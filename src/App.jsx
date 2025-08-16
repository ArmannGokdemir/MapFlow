import React, { useState, useMemo } from 'react';
import './App.css';

// Import atomic components
import Button from './components/atoms/Button';
import Input from './components/atoms/Input';
import Badge from './components/atoms/Badge';

// Import molecular components
import ViewToggle from './components/molecules/ViewToggle';
import ProcessFilter from './components/molecules/ProcessFilter';

// Import organism components
// import Header from './components/organisms/Header';
import ForceGraph from './components/organisms/ForceGraphSimple';
import Swimlane from './components/organisms/Swimlane';
// import Sidebar from './components/organisms/Sidebar';
import Sidebar from './components/organisms/Sidebar';

// Import utilities
import { buildFromPropsOrFallback, filterGraph } from './utils/dataUtils';

/**
 * Abbvie — Process ↔ Flow Explorer (Refactored with Atomic Design)
 *
 * This is the main application component that orchestrates the data flow
 * and state management for the entire diagram viewer application.
 */
export default function App({ nodesData, linksData }) {
  // State management
  const [currentView, setCurrentView] = useState('force');
  const [searchQuery, setSearchQuery] = useState('');
  const [processFilters, setProcessFilters] = useState({});
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

  // Build graph data from props or fallback
  const baseGraph = useMemo(() => {
    return buildFromPropsOrFallback(nodesData, linksData);
  }, [nodesData, linksData]);

  // Get unique process names for filters
  const processNames = useMemo(() => {
    return [...new Set(baseGraph.nodes
      .filter(n => n.type === 'process')
      .map(n => n.name)
    )].sort();
  }, [baseGraph]);

  // Apply filters to the graph
  const filteredGraph = useMemo(() => {
    return filterGraph(baseGraph, processFilters, searchQuery);
  }, [baseGraph, processFilters, searchQuery]);

  // Helper functions for hover card data
  const getConnectedFlows = (node) => {
    if (node.type !== 'process') return [];
    
    const connectedFlows = [];
    filteredGraph.links.forEach(link => {
      const sourceId = typeof link.source === 'string' ? link.source : link.source.id || link.source;
      const targetId = typeof link.target === 'string' ? link.target : link.target.id || link.target;
      
      if (sourceId === node.id) {
        const targetNode = filteredGraph.nodes.find(n => n.id === targetId);
        if (targetNode && targetNode.type === 'flow') {
          connectedFlows.push(targetNode);
        }
      }
    });
    return connectedFlows;
  };

  const getNodeProcesses = (node) => {
    if (node.type === 'process') return [node.name];
    
    const connectedProcesses = new Set();
    filteredGraph.links.forEach(link => {
      const sourceId = typeof link.source === 'string' ? link.source : link.source.id || link.source;
      const targetId = typeof link.target === 'string' ? link.target : link.target.id || link.target;
      
      if (targetId === node.id) {
        const sourceNode = filteredGraph.nodes.find(n => n.id === sourceId);
        if (sourceNode && sourceNode.type === 'process') {
          connectedProcesses.add(sourceNode.name);
        }
      }
    });
    
    return Array.from(connectedProcesses);
  };

  // Event handlers
  const handleViewToggle = () => {
    setCurrentView(prev => prev === 'force' ? 'swimlane' : 'force');
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

  const handleProcessFilterChange = (processName, enabled) => {
    setProcessFilters(prev => ({
      ...prev,
      [processName]: enabled
    }));
  };

  const handleNodeClick = (event, node) => {
    console.log('Node clicked in App:', node);
    setSelectedNode(node);
    // You can also show additional details
    // alert(`Node Details:\n\nName: ${node.name}\nType: ${node.type}\nID: ${node.id}`);
  };

  const handleNodeHover = (event, node) => {
    // Can be used for hover effects in the future
  };

  const handleNodeOut = (event, node) => {
    // Can be used for hover effects in the future
  };

  const handleCloseSidebar = () => {
    setSelectedNode(null);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setProcessFilters({});
  };

  // Handle hover card display
  const handleHoverCard = (node, position) => {
    setHoveredNode(node);
    setHoverPosition(position);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Abbvie Process Explorer
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Interactive diagram viewer for process flows and relationships
        </p>
      </div>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar Controls */}
        <div className="w-80 bg-white border-r border-gray-200 p-6 space-y-6">
          {/* View Toggle */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">View Mode</h3>
            <ViewToggle 
              currentView={currentView}
              onToggle={handleViewToggle}
            />
          </div>

          {/* Search */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Search</h3>
            <Input
              type="text"
              placeholder="Search processes and flows..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>

          {/* Process Filters */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold text-gray-700">Process Filters</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
              >
                Reset
              </Button>
            </div>
            <ProcessFilter
              processNames={processNames}
              enabledMap={processFilters}
              onChange={handleProcessFilterChange}
            />
          </div>

          {/* Graph Stats */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Statistics</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Processes:</span>
                <Badge variant="secondary">
                  {filteredGraph.nodes.filter(n => n.type === 'process').length}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Flows:</span>
                <Badge variant="secondary">
                  {filteredGraph.nodes.filter(n => n.type === 'flow').length}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Connections:</span>
                <Badge variant="secondary">
                  {filteredGraph.links.length}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Main Visualization Area */}
        <div className="flex-1 p-6">
          {currentView === 'force' ? (
            <ForceGraph
              graph={filteredGraph}
              currentView={currentView}
              onNodeHover={handleNodeHover}
              onNodeOut={handleNodeOut}
              onNodeClick={handleNodeClick}
              onHoverCard={handleHoverCard}
            />
          ) : (
            <Swimlane
              graph={filteredGraph}
              currentView={currentView}
              onNodeClick={handleNodeClick}
            />
          )}
        </div>
      </div>

      {/* Sidebar for node details */}
      <Sidebar
        selectedNode={selectedNode}
        onClose={handleCloseSidebar}
      />

      {/* Global Hover Card - positioned relative to viewport */}
      {hoveredNode && (
        <div 
          className="fixed pointer-events-none z-[9999]"
          style={{
            left: Math.min(hoverPosition.x + 15, window.innerWidth - 400),
            top: Math.max(hoverPosition.y - 10, 10),
            transform: hoverPosition.x > window.innerWidth - 400 ? 'translateX(-100%)' : 'none'
          }}
        >
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-sm">
            {/* Card Header */}
            <div className={`px-4 py-3 rounded-t-xl ${
              hoveredNode.type === 'process' 
                ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                : 'bg-gradient-to-r from-emerald-500 to-emerald-600'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm bg-white/20`}>
                  {hoveredNode.type === 'process' ? 'P' : 'F'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-semibold text-sm leading-tight">
                    {hoveredNode.name}
                  </div>
                  <div className="text-white/80 text-xs">
                    {hoveredNode.type === 'process' ? 'Process Node' : 'Flow Node'}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Card Body */}
            <div className="p-4 space-y-3">
              {/* Connected Flows for Process Nodes */}
              {hoveredNode.type === 'process' && (
                <div>
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                    Connected Flows
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {getConnectedFlows(hoveredNode).length > 0 ? (
                      getConnectedFlows(hoveredNode).map((flowNode, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"
                        >
                          {flowNode.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 text-xs">No connected flows</span>
                    )}
                  </div>
                </div>
              )}

              {/* Connected Processes for Flow Nodes */}
              {hoveredNode.type === 'flow' && (
                <div>
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                    Connected Processes
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {getNodeProcesses(hoveredNode).length > 0 ? (
                      getNodeProcesses(hoveredNode).map((processName, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {processName}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 text-xs">No connected processes</span>
                    )}
                  </div>
                </div>
              )}
              
              {/* Purpose */}
              {hoveredNode.purpose && (
                <div>
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                    Purpose
                  </div>
                  <div className="text-sm text-slate-700 leading-relaxed">
                    {hoveredNode.purpose}
                  </div>
                </div>
              )}
              
              {/* Legacy Name */}
              {hoveredNode.oldName && (
                <div>
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                    Legacy Name
                  </div>
                  <div className="text-sm text-amber-700 bg-amber-50 px-2 py-1 rounded font-medium">
                    {hoveredNode.oldName}
                  </div>
                </div>
              )}
              
              {/* Technical Info */}
              <div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                  Technical Details
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Node ID:</span>
                    <span className="font-mono text-slate-800 bg-slate-100 px-1 rounded">
                      {hoveredNode.id}
                    </span>
                  </div>
                  {hoveredNode.link && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">External Link:</span>
                      <button
                        className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(hoveredNode.link, '_blank');
                        }}
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Open
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Card Footer */}
            <div className="px-4 py-2 bg-slate-50 rounded-b-xl border-t border-slate-100">
              <div className="text-xs text-slate-500 text-center">
                Click for detailed view • Drag to reposition
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
