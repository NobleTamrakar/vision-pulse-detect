
import React from 'react';
import { Detection } from './ResultPanel';

interface DetectionOverlayProps {
  detections: Detection[];
  imageWidth: number;
  imageHeight: number;
}

const DetectionOverlay = ({ detections, imageWidth, imageHeight }: DetectionOverlayProps) => {
  return (
    <div className="absolute top-0 left-0 w-full h-full">
      {detections
        .filter(detection => detection.boundingBox)
        .map((detection) => {
          const box = detection.boundingBox!;
          return (
            <div
              key={detection.id}
              className="absolute border-2 border-[#3FEBD0] rounded-md flex items-start justify-between"
              style={{
                left: `${box.x * 100}%`,
                top: `${box.y * 100}%`,
                width: `${box.width * 100}%`,
                height: `${box.height * 100}%`,
              }}
            >
              <div className="absolute -top-6 left-0 bg-[#112221] px-2 py-0.5 rounded text-xs text-[#3FEBD0] whitespace-nowrap font-medium">
                {detection.label} ({Math.round(detection.confidence * 100)}%)
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default DetectionOverlay;
