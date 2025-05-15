
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from '@/components/ui/sonner';
import { Upload, Image, X } from 'lucide-react';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

const ImageUploader = ({ onImageUpload }: ImageUploaderProps) => {
  const [preview, setPreview] = useState<string | null>(null);

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

  return (
    <div className="w-full">
      {!preview ? (
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
          <div 
            {...getRootProps()} 
            className="mt-3 py-2 px-4 flex items-center justify-center bg-[#054938] text-[#F0F2F0] rounded-lg cursor-pointer hover:bg-[#094534] transition-all duration-300"
          >
            <input {...getInputProps()} />
            <Image className="w-5 h-5 mr-2" />
            <span>Upload a different image</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
