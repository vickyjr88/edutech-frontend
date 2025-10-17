import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import {
  blogApiService,
  CreateBlogPostDto,
  UpdateBlogPostDto,
  BlogCategory,
  BlogAuthor,
  BlogImage,
  BlogSEOMetadata,
} from '@/services/blog-api.service';
import { ArrowLeft, Save, RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const BlogPostEditor = () => {
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();
  const { toast } = useToast();
  const isEditMode = Boolean(postId && postId !== 'new');

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);

  // Form state
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>('draft');
  const [isFeatured, setIsFeatured] = useState(false);
  const [allowComments, setAllowComments] = useState(true);
  const [publishedAt, setPublishedAt] = useState('');
  const [readingTime, setReadingTime] = useState(5);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string>('');
  const [relatedPostIds, setRelatedPostIds] = useState<string>('');

  // Author state
  const [authorName, setAuthorName] = useState('');
  const [authorBio, setAuthorBio] = useState('');
  const [authorAvatar, setAuthorAvatar] = useState('');
  const [authorTwitter, setAuthorTwitter] = useState('');
  const [authorLinkedIn, setAuthorLinkedIn] = useState('');
  const [authorWebsite, setAuthorWebsite] = useState('');

  // Featured image state
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [imageWidth, setImageWidth] = useState(1200);
  const [imageHeight, setImageHeight] = useState(630);
  const [imageCaption, setImageCaption] = useState('');

  // SEO state
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');
  const [seoOgImage, setSeoOgImage] = useState('');
  const [seoCanonicalUrl, setSeoCanonicalUrl] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchAllTags();
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

  const fetchAllTags = async () => {
    try {
      const tags = await blogApiService.getAllTags();
      setAllTags(tags);
    } catch (error) {
      console.error('Error fetching tags:', error);
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
      setIsFeatured(post.isFeatured);
      setAllowComments(post.allowComments);
      setPublishedAt(
        post.publishedAt
          ? new Date(post.publishedAt).toISOString().split('T')[0]
          : ''
      );
      setReadingTime(post.readingTime);
      setSelectedCategories(post.categories.map((c) => c.slug));
      setTags(post.tags.join(', '));
      setRelatedPostIds(post.relatedPostIds.join(', '));

      // Author
      setAuthorName(post.author.name);
      setAuthorBio(post.author.bio || '');
      setAuthorAvatar(post.author.avatar || '');
      setAuthorTwitter(post.author.socialLinks?.twitter || '');
      setAuthorLinkedIn(post.author.socialLinks?.linkedin || '');
      setAuthorWebsite(post.author.socialLinks?.website || '');

      // Featured image
      if (post.featuredImage) {
        setImageUrl(post.featuredImage.src);
        setImageAlt(post.featuredImage.alt);
        setImageWidth(post.featuredImage.width);
        setImageHeight(post.featuredImage.height);
        setImageCaption(post.featuredImage.caption || '');
      }

      // SEO
      setSeoTitle(post.seoMetadata.title);
      setSeoDescription(post.seoMetadata.description);
      setSeoKeywords(post.seoMetadata.keywords.join(', '));
      setSeoOgImage(post.seoMetadata.ogImage || '');
      setSeoCanonicalUrl(post.seoMetadata.canonicalUrl || '');
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
    if (!title || !slug || !excerpt || !content || !authorName) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
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

      const author: BlogAuthor = {
        name: authorName,
        bio: authorBio || undefined,
        avatar: authorAvatar || undefined,
        socialLinks: {
          twitter: authorTwitter || undefined,
          linkedin: authorLinkedIn || undefined,
          website: authorWebsite || undefined,
        },
      };

      const featuredImage: BlogImage | undefined = imageUrl
        ? {
            src: imageUrl,
            alt: imageAlt,
            width: imageWidth,
            height: imageHeight,
            caption: imageCaption || undefined,
          }
        : undefined;

      const seoMetadata: BlogSEOMetadata = {
        title: seoTitle || title,
        description: seoDescription || excerpt,
        keywords: seoKeywords
          ? seoKeywords.split(',').map((k) => k.trim())
          : [],
        ogImage: seoOgImage || undefined,
        canonicalUrl: seoCanonicalUrl || undefined,
      };

      const selectedCats = categories.filter((c) =>
        selectedCategories.includes(c.slug)
      );

      const data: CreateBlogPostDto | UpdateBlogPostDto = {
        slug,
        title,
        excerpt,
        content,
        author,
        featuredImage,
        categories: selectedCats.map(cat => cat.slug),
        tags: tags
          ? tags.split(',').map((t) => t.trim())
          : [],
        status,
        publishedAt: publishedAt ? new Date(publishedAt) : undefined,
        readingTime,
        seoMetadata,
        isFeatured,
        allowComments,
        relatedPostIds: relatedPostIds
          ? relatedPostIds.split(',').map((id) => id.trim())
          : [],
      };

      if (isEditMode && postId) {
        await blogApiService.updatePost(postId, data);
        toast({
          title: 'Success',
          description: 'Blog post updated successfully',
        });
      } else {
        await blogApiService.createPost(data as CreateBlogPostDto);
        toast({
          title: 'Success',
          description: 'Blog post created successfully',
        });
      }

      navigate('/admin/blog/posts');
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
    <div className="container mx-auto p-6 space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/admin/blog/posts')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {isEditMode ? 'Edit Post' : 'New Post'}
            </h1>
            <p className="text-muted-foreground">
              {isEditMode
                ? 'Update your blog post'
                : 'Create a new blog post'}
            </p>
          </div>
        </div>
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

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="author">Author</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Post Content</CardTitle>
              <CardDescription>
                Write your blog post content here
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter post title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="post-slug"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt *</Label>
                <Textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brief description of your post"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your blog post content here..."
                  rows={15}
                  className="font-mono"
                />
                <p className="text-sm text-muted-foreground">
                  Estimated reading time: {readingTime} min
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Post Settings</CardTitle>
              <CardDescription>
                Configure post status and categorization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={(v: any) => setStatus(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="publishedAt">Published Date</Label>
                <Input
                  id="publishedAt"
                  type="date"
                  value={publishedAt}
                  onChange={(e) => setPublishedAt(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Categories *</Label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <div
                      key={category.slug}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={category.slug}
                        checked={selectedCategories.includes(category.slug)}
                        onCheckedChange={() => toggleCategory(category.slug)}
                      />
                      <label
                        htmlFor={category.slug}
                        className="text-sm cursor-pointer"
                      >
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="tag1, tag2, tag3"
                />
                <p className="text-sm text-muted-foreground">
                  Separate tags with commas
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="relatedPostIds">Related Post IDs</Label>
                <Input
                  id="relatedPostIds"
                  value={relatedPostIds}
                  onChange={(e) => setRelatedPostIds(e.target.value)}
                  placeholder="id1, id2, id3"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isFeatured"
                  checked={isFeatured}
                  onCheckedChange={(checked) => setIsFeatured(checked as boolean)}
                />
                <label htmlFor="isFeatured" className="text-sm cursor-pointer">
                  Featured Post
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allowComments"
                  checked={allowComments}
                  onCheckedChange={(checked) =>
                    setAllowComments(checked as boolean)
                  }
                />
                <label htmlFor="allowComments" className="text-sm cursor-pointer">
                  Allow Comments
                </label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="author" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Author Information</CardTitle>
              <CardDescription>
                Information about the post author
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="authorName">Name *</Label>
                <Input
                  id="authorName"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Author name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="authorBio">Bio</Label>
                <Textarea
                  id="authorBio"
                  value={authorBio}
                  onChange={(e) => setAuthorBio(e.target.value)}
                  placeholder="Brief bio"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="authorAvatar">Avatar URL</Label>
                <Input
                  id="authorAvatar"
                  value={authorAvatar}
                  onChange={(e) => setAuthorAvatar(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="authorTwitter">Twitter</Label>
                <Input
                  id="authorTwitter"
                  value={authorTwitter}
                  onChange={(e) => setAuthorTwitter(e.target.value)}
                  placeholder="https://twitter.com/username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="authorLinkedIn">LinkedIn</Label>
                <Input
                  id="authorLinkedIn"
                  value={authorLinkedIn}
                  onChange={(e) => setAuthorLinkedIn(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="authorWebsite">Website</Label>
                <Input
                  id="authorWebsite"
                  value={authorWebsite}
                  onChange={(e) => setAuthorWebsite(e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
              <CardDescription>
                Add a featured image for your post
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageAlt">Alt Text</Label>
                <Input
                  id="imageAlt"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="Description of the image"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="imageWidth">Width</Label>
                  <Input
                    id="imageWidth"
                    type="number"
                    value={imageWidth}
                    onChange={(e) => setImageWidth(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageHeight">Height</Label>
                  <Input
                    id="imageHeight"
                    type="number"
                    value={imageHeight}
                    onChange={(e) => setImageHeight(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageCaption">Caption</Label>
                <Input
                  id="imageCaption"
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  placeholder="Image caption"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>
                Optimize your post for search engines
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seoTitle">SEO Title</Label>
                <Input
                  id="seoTitle"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="SEO-optimized title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seoDescription">SEO Description</Label>
                <Textarea
                  id="seoDescription"
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="SEO description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seoKeywords">Keywords</Label>
                <Input
                  id="seoKeywords"
                  value={seoKeywords}
                  onChange={(e) => setSeoKeywords(e.target.value)}
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seoOgImage">Open Graph Image</Label>
                <Input
                  id="seoOgImage"
                  value={seoOgImage}
                  onChange={(e) => setSeoOgImage(e.target.value)}
                  placeholder="https://example.com/og-image.jpg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seoCanonicalUrl">Canonical URL</Label>
                <Input
                  id="seoCanonicalUrl"
                  value={seoCanonicalUrl}
                  onChange={(e) => setSeoCanonicalUrl(e.target.value)}
                  placeholder="https://example.com/blog/post-slug"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BlogPostEditor;
