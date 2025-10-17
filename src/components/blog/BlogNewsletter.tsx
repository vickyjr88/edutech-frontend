import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BlogNewsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSubscribed(true);
      toast({
        title: "Successfully subscribed!",
        description: "You'll receive our latest articles and updates.",
      });
      
      setEmail("");
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-900 mb-2">
            You're subscribed!
          </h3>
          <p className="text-green-700 text-sm">
            Thank you for subscribing to our newsletter. You'll receive our latest articles and updates.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Mail className="w-5 h-5 mr-2" />
          Newsletter
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Get the latest articles, tips, and insights delivered to your inbox.
          </p>
          
          <form onSubmit={handleSubscribe} className="space-y-3">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
          
          <p className="text-xs text-gray-500">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export { BlogNewsletter };
