import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import Badge from '../atoms/Badge';

export default function ForceGraph({ graph, currentView, viewToggle, onNodeHover, onNodeOut, onNodeClick, onHoverCard }) {
  const svgRef = useRef();
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

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

  // Get connected flows for a process node
  const getConnectedFlows = (node) => {
    if (node.type !== 'process') return [];
    
    const connectedFlows = [];
    graph.links.forEach(link => {
      const sourceId = typeof link.source === 'string' ? link.source : link.source.id || link.source;
      const targetId = typeof link.target === 'string' ? link.target : link.target.id || link.target;
      
      if (sourceId === node.id) {
        const targetNode = graph.nodes.find(n => n.id === targetId);
        if (targetNode && targetNode.type === 'flow') {
          connectedFlows.push(targetNode);
        }
      }
    });
    return connectedFlows;
  };

  // Get connected processes for a flow node
  const getNodeProcesses = (node) => {
    if (node.type === 'process') return [node.name];
    
    const connectedProcesses = new Set();
    graph.links.forEach(link => {
      const sourceId = typeof link.source === 'string' ? link.source : link.source.id || link.source;
      const targetId = typeof link.target === 'string' ? link.target : link.target.id || link.target;
      
      if (targetId === node.id) {
        const sourceNode = graph.nodes.find(n => n.id === sourceId);
        if (sourceNode && sourceNode.type === 'process') {
          connectedProcesses.add(sourceNode.name);
        }
      }
    });
    
    return Array.from(connectedProcesses);
  };

  // Update dimensions based on container size
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: rect.width,
          height: rect.height - 80 // Account for header
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // D3 Force Graph Effect
  useEffect(() => {
    if (!graph.nodes.length || currentView !== 'force') return;

    const svg = d3.select(svgRef.current);
    const width = dimensions.width;
    const height = dimensions.height;

    // Clear previous content
    svg.selectAll("*").remove();

    // Set up SVG viewBox for responsiveness
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    // Create defs for patterns and markers
    const defs = svg.append("defs");

    // Create main group for zoom/pan
    const g = svg.append("g");

    // Get process colors
    const processColors = getProcessColors();

    // Set up force simulation
    const simulation = d3.forceSimulation(graph.nodes)
      .force("link", d3.forceLink(graph.links).id(d => d.id).distance(150))
      .force("charge", d3.forceManyBody().strength(-1000))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(d => d.type === "process" ? 70 : 60))
      .force("x", d3.forceX(width / 2).strength(0.1))
      .force("y", d3.forceY(height / 2).strength(0.1));

    // Create simple arrow markers
    defs.append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 15)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#64748b");

    // Create links with simple styling
    const link = g.append("g").selectAll("line")
      .data(graph.links)
      .enter().append("line")
      .attr("stroke", "#cbd5e1")
      .attr("stroke-width", 2)
      .attr("marker-end", "url(#arrowhead)");

    // Create node groups
    const nodeGroup = g.append("g").selectAll("g")
      .data(graph.nodes)
      .enter().append("g")
      .attr("class", "cursor-pointer")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    // Function to create pie chart path for multi-process flows
    const createPieChart = (node, radius) => {
      const processes = getNodeProcesses(node);
      if (processes.length <= 1) return null;

      const pie = d3.pie().value(1);
      const arc = d3.arc().innerRadius(0).outerRadius(radius);
      
      return pie(processes).map((d, i) => ({
        path: arc(d),
        color: processColors[processes[i]]
      }));
    };

    // Add circles or pie charts for nodes
    nodeGroup.each(function(d) {
      const group = d3.select(this);
      
      if (d.type === 'process') {
        // Simple circle for process nodes
        group.append("circle")
          .attr("r", 40)
          .attr("fill", processColors[d.name] || '#6b7280')
          .attr("stroke", "white")
          .attr("stroke-width", 3)
          .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.1))");
          
        // Add process letter in center
        group.append("text")
          .text("P")
          .attr("text-anchor", "middle")
          .attr("dy", "0.3em")
          .attr("class", "text-xl font-bold fill-white pointer-events-none select-none");
          
      } else {
        // Flow nodes can have pie charts for multiple processes
        const processes = getNodeProcesses(d);
        if (processes.length > 1) {
          // Multi-process flow - create pie chart
          const pieData = createPieChart(d, 35);
          pieData.forEach((segment, i) => {
            group.append("path")
              .attr("d", segment.path)
              .attr("fill", segment.color)
              .attr("stroke", "white")
              .attr("stroke-width", 2)
              .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.1))");
          });
        } else {
          // Single process flow - simple circle
          const color = processes.length > 0 ? processColors[processes[0]] : '#6b7280';
          group.append("circle")
            .attr("r", 35)
            .attr("fill", color)
            .attr("stroke", "white")
            .attr("stroke-width", 3)
            .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.1))");
        }
        
        // Add flow letter in center
        group.append("text")
          .text("F")
          .attr("text-anchor", "middle")
          .attr("dy", "0.3em")
          .attr("class", "text-lg font-bold fill-white pointer-events-none select-none");
      }
    });

    // Add permanent labels below nodes
    const labels = nodeGroup.append("text")
      .text(d => d.name) // Show full name without truncation
      .attr("text-anchor", "middle")
      .attr("dy", d => d.type === "process" ? "3.2em" : "2.8em")
      .attr("class", "text-sm font-semibold fill-slate-700 pointer-events-none select-none")
      .style("text-shadow", "2px 2px 4px rgba(255,255,255,0.9)")
      .style("paint-order", "stroke fill")
      .style("stroke", "white")
      .style("stroke-width", "4px")
      .style("stroke-linejoin", "round");

    // Add hover effects and events
    nodeGroup
      .on("mouseover", function(event, d) {
        // Get mouse position relative to the viewport for proper positioning
        onHoverCard?.(d, { x: event.clientX, y: event.clientY });
        
        // Visual hover effects
        d3.select(this).select("circle, path")
          .transition()
          .duration(200)
          .style("filter", "brightness(1.2) drop-shadow(0 4px 8px rgba(0,0,0,0.2))")
          .style("transform", "scale(1.1)");
          
        // Make label more prominent on hover
        d3.select(this).select("text")
          .transition()
          .duration(200)
          .style("font-weight", "bold")
          .style("stroke-width", "5px");
          
        onNodeHover?.(event, d);
      })
      .on("mousemove", function(event, d) {
        // Update hover card position
        onHoverCard?.(d, { x: event.clientX, y: event.clientY });
      })
      .on("mouseout", function(event, d) {
        onHoverCard?.(null, { x: 0, y: 0 });
        
        // Reset visual effects
        d3.select(this).select("circle, path")
          .transition()
          .duration(200)
          .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.1))")
          .style("transform", "scale(1)");
          
        d3.select(this).select("text")
          .transition()
          .duration(200)
          .style("font-weight", "600")
          .style("stroke-width", "4px");
          
        onNodeOut?.(event, d);
      })
      .on("click", function(event, d) {
        onNodeClick?.(event, d);
      });

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      nodeGroup.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      simulation.stop();
    };

  }, [graph, currentView, dimensions, onNodeHover, onNodeOut, onNodeClick, onHoverCard]);

  if (currentView !== 'force') return null;

  const processColors = getProcessColors();
  const processEntries = Object.entries(processColors);

  return (
    <div 
      ref={containerRef}
      className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden relative"
      style={{ height: '70vh', minHeight: '500px' }}
    >
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Force Graph View</h2>
            <p className="text-slate-600 text-sm mt-1">Interactive network visualization with process-specific colors</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Process Color Legend */}
            <div className="flex items-center gap-3 text-sm">
              {processEntries.slice(0, 4).map(([process, color]) => (
                <div key={process} className="flex items-center gap-1">
                  <div 
                    className="w-3 h-3 rounded-full border border-white"
                    style={{ backgroundColor: color }}
                  ></div>
                  <span className="text-slate-600 text-xs truncate max-w-20">{process}</span>
                </div>
              ))}
              {processEntries.length > 4 && (
                <span className="text-slate-400 text-xs">+{processEntries.length - 4} more</span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Graph Container */}
      <div className="relative h-full">
        <svg ref={svgRef} className="w-full h-full"></svg>
        
        {/* Controls overlay */}
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 space-y-2">
          <div className="text-xs text-slate-600 font-medium">Controls:</div>
          <div className="text-xs text-slate-500 space-y-1">
            <div>• Drag nodes to reposition</div>
            <div>• Scroll to zoom in/out</div>
            <div>• Click for detailed view</div>
            <div>• Hover for extra info</div>
          </div>
        </div>

        {/* Legend */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3">
          <div className="text-xs text-slate-600 font-medium mb-2">Node Types:</div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center">
                <span className="text-white text-xs font-bold">P</span>
              </div>
              <span className="text-slate-600">Process</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 via-red-500 to-emerald-500 border-2 border-white flex items-center justify-center">
                <span className="text-white text-xs font-bold">F</span>
              </div>
              <span className="text-slate-600">Multi-process Flow</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export helper functions for use in parent component hover card
export { getConnectedFlows, getNodeProcesses };
