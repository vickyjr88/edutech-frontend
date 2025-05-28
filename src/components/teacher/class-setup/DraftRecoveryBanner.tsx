import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Save, Clock } from 'lucide-react';
import { formatLastSavedDate } from './utils/storageUtils';

interface DraftRecoveryBannerProps {
  lastSaved: number;
  hasUnsavedChanges: boolean;
  draftExists: boolean;
  onSaveNow: () => void;
}

const DraftRecoveryBanner: React.FC<DraftRecoveryBannerProps> = ({
  lastSaved,
  hasUnsavedChanges,
  draftExists,
  onSaveNow
}) => {
  if (!draftExists && !hasUnsavedChanges) {
    return null;
  }
  
  // Format last saved time
  const lastSavedText = formatLastSavedDate(lastSaved);
  
  return (
    <Alert 
      variant={hasUnsavedChanges ? "destructive" : "default"}
      className="mb-6 bg-blue-50 border-blue-200 shadow-sm"
    >
      <div className="flex justify-between items-center w-full">
        <div className="flex flex-col">
          {draftExists && (
            <AlertTitle className="flex items-center">
              <Save className="h-4 w-4 mr-2" />
              Draft saved
            </AlertTitle>
          )}
          
          <AlertDescription className="flex items-center text-sm">
            <Clock className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
            {hasUnsavedChanges 
              ? "You have unsaved changes"
              : `Last saved: ${lastSavedText}`
            }
          </AlertDescription>
        </div>
        
        <div className="flex gap-2">
          {hasUnsavedChanges && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={onSaveNow}
              className="bg-white hover:bg-blue-50"
            >
              <Save className="h-3.5 w-3.5 mr-1" />
              Save now
            </Button>
          )}
        </div>
      </div>
    </Alert>
  );
};

export default DraftRecoveryBanner;