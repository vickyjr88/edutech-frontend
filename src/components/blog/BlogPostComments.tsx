import React, { useState, useEffect } from "react";
import { blogService, BlogComment } from "@/integrations/api/services/blog.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Reply, ThumbsUp, Flag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BlogPostCommentsProps {
  postId: string;
}

interface Comment {
  id: string;
  author: {
    name: string;
    email: string;
    avatar?: string;
  };
  content: string;
  createdAt: Date;
  likes: number;
  replies: Comment[];
}

const BlogPostComments: React.FC<BlogPostCommentsProps> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState({
    name: "",
    email: "",
    content: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const mapApiComment = (c: BlogComment): Comment => ({
    id: c._id || c.id || '',
    author: {
      name: c.author.name,
      email: c.author.email,
      avatar: c.author.avatar
    },
    content: c.content,
    createdAt: new Date(c.createdAt),
    likes: c.likes || 0,
    replies: (c.replies || []).map(mapApiComment)
  });

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await blogService.getComments(postId, 'approved'); // Default to approved for public
        if (response.data) {
          setComments(response.data.map(mapApiComment));
        }
      } catch (error) {
        console.error('Failed to fetch comments', error);
      }
    };
    if (postId) {
      fetchComments();
    }
  }, [postId]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.name || !newComment.email || !newComment.content) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await blogService.createComment({
        postId,
        author: {
          name: newComment.name,
          email: newComment.email
        },
        content: newComment.content
      });

      setNewComment({ name: "", email: "", content: "" });

      toast({
        title: "Comment posted!",
        description: "Your comment has been submitted for review.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error posting comment",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const handleLike = (commentId: string) => {
    setComments(prev =>
      prev.map(comment =>
        comment.id === commentId
          ? { ...comment, likes: comment.likes + 1 }
          : comment
      )
    );
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <MessageCircle className="w-5 h-5 mr-2" />
          Comments ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Comment Form */}
        <form onSubmit={handleSubmitComment} className="mb-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Leave a Comment</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Your name"
                value={newComment.name}
                onChange={(e) => setNewComment(prev => ({ ...prev, name: e.target.value }))}
                required
              />
              <Input
                type="email"
                placeholder="Your email"
                value={newComment.email}
                onChange={(e) => setNewComment(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            <Textarea
              placeholder="Share your thoughts..."
              value={newComment.content}
              onChange={(e) => setNewComment(prev => ({ ...prev, content: e.target.value }))}
              className="min-h-24"
              required
            />
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">
                Comments are moderated and will be published after review.
              </p>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Posting..." : "Post Comment"}
              </Button>
            </div>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-6">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No comments yet. Be the first to share your thoughts!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                <div className="flex space-x-4">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                    <AvatarFallback>
                      {getInitials(comment.author.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-gray-900">{comment.author.name}</h4>
                      <Badge variant="secondary" className="text-xs">
                        Verified
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>

                    <p className="text-gray-700 mb-3">{comment.content}</p>

                    <div className="flex items-center space-x-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(comment.id)}
                        className="text-gray-500 hover:text-blue-600"
                      >
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        {comment.likes}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-600">
                        <Reply className="w-4 h-4 mr-1" />
                        Reply
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-600">
                        <Flag className="w-4 h-4 mr-1" />
                        Report
                      </Button>
                    </div>

                    {/* Replies */}
                    {comment.replies.length > 0 && (
                      <div className="mt-4 ml-6 space-y-4">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={reply.author.avatar} alt={reply.author.name} />
                              <AvatarFallback className="text-xs">
                                {getInitials(reply.author.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h5 className="font-medium text-gray-900 text-sm">{reply.author.name}</h5>
                                <Badge variant="secondary" className="text-xs">
                                  Author
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  {formatDate(reply.createdAt)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700">{reply.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export { BlogPostComments };
