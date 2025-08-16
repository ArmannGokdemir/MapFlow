import React from 'react';
import Card from '../atoms/Card';
import Badge from '../atoms/Badge';
import Button from '../atoms/Button';

export default function Sidebar({ selectedNode, onClose }) {
  if (!selectedNode) return null;

  const isProcess = selectedNode.type === 'process';

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl border-l border-slate-200 z-50 overflow-hidden flex flex-col">
        {/* Header */}
        <div className={`px-6 py-5 border-b border-slate-200 ${
          isProcess 
            ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
            : 'bg-gradient-to-r from-emerald-500 to-emerald-600'
        }`}>
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                  isProcess ? 'bg-white/20' : 'bg-white/20'
                }`}>
                  {isProcess ? 'P' : 'F'}
                </div>
                <Badge className="bg-white/20 text-white border-white/30">
                  {isProcess ? 'Process' : 'Flow'}
                </Badge>
              </div>
              <h2 className="text-lg font-bold text-white leading-tight">
                {selectedNode.name}
              </h2>
              {selectedNode.purpose && (
                <p className="text-white/80 text-sm mt-1 line-clamp-2">
                  {selectedNode.purpose}
                </p>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="ml-3 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Basic Information
            </h3>
            
            <Card className="border-slate-200 shadow-sm">
              <div className="p-4 space-y-4">
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Full Name</label>
                  <p className="text-slate-800 font-medium mt-1 break-words">{selectedNode.name}</p>
                </div>
                
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Type</label>
                  <div className="mt-1">
                    <Badge 
                      className={isProcess 
                        ? 'bg-blue-100 text-blue-800 border-blue-200' 
                        : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      }
                    >
                      {isProcess ? 'Process Node' : 'Flow Node'}
                    </Badge>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Node ID</label>
                  <p className="text-slate-600 text-sm mt-1 font-mono bg-slate-50 px-2 py-1 rounded">
                    {selectedNode.id}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Flow-specific details */}
          {!isProcess && (
            <>
              {selectedNode.purpose && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Purpose & Description
                  </h3>
                  
                  <Card className="border-slate-200 shadow-sm">
                    <div className="p-4">
                      <p className="text-slate-700 leading-relaxed">{selectedNode.purpose}</p>
                    </div>
                  </Card>
                </div>
              )}

              {selectedNode.oldName && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Legacy Information
                  </h3>
                  
                  <Card className="border-amber-200 bg-amber-50 shadow-sm">
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <label className="text-xs font-medium text-amber-700 uppercase tracking-wider">Previous Name</label>
                          <p className="text-amber-800 font-medium mt-1 break-words">{selectedNode.oldName}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {selectedNode.link && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    External Resources
                  </h3>
                  
                  <Card className="border-blue-200 shadow-sm">
                    <div className="p-4">
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => window.open(selectedNode.link, '_blank')}
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Open in Power Automate
                      </Button>
                      <p className="text-xs text-slate-500 mt-2 text-center">
                        View this flow in the Power Automate portal
                      </p>
                    </div>
                  </Card>
                </div>
              )}
            </>
          )}

          {/* Actions */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
              Quick Actions
            </h3>
            
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  navigator.clipboard.writeText(selectedNode.name);
                }}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy Name to Clipboard
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(selectedNode, null, 2));
                }}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export Node Data
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
