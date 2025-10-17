import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { blogApiService, BlogPost } from '@/services/blog-api.service';
import {
  Search,
  RefreshCw,
  Tag,
  TrendingUp,
  FileText,
} from 'lucide-react';

interface TagInfo {
  name: string;
  count: number;
  posts: BlogPost[];
}

const BlogTagsList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tags, setTags] = useState<TagInfo[]>([]);
  const [filteredTags, setFilteredTags] = useState<TagInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    fetchTagsWithPosts();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = tags.filter((tag) =>
        tag.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTags(filtered);
    } else {
      setFilteredTags(tags);
    }
  }, [searchTerm, tags]);

  const fetchTagsWithPosts = async () => {
    try {
      setLoading(true);
      const response = await blogApiService.listPosts({ limit: 100 });
      setPosts(response.posts);

      // Build tag info
      const tagMap = new Map<string, TagInfo>();

      response.posts.forEach((post) => {
        post.tags.forEach((tag) => {
          if (tagMap.has(tag)) {
            const tagInfo = tagMap.get(tag)!;
            tagInfo.count++;
            tagInfo.posts.push(post);
          } else {
            tagMap.set(tag, {
              name: tag,
              count: 1,
              posts: [post],
            });
          }
        });
      });

      const tagsList = Array.from(tagMap.values()).sort((a, b) => b.count - a.count);
      setTags(tagsList);
      setFilteredTags(tagsList);
    } catch (error) {
      console.error('Error fetching tags:', error);
      toast({
        title: 'Error',
        description: 'Failed to load tags',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getTotalUniqueTags = () => tags.length;

  const getTotalTagUsage = () => tags.reduce((sum, tag) => sum + tag.count, 0);

  const getMostPopularTag = () => {
    if (tags.length === 0) return null;
    return tags[0];
  };

  const viewPostsWithTag = (tagName: string) => {
    navigate(`/admin/blog/posts?tag=${encodeURIComponent(tagName)}`);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Blog Tags</h1>
          <p className="text-muted-foreground">
            View and manage blog post tags
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Tags</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalUniqueTags()}</div>
            <p className="text-xs text-muted-foreground">
              Total unique tags across all posts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalTagUsage()}</div>
            <p className="text-xs text-muted-foreground">
              Total tag assignments across posts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Popular</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getMostPopularTag()?.name || 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {getMostPopularTag()
                ? `Used in ${getMostPopularTag()?.count} posts`
                : 'No tags yet'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Tags</CardTitle>
          <CardDescription>Filter tags by name</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredTags.length === 0 ? (
            <div className="text-center p-12">
              <Tag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'No tags match your search' : 'No tags found'}
              </p>
              {!searchTerm && (
                <p className="text-sm text-muted-foreground">
                  Tags will appear here once you add them to blog posts
                </p>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tag Name</TableHead>
                  <TableHead>Usage Count</TableHead>
                  <TableHead>Sample Posts</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTags.map((tag) => (
                  <TableRow key={tag.name}>
                    <TableCell className="font-medium">
                      <Badge variant="outline">#{tag.name}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge>{tag.count} posts</Badge>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <div className="flex flex-col gap-1">
                        {tag.posts.slice(0, 3).map((post) => (
                          <span
                            key={post._id}
                            className="text-sm text-muted-foreground truncate"
                          >
                            • {post.title}
                          </span>
                        ))}
                        {tag.posts.length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{tag.posts.length - 3} more
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => viewPostsWithTag(tag.name)}
                      >
                        View Posts
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tag Cloud</CardTitle>
          <CardDescription>
            Visual representation of tag popularity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 50).map((tag) => {
              const maxCount = Math.max(...tags.map((t) => t.count));
              const minCount = Math.min(...tags.map((t) => t.count));
              const range = maxCount - minCount || 1;
              const normalized = (tag.count - minCount) / range;
              const fontSize = 0.75 + normalized * 1.25; // 0.75rem to 2rem

              return (
                <button
                  key={tag.name}
                  onClick={() => viewPostsWithTag(tag.name)}
                  className="px-3 py-1 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
                  style={{ fontSize: `${fontSize}rem` }}
                >
                  {tag.name}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogTagsList;
