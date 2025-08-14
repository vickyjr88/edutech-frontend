import { describe, it, expect } from 'vitest';
import { buttonVariants } from '@/components/ui/button';
import { badgeVariants } from '@/components/ui/badge';

describe('UI Component Variants (class-variance-authority)', () => {
  describe('buttonVariants', () => {
    it('should generate default button classes', () => {
      const result = buttonVariants();
      expect(result).toContain('bg-primary');
      expect(result).toContain('text-primary-foreground');
      expect(result).toContain('h-10');
      expect(result).toContain('px-4');
    });

    it('should apply destructive variant', () => {
      const result = buttonVariants({ variant: 'destructive' });
      expect(result).toContain('bg-destructive');
      expect(result).toContain('text-destructive-foreground');
    });

    it('should apply outline variant', () => {
      const result = buttonVariants({ variant: 'outline' });
      expect(result).toContain('border');
      expect(result).toContain('bg-background');
    });

    it('should apply ghost variant', () => {
      const result = buttonVariants({ variant: 'ghost' });
      expect(result).toContain('hover:bg-accent');
      expect(result).not.toContain('bg-primary');
    });

    it('should apply link variant', () => {
      const result = buttonVariants({ variant: 'link' });
      expect(result).toContain('underline-offset-4');
      expect(result).toContain('hover:underline');
    });

    it('should apply small size', () => {
      const result = buttonVariants({ size: 'sm' });
      expect(result).toContain('h-9');
      expect(result).toContain('px-3');
    });

    it('should apply large size', () => {
      const result = buttonVariants({ size: 'lg' });
      expect(result).toContain('h-11');
      expect(result).toContain('px-8');
    });

    it('should apply icon size', () => {
      const result = buttonVariants({ size: 'icon' });
      expect(result).toContain('h-10');
      expect(result).toContain('w-10');
    });

    it('should combine variant and size', () => {
      const result = buttonVariants({ variant: 'outline', size: 'lg' });
      expect(result).toContain('border');
      expect(result).toContain('h-11');
      expect(result).toContain('px-8');
    });

    it('should include custom className', () => {
      const result = buttonVariants({ className: 'custom-class' });
      expect(result).toContain('custom-class');
    });

    it('should include base classes in all variants', () => {
      const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const;
      
      variants.forEach(variant => {
        const result = buttonVariants({ variant });
        expect(result).toContain('inline-flex');
        expect(result).toContain('items-center');
        expect(result).toContain('justify-center');
        expect(result).toContain('rounded-md');
        expect(result).toContain('transition-colors');
      });
    });
  });

  describe('badgeVariants', () => {
    it('should generate default badge classes', () => {
      const result = badgeVariants();
      expect(result).toContain('bg-primary');
      expect(result).toContain('text-primary-foreground');
      expect(result).toContain('inline-flex');
      expect(result).toContain('rounded-full');
    });

    it('should apply secondary variant', () => {
      const result = badgeVariants({ variant: 'secondary' });
      expect(result).toContain('bg-secondary');
      expect(result).toContain('text-secondary-foreground');
    });

    it('should apply destructive variant', () => {
      const result = badgeVariants({ variant: 'destructive' });
      expect(result).toContain('bg-destructive');
      expect(result).toContain('text-destructive-foreground');
    });

    it('should apply outline variant', () => {
      const result = badgeVariants({ variant: 'outline' });
      expect(result).toContain('text-foreground');
      expect(result).not.toContain('border-transparent');
    });

    it('should apply info variant', () => {
      const result = badgeVariants({ variant: 'info' });
      expect(result).toContain('bg-blue-100');
      expect(result).toContain('text-blue-800');
    });

    it('should apply warning variant', () => {
      const result = badgeVariants({ variant: 'warning' });
      expect(result).toContain('bg-yellow-100');
      expect(result).toContain('text-yellow-800');
    });

    it('should apply success variant', () => {
      const result = badgeVariants({ variant: 'success' });
      expect(result).toContain('bg-green-100');
      expect(result).toContain('text-green-800');
    });

    it('should include base classes in all variants', () => {
      const variants = ['default', 'secondary', 'destructive', 'outline', 'info', 'warning', 'success'] as const;
      
      variants.forEach(variant => {
        const result = badgeVariants({ variant });
        expect(result).toContain('inline-flex');
        expect(result).toContain('items-center');
        expect(result).toContain('rounded-full');
        expect(result).toContain('px-2.5');
        expect(result).toContain('py-0.5');
        expect(result).toContain('text-xs');
        expect(result).toContain('font-semibold');
      });
    });

    it('should handle custom className', () => {
      const result = badgeVariants({ className: 'my-custom-class' });
      expect(result).toContain('my-custom-class');
    });

    it('should handle hover states', () => {
      const variants = ['default', 'secondary', 'destructive'] as const;
      
      variants.forEach(variant => {
        const result = badgeVariants({ variant });
        expect(result).toContain('hover:');
      });
    });
  });

  describe('Variant Consistency', () => {
    it('should maintain consistent naming patterns', () => {
      // Both components should have destructive variant
      expect(buttonVariants({ variant: 'destructive' })).toContain('destructive');
      expect(badgeVariants({ variant: 'destructive' })).toContain('destructive');
    });

    it('should maintain consistent base classes', () => {
      const buttonBase = buttonVariants();
      const badgeBase = badgeVariants();
      
      // Both should have inline-flex
      expect(buttonBase).toContain('inline-flex');
      expect(badgeBase).toContain('inline-flex');
      
      // Both should have items-center
      expect(buttonBase).toContain('items-center');
      expect(badgeBase).toContain('items-center');
    });

    it('should handle undefined variants gracefully', () => {
      // Should fall back to defaults
      expect(() => buttonVariants({ variant: undefined })).not.toThrow();
      expect(() => badgeVariants({ variant: undefined })).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle null/undefined props', () => {
      expect(() => buttonVariants({})).not.toThrow();
      expect(() => badgeVariants({})).not.toThrow();
    });

    it('should handle conflicting classes in className', () => {
      const result = buttonVariants({ 
        variant: 'default', 
        className: 'bg-red-500' 
      });
      
      // Should contain both classes (tailwind-merge handles conflicts)
      expect(result).toContain('bg-');
    });

    it('should be composable with other utility functions', () => {
      const customButton = buttonVariants({ 
        variant: 'outline', 
        size: 'sm',
        className: 'font-bold'
      });
      
      expect(customButton).toContain('border');
      expect(customButton).toContain('h-9');
      expect(customButton).toContain('font-bold');
    });
  });
});
