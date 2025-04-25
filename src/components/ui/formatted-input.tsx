import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface FormattedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onValueChange?: (value: string) => void;
  formatter?: (value: string) => string;
}

const FormattedInput = React.forwardRef<HTMLInputElement, FormattedInputProps>(
  ({ className, onValueChange, formatter, onChange, ...props }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(event);
      }
      
      let newValue = event.target.value;
      
      // Apply formatter if provided
      if (formatter) {
        newValue = formatter(newValue);
        event.target.value = newValue;
      }
      
      if (onValueChange) {
        onValueChange(newValue);
      }
    };
    
    return (
      <Input
        className={cn(className)}
        onChange={handleChange}
        ref={ref}
        {...props}
      />
    );
  }
);

FormattedInput.displayName = "FormattedInput";

// Number formatter that ensures only valid numbers are entered
export const formatNumber = (value: string): string => {
  // Remove any non-digit or decimal point characters
  let formatted = value.replace(/[^\d.-]/g, '');
  
  // Ensure only one decimal point
  const parts = formatted.split('.');
  if (parts.length > 2) {
    formatted = parts[0] + '.' + parts.slice(1).join('');
  }
  
  // Handle negative sign
  if (formatted.startsWith('-')) {
    // If there are multiple negatives, keep only the first one
    formatted = '-' + formatted.substring(1).replace(/-/g, '');
  } else {
    // Remove any negative signs in the middle of the number
    formatted = formatted.replace(/-/g, '');
  }
  
  return formatted;
};

export { FormattedInput };
