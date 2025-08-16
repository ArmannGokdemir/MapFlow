import React from 'react';
import Button from '../atoms/Button';

const ViewToggle = ({ currentView, onToggle }) => {
  return (
    <div className="flex gap-1 p-1 rounded-xl border border-gray-200 bg-white/90 backdrop-blur">
      <Button
        variant={currentView === 'force' ? 'primary' : 'default'}
        onClick={() => onToggle()}
        className="shadow-sm"
      >
        Force Graph
      </Button>
      <Button
        variant={currentView === 'swimlane' ? 'primary' : 'default'}
        onClick={() => onToggle()}
        className="shadow-sm"
      >
        Swimlane
      </Button>
    </div>
  );
};

export default ViewToggle;
