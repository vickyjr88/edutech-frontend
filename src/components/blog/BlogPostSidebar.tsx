import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Eye, ArrowRight } from "lucide-react";
import { BlogPost } from "@/types/blog";

interface BlogPostSidebarProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

const BlogPostSidebar: React.FC<BlogPostSidebarProps> = ({ post, relatedPosts }) => {
  const formatDate = (dateLike: Date | string | number | null | undefined) => {
    const date = dateLike instanceof Date ? dateLike : new Date(dateLike as any);
    if (isNaN(date.getTime())) return '—';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Author Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">About the Author</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback className="text-lg">
                {getInitials(post.author.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                {post.author.name}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {post.author.bio}
              </p>
              {post.author.socialLinks && (
                <div className="flex space-x-3">
                  {post.author.socialLinks.twitter && (
                    <a
                      href={`https://twitter.com/${post.author.socialLinks.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-600 transition-colors text-sm"
                    >
                      Twitter
                    </a>
                  )}
                  {post.author.socialLinks.linkedin && (
                    <a
                      href={`https://linkedin.com/in/${post.author.socialLinks.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-600 transition-colors text-sm"
                    >
                      LinkedIn
                    </a>
                  )}
                  {post.author.socialLinks.website && (
                    <a
                      href={post.author.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-600 transition-colors text-sm"
                    >
                      Website
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Post Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Post Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Published</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {formatDate(post.publishedAt)}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Reading Time</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {post.readingTime} min
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Views</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {post.viewCount.toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {post.categories.map((category) => (
              <Link key={(category as any).id || category.slug || category.name} to={`/blog?category=${category.slug}`}>
                <div className="flex items-center justify-between p-2 rounded hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color || undefined }}
                    ></div>
                    <span className="text-sm text-gray-700">{category.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">{category.postCount}</span>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link key={tag} to={`/blog?tag=${tag}`}>
                <Badge variant="secondary" className="text-xs hover:bg-gray-200 transition-colors">
                  #{tag}
                </Badge>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Related Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {relatedPosts.map((relatedPost) => (
                <Link key={(relatedPost as any).id || (relatedPost as any)._id || relatedPost.slug} to={`/blog/${relatedPost.slug}`}>
                  <div className="group">
                    <div className="flex space-x-3">
                      {relatedPost.featuredImage && (
                        <div className="flex-shrink-0">
                          <img
                            src={relatedPost.featuredImage.src}
                            alt={relatedPost.featuredImage.alt}
                            className="w-16 h-16 object-cover rounded"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h4>
                        <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                          <span>{formatDate(relatedPost.publishedAt)}</span>
                          <span>•</span>
                          <span>{relatedPost.readingTime} min read</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Link to="/blog">
                <Button variant="outline" size="sm" className="w-full">
                  View All Articles
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Newsletter Signup */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Stay Updated
            </h3>
            <p className="text-sm text-blue-700 mb-4">
              Get the latest articles and insights delivered to your inbox.
            </p>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Subscribe to Newsletter
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { BlogPostSidebar };
