import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';

// Set the PDF.js worker path - use full URL for CDN to avoid CORS issues
const workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

interface CustomPdfViewerProps {
  pdfUrl: string;
  fileName: string;
  onClose?: () => void;
}

const CustomPdfViewer: React.FC<CustomPdfViewerProps> = ({ pdfUrl, fileName, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState(1.5);

  // Set the window title to the filename
  useEffect(() => {
    const originalTitle = document.title;
    document.title = fileName;
    
    return () => {
      document.title = originalTitle;
    };
  }, [fileName]);

  // Load the PDF document
  useEffect(() => {
    const loadPdf = async () => {
      try {
        setLoading(true);
        
        // First try with full options
        try {
          const loadingTask = pdfjsLib.getDocument({
            url: pdfUrl,
            cMapUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/cmaps/',
            cMapPacked: true,
            withCredentials: false,
          });
          
          const pdfDoc = await loadingTask.promise;
          setPdf(pdfDoc);
          setTotalPages(pdfDoc.numPages);
          setLoading(false);
        } catch (firstError) {
          console.warn('First PDF loading attempt failed:', firstError);
          
          // Second attempt with simpler configuration
          try {
            const simpleLoadingTask = pdfjsLib.getDocument(pdfUrl);
            const pdfDoc = await simpleLoadingTask.promise;
            setPdf(pdfDoc);
            setTotalPages(pdfDoc.numPages);
            setLoading(false);
          } catch (secondError) {
            throw new Error(`PDF loading failed: ${secondError.message}`);
          }
        }
      } catch (err) {
        console.error('Error loading PDF:', err);
        setError(`Failed to load PDF document. ${err.message}`);
        setLoading(false);
      }
    };
    
    loadPdf();
  }, [pdfUrl]);

  // Render the current page
  useEffect(() => {
    if (!pdf || !canvasRef.current) return;
    
    const renderPage = async () => {
      try {
        const page = await pdf.getPage(currentPage);
        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const context = canvas.getContext('2d');
        if (!context) return;
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        
        await page.render(renderContext).promise;
      } catch (err) {
        console.error('Error rendering page:', err);
        setError('Failed to render page');
      }
    };
    
    renderPage();
  }, [pdf, currentPage, scale]);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const zoomIn = () => {
    setScale(prevScale => prevScale + 0.2);
  };

  const zoomOut = () => {
    setScale(prevScale => Math.max(0.5, prevScale - 0.2));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-theme-blue"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-8">
        <p className="text-xl font-bold mb-2">{error}</p>
        <p className="text-sm mt-2 mb-4">URL: {pdfUrl}</p>
        <div className="flex flex-col items-center gap-4">
          <a 
            href={pdfUrl} 
            download={fileName}
            className="flex items-center px-4 py-2 bg-theme-blue text-white rounded hover:bg-theme-blue/90 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Download the PDF
          </a>
          <button
            onClick={() => window.open(pdfUrl, '_blank')}
            className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Try opening in browser
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-900">
      {/* Toolbar */}
      <div className="bg-white dark:bg-gray-800 shadow-md py-3 px-4 flex items-center justify-between">
        <div className="flex items-center">
          {onClose && (
            <button 
              onClick={onClose}
              className="flex items-center text-theme-blue dark:text-white hover:text-theme-blue/80 mr-4"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Back
            </button>
          )}
          <h1 className="text-lg font-medium">{fileName}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button 
              onClick={zoomOut}
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              title="Zoom out"
            >
              -
            </button>
            <span className="text-sm">{Math.round(scale * 100)}%</span>
            <button 
              onClick={zoomIn}
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              title="Zoom in"
            >
              +
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={goToPreviousPage}
              disabled={currentPage <= 1}
              className={`p-1 rounded-full ${currentPage <= 1 ? 'text-gray-400 dark:text-gray-600' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              title="Previous page"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-sm">{currentPage} / {totalPages}</span>
            <button 
              onClick={goToNextPage}
              disabled={currentPage >= totalPages}
              className={`p-1 rounded-full ${currentPage >= totalPages ? 'text-gray-400 dark:text-gray-600' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              title="Next page"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          
          <a 
            href={pdfUrl} 
            download={fileName}
            className="flex items-center px-3 py-1 bg-theme-blue text-white text-sm rounded hover:bg-theme-blue/90"
          >
            <Download className="h-4 w-4 mr-1" />
            Download
          </a>
        </div>
      </div>
      
      {/* PDF Viewer */}
      <div className="flex-1 overflow-auto p-4 flex justify-center">
        <canvas ref={canvasRef} className="shadow-lg"></canvas>
      </div>
    </div>
  );
};

export default CustomPdfViewer; 