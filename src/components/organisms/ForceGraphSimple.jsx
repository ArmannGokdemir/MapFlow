
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

// Minimal, guaranteed working D3 force graph
export default function ForceGraph({ graph, currentView, onNodeClick }) {
  const svgRef = useRef();
  const width = 800;
  const height = 600;

  // Generate consistent colors for each process
  const getProcessColors = () => {
    const processes = [...new Set(graph.nodes.filter(n => n.type === 'process').map(n => n.name))];
    const colors = [
      '#3b82f6', // blue
      '#ef4444', // red
      '#10b981', // emerald
      '#f59e0b', // amber
      '#8b5cf6', // violet
      '#06b6d4', // cyan
      '#84cc16', // lime
      '#f97316', // orange
      '#ec4899', // pink
      '#6366f1', // indigo
    ];
    
    const colorMap = {};
    processes.forEach((process, index) => {
      colorMap[process] = colors[index % colors.length];
    });
    return colorMap;
  };

  // Get node color based on type and process
  const getNodeColor = (node, processColors) => {
    if (node.type === 'process') {
      return processColors[node.name] || '#6b7280';
    } else {
      // For flow nodes, find connected processes
      const connectedProcesses = [];
      graph.links.forEach(link => {
        const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
        const targetId = typeof link.target === 'string' ? link.target : link.target.id;
        
        if (targetId === node.id) {
          const sourceNode = graph.nodes.find(n => n.id === sourceId);
          if (sourceNode && sourceNode.type === 'process') {
            connectedProcesses.push(sourceNode.name);
          }
        }
      });
      
      // Use first connected process color, or default
      return connectedProcesses.length > 0 ? processColors[connectedProcesses[0]] : '#10b981';
    }
  };

  // Get linked nodes for highlighting
  const getLinkedNodes = (nodeId) => {
    const linkedNodes = new Set([nodeId]); // Include the hovered node itself
    
    graph.links.forEach(link => {
      const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
      const targetId = typeof link.target === 'string' ? link.target : link.target.id;
      
      if (sourceId === nodeId) {
        linkedNodes.add(targetId);
      }
      if (targetId === nodeId) {
        linkedNodes.add(sourceId);
      }
    });
    
    return linkedNodes;
  };

  useEffect(() => {
    if (!graph.nodes.length || currentView !== 'force') return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const g = svg.append('g');
    const processColors = getProcessColors();

    // Zoom (all events)
    svg.call(d3.zoom()
      .scaleExtent([0.2, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      })
    );

    // Create links with better highlighting support
    const link = g.append('g')
      .selectAll('line')
      .data(graph.links)
      .enter().append('line')
      .attr('stroke', '#aaa')
      .attr('stroke-width', 1.5)
      .attr('opacity', 0.6)
      .attr('class', 'graph-link');

    // Nodes with highlighting support
    const node = g.append('g')
      .selectAll('circle')
      .data(graph.nodes)
      .enter().append('circle')
      .attr('r', d => d.type === 'process' ? 25 : 20)
      .attr('fill', d => getNodeColor(d, processColors))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .attr('class', 'graph-node')
      .attr('data-node-id', d => d.id)
      .call(d3.drag()
        .on('start', (event, d) => {
          // Mark as dragging to prevent hover card
          d3.select(event.sourceEvent.target).classed('dragging', true);
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          // Remove dragging class after a short delay
          setTimeout(() => {
            d3.select(event.sourceEvent.target).classed('dragging', false);
          }, 100);
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
      );

    // Hover with linked node highlighting
    let hoverTimeout = null;
    
    node
      .on('mouseenter', function (event, d) {
        // Clear any existing timeout
        if (hoverTimeout) clearTimeout(hoverTimeout);
        
        // Get linked nodes
        const linkedNodeIds = getLinkedNodes(d.id);
        
        // Dim all nodes and links first
        node.style('opacity', 0.3);
        link.style('opacity', 0.1);
        
        // Highlight linked nodes
        node
          .filter(nodeData => linkedNodeIds.has(nodeData.id))
          .style('opacity', 1)
          .transition()
          .duration(100)
          .attr('r', nodeData => (nodeData.type === 'process' ? 25 : 20) + 3)
          .style('filter', 'brightness(1.2)');
        
        // Highlight connected links
        link
          .filter(linkData => {
            const sourceId = typeof linkData.source === 'string' ? linkData.source : linkData.source.id;
            const targetId = typeof linkData.target === 'string' ? linkData.target : linkData.target.id;
            return linkedNodeIds.has(sourceId) && linkedNodeIds.has(targetId);
          })
          .style('opacity', 0.8)
          .style('stroke', '#f59e0b')
          .style('stroke-width', 3);
        
        console.log('Highlighting linked nodes for:', d.name, 'Linked count:', linkedNodeIds.size - 1);
      })
      .on('mouseleave', function (event, d) {
        // Clear timeout
        if (hoverTimeout) clearTimeout(hoverTimeout);
        
        // Reset all visual effects
        node
          .style('opacity', 1)
          .transition()
          .duration(100)
          .attr('r', d => d.type === 'process' ? 25 : 20)
          .style('filter', 'none');
        
        link
          .style('opacity', 0.6)
          .style('stroke', '#aaa')
          .style('stroke-width', 1.5);
      })
      .on('click', function (event, d) {
        // Prevent event bubbling
        event.stopPropagation();
        
        console.log('Clicked node:', d.name, d.type);
        
        // Call the callback if provided
        if (onNodeClick) {
          onNodeClick(event, d);
        } else {
          // Default behavior - show details in console
          console.log('Node Details:', {
            id: d.id,
            name: d.name,
            type: d.type,
            linkedNodes: Array.from(getLinkedNodes(d.id)).filter(id => id !== d.id)
          });
        }
      });

    // Labels
    g.append('g')
      .selectAll('text')
      .data(graph.nodes)
      .enter().append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', 5)
      .attr('font-size', 12)
      .text(d => d.name);

    // Simulation
    const simulation = d3.forceSimulation(graph.nodes)
      .force('link', d3.forceLink(graph.links).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2));

    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
      g.selectAll('text')
        .attr('x', d => d.x)
        .attr('y', d => d.y + 30);
    });

    return () => simulation.stop();
  }, [graph, currentView]);

  if (currentView !== 'force') return null;

  return (
    <div style={{ width: '100%', height: '70vh', minHeight: 500, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #0001', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
      <svg ref={svgRef} width="100%" height="100%" style={{ width: '100%', height: '100%' }}></svg>
    </div>
  );
}
