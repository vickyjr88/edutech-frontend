import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export interface FormError {
  id: string;
  field?: string;
  message: string;
  type: 'error' | 'warning' | 'info';
}

interface FormErrorNotificationProps {
  errors: FormError[];
  onDismiss: (id: string) => void;
  onScrollToField?: (field: string) => void;
}

const FormErrorNotification: React.FC<FormErrorNotificationProps> = ({
  errors,
  onDismiss,
  onScrollToField
}) => {
  if (errors.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md w-full space-y-2">
      <AnimatePresence>
        {errors.map((error) => (
          <motion.div
            key={error.id}
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className="w-full"
          >
            <Alert
              variant={error.type === 'error' ? 'destructive' : error.type === 'warning' ? 'default' : 'default'}
              className={`
                relative shadow-lg border 
                ${error.type === 'error' 
                  ? 'bg-red-50 border-red-200 text-red-900' 
                  : error.type === 'warning'
                    ? 'bg-amber-50 border-amber-200 text-amber-900'
                    : 'bg-blue-50 border-blue-200 text-blue-900'
                }
              `}
            >
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDismiss(error.id)}
                className="absolute right-2 top-2 h-6 w-6 p-0 rounded-full"
              >
                <X className="h-3 w-3" />
              </Button>
              
              <AlertCircle 
                className={`
                  h-4 w-4 mr-2 
                  ${error.type === 'error' 
                    ? 'text-red-600' 
                    : error.type === 'warning'
                      ? 'text-amber-600'
                      : 'text-blue-600'
                  }
                `} 
              />
              
              <AlertTitle className="font-medium text-sm mb-1">
                {error.type === 'error' 
                  ? 'Error'
                  : error.type === 'warning'
                    ? 'Warning'
                    : 'Information'
                }
              </AlertTitle>
              
              <AlertDescription className="text-sm">
                {error.message}
                
                {error.field && onScrollToField && (
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => onScrollToField(error.field!)}
                    className={`
                      p-0 h-auto mt-1 font-normal
                      ${error.type === 'error'
                        ? 'text-red-600'
                        : error.type === 'warning'
                          ? 'text-amber-600' 
                          : 'text-blue-600'
                      }
                    `}
                  >
                    Go to field
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default FormErrorNotification;