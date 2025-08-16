import React, { useState } from 'react';
import Card from '../atoms/Card';
import Badge from '../atoms/Badge';

export default function Swimlane({ graph, currentView, onNodeClick }) {
  const [expandedProcesses, setExpandedProcesses] = useState(new Set()); // Changed to Set for multiple processes
  
  if (currentView !== 'swimlane') return null;

  const processes = graph.nodes.filter(n => n.type === 'process');
  
  // Expand/Collapse all functions
  const expandAll = () => {
    setExpandedProcesses(new Set(processes.map(p => p.id)));
  };
  
  const collapseAll = () => {
    setExpandedProcesses(new Set());
  };
  
  const toggleProcess = (processId) => {
    const newExpanded = new Set(expandedProcesses);
    if (newExpanded.has(processId)) {
      newExpanded.delete(processId);
    } else {
      newExpanded.add(processId);
    }
    setExpandedProcesses(newExpanded);
  };
  
  // Generate consistent colors for each process
  const getProcessColor = (index) => {
    const colors = [
      { bg: 'from-blue-500 to-blue-600', accent: 'blue', light: 'bg-blue-50', border: 'border-blue-200' },
      { bg: 'from-emerald-500 to-emerald-600', accent: 'emerald', light: 'bg-emerald-50', border: 'border-emerald-200' },
      { bg: 'from-purple-500 to-purple-600', accent: 'purple', light: 'bg-purple-50', border: 'border-purple-200' },
      { bg: 'from-orange-500 to-orange-600', accent: 'orange', light: 'bg-orange-50', border: 'border-orange-200' },
      { bg: 'from-pink-500 to-pink-600', accent: 'pink', light: 'bg-pink-50', border: 'border-pink-200' },
      { bg: 'from-indigo-500 to-indigo-600', accent: 'indigo', light: 'bg-indigo-50', border: 'border-indigo-200' },
      { bg: 'from-teal-500 to-teal-600', accent: 'teal', light: 'bg-teal-50', border: 'border-teal-200' },
      { bg: 'from-red-500 to-red-600', accent: 'red', light: 'bg-red-50', border: 'border-red-200' },
    ];
    return colors[index % colors.length];
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Modern Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Process Swimlanes
              </h1>
              <p className="text-slate-600 mt-2 text-lg">Explore processes and their connected flows in beautiful, organized sections</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-2xl">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-slate-700">{processes.length} Processes</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-2xl">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-slate-700">{graph.nodes.filter(n => n.type === 'flow').length} Flows</span>
              </div>
              
              {/* Expand/Collapse All Buttons */}
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={expandAll}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl transition-colors text-sm font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  Expand All
                </button>
                <button
                  onClick={collapseAll}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-500 hover:bg-slate-600 text-white rounded-2xl transition-colors text-sm font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l3-3 3 3m0-6l-3-3-3 3" />
                  </svg>
                  Collapse All
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Process Cards Container */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid gap-8">
          {processes.map((process, index) => {
            const flows = graph.links
              .filter(link => {
                const sourceId = typeof link.source === 'string' ? link.source : link.source.id || link.source;
                return sourceId === process.id;
              })
              .map(link => {
                const targetId = typeof link.target === 'string' ? link.target : link.target.id || link.target;
                return graph.nodes.find(n => n.id === targetId);
              })
              .filter(Boolean);

            const colorScheme = getProcessColor(index);
            const isExpanded = expandedProcesses.has(process.id);

            return (
              <div key={process.id} className="group">
                {/* Process Card */}
                <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-[1.01]">
                  
                  {/* Process Header - Always Visible */}
                  <div className={`bg-gradient-to-r ${colorScheme.bg} p-6 relative overflow-hidden cursor-pointer`}
                       onClick={() => toggleProcess(process.id)}>
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-white/10 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]"></div>
                    
                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                          <span className="text-white font-bold text-lg">P</span>
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-white mb-1">{process.name}</h2>
                          <p className="text-white/80 text-sm">Process #{index + 1}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-2xl">
                          <span className="text-white font-semibold text-sm">{flows.length} flows</span>
                        </div>
                        
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors">
                          <svg 
                            className={`w-5 h-5 text-white transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Flows Section - Only show when expanded */}
                  {isExpanded && (
                    <div className="p-6">
                      {flows.length > 0 ? (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                          {flows.map((flow, flowIndex) => (
                            <div
                              key={flow.id}
                              onClick={() => onNodeClick?.(null, flow)}
                              className="group/flow cursor-pointer"
                            >
                              {/* Modern Flow Card */}
                              <div className={`${colorScheme.light} ${colorScheme.border} border-2 rounded-2xl p-5 hover:shadow-lg transition-all duration-300 hover:scale-105 hover:-translate-y-1 backdrop-blur-sm`}>
                                
                                {/* Flow Header */}
                                <div className="flex items-start justify-between mb-4">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <div className={`w-3 h-3 bg-${colorScheme.accent}-500 rounded-full`}></div>
                                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Flow #{flowIndex + 1}</span>
                                    </div>
                                    <h3 className="font-bold text-slate-800 text-lg leading-tight group-hover/flow:text-slate-900">
                                      {flow.name}
                                    </h3>
                                  </div>
                                  
                                  <div className="w-8 h-8 bg-white/60 rounded-xl flex items-center justify-center group-hover/flow:bg-white transition-colors">
                                    <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                  </div>
                                </div>
                                
                                {/* Flow Content */}
                                <div className="space-y-3">
                                  {flow.purpose && (
                                    <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                                      {flow.purpose}
                                    </p>
                                  )}
                                  
                                  {/* Enhanced Meta Tags */}
                                  <div className="flex flex-wrap gap-2">
                                    {flow.oldName && (
                                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                        </svg>
                                        Legacy
                                      </span>
                                    )}
                                    
                                    {flow.link && (
                                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                        </svg>
                                        Linked
                                      </span>
                                    )}
                                  </div>
                                  
                                  {/* Action Button */}
                                  <div className="pt-2">
                                    <button className="w-full py-2 px-4 bg-white/80 hover:bg-white rounded-xl text-sm font-medium text-slate-700 hover:text-slate-900 transition-all duration-200 border border-white/60 hover:border-slate-200">
                                      View Details
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        /* Empty State - Modern Design */
                        <div className="text-center py-16">
                          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center">
                            <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-semibold text-slate-600 mb-2">No flows connected</h3>
                          <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
                            This process doesn't have any connected flows yet. Flows will appear here when they're linked to this process.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
