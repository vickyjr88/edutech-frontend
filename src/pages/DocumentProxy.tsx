import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Loader2, FileText, FileType, Image, AlertCircle, ExternalLink } from 'lucide-react';

const DocumentProxy = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const documentType = searchParams.get('type');
  const documentId = searchParams.get('id');
  const teacherId = searchParams.get('teacherId');
  
  useEffect(() => {
    // Validate parameters
    if (!documentType || !teacherId) {
      setError('Missing required parameters');
      setIsLoading(false);
      return;
    }
    
    // Redirect to the API endpoint that serves documents
    const apiUrl = `/api/teachers/${teacherId}/documents/${documentType}/view`;
    
    // Open in a new window/tab to allow for proper display
    window.location.href = apiUrl;
    
    // Set loading to false after redirect
    setIsLoading(false);
  }, [documentType, documentId, teacherId, navigate]);
  
  const getDocumentTitle = () => {
    if (documentType === 'background_check') {
      return 'Background Check Document';
    } else if (documentType === 'government_id') {
      return 'Government ID Document';
    }
    return 'Verification Document';
  };
  
  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-800 mb-2">Document Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.close()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Close Viewer
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      {isLoading && (
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto mb-4" />
          <h1 className="text-xl font-medium text-gray-800 mb-2">{getDocumentTitle()}</h1>
          <p className="text-gray-600">Loading document, please wait...</p>
        </div>
      )}
    </div>
  );
};

export default DocumentProxy;