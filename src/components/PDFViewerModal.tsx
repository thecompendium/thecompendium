import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import CustomPdfViewer from './CustomPdfViewer';

interface PDFViewerModalProps {
  pdfUrl: string;
  fileName: string;
  onClose: () => void;
}

const PDFViewerModal: React.FC<PDFViewerModalProps> = ({ pdfUrl, fileName, onClose }) => {
  // Prevent scrolling of the body when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="relative w-full h-full max-w-7xl max-h-[95vh] bg-white dark:bg-gray-900 rounded-lg shadow-xl flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="w-full h-full">
          <CustomPdfViewer
            pdfUrl={pdfUrl}
            fileName={fileName}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default PDFViewerModal; 