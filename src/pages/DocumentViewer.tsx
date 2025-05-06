import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2, FileText, FileType, Image, AlertCircle, ExternalLink } from 'lucide-react';
import axios from 'axios';

const DocumentViewer = () => {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [documentData, setDocumentData] = useState<string | null>(null);
  const [contentType, setContentType] = useState<string | null>(null);
  
  const documentUrl = searchParams.get('url');
  const documentType = searchParams.get('type');
  
  useEffect(() => {
    // Validate the URL parameter
    if (!documentUrl) {
      setError('Missing document URL parameter');
      setIsLoading(false);
      return;
    }
    
    // Reset loading state when URL changes
    setIsLoading(true);
    setError(null);
    setDocumentData(null);
    
    // Fetch document content
    const fetchDocument = async () => {
      try {
        // Use axios to fetch the document with responseType blob
        const response = await axios.get(documentUrl, {
          responseType: 'blob',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0',
          }
        });
        
        // Get content type
        const type = response.headers['content-type'] || response.data.type;
        console.log('Document content type:', type);
        setContentType(type);
        
        // Create object URL from blob
        const objectUrl = URL.createObjectURL(response.data);
        console.log('Document loaded, created object URL');
        setDocumentData(objectUrl);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching document:', err);
        setError(`Failed to load document: ${err.message || 'The link may have expired or the document may not be available.'}`);
        setIsLoading(false);
      }
    };
    
    fetchDocument();
    
    // Cleanup object URL on unmount
    return () => {
      if (documentData) {
        URL.revokeObjectURL(documentData);
      }
    };
  }, [documentUrl]);
  
  const getDocumentTitle = () => {
    if (documentType === 'background_check') {
      return 'Background Check Document';
    } else if (documentType === 'government_id') {
      return 'Government ID Document';
    }
    return 'Verification Document';
  };
  
  const getDocumentIcon = () => {
    if (!contentType) return <FileText className="h-8 w-8 text-blue-500" />;
    
    if (contentType.includes('pdf')) {
      return <FileType className="h-8 w-8 text-red-500" />;
    } else if (contentType.includes('image')) {
      return <Image className="h-8 w-8 text-green-500" />;
    }
    
    return <FileText className="h-8 w-8 text-blue-500" />;
  };
  
  if (error) {
    // Try to get the direct URL from localStorage as fallback
    const directUrl = localStorage.getItem('lastDocumentUrl');
    
    return (
      <div className="h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-800 mb-2">Document Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          
          <div className="flex flex-col space-y-3">
            {directUrl && (
              <a 
                href={directUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors inline-flex items-center justify-center"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Document Directly
              </a>
            )}
            
            <button 
              onClick={() => window.close()} 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Close Viewer
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  const renderDocumentContent = () => {
    if (!documentData || !contentType) return null;
    
    if (contentType.includes('pdf')) {
      return (
        <object
          data={documentData}
          type="application/pdf"
          className="w-full h-full"
        >
          <div className="flex flex-col items-center justify-center h-full">
            <AlertCircle className="h-8 w-8 text-orange-500 mb-2" />
            <p className="text-gray-700 mb-4">Unable to display PDF directly in the browser.</p>
            <a 
              href={documentData} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open PDF in New Tab
            </a>
          </div>
        </object>
      );
    }
    
    if (contentType.includes('image')) {
      return (
        <div className="flex items-center justify-center h-full bg-gray-900 p-4">
          <img 
            src={documentData}
            alt="Document Viewer"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      );
    }
    
    // For other document types, provide a download link
    return (
      <div className="flex flex-col items-center justify-center h-full">
        {getDocumentIcon()}
        <p className="text-gray-700 my-4">This document type cannot be previewed directly.</p>
        <a 
          href={documentData} 
          download={`${getDocumentTitle()}.${contentType.split('/')[1] || 'file'}`}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
        >
          <FileText className="h-4 w-4 mr-2" />
          Download Document
        </a>
      </div>
    );
  };
  
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <div className="bg-white shadow-sm py-2 px-4 flex justify-between items-center">
        <div className="flex items-center">
          {getDocumentIcon()}
          <h1 className="text-lg font-medium ml-2">{getDocumentTitle()}</h1>
        </div>
        <button 
          onClick={() => window.close()} 
          className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors text-sm"
        >
          Close
        </button>
      </div>
      
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
              <p className="text-gray-700">Loading document...</p>
            </div>
          </div>
        )}
        
        {!isLoading && documentData && renderDocumentContent()}
      </div>
    </div>
  );
};

export default DocumentViewer;