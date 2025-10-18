import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Home } from "lucide-react";
import { BlogPost } from "@/types/blog";

interface BlogPostNavigationProps {
  post: BlogPost;
}

const BlogPostNavigation: React.FC<BlogPostNavigationProps> = ({ post }) => {
  // In a real app, these would be fetched from the API
  const previousPost = null; // Would be fetched based on post order
  const nextPost = null; // Would be fetched based on post order

  return (
    <div className="space-y-6">
      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {previousPost ? (
            <Link to={`/blog/${previousPost.slug}`}>
              <Button variant="outline" className="flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous Article
              </Button>
            </Link>
          ) : (
            <Button variant="outline" disabled className="flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous Article
            </Button>
          )}
          
          {nextPost ? (
            <Link to={`/blog/${nextPost.slug}`}>
              <Button variant="outline" className="flex items-center">
                Next Article
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          ) : (
            <Button variant="outline" disabled className="flex items-center">
              Next Article
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
        
        <Link to="/blog">
          <Button variant="outline" className="flex items-center">
            <Home className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </Link>
      </div>

      {/* Share and Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Found this article helpful?
              </h3>
              <p className="text-gray-600">
                Share it with other parents and educators who might benefit from this information.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <Button 
                variant="outline" 
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: post.title,
                      text: post.excerpt,
                      url: window.location.href,
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                  }
                }}
              >
                Share Article
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  // In a real app, this would save to bookmarks
                  console.log('Bookmarking article');
                }}
              >
                Save for Later
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Related Articles CTA */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Explore More Articles
          </h3>
          <p className="text-gray-600 mb-4">
            Discover more insights, tips, and stories from our education experts.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/blog">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Browse All Articles
              </Button>
            </Link>
            <Link to="/blog?category=parenting">
              <Button variant="outline">
                Parenting Tips
              </Button>
            </Link>
            <Link to="/blog?category=education">
              <Button variant="outline">
                Education Insights
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { BlogPostNavigation };
