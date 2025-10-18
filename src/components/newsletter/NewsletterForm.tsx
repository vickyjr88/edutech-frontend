import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '@/lib/axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const newsletterFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type NewsletterFormData = z.infer<typeof newsletterFormSchema>;

const NewsletterForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const form = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterFormSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: NewsletterFormData) => {
    setIsSubmitting(true);
    try {
      await api.post('/newsletter/subscribe', data);
      toast({
        title: 'Successfully subscribed!',
        description: 'You have been added to our newsletter.',
      });
      form.reset();
    } catch (error) {
      toast({
        title: 'Subscription failed',
        description: 'You may already be subscribed, or an error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-sm">
      <Input
        {...form.register('email')}
        type="email"
        placeholder="Enter your email"
        disabled={isSubmitting}
        className="w-full"
      />
      <Button type="submit" disabled={isSubmitting} className="w-full mt-4 mb-4">
        {isSubmitting ? 'Subscribing...' : 'Subscribe'}
      </Button>
        <p className="text-sm">We respect your privacy. Unsubscribe at any time.</p>
    </form>
  );
};

export default NewsletterForm;
