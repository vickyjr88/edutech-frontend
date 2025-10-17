import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BlogPost } from "@/types/blog";

interface BlogPostContentProps {
  post: BlogPost;
}

const BlogPostContent: React.FC<BlogPostContentProps> = ({ post }) => {
  return (
    <Card className="mb-8">
      <CardContent className="p-8">
        <div 
          className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        {/* Table of Contents could be added here */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Last updated: {new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }).format(post.updatedAt)}
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>Reading time: {post.readingTime} minutes</span>
              <span>•</span>
              <span>{post.viewCount.toLocaleString()} views</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { BlogPostContent };
