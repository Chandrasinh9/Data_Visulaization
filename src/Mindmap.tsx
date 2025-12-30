import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { hierarchy, tree, HierarchyNode } from 'd3-hierarchy';
import { zoom, zoomIdentity, ZoomBehavior } from 'd3-zoom';
import { select } from 'd3-selection';

interface MindmapNode {
  id: string;
  name: string;
  children?: MindmapNode[];
  value?: number;
}

interface MindmapProps {
  data: MindmapNode;
  width?: number;
  height?: number;
}

const Mindmap: React.FC<MindmapProps> = ({ 
  data, 
  width = 800, 
  height = 600 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g');

    // Create tree layout
    const root = hierarchy(data);
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
      .attr('stroke-width', 2);

    // Draw nodes
    const nodes = g.selectAll('.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d: any) => `translate(${d.y},${d.x})`)
      .style('cursor', 'pointer')
      .on('click', (event, d: any) => {
        setSelectedNode(d.data.id);
      });

    // Add circles for nodes
    nodes.append('circle')
      .attr('r', 8)
      .attr('fill', (d: any) => {
        if (d.depth === 0) return '#e74c3c';
        if (d.depth === 1) return '#3498db';
        if (d.depth === 2) return '#2ecc71';
        return '#f39c12';
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    // Add labels
    nodes.append('text')
      .attr('dy', '.35em')
      .attr('x', (d: any) => d.children ? -13 : 13)
      .style('text-anchor', (d: any) => d.children ? 'end' : 'start')
      .text((d: any) => d.data.name)
      .style('font-size', '12px')
      .style('font-family', 'Arial, sans-serif');

    // Initial zoom to fit
    const bounds = g.node()?.getBBox();
    if (bounds) {
      const fullWidth = width;
      const fullHeight = height;
      const widthScale = fullWidth / bounds.width;
      const heightScale = fullHeight / bounds.height;
      const scale = 0.8 * Math.min(widthScale, heightScale);
      
      svg.call(zoomBehavior.transform, 
        zoomIdentity
          .translate(fullWidth / 2, fullHeight / 2)
          .scale(scale)
          .translate(-bounds.x - bounds.width / 2, -bounds.y - bounds.height / 2)
      );
    }

  }, [data, width, height]);

  return (
    <div>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        style={{ border: '1px solid #ccc', borderRadius: '8px' }}
      />
      {selectedNode && (
        <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
          <strong>Selected Node:</strong> {selectedNode}
        </div>
      )}
    </div>
  );
};

export default Mindmap;
