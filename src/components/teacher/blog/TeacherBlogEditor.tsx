import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { blogApiService, BlogCategory } from '@/services/blog-api.service';
import { ArrowLeft, Save, RefreshCw, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const TeacherBlogEditor = () => {
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();
  const { toast } = useToast();
  const { user } = useAuth();
  const isEditMode = Boolean(postId && postId !== 'new');

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<BlogCategory[]>([]);

  // Basic form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>('draft');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string>('');
  const [featuredImageUrl, setFeaturedImageUrl] = useState('');
  const [readingTime, setReadingTime] = useState(5);

  useEffect(() => {
    fetchCategories();
    if (isEditMode) {
      fetchPost();
    }
  }, [postId]);

  useEffect(() => {
    if (title && !isEditMode) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setSlug(generatedSlug);
    }
  }, [title, isEditMode]);

  useEffect(() => {
    if (content) {
      const words = content.trim().split(/\s+/).length;
      const estimatedTime = Math.max(1, Math.ceil(words / 200));
      setReadingTime(estimatedTime);
    }
  }, [content]);

  const fetchCategories = async () => {
    try {
      const cats = await blogApiService.listCategories();
      setCategories(cats);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchPost = async () => {
    if (!postId) return;

    try {
      setLoading(true);
      const post = await blogApiService.getPostById(postId);

      setSlug(post.slug);
      setTitle(post.title);
      setExcerpt(post.excerpt);
      setContent(post.content);
      setStatus(post.status);
      setReadingTime(post.readingTime);
      setSelectedCategories(post.categories.map((c) => c.slug));
      setTags(post.tags.join(', '));
      setFeaturedImageUrl(post.featuredImage?.src || '');
    } catch (error) {
      console.error('Error fetching post:', error);
      toast({
        title: 'Error',
        description: 'Failed to load blog post',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title || !excerpt || !content) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in title, excerpt, and content',
        variant: 'destructive',
      });
      return;
    }

    if (selectedCategories.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please select at least one category',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSaving(true);

      const author = {
        name: user?.fullName || 'Teacher',
        bio: user?.bio || '',
        avatar: user?.profileImage || '',
      };

      const featuredImage = featuredImageUrl
        ? {
            src: featuredImageUrl,
            alt: title,
            width: 1200,
            height: 630,
          }
        : undefined;

      const seoMetadata = {
        title: title,
        description: excerpt,
        keywords: tags ? tags.split(',').map((k) => k.trim()) : [],
      };

      const data: any = {
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title,
        excerpt,
        content,
        author,
        featuredImage,
        categories: selectedCategories,
        tags: tags ? tags.split(',').map((t) => t.trim()) : [],
        status,
        readingTime,
        seoMetadata,
        isFeatured: false,
        allowComments: true,
        relatedPostIds: [],
      };

      if (isEditMode && postId) {
        await blogApiService.updatePost(postId, data);
        toast({
          title: 'Success',
          description: 'Blog post updated successfully',
        });
      } else {
        await blogApiService.createPost(data);
        toast({
          title: 'Success',
          description: 'Blog post created successfully',
        });
      }

      navigate('/teacher-dashboard/blog');
    } catch (error: any) {
      console.error('Error saving post:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to save blog post',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const toggleCategory = (categorySlug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categorySlug)
        ? prev.filter((s) => s !== categorySlug)
        : [...prev, categorySlug]
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/teacher-dashboard/blog')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {isEditMode ? 'Edit Post' : 'New Post'}
            </h1>
            <p className="text-muted-foreground">
              {isEditMode ? 'Update your blog post' : 'Create a new blog post'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {slug && (
            <Button
              variant="outline"
              onClick={() => window.open(`/blog/${slug}`, '_blank')}
            >
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
          )}
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Post
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Post Content</CardTitle>
          <CardDescription>Write your blog post content</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a compelling title"
              className="text-lg font-medium"
            />
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt *</Label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="A brief summary of your post (2-3 sentences)"
              rows={3}
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your blog post content here... Use markdown for formatting."
              rows={15}
              className="font-mono text-sm"
            />
            <p className="text-sm text-muted-foreground">
              Estimated reading time: {readingTime} min
            </p>
          </div>

          {/* Featured Image */}
          <div className="space-y-2">
            <Label htmlFor="featuredImage">Featured Image URL (Optional)</Label>
            <Input
              id="featuredImage"
              value={featuredImageUrl}
              onChange={(e) => setFeaturedImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
            {featuredImageUrl && (
              <img
                src={featuredImageUrl}
                alt="Preview"
                className="mt-2 max-h-48 rounded-md object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Post Settings</CardTitle>
          <CardDescription>Configure post status and categorization</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={(v: any) => setStatus(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft (Save for later)</SelectItem>
                <SelectItem value="published">Published (Visible to all)</SelectItem>
                <SelectItem value="archived">Archived (Hidden)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <Label>Categories *</Label>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => (
                <div key={category.slug} className="flex items-center space-x-2">
                  <Checkbox
                    id={category.slug}
                    checked={selectedCategories.includes(category.slug)}
                    onCheckedChange={() => toggleCategory(category.slug)}
                  />
                  <label
                    htmlFor={category.slug}
                    className="text-sm cursor-pointer flex-1"
                  >
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (Optional)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="education, teaching, mathematics (comma separated)"
            />
            <p className="text-sm text-muted-foreground">
              Separate tags with commas to help readers find your content
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => navigate('/teacher-dashboard/blog')}
        >
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {status === 'published' ? 'Publish Post' : 'Save Draft'}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default TeacherBlogEditor;
