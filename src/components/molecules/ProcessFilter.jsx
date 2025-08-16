import React from 'react';
import Checkbox from '../atoms/Checkbox';

const ProcessFilter = ({ processNames, enabledMap, onChange }) => {
  return (
    <div className="space-y-2">
      {processNames.map((processName) => (
        <Checkbox
          key={processName}
          label={processName}
          checked={enabledMap[processName] !== false}
          onChange={(e) => onChange(processName, e.target.checked)}
        />
      ))}
    </div>
  );
};

export default ProcessFilter;
