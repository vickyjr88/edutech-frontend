import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BlogHero } from "@/components/blog/BlogHero";
import { BlogFilters } from "@/components/blog/BlogFilters";
import { BlogPostGrid } from "@/components/blog/BlogPostGrid";
import { BlogNewsletter } from "@/components/blog/BlogNewsletter";
import { BlogStats } from "@/components/blog/BlogStats";
import { BlogPost, BlogFilters as BlogFiltersType } from "@/types/blog";

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<BlogFiltersType>({
    status: 'published',
    sortBy: 'publishedAt',
    sortOrder: 'desc',
    page: 1,
    limit: 12
  });
  const [totalPages, setTotalPages] = useState(1);

  // Mock data for demonstration
  const mockPosts: BlogPost[] = [
    {
      id: "1",
      slug: "getting-started-with-online-learning",
      title: "Getting Started with Online Learning: A Parent's Guide",
      excerpt: "Discover how to set up the perfect learning environment for your child's online education journey.",
      content: "Full blog post content...",
      author: {
        id: "1",
        name: "Dr. Sarah Johnson",
        bio: "Education Specialist with 15 years of experience",
        avatar: "/api/placeholder/40/40",
        socialLinks: {
          twitter: "@sarahjohnson",
          linkedin: "sarah-johnson-edu"
        }
      },
      featuredImage: {
        src: "/api/placeholder/600/400",
        alt: "Online learning setup",
        width: 600,
        height: 400
      },
      categories: [
        {
          id: "1",
          name: "Parenting",
          slug: "parenting",
          description: "Tips and advice for parents",
          color: "#3B82F6",
          postCount: 15
        }
      ],
      tags: ["online learning", "parenting", "education"],
      status: "published",
      publishedAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-15"),
      createdAt: new Date("2024-01-10"),
      readingTime: 5,
      viewCount: 1250,
      seoMetadata: {
        title: "Getting Started with Online Learning - Kidato Blog",
        description: "Learn how to set up the perfect online learning environment for your child.",
        keywords: ["online learning", "parenting", "education"]
      }
    },
    {
      id: "2",
      slug: "benefits-of-personalized-education",
      title: "The Benefits of Personalized Education in Africa",
      excerpt: "Exploring how personalized learning approaches are transforming education across the continent.",
      content: "Full blog post content...",
      author: {
        id: "2",
        name: "Prof. Michael Ochieng",
        bio: "Educational Technology Researcher",
        avatar: "/api/placeholder/40/40",
        socialLinks: {
          linkedin: "michael-ochieng"
        }
      },
      featuredImage: {
        src: "/api/placeholder/600/400",
        alt: "Personalized education",
        width: 600,
        height: 400
      },
      categories: [
        {
          id: "2",
          name: "Education",
          slug: "education",
          description: "Educational insights and research",
          color: "#10B981",
          postCount: 23
        }
      ],
      tags: ["personalized learning", "africa", "education technology"],
      status: "published",
      publishedAt: new Date("2024-01-12"),
      updatedAt: new Date("2024-01-12"),
      createdAt: new Date("2024-01-08"),
      readingTime: 8,
      viewCount: 2100,
      seoMetadata: {
        title: "Benefits of Personalized Education in Africa - Kidato Blog",
        description: "Discover how personalized learning is transforming education in Africa.",
        keywords: ["personalized learning", "africa", "education"]
      }
    },
    {
      id: "3",
      slug: "teacher-success-stories",
      title: "Teacher Success Stories: Making a Difference Online",
      excerpt: "Inspiring stories from teachers who are making a real impact through online education.",
      content: "Full blog post content...",
      author: {
        id: "3",
        name: "Grace Mwangi",
        bio: "Teacher Success Coordinator",
        avatar: "/api/placeholder/40/40"
      },
      featuredImage: {
        src: "/api/placeholder/600/400",
        alt: "Teacher success stories",
        width: 600,
        height: 400
      },
      categories: [
        {
          id: "3",
          name: "Teachers",
          slug: "teachers",
          description: "Resources and stories for teachers",
          color: "#F59E0B",
          postCount: 18
        }
      ],
      tags: ["teachers", "success stories", "online teaching"],
      status: "published",
      publishedAt: new Date("2024-01-10"),
      updatedAt: new Date("2024-01-10"),
      createdAt: new Date("2024-01-05"),
      readingTime: 6,
      viewCount: 1800,
      seoMetadata: {
        title: "Teacher Success Stories - Kidato Blog",
        description: "Read inspiring stories from teachers making a difference online.",
        keywords: ["teachers", "success stories", "online teaching"]
      }
    }
  ];

  useEffect(() => {
    // Simulate API call
    const loadPosts = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPosts(mockPosts);
        setTotalPages(1);
      } catch (error) {
        console.error('Error loading posts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [filters]);

  const handleFiltersChange = (newFilters: Partial<BlogFiltersType>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 pt-20">
        <BlogHero />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <BlogFilters 
                filters={filters} 
                onFiltersChange={handleFiltersChange}
              />
              <BlogPostGrid 
                posts={posts} 
                loading={loading}
                totalPages={totalPages}
                currentPage={filters.page || 1}
                onPageChange={(page) => handleFiltersChange({ page })}
              />
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-8">
              <BlogStats />
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
