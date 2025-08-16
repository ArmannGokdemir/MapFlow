import React from 'react';
import { Button } from '../atoms';

const GraphControls = ({ layout, onLayoutChange, onZoomIn, onZoomOut, onResetZoom, onReorganize }) => {
  return (
    <div className="mt-4 text-sm text-gray-600">
      <div className="font-semibold text-gray-700 mb-1">Graph Controls</div>
      
      <div className="flex items-center gap-2 mb-2">
        <Button size="sm" onClick={onZoomOut}>−</Button>
        <Button size="sm" onClick={onResetZoom}>Reset</Button>
        <Button size="sm" onClick={onZoomIn}>+</Button>
      </div>
      
      <div className="flex items-center gap-2 mb-2">
        <label className="text-sm">Layout:</label>
        <select 
          value={layout} 
          onChange={(e) => onLayoutChange(e.target.value)} 
          className="px-2 py-1 rounded-lg border border-gray-200"
        >
          <option value="radial">Radial</option>
          <option value="columns">Columns</option>
        </select>
        <Button size="sm" onClick={onReorganize} className="ml-auto">
          Reorganize
        </Button>
      </div>
      
      <div className="mt-3 text-xs text-gray-500">
        Tip: Drag background to pan. Drag a process to move its flows together. Hover highlights neighbors.
      </div>
    </div>
  );
};

export default GraphControls;
