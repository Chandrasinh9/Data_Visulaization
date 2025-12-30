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

const MindmapFixed: React.FC<MindmapProps> = ({ 
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

  // Update currentData when prop data changes
  useEffect(() => {
    setCurrentData(data);
  }, [data]);

  // Process data with expanded state
  const processData = useCallback((node: MindmapNode): MindmapNode => {
    const processed = { ...node };
    if (node.children && node.expanded !== false) {
      processed.children = node.children.map(child => processData(child));
    } else {
      processed.children = [];
    }
    return processed;
  }, []);

  // Expand all nodes
  const expandAll = useCallback(() => {
    const expandNode = (node: MindmapNode): MindmapNode => {
      const expanded = { ...node, expanded: true };
      if (node.children) {
        expanded.children = node.children.map(expandNode);
      }
      return expanded;
    };
    const newData = expandNode(data);
    setCurrentData(newData);
  }, [data]);

  // Collapse all nodes except root
  const collapseAll = useCallback(() => {
    const collapseNode = (node: MindmapNode, isRoot: boolean = false): MindmapNode => {
      const collapsed = { ...node, expanded: isRoot };
      if (node.children) {
        collapsed.children = node.children.map(child => collapseNode(child, false));
      }
      return collapsed;
    };
    const newData = collapseNode(data, true);
    setCurrentData(newData);
  }, [data]);

  // Toggle node expansion
  const toggleNode = useCallback((nodeId: string) => {
    const toggleNodeRecursive = (node: MindmapNode): MindmapNode => {
      if (node.id === nodeId) {
        return { ...node, expanded: !node.expanded };
      }
      if (node.children) {
        return {
          ...node,
          children: node.children.map(toggleNodeRecursive)
        };
      }
      return node;
    };
    const newData = toggleNodeRecursive(currentData);
    setCurrentData(newData);
  }, [currentData]);

  useEffect(() => {
    if (!svgRef.current || !currentData) return;

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

    const processedData = processData(currentData);

    // Create layout based on type
    let root;
    if (layoutType === 'radial') {
      root = hierarchy(processedData);
      const radius = Math.min(width, height) / 2 - 100;
      
      // Radial layout
      const radialTree = d3.tree<MindmapNode>()
        .size([2 * Math.PI, radius])
        .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth);

      radialTree(root);

      // Convert polar to cartesian coordinates
      root.descendants().forEach((d: any) => {
        const angle = d.x;
        const radius = d.y;
        d.x = radius * Math.cos(angle - Math.PI / 2);
        d.y = radius * Math.sin(angle - Math.PI / 2);
      });
    } else {
      // Tree layout - completely redesigned for proper hierarchy
      root = hierarchy(processedData);
      
      // Calculate proper layout
      const treeLayout = tree<MindmapNode>()
        .size([height - 120, width - 400])
        .nodeSize([80, 200])
        .separation((a, b) => {
          // Siblings are closer, different branches are further
          return a.parent == b.parent ? 1 : 2;
        });
      
      treeLayout(root);
      
      // Ensure proper positioning
      root.descendants().forEach((d: any) => {
        // Add some padding to the left for better visibility
        if (d.depth > 0) {
          d.y = d.y + 100;
        }
      });
    }

    // Add zoom behavior
    const zoomBehavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoomBehavior as any);
    
    // Center the view properly for both layouts
    if (layoutType === 'radial') {
      // For radial view, center the root at the middle
      const centerX = width / 2;
      const centerY = height / 2;
      g.attr('transform', `translate(${centerX}, ${centerY})`);
    }

    // Draw links
    const linkGenerator = layoutType === 'radial' 
      ? d3.linkRadial<any, HierarchyNode<MindmapNode>>()
          .angle((d: any) => Math.atan2(d.y, d.x) + Math.PI / 2)
          .radius((d: any) => Math.sqrt(d.x * d.x + d.y * d.y))
      : d3.linkHorizontal<any, HierarchyNode<MindmapNode>>()
          .x((d: any) => d.y)
          .y((d: any) => d.x);

    g.selectAll('.link')
      .data(root.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', linkGenerator)
      .attr('fill', 'none')
      .attr('stroke', '#999')
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.6)
      .style('transition', 'all 0.3s ease');

    // Draw nodes
    const nodes = g.selectAll('.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d: any) => `translate(${d.x},${d.y})`)
      .style('cursor', 'pointer')
      .on('click', (event, d: any) => {
        event.stopPropagation();
        const nodeId = d.data.id;
        setSelectedNode(nodeId);
        onNodeSelect?.(d.data);
        
        // Toggle expanded state if node has children
        if (d.data.children && d.data.children.length > 0 || 
            currentData.children?.some(child => child.id === nodeId)) {
          toggleNode(nodeId);
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
    nodes.filter((d: any): boolean => {
      const originalNode = findNodeById(currentData, d.data.id);
      return !!(originalNode && originalNode.children && originalNode.children.length > 0);
    })
      .append('text')
      .attr('dy', '.35em')
      .attr('x', (d: any) => {
        const originalNode = findNodeById(currentData, d.data.id);
        return originalNode?.expanded ? -20 : 20;
      })
      .style('text-anchor', 'middle')
      .style('font-size', '10px')
      .style('font-weight', 'bold')
      .style('fill', 'white')
      .text((d: any) => {
        const originalNode = findNodeById(currentData, d.data.id);
        return originalNode?.expanded ? '-' : '+';
      });

    // Add labels
    nodes.append('text')
      .attr('dy', '.35em')
      .attr('x', (d: any) => {
        if (layoutType === 'radial') {
          return d.x > 0 ? 15 : -15;
        }
        return d.children ? -15 : 15;
      })
      .style('text-anchor', (d: any) => {
        if (layoutType === 'radial') {
          return d.x > 0 ? 'start' : 'end';
        }
        return d.children ? 'end' : 'start';
      })
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
      const scale = layoutType === 'tree' ? 0.7 : 0.8;
      
      if (layoutType === 'radial') {
        // For radial view, center at middle without additional transforms
        svg.call(zoomBehavior as any, 
          zoomIdentity
            .translate(fullWidth / 2, fullHeight / 2)
            .scale(scale)
        );
      } else {
        // For tree view, use original logic
        svg.call(zoomBehavior as any, 
          zoomIdentity
            .translate(100, fullHeight / 2)
            .scale(scale)
            .translate(-bounds.x - bounds.width / 2, -bounds.y - bounds.height / 2)
        );
      }
    }

    // Cleanup
    return () => {
      tooltip.remove();
    };

  }, [currentData, width, height, selectedNode, hoveredNode, onNodeSelect, onNodeHover, layoutType, processData, toggleNode]);

  // Helper function to find node by ID
  const findNodeById = (node: MindmapNode, id: string): MindmapNode | null => {
    if (node.id === id) return node;
    if (node.children) {
      for (const child of node.children) {
        const found = findNodeById(child, id);
        if (found) return found;
      }
    }
    return null;
  };

  return (
    <div>
      <div className="mindmap-controls">
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

export default MindmapFixed;
