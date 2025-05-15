
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader, Play } from 'lucide-react';

interface RecognitionButtonProps {
  onRecognize: () => void;
  isProcessing: boolean;
  disabled: boolean;
}

const RecognitionButton = ({ onRecognize, isProcessing, disabled }: RecognitionButtonProps) => {
  return (
    <Button
      onClick={onRecognize}
      disabled={isProcessing || disabled}
      className={`bg-[#22C55E] hover:bg-[#00BC4C] text-white py-3 px-6 rounded-xl flex items-center justify-center text-lg font-semibold transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {isProcessing ? (
        <>
          <Loader className="w-5 h-5 mr-2 animate-spin-slow" />
          Processing...
        </>
      ) : (
        <>
          <Play className="w-5 h-5 mr-2 fill-white" />
          Run Recognition
        </>
      )}
    </Button>
  );
};

export default RecognitionButton;
