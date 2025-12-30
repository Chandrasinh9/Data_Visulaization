import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { hierarchy, tree, HierarchyNode } from 'd3-hierarchy';
import { zoom, zoomIdentity, ZoomBehavior } from 'd3-zoom';
import { select } from 'd3-selection';

interface MindmapNode {
  id: string;
  name: string;
  description?: string;
  summary?: string;
  children?: MindmapNode[];
  value?: number;
  expanded?: boolean;
}

interface MindmapProps {
  data: MindmapNode;
  width?: number;
  height?: number;
  onNodeSelect?: (node: MindmapNode | null) => void;
  onNodeHover?: (node: MindmapNode | null) => void;
  layoutType?: 'tree' | 'radial';
}

const MindmapEnhanced: React.FC<MindmapProps> = ({ 
  data, 
  width = 800, 
  height = 600,
  onNodeSelect,
  onNodeHover,
  layoutType = 'tree'
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [currentData, setCurrentData] = useState<MindmapNode>(data);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g');

    // Create tooltip
    const tooltip = d3.select('body').append('div')
      .attr('class', 'mindmap-tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background', 'rgba(0, 0, 0, 0.9)')
      .style('color', 'white')
      .style('padding', '10px')
      .style('border-radius', '6px')
      .style('font-size', '12px')
      .style('max-width', '250px')
      .style('z-index', '1000');

    // Process data with expanded state
    const processData = (node: MindmapNode, expanded: boolean = true): MindmapNode => {
      const processed = { ...node };
      if (node.children && expanded) {
        processed.children = node.children.map(child => processData(child, child.expanded !== false));
      } else {
        processed.children = [];
      }
      return processed;
    };

    const processedData = processData(data);

    // Create tree layout
    const root = hierarchy(processedData);
    const treeLayout = tree<MindmapNode>()
      .size([height - 100, width - 200]);

    treeLayout(root);

    // Add zoom behavior
    const zoomBehavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoomBehavior as any);

    // Draw links
    g.selectAll('.link')
      .data(root.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', d3.linkHorizontal<any, HierarchyNode<MindmapNode>>()
        .x((d: any) => d.y)
        .y((d: any) => d.x)
      )
      .attr('fill', 'none')
      .attr('stroke', '#999')
      .attr('stroke-width', 2)
      .style('transition', 'all 0.3s ease');

    // Draw nodes
    const nodes = g.selectAll('.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d: any) => `translate(${d.y},${d.x})`)
      .style('cursor', 'pointer')
      .on('click', (event, d: any) => {
        event.stopPropagation();
        const nodeId = d.data.id;
        setSelectedNode(nodeId);
        onNodeSelect?.(d.data);
        
        // Toggle expanded state
        if (d.children || d._children) {
          d.data.expanded = !d.data.expanded;
          // Force re-render
          const event = new CustomEvent('mindmap-update');
          window.dispatchEvent(event);
        }
      })
      .on('mouseenter', (event, d: any) => {
        setHoveredNode(d.data.id);
        onNodeHover?.(d.data);
        
        // Show tooltip
        tooltip
          .style('visibility', 'visible')
          .html(`
            <strong>${d.data.name}</strong>
            ${d.data.description ? `<br/><br/>${d.data.description}` : ''}
            ${d.data.summary ? `<br/><br/><em>${d.data.summary}</em>` : ''}
          `);
        
        // Position tooltip
        const [x, y] = d3.pointer(event, document.body);
        tooltip
          .style('left', (x + 10) + 'px')
          .style('top', (y - 10) + 'px');
      })
      .on('mousemove', (event) => {
        const [x, y] = d3.pointer(event, document.body);
        tooltip
          .style('left', (x + 10) + 'px')
          .style('top', (y - 10) + 'px');
      })
      .on('mouseleave', () => {
        setHoveredNode(null);
        onNodeHover?.(null);
        tooltip.style('visibility', 'hidden');
      });

    // Add circles for nodes
    nodes.append('circle')
      .attr('r', (d: any) => {
        if (d.depth === 0) return 12;
        if (d.depth === 1) return 10;
        return 8;
      })
      .attr('fill', (d: any) => {
        if (selectedNode === d.data.id) return '#e74c3c';
        if (hoveredNode === d.data.id) return '#f39c12';
        if (d.depth === 0) return '#e74c3c';
        if (d.depth === 1) return '#3498db';
        if (d.depth === 2) return '#2ecc71';
        return '#f39c12';
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('transition', 'all 0.3s ease')
      .style('filter', (d: any) => {
        if (selectedNode === d.data.id || hoveredNode === d.data.id) {
          return 'drop-shadow(0 0 8px rgba(0,0,0,0.3))';
        }
        return 'none';
      });

    // Add expand/collapse indicators
    nodes.filter((d: any) => d.data.children && d.data.children.length > 0)
      .append('text')
      .attr('dy', '.35em')
      .attr('x', (d: any) => d.children ? -20 : 20)
      .style('text-anchor', 'middle')
      .style('font-size', '10px')
      .style('font-weight', 'bold')
      .style('fill', 'white')
      .text((d: any) => d.children ? '-' : '+');

    // Add labels
    nodes.append('text')
      .attr('dy', '.35em')
      .attr('x', (d: any) => d.children ? -15 : 15)
      .style('text-anchor', (d: any) => d.children ? 'end' : 'start')
      .text((d: any) => d.data.name)
      .style('font-size', '12px')
      .style('font-family', 'Arial, sans-serif')
      .style('font-weight', (d: any) => d.depth === 0 ? 'bold' : 'normal')
      .style('fill', (d: any) => {
        if (selectedNode === d.data.id || hoveredNode === d.data.id) {
          return '#e74c3c';
        }
        return '#333';
      })
      .style('transition', 'all 0.3s ease');

    // Initial zoom to fit
    const bounds = (g.node() as any)?.getBBox();
    if (bounds) {
      const fullWidth = width;
      const fullHeight = height;
      const widthScale = fullWidth / bounds.width;
      const heightScale = fullHeight / bounds.height;
      const scale = 0.8 * Math.min(widthScale, heightScale);
      
      svg.call(zoomBehavior as any, 
        zoomIdentity
          .translate(fullWidth / 2, fullHeight / 2)
          .scale(scale)
          .translate(-bounds.x - bounds.width / 2, -bounds.y - bounds.height / 2)
      );
    }

    // Cleanup
    return () => {
      tooltip.remove();
    };

  }, [data, width, height, selectedNode, hoveredNode, onNodeSelect, onNodeHover]);

  // Handle custom event for updates
  useEffect(() => {
    const handleUpdate = () => {
      // Force re-render by updating state
      setSelectedNode(prev => prev);
    };

    window.addEventListener('mindmap-update', handleUpdate);
    return () => window.removeEventListener('mindmap-update', handleUpdate);
  }, []);

  // Control functions
  const fitToView = () => {
    if (!svgRef.current) return;
    
    const svg = d3.select(svgRef.current);
    const g = svg.select('g');
    const bounds = (g.node() as any)?.getBBox();
    
    if (bounds) {
      const fullWidth = width;
      const fullHeight = height;
      const widthScale = fullWidth / bounds.width;
      const heightScale = fullHeight / bounds.height;
      const scale = 0.8 * Math.min(widthScale, heightScale);
      
      const zoomBehavior = zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.1, 3]);
      
      svg.transition()
        .duration(750)
        .call(zoomBehavior as any, 
          zoomIdentity
            .translate(fullWidth / 2, fullHeight / 2)
            .scale(scale)
            .translate(-bounds.x - bounds.width / 2, -bounds.y - bounds.height / 2)
        );
    }
  };

  const expandAll = () => {
    const expandNode = (node: MindmapNode) => {
      node.expanded = true;
      if (node.children) {
        node.children.forEach(expandNode);
      }
    };
    expandNode(data);
    setSelectedNode(prev => prev); // Force re-render
  };

  const collapseAll = () => {
    const collapseNode = (node: MindmapNode, depth: number = 0) => {
      if (depth !== 0) { // Keep root expanded
        node.expanded = false;
      }
      if (node.children) {
        node.children.forEach(child => collapseNode(child, depth + 1));
      }
    };
    collapseNode(data);
    setSelectedNode(prev => prev); // Force re-render
  };

  return (
    <div>
      <div className="mindmap-controls">
        <button onClick={fitToView} className="control-btn-small">🎯 Fit View</button>
        <button onClick={expandAll} className="control-btn-small">📂 Expand All</button>
        <button onClick={collapseAll} className="control-btn-small">📁 Collapse All</button>
      </div>
      
      <svg
        ref={svgRef}
        width={width}
        height={height}
        style={{ border: '1px solid #ccc', borderRadius: '8px', background: 'white' }}
      />
      
      {selectedNode && (
        <div style={{ 
          marginTop: '10px', 
          padding: '10px', 
          backgroundColor: '#f0f0f0', 
          borderRadius: '4px',
          textAlign: 'left'
        }}>
          <strong>Selected Node:</strong> {selectedNode}
        </div>
      )}
    </div>
  );
};

export default MindmapEnhanced;
