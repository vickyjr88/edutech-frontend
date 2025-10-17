import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Eye, Share2, Bookmark, Heart } from "lucide-react";
import { BlogPost } from "@/types/blog";

interface BlogPostHeaderProps {
  post: BlogPost;
}

const BlogPostHeader: React.FC<BlogPostHeaderProps> = ({ post }) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <article className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
      {/* Featured Image */}
      {post.featuredImage && (
        <div className="aspect-video overflow-hidden">
          <img
            src={post.featuredImage.src}
            alt={post.featuredImage.alt}
            className="w-full h-full object-cover"
          />
          {post.featuredImage.caption && (
            <p className="text-sm text-gray-600 italic p-4 bg-gray-50">
              {post.featuredImage.caption}
            </p>
          )}
        </div>
      )}

      <div className="p-8">
        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.categories.map((category) => (
            <Link key={category.id} to={`/blog?category=${category.slug}`}>
              <Badge
                variant="secondary"
                className="hover:bg-blue-100 transition-colors"
                style={{ backgroundColor: category.color + '20', color: category.color }}
              >
                {category.name}
              </Badge>
            </Link>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
          {post.title}
        </h1>

        {/* Excerpt */}
        <p className="text-xl text-gray-600 mb-6 leading-relaxed">
          {post.excerpt}
        </p>

        {/* Author and Meta Info */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <Avatar className="w-12 h-12">
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback>
                {getInitials(post.author.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-gray-900">{post.author.name}</p>
              <p className="text-sm text-gray-600">{post.author.bio}</p>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{post.readingTime} min read</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{post.viewCount.toLocaleString()} views</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link key={tag} to={`/blog?tag=${tag}`}>
                  <span className="text-sm text-gray-500 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors cursor-pointer">
                    #{tag}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Bookmark className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm">
              <Heart className="w-4 h-4 mr-2" />
              Like
            </Button>
          </div>

          {/* Author Social Links */}
          {post.author.socialLinks && (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">Follow author:</span>
              {post.author.socialLinks.twitter && (
                <a
                  href={`https://twitter.com/${post.author.socialLinks.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-600 transition-colors"
                >
                  Twitter
                </a>
              )}
              {post.author.socialLinks.linkedin && (
                <a
                  href={`https://linkedin.com/in/${post.author.socialLinks.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-600 transition-colors"
                >
                  LinkedIn
                </a>
              )}
              {post.author.socialLinks.website && (
                <a
                  href={post.author.socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-600 transition-colors"
                >
                  Website
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export { BlogPostHeader };
