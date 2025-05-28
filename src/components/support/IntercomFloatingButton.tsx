import React from 'react';
import { useIntercom } from './IntercomProvider';
import { Button } from '@/components/ui/button';
import { MessageCircle, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IntercomFloatingButtonProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  variant?: 'help' | 'chat';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  hideWhenIntercomVisible?: boolean;
}

export const IntercomFloatingButton: React.FC<IntercomFloatingButtonProps> = ({
  position = 'bottom-right',
  variant = 'help',
  size = 'md',
  className,
  hideWhenIntercomVisible = true
}) => {
  const { show, isLoaded } = useIntercom();

  if (!isLoaded) {
    return null;
  }

  const handleClick = () => {
    show();
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-6 left-6';
      case 'top-right':
        return 'top-6 right-6';
      case 'top-left':
        return 'top-6 left-6';
      default:
        return 'bottom-6 right-6';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-10 w-10';
      case 'lg':
        return 'h-16 w-16';
      default:
        return 'h-12 w-12';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'h-4 w-4';
      case 'lg':
        return 'h-7 w-7';
      default:
        return 'h-5 w-5';
    }
  };

  const Icon = variant === 'chat' ? MessageCircle : HelpCircle;

  return (
    <Button
      onClick={handleClick}
      className={cn(
        'fixed rounded-full shadow-lg z-50 transition-all duration-200 hover:scale-110',
        'bg-kidato-purple hover:bg-kidato-purple/90 text-white',
        getPositionClasses(),
        getSizeClasses(),
        className
      )}
      size="icon"
    >
      <Icon className={getIconSize()} />
    </Button>
  );
};