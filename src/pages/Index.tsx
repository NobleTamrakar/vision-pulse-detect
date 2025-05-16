import React, { useRef, useState, useEffect } from 'react';
import ImageUploader from '@/components/ImageUploader';
import RecognitionButton from '@/components/RecognitionButton';
import ResultPanel, { Detection } from '@/components/ResultPanel';
import DetectionToggle from '@/components/DetectionToggle';
import DetectionOverlay from '@/components/DetectionOverlay';
import { toast } from 'sonner';

const Index = () => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectionMode, setDetectionMode] = useState('object');
  const [results, setResults] = useState<Detection[]>([]);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [isLiveMode, setIsLiveMode] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    return () => {
      // Clean up object URLs when component unmounts
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  // Handle image load to get dimensions
  const handleImageLoad = () => {
    if (imageRef.current) {
      setImageDimensions({
        width: imageRef.current.naturalWidth,
        height: imageRef.current.naturalHeight
      });
    }
  };

  const handleImageUpload = (file: File) => {
    // Cleanup previous URL if exists
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
    
    setUploadedImage(file);
    const objectUrl = URL.createObjectURL(file);
    setImageUrl(objectUrl);
    setResults([]);
    setIsLiveMode(false);
  };

  // Process live camera frames
  const handleLiveFrame = (imageData: ImageData) => {
    // This would normally connect to an AI service for real-time analysis
    // For this demo, we'll simulate analysis every few seconds to avoid overwhelming the UI
    
    // Use a debounced approach for demo purposes
    const currentTime = Date.now();
    if (!handleLiveFrame.lastUpdate || currentTime - handleLiveFrame.lastUpdate > 3000) {
      handleLiveFrame.lastUpdate = currentTime;
      
      // Generate mock results for the live feed
      const mockResults: Detection[] = detectionMode === 'disaster' 
        ? [
            { id: `live-1-${currentTime}`, label: 'Flood Risk', confidence: 0.6 + Math.random() * 0.2, boundingBox: { x: 0.2, y: 0.3, width: 0.5, height: 0.4 } },
            { id: `live-2-${currentTime}`, label: 'Fire Hazard', confidence: 0.7 + Math.random() * 0.15, boundingBox: { x: 0.6, y: 0.2, width: 0.3, height: 0.3 } },
          ]
        : [
            { id: `live-1-${currentTime}`, label: 'Person', confidence: 0.8 + Math.random() * 0.15, boundingBox: { x: 0.3, y: 0.2, width: 0.2, height: 0.6 } },
            { id: `live-2-${currentTime}`, label: 'Object', confidence: 0.7 + Math.random() * 0.2, boundingBox: { x: 0.7, y: 0.4, width: 0.25, height: 0.3 } },
          ];
      
      setResults(mockResults);
    }
  };
  
  // Add a property for timestamp tracking
  handleLiveFrame.lastUpdate = 0;

  const runRecognition = () => {
    if (isLiveMode) {
      // Toggle live mode off
      setIsLiveMode(false);
      setResults([]);
      return;
    }
    
    // Handle regular image recognition
    if (uploadedImage) {
      setIsProcessing(true);
      setResults([]);
      
      // Simulate AI processing with a timeout
      setTimeout(() => {
        // Generate mock detection results based on the mode
        let mockResults: Detection[];
        
        if (detectionMode === 'disaster') {
          mockResults = [
            { id: '1', label: 'Flood Water', confidence: 0.96, boundingBox: { x: 0.1, y: 0.4, width: 0.8, height: 0.5 } },
            { id: '2', label: 'Damaged Building', confidence: 0.87, boundingBox: { x: 0.3, y: 0.2, width: 0.4, height: 0.3 } },
            { id: '3', label: 'Debris', confidence: 0.82, boundingBox: { x: 0.5, y: 0.7, width: 0.3, height: 0.2 } },
          ];
          toast.success('Disaster analysis complete');
        } else {
          mockResults = [
            { id: '1', label: 'Person', confidence: 0.98, boundingBox: { x: 0.2, y: 0.2, width: 0.3, height: 0.6 } },
            { id: '2', label: 'Tree', confidence: 0.92, boundingBox: { x: 0.7, y: 0.1, width: 0.2, height: 0.7 } },
            { id: '3', label: 'Car', confidence: 0.89, boundingBox: { x: 0.1, y: 0.7, width: 0.25, height: 0.2 } },
            { id: '4', label: 'Building', confidence: 0.84, boundingBox: { x: 0.5, y: 0.1, width: 0.4, height: 0.5 } },
          ];
          toast.success('Object detection complete');
        }
        
        setResults(mockResults);
        setIsProcessing(false);
      }, 2500);
    } else {
      // Open the camera in live mode
      setIsLiveMode(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-12 md:py-16 lg:py-20">
      <div className="w-full max-w-6xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-2 mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#00E8CF]">
            AI Image Recognition
          </h1>
          <p className="text-[#F0F2F0] mt-3 text-lg max-w-2xl mx-auto">
            Upload an image or use live camera feed to detect objects, analyze scenes, or identify disaster areas using advanced AI recognition.
          </p>
          <div className="mt-6 max-w-xs mx-auto">
            <DetectionToggle
              activeMode={detectionMode}
              setActiveMode={setDetectionMode}
            />
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left column - Upload */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-[#112221] p-6 rounded-2xl shadow-xl">
              <h2 className="text-xl font-semibold mb-4 text-[#00E8CF]">Image Upload</h2>
              <ImageUploader 
                onImageUpload={handleImageUpload} 
                onLiveFrameAnalysis={handleLiveFrame} 
              />
            </div>
          </div>

          {/* Right column - Actions & Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recognition Button */}
            <div className="bg-[#112221] p-6 rounded-2xl shadow-xl flex justify-center">
              <RecognitionButton
                onRecognize={runRecognition}
                isProcessing={isProcessing}
                disabled={isLiveMode ? false : !uploadedImage}
                isLiveMode={!uploadedImage}
              />
            </div>

            {/* Results Panel */}
            {(results.length > 0 || isProcessing) && (
              <div className="relative">
                {isProcessing ? (
                  <div className="bg-[#112221] rounded-2xl p-6 shadow-xl h-64 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 border-4 border-[#3FEBD0] border-t-transparent rounded-full animate-spin-slow"></div>
                    <p className="mt-4 text-[#F0F2F0] animate-pulse-subtle">
                      {detectionMode === 'disaster' 
                        ? 'Analyzing disaster features...' 
                        : 'Detecting objects in image...'}
                    </p>
                  </div>
                ) : (
                  <ResultPanel results={results} mode={detectionMode} />
                )}
              </div>
            )}

            {/* Tips */}
            <div className="bg-[#112221] p-6 rounded-2xl shadow-xl">
              <h3 className="text-[#00E8CF] font-semibold mb-2">Tips</h3>
              <ul className="list-disc list-inside text-sm text-[#F0F2F0] space-y-2">
                <li>Upload clear, high-resolution images for better results</li>
                <li>Use live camera analysis for real-time detection</li>
                <li>Switch detection modes depending on your analysis needs</li>
                <li>Hover over detected areas for more information</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
