import { NavigateFunction } from 'react-router-dom';

export const isLocalPath = (path: string): boolean => {
  // Check if the path is relative to the public folder
  return path.startsWith('/public/') || path.startsWith('public/');
};

export const formatLocalPath = (path: string): string => {
  // Remove '/public' from the path when needed
  const cleanPath = path.replace(/^\/public\/|^public\//, '');
  return cleanPath;
};

export const getPublicPdfPath = (pdfPath: string): string => {
  // Remove '/public' and leading slash if present
  const cleanPath = pdfPath.replace(/^\/public\/|^public\//, '');
  
  // In development, use the local server URL with correct protocol
  if (process.env.NODE_ENV === 'development') {
    // Encode the path to handle spaces and special characters
    const encodedPath = encodeURI(cleanPath);
    return `${window.location.protocol}//${window.location.host}/${encodedPath}`;
  }
  
  // In production (Vercel), use the deployed URL
  const encodedPath = encodeURI(cleanPath);
  return `${window.location.origin}/${encodedPath}`;
};

export const getAbsolutePdfPath = (pdfPath: string): string => {
  if (isLocalPath(pdfPath)) {
    return getPublicPdfPath(pdfPath);
  }
  
  return pdfPath;
};

export const openPdfViewer = (navigate: NavigateFunction, pdfUrl: string, title?: string) => {
  if (isLocalPath(pdfUrl)) {
    const fullUrl = getPublicPdfPath(pdfUrl);
    const newWindow = window.open(fullUrl, '_blank');
    
    // Set favicons in new window
    if (newWindow) {
      newWindow.onload = () => {
        const favicons = [
          { rel: 'icon', type: 'image/x-icon', href: '/my-favicon/favicon.ico' },
          { rel: 'apple-touch-icon', sizes: '180x180', href: '/my-favicon/apple-touch-icon.png' }
        ];

        // Remove any existing favicons
        const existingFavicons = newWindow.document.querySelectorAll("link[rel*='icon']");
        existingFavicons.forEach(favicon => favicon.remove());

        // Add new favicons
        favicons.forEach(({ rel, type, sizes, href }) => {
          const link = newWindow.document.createElement('link');
          link.rel = rel;
          if (type) link.type = type;
          if (sizes) link.sizes = sizes;
          link.href = href;
          newWindow.document.head.appendChild(link);
        });

        // Update title if provided
        if (title) {
          newWindow.document.title = title;
        }
      };
    }
  } else {
    window.open(pdfUrl, '_blank');
  }
};