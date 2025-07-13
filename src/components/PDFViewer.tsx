import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X, Download } from 'lucide-react';
import { getAbsolutePdfPath } from '@/utils/pdfUtils';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  pdfPath?: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfPath }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { pdfUrl } = useParams();

  const decodedPdfUrl = pdfUrl ? decodeURIComponent(pdfUrl) : '';
  const actualPdfPath = pdfPath || decodedPdfUrl;

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
  }

  function changePage(offset: number) {
    setPageNumber(prevPageNumber => Math.min(Math.max(1, prevPageNumber + offset), numPages));
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-md py-4 px-6 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-theme-blue dark:text-white hover:text-theme-blue/80"
        >
          <ChevronLeft className="h-5 w-5 mr-2" />
          Back
        </button>
        <div className="flex items-center gap-4">
          <a
            href={actualPdfPath}
            download
            className="flex items-center px-4 py-2 bg-theme-blue text-white rounded-md hover:bg-theme-blue/90 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </a>
          <button
            onClick={() => navigate(-1)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-grow flex flex-col items-center py-8 px-4">
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-theme-blue"></div>
          </div>
        )}
        
        <Document
          file={actualPdfPath}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-theme-blue"></div>
            </div>
          }
          error={
            <div className="text-red-500 dark:text-red-400 text-center">
              <p>Error loading PDF. Please try again later.</p>
              <p className="text-sm mt-2">Path: {actualPdfPath}</p>
            </div>
          }
        >
          <Page
            pageNumber={pageNumber}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            className="shadow-lg"
          />
        </Document>

        {/* Navigation Controls */}
        {numPages > 0 && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 flex items-center gap-4">
            <button
              onClick={() => changePage(-1)}
              disabled={pageNumber <= 1}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <span className="text-sm">
              Page {pageNumber} of {numPages}
            </span>
            
            <button
              onClick={() => changePage(1)}
              disabled={pageNumber >= numPages}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFViewer; 