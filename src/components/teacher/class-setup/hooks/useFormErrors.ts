import React, { useState, useEffect, useRef } from 'react';
import { FieldValues, UseFormReturn, FieldErrors } from 'react-hook-form';
import { FormError } from '../FormErrorNotification';

interface UseFormErrorsOptions {
  // Options for custom error mapping, timing, etc.
  debounceMs?: number;
  mapCustomErrors?: (errors: FieldErrors<any>) => FormError[];
  autoScrollToError?: boolean;
}

export function useFormErrors<TFieldValues extends FieldValues = FieldValues>(
  form: UseFormReturn<TFieldValues>,
  options: UseFormErrorsOptions = {}
) {
  const [errors, setErrors] = useState<FormError[]>([]);
  const [lastTriggeredFields, setLastTriggeredFields] = useState<string[]>([]);
  
  const {
    debounceMs = 500,
    mapCustomErrors,
    autoScrollToError = true
  } = options;

  // Generate a unique ID for an error
  const generateErrorId = (field?: string) => {
    return `${field || 'form'}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  };

  // Add a form error
  const addError = (error: Omit<FormError, 'id'>) => {
    const newError = {
      ...error,
      id: generateErrorId(error.field)
    };
    
    setErrors(prev => [...prev, newError]);
    
    // Auto-scroll to field if enabled
    if (autoScrollToError && error.field) {
      scrollToField(error.field);
    }
    
    return newError.id;
  };

  // Dismiss an error by ID
  const dismissError = (id: string) => {
    setErrors(prev => prev.filter(error => error.id !== id));
  };

  // Dismiss all errors
  const clearErrors = () => {
    setErrors([]);
  };

  // Scroll to a field
  const scrollToField = (field: string) => {
    try {
      const fieldElement = document.querySelector(`[name="${field}"]`);
      if (fieldElement) {
        fieldElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        
        // Add a brief highlight effect
        fieldElement.classList.add('highlight-field');
        setTimeout(() => {
          fieldElement.classList.remove('highlight-field');
        }, 2000);
      }
    } catch (error) {
      console.warn(`Could not scroll to field: ${field}`, error);
    }
  };

  // Run form validation for specific fields
  const validateFields = async (fields: string[]) => {
    setLastTriggeredFields(fields);
    await form.trigger(fields as any[]);
  };

  // Watch form errors and map them to our format
  useEffect(() => {
    const formState = form.formState;
    
    if (Object.keys(formState.errors).length > 0) {
      // Map React Hook Form errors to our format
      const mappedErrors: FormError[] = [];
      
      // Use custom mapping if provided
      if (mapCustomErrors) {
        const customErrors = mapCustomErrors(formState.errors);
        mappedErrors.push(...customErrors);
      } else {
        // Default mapping
        Object.entries(formState.errors).forEach(([field, error]) => {
          if (error && error.message) {
            mappedErrors.push({
              id: generateErrorId(field),
              field,
              message: error.message as string,
              type: 'error',
            });
          }
        });
      }
      
      // Update our errors
      setErrors(prev => {
        // Keep non-field errors
        const nonFieldErrors = prev.filter(e => !e.field);
        
        // Replace field errors with new ones
        return [
          ...nonFieldErrors,
          ...mappedErrors
        ];
      });
    } else {
      // If no errors, clear field-related errors but keep manual ones
      setErrors(prev => prev.filter(e => !e.field));
    }
  }, [form.formState.errors, mapCustomErrors]);

  // Create a ref at the top level of the component
  const fieldsRef = useRef(lastTriggeredFields);

  // Auto-validate fields as user types
  useEffect(() => {
    // Update ref when lastTriggeredFields changes
    fieldsRef.current = lastTriggeredFields;

    // Set up form subscription
    const subscription = form.watch(() => {
      // Using a timeout to avoid too frequent validations
      if (fieldsRef.current.length > 0) {
        const timer = setTimeout(() => {
          form.trigger(fieldsRef.current as any[]);
        }, debounceMs);

        return () => clearTimeout(timer);
      }
    });

    return () => subscription.unsubscribe();
  }, [form, debounceMs, lastTriggeredFields]);

  return {
    errors,
    addError,
    dismissError,
    clearErrors,
    scrollToField,
    validateFields,
  };
}

export default useFormErrors;