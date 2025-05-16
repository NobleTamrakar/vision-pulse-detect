
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Camera, CameraOff, X, CameraIcon, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  onClose: () => void;
  onLiveFrame?: (imageData: ImageData) => void;
}

const CameraCapture = ({ onCapture, onClose, onLiveFrame }: CameraCaptureProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLiveAnalysis, setIsLiveAnalysis] = useState(false);
  const animationRef = useRef<number | null>(null);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsStreaming(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Could not access camera. Please check permissions.');
      toast.error('Camera access denied. Please check your browser permissions.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
    
    // Stop live analysis if it's running
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  const captureImage = useCallback(() => {
    if (!isStreaming || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the video frame to the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (blob) {
        // Create a file from the blob
        const file = new File([blob], `camera-capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
        onCapture(file);
        stopCamera();
        onClose();
        toast.success('Photo captured successfully!');
      } else {
        toast.error('Failed to capture photo');
      }
    }, 'image/jpeg', 0.9);
  }, [isStreaming, onCapture, onClose, stopCamera]);

  // Process frames for live analysis
  const processFrame = useCallback(() => {
    if (!isStreaming || !videoRef.current || !canvasRef.current || !isLiveAnalysis) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the video frame to the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get image data for analysis
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    
    // Process frame with the callback if provided
    if (onLiveFrame) {
      onLiveFrame(imageData);
    }

    // Continue the animation loop
    animationRef.current = requestAnimationFrame(processFrame);
  }, [isStreaming, isLiveAnalysis, onLiveFrame]);

  // Toggle live analysis mode
  const toggleLiveAnalysis = useCallback(() => {
    if (!isLiveAnalysis) {
      setIsLiveAnalysis(true);
      // Start the analysis loop
      animationRef.current = requestAnimationFrame(processFrame);
      toast.success('Live analysis started');
    } else {
      setIsLiveAnalysis(false);
      // Stop the analysis loop
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      toast.info('Live analysis stopped');
    }
  }, [isLiveAnalysis, processFrame]);

  // Start camera when component mounts
  useEffect(() => {
    startCamera();
    // Clean up when component unmounts
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  // Clean up animation frame when component unmounts
  useEffect(() => {
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-[#112221] rounded-2xl p-6 max-w-lg w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-[#F0F2F0] bg-[#054938] p-2 rounded-full hover:bg-[#094534] transition-colors"
          aria-label="Close camera"
        >
          <X size={18} />
        </button>
        
        <h2 className="text-xl font-semibold mb-4 text-[#00E8CF]">
          {isLiveAnalysis ? 'Live Camera Analysis' : 'Camera Capture'}
        </h2>
        
        <div className="flex flex-col items-center">
          {error ? (
            <div className="bg-red-900/20 border border-red-500 p-4 rounded-xl mb-4 text-center">
              <CameraOff className="mx-auto mb-2 text-red-400" size={32} />
              <p className="text-red-300">{error}</p>
            </div>
          ) : (
            <div className="relative w-full rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center mb-4">
              <video 
                ref={videoRef} 
                className="max-w-full max-h-full" 
                autoPlay 
                playsInline
                muted
              />
              <canvas ref={canvasRef} className="hidden" />
              
              {!isStreaming && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                  <div className="animate-pulse text-[#3FEBD0]">
                    <Camera size={40} />
                  </div>
                </div>
              )}
              
              {isLiveAnalysis && isStreaming && (
                <div className="absolute top-2 left-2 bg-[#22C55E] text-white px-2 py-1 rounded-lg text-xs font-medium animate-pulse">
                  Live Analysis Active
                </div>
              )}
            </div>
          )}
          
          <div className="flex flex-col w-full gap-2">
            {onLiveFrame && (
              <Button
                onClick={toggleLiveAnalysis}
                disabled={!isStreaming || !!error}
                className={`${
                  isLiveAnalysis ? 'bg-[#054938]' : 'bg-[#22C55E] hover:bg-[#00BC4C]'
                } text-white py-3 px-6 rounded-xl flex items-center justify-center text-lg font-semibold transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isLiveAnalysis ? (
                  <>
                    <Pause className="w-5 h-5 mr-2" />
                    Stop Live Analysis
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2 fill-white" />
                    Start Live Analysis
                  </>
                )}
              </Button>
            )}
            
            <Button
              onClick={captureImage}
              disabled={!isStreaming || !!error || isLiveAnalysis}
              className="bg-[#22C55E] hover:bg-[#00BC4C] text-white py-3 px-6 rounded-xl flex items-center justify-center text-lg font-semibold transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CameraIcon className="w-5 h-5 mr-2" />
              Capture Photo
            </Button>
            
            <Button
              onClick={onClose}
              variant="outline"
              className="border-[#094534] text-[#F0F2F0] hover:bg-[#054938] mt-2"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraCapture;
