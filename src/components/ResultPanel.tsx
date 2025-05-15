
import React from 'react';

export type Detection = {
  id: string;
  label: string;
  confidence: number;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};

interface ResultPanelProps {
  results: Detection[];
  mode: string;
}

const ResultPanel = ({ results, mode }: ResultPanelProps) => {
  if (results.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#112221] rounded-2xl p-6 shadow-xl animate-fade-in">
      <h2 className="text-xl font-semibold mb-4 text-[#00E8CF]">
        {mode === 'disaster' ? 'Disaster Analysis Results' : 'Object Detection Results'}
      </h2>
      <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-hidden">
        {results.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between bg-[#054938] rounded-xl p-3 hover:bg-opacity-80 transition-all cursor-pointer"
          >
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[#3FEBD0] mr-3"></div>
              <span className="font-medium text-[#F0F2F0]">{item.label}</span>
            </div>
            <div className="text-sm font-semibold text-[#3FEBD0]">
              {Math.round(item.confidence * 100)}%
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-3 border-t border-[#094534] text-xs text-[#3FEBD0] flex justify-between">
        <span>{results.length} items detected</span>
        <span>{new Date().toLocaleTimeString()}</span>
      </div>
    </div>
  );
};

export default ResultPanel;
