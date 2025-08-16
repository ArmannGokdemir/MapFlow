import React from 'react';
import { Badge } from '../atoms';

const HoverTooltip = ({ hoverPayload, containerSize }) => {
  if (!hoverPayload) return null;

  const { node, neighbors, pos } = hoverPayload;
  
  return (
    <div
      className="pointer-events-none absolute z-50"
      style={{
        left: Math.max(8, Math.min((pos?.x ?? 0) + 14, containerSize.w - 340)),
        top: Math.max(8, Math.min((pos?.y ?? 0) + 14, containerSize.h - 180)),
      }}
    >
      <div className="w-[320px] bg-white/95 border border-gray-200 rounded-2xl shadow-2xl p-3">
        <div className="text-xs uppercase tracking-wide text-gray-500">
          {node.type === 'process' ? 'Process' : 'Flow'}
        </div>
        <div className="font-semibold mb-1">{node.name}</div>
        
        {node.type === 'flow' && node.purpose && (
          <div className="text-xs text-gray-600">{node.purpose}</div>
        )}
        
        {node.type === 'flow' && (
          <div className="text-xs text-gray-700 mt-2">
            <div className="font-medium mb-1">In processes</div>
            <div className="flex flex-wrap gap-1">
              {neighbors.filter(n => n && n.type === 'process').map((p) => (
                <Badge key={p.id} variant="info">
                  {p.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {node.type === 'flow' && node.link && (
          <div className="mt-2">
            <a 
              className="text-xs px-2 py-1 rounded-lg bg-sky-600 text-white hover:bg-sky-700" 
              target="_blank" 
              rel="noreferrer" 
              href={node.link}
            >
              Open flow ↗
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default HoverTooltip;
