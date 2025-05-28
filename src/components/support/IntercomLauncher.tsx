import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, HelpCircle, Phone } from 'lucide-react';
import { useIntercom } from './IntercomProvider';
import { cn } from '@/lib/utils';

interface IntercomLauncherProps {
  variant?: 'default' | 'minimal' | 'fab';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
  showIcon?: boolean;
  text?: string;
}

export const IntercomLauncher: React.FC<IntercomLauncherProps> = ({
  variant = 'default',
  size = 'md',
  className,
  children,
  showIcon = true,
  text = 'Help & Support'
}) => {
  const { show, isLoaded } = useIntercom();

  const handleClick = () => {
    if (isLoaded) {
      show();
    }
  };

  if (!isLoaded) {
    return null;
  }

  const getButtonSize = () => {
    switch (size) {
      case 'sm': return 'sm';
      case 'lg': return 'lg';
      default: return 'default';
    }
  };

  const getButtonVariant = () => {
    switch (variant) {
      case 'minimal': return 'ghost';
      case 'fab': return 'default';
      default: return 'outline';
    }
  };

  if (variant === 'fab') {
    return (
      <Button
        onClick={handleClick}
        size={getButtonSize()}
        variant={getButtonVariant()}
        className={cn(
          "fixed bottom-6 right-6 rounded-full shadow-lg z-50",
          size === 'lg' && "h-14 w-14",
          size === 'md' && "h-12 w-12",
          size === 'sm' && "h-10 w-10",
          className
        )}
      >
        {children || <MessageCircle className="h-5 w-5" />}
      </Button>
    );
  }

  return (
    <Button
      onClick={handleClick}
      size={getButtonSize()}
      variant={getButtonVariant()}
      className={cn("gap-2", className)}
    >
      {showIcon && (children || <HelpCircle className="h-4 w-4" />)}
      {variant !== 'minimal' && text}
    </Button>
  );
};

export const IntercomMessageButton: React.FC<IntercomLauncherProps> = (props) => {
  const { showMessages, isLoaded } = useIntercom();

  const handleClick = () => {
    if (isLoaded) {
      showMessages();
    }
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <Button
      onClick={handleClick}
      size={props.size || 'md'}
      variant={props.variant === 'fab' ? 'default' : 'outline'}
      className={cn("gap-2", props.className)}
    >
      {props.showIcon !== false && <MessageCircle className="h-4 w-4" />}
      {props.text || 'Messages'}
    </Button>
  );
};

export const IntercomContactButton: React.FC<IntercomLauncherProps> = (props) => {
  const { showNewMessage, isLoaded } = useIntercom();

  const handleClick = () => {
    if (isLoaded) {
      showNewMessage();
    }
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <Button
      onClick={handleClick}
      size={props.size || 'md'}
      variant={props.variant === 'fab' ? 'default' : 'outline'}
      className={cn("gap-2", props.className)}
    >
      {props.showIcon !== false && <Phone className="h-4 w-4" />}
      {props.text || 'Contact Support'}
    </Button>
  );
};