import React, { useState, useEffect } from 'react';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { blogApiService, BlogPost } from '@/services/blog-api.service';
import axios from 'axios';
import {
  Search,
  RefreshCw,
  Users,
  FileText,
  Eye,
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';

interface User {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  bio?: string;
  profileImage?: string;
  isActive: boolean;
}

interface BloggerInfo {
  user: User;
  postCount: number;
  publishedCount: number;
  draftCount: number;
  posts: BlogPost[];
}

const BloggersList = () => {
  const { toast } = useToast();
  const [bloggers, setBloggers] = useState<BloggerInfo[]>([]);
  const [filteredBloggers, setFilteredBloggers] = useState<BloggerInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBloggersData();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = bloggers.filter(
        (blogger) =>
          blogger.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blogger.user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBloggers(filtered);
    } else {
      setFilteredBloggers(bloggers);
    }
  }, [searchTerm, bloggers]);

  const getAuthToken = () => {
    return localStorage.getItem('kidato_access_token');
  };

  const fetchBloggersData = async () => {
    try {
      setLoading(true);

      // Fetch all users (admin only endpoint)
      const token = getAuthToken();
      const usersResponse = await axios.get(`${API_BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Filter to only ADMIN and TEACHER users who can be bloggers
      const potentialBloggers = usersResponse.data.filter(
        (user: User) => user.role === 'admin' || user.role === 'teacher'
      );

      // Fetch all blog posts
      const postsResponse = await blogApiService.listPosts({ limit: 100 });

      // Build blogger info by matching author names to users
      const bloggerMap = new Map<string, BloggerInfo>();

      potentialBloggers.forEach((user: User) => {
        bloggerMap.set(user.email, {
          user,
          postCount: 0,
          publishedCount: 0,
          draftCount: 0,
          posts: [],
        });
      });

      // Count posts per blogger
      postsResponse.posts.forEach((post: BlogPost) => {
        // Try to match by author name or email
        const bloggerInfo = Array.from(bloggerMap.values()).find(
          (info) =>
            info.user.fullName === post.author.name ||
            info.user.email === post.author.name
        );

        if (bloggerInfo) {
          bloggerInfo.postCount++;
          bloggerInfo.posts.push(post);
          if (post.status === 'published') {
            bloggerInfo.publishedCount++;
          } else if (post.status === 'draft') {
            bloggerInfo.draftCount++;
          }
        }
      });

      const bloggersList = Array.from(bloggerMap.values()).sort(
        (a, b) => b.postCount - a.postCount
      );

      setBloggers(bloggersList);
      setFilteredBloggers(bloggersList);
    } catch (error: any) {
      console.error('Error fetching bloggers:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to load bloggers',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getTotalBloggers = () => bloggers.length;

  const getTotalPosts = () => bloggers.reduce((sum, b) => sum + b.postCount, 0);

  const getActiveBloggers = () =>
    bloggers.filter((b) => b.postCount > 0).length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Blog Authors</h1>
          <p className="text-muted-foreground">
            Manage users who can write blog posts
          </p>
        </div>
        <Button onClick={fetchBloggersData} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Authors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalBloggers()}</div>
            <p className="text-xs text-muted-foreground">
              Admins and teachers who can blog
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Authors</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getActiveBloggers()}</div>
            <p className="text-xs text-muted-foreground">
              Authors with published posts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalPosts()}</div>
            <p className="text-xs text-muted-foreground">
              All posts from all authors
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Authors</CardTitle>
          <CardDescription>Filter authors by name or email</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search authors..."
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
          ) : filteredBloggers.length === 0 ? (
            <div className="text-center p-12">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'No authors match your search' : 'No authors found'}
              </p>
              {!searchTerm && (
                <p className="text-sm text-muted-foreground">
                  Only admin and teacher users can be blog authors
                </p>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Author</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Total Posts</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead>Drafts</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBloggers.map((blogger) => (
                  <TableRow key={blogger.user._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={blogger.user.profileImage}
                            alt={blogger.user.fullName}
                          />
                          <AvatarFallback>
                            {getInitials(blogger.user.fullName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{blogger.user.fullName}</div>
                          {blogger.user.bio && (
                            <div className="text-sm text-muted-foreground truncate max-w-xs">
                              {blogger.user.bio}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{blogger.user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {blogger.user.role.charAt(0).toUpperCase() +
                          blogger.user.role.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge>{blogger.postCount}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">{blogger.publishedCount}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{blogger.draftCount}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={blogger.user.isActive ? 'default' : 'destructive'}
                      >
                        {blogger.user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {blogger.postCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            // This would open a dialog showing their posts
                            toast({
                              title: 'Posts by ' + blogger.user.fullName,
                              description: `${blogger.postCount} posts found`,
                            });
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Posts
                        </Button>
                      )}
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
          <CardTitle>Author Information</CardTitle>
          <CardDescription>
            How blog authors work in Kidato
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-primary rounded-full mt-2" />
            <p className="text-sm text-muted-foreground">
              Only users with <strong>Admin</strong> or <strong>Teacher</strong>{' '}
              roles can create blog posts
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-primary rounded-full mt-2" />
            <p className="text-sm text-muted-foreground">
              Author information is stored directly on each blog post and includes
              name, bio, avatar, and social links
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-primary rounded-full mt-2" />
            <p className="text-sm text-muted-foreground">
              When creating a blog post, you can customize the author information
              for that specific post
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-primary rounded-full mt-2" />
            <p className="text-sm text-muted-foreground">
              This page shows all potential blog authors and their current posting
              activity
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BloggersList;
