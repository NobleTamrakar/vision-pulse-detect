
import React from 'react';

interface DetectionToggleProps {
  activeMode: string;
  setActiveMode: (mode: string) => void;
}

const DetectionToggle = ({ activeMode, setActiveMode }: DetectionToggleProps) => {
  return (
    <div className="flex bg-[#054938] rounded-xl p-1 shadow-md">
      <button
        onClick={() => setActiveMode('object')}
        className={`py-2 px-4 rounded-lg text-sm transition-all duration-300 flex-1 ${
          activeMode === 'object'
            ? 'bg-[#112221] text-[#00E8CF] shadow-sm'
            : 'text-[#F0F2F0] hover:text-[#3FEBD0]'
        }`}
      >
        Object Detection
      </button>
      <button
        onClick={() => setActiveMode('disaster')}
        className={`py-2 px-4 rounded-lg text-sm transition-all duration-300 flex-1 ${
          activeMode === 'disaster'
            ? 'bg-[#112221] text-[#00E8CF] shadow-sm'
            : 'text-[#F0F2F0] hover:text-[#3FEBD0]'
        }`}
      >
        Disaster Detection
      </button>
    </div>
  );
};

export default DetectionToggle;
