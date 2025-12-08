import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BlogHero } from "@/components/blog/BlogHero";
import { BlogFilters } from "@/components/blog/BlogFilters";
import { BlogPostGrid } from "@/components/blog/BlogPostGrid";
import { BlogNewsletter } from "@/components/blog/BlogNewsletter";
import { BlogStats } from "@/components/blog/BlogStats";
import { BlogPost, BlogFilters as BlogFiltersType, BlogListResponse } from "@/types/blog";
import { blogApiService } from "@/services/blogApi";

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<BlogFiltersType>({
    status: 'published',
    sortBy: 'publishedAt',
    sortOrder: 'desc',
    page: 1,
    limit: 12
  });
  const [totalPages, setTotalPages] = useState(1);

  // Load blog posts from API
  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response: BlogListResponse = await blogApiService.getPosts(filters);
      setPosts(response.posts);
      setTotalPages(response.totalPages);
    } catch (err) {
      console.error('Failed to load blog posts:', err);
      setError(err instanceof Error ? err.message : 'Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [filters]);



  const handleFiltersChange = (newFilters: Partial<BlogFiltersType>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Load stats and categories
  const [stats, setStats] = useState<any>(null); // Use appropriate type
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const [statsData, categoriesData] = await Promise.all([
          blogApiService.getStats(),
          blogApiService.getCategories()
        ]);
        setStats(statsData);
        setCategories(categoriesData);
      } catch (err) {
        console.error('Failed to load blog metadata:', err);
      }
    };
    loadMetadata();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow bg-gray-50 pt-20">
        <BlogHero stats={stats} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <BlogFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                categories={categories}
                stats={stats}
              />
              <BlogPostGrid
                posts={posts}
                loading={loading}
                error={error}
                totalPages={totalPages}
                currentPage={filters.page || 1}
                onPageChange={(page) => handleFiltersChange({ page })}
              />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-8">
              <BlogStats stats={stats} />
              <BlogNewsletter />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
