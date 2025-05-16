
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from '@/components/ui/sonner';
import { Upload, Image, X, Camera, Video } from 'lucide-react';
import CameraCapture from './CameraCapture';
import { Button } from '@/components/ui/button';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  onLiveFrameAnalysis?: (imageData: ImageData) => void;
}

const ImageUploader = ({ onImageUpload, onLiveFrameAnalysis }: ImageUploaderProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      toast.success('Image uploaded successfully');
    } else {
      toast.error('Please upload a valid image file');
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
    },
    maxFiles: 1,
  });

  const removeImage = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
      toast.info('Image removed');
    }
  };

  const handleCaptureImage = (file: File) => {
    onImageUpload(file);
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setShowCamera(false);
  };

  const handleOpenCamera = (liveMode: boolean = false) => {
    // Check if the browser supports getUserMedia
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast.error('Your browser does not support camera access');
      return;
    }
    setShowCamera(true);
  };

  return (
    <div className="w-full">
      {showCamera && (
        <CameraCapture 
          onCapture={handleCaptureImage}
          onClose={() => setShowCamera(false)}
          onLiveFrame={onLiveFrameAnalysis}
        />
      )}

      {!preview ? (
        <div className="w-full">
          <div
            {...getRootProps()}
            className={`w-full flex flex-col items-center justify-center border-2 border-dashed border-[#094534] bg-[#112221] rounded-2xl p-6 transition-all duration-300 cursor-pointer ${
              isDragActive ? 'border-[#3FEBD0] bg-opacity-80' : ''
            } h-64 hover:border-[#3FEBD0]`}
          >
            <input {...getInputProps()} />
            <Upload 
              className="w-16 h-16 text-[#3FEBD0] mb-4" 
              strokeWidth={1.5} 
            />
            <p className="text-center text-[#F0F2F0]">
              {isDragActive
                ? 'Drop the image here...'
                : 'Drag & drop an image here, or click to select'}
            </p>
            <p className="text-sm text-[#3FEBD0] mt-2">
              Supports: JPG, PNG, GIF
            </p>
          </div>
          
          <div className="mt-3 flex gap-2">
            <Button
              onClick={() => handleOpenCamera(false)}
              className="flex-1 bg-[#054938] text-[#F0F2F0] hover:bg-[#094534] transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Camera className="w-5 h-5" />
              <span>Take a Photo</span>
            </Button>
            
            {onLiveFrameAnalysis && (
              <Button
                onClick={() => handleOpenCamera(true)}
                className="flex-1 bg-[#054938] text-[#F0F2F0] hover:bg-[#094534] transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Video className="w-5 h-5" />
                <span>Live Analysis</span>
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="relative w-full">
          <div className="group relative rounded-2xl overflow-hidden shadow-xl">
            <img
              src={preview}
              alt="Preview"
              className="w-full max-h-96 object-contain rounded-2xl"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeImage();
              }}
              className="absolute top-2 right-2 bg-[#112221] text-[#F0F2F0] p-2 rounded-full opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Remove image"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-3 flex gap-2">
            <div 
              {...getRootProps()} 
              className="flex-1 py-2 px-4 flex items-center justify-center bg-[#054938] text-[#F0F2F0] rounded-lg cursor-pointer hover:bg-[#094534] transition-all duration-300"
            >
              <input {...getInputProps()} />
              <Image className="w-5 h-5 mr-2" />
              <span>Upload a different image</span>
            </div>
            
            <Button
              onClick={() => handleOpenCamera(false)}
              className="py-2 px-4 bg-[#054938] text-[#F0F2F0] rounded-lg hover:bg-[#094534] transition-all duration-300 flex items-center justify-center"
            >
              <Camera className="w-5 h-5" />
            </Button>
            
            {onLiveFrameAnalysis && (
              <Button
                onClick={() => handleOpenCamera(true)}
                className="py-2 px-4 bg-[#054938] text-[#F0F2F0] rounded-lg hover:bg-[#094534] transition-all duration-300 flex items-center justify-center"
              >
                <Video className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
