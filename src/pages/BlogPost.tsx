import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BlogPostHeader } from "@/components/blog/BlogPostHeader";
import { BlogPostContent } from "@/components/blog/BlogPostContent";
import { BlogPostSidebar } from "@/components/blog/BlogPostSidebar";
import { BlogPostComments } from "@/components/blog/BlogPostComments";
import { BlogPostNavigation } from "@/components/blog/BlogPostNavigation";
import { BlogPost, BlogAuthor } from "@/types/blog";

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const loadPost = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data - in a real app, this would fetch from API
        const mockPost: BlogPost = {
          id: "1",
          slug: slug || "",
          title: "Getting Started with Online Learning: A Parent's Guide",
          excerpt: "Discover how to set up the perfect learning environment for your child's online education journey.",
          content: `
            <h2>Introduction</h2>
            <p>Online learning has become an integral part of education, especially in Africa where access to quality education can be challenging. As a parent, you play a crucial role in ensuring your child's success in this digital learning environment.</p>
            
            <h2>Setting Up the Learning Space</h2>
            <p>Creating a dedicated learning space is essential for your child's focus and productivity. Here are some key considerations:</p>
            
            <ul>
              <li><strong>Quiet Environment:</strong> Choose a space away from distractions like TV, games, or noisy areas.</li>
              <li><strong>Good Lighting:</strong> Ensure adequate natural or artificial lighting to reduce eye strain.</li>
              <li><strong>Comfortable Seating:</strong> Invest in an ergonomic chair and desk setup.</li>
              <li><strong>Reliable Internet:</strong> A stable internet connection is crucial for uninterrupted learning.</li>
            </ul>
            
            <h2>Technology Requirements</h2>
            <p>Having the right technology setup can make a significant difference in your child's learning experience:</p>
            
            <h3>Essential Devices</h3>
            <ul>
              <li>Laptop or desktop computer with webcam and microphone</li>
              <li>Tablet for interactive learning activities</li>
              <li>Smartphone as a backup device</li>
            </ul>
            
            <h3>Software and Applications</h3>
            <ul>
              <li>Video conferencing software (Zoom, Google Meet)</li>
              <li>Learning management system access</li>
              <li>Productivity tools (Google Workspace, Microsoft Office)</li>
            </ul>
            
            <h2>Supporting Your Child's Learning</h2>
            <p>As a parent, your involvement is crucial for your child's success in online learning:</p>
            
            <h3>Daily Routines</h3>
            <p>Establish consistent daily routines that include:</p>
            <ul>
              <li>Regular wake-up and sleep times</li>
              <li>Dedicated study hours</li>
              <li>Break times for physical activity</li>
              <li>Family time and social interactions</li>
            </ul>
            
            <h3>Monitoring Progress</h3>
            <p>Stay engaged with your child's learning by:</p>
            <ul>
              <li>Regularly checking assignments and grades</li>
              <li>Communicating with teachers</li>
              <li>Celebrating achievements and milestones</li>
              <li>Addressing challenges promptly</li>
            </ul>
            
            <h2>Overcoming Common Challenges</h2>
            <p>Online learning comes with its own set of challenges. Here's how to address them:</p>
            
            <h3>Technical Issues</h3>
            <p>Prepare for technical difficulties by:</p>
            <ul>
              <li>Having backup internet options</li>
              <li>Learning basic troubleshooting</li>
              <li>Maintaining contact with technical support</li>
            </ul>
            
            <h3>Motivation and Engagement</h3>
            <p>Keep your child motivated by:</p>
            <ul>
              <li>Setting achievable goals</li>
              <li>Providing positive reinforcement</li>
              <li>Encouraging peer interactions</li>
              <li>Making learning fun and interactive</li>
            </ul>
            
            <h2>Conclusion</h2>
            <p>Online learning can be a rewarding experience for both you and your child when approached with the right mindset and preparation. By creating a supportive environment, staying engaged, and addressing challenges proactively, you can help your child thrive in their educational journey.</p>
            
            <p>Remember, every child is unique, and what works for one may not work for another. Be patient, stay flexible, and don't hesitate to seek help when needed.</p>
          `,
          author: {
            id: "1",
            name: "Dr. Sarah Johnson",
            bio: "Education Specialist with 15 years of experience in online learning and child development. Sarah has helped thousands of families transition to digital education successfully.",
            avatar: "/api/placeholder/100/100",
            socialLinks: {
              twitter: "@sarahjohnson",
              linkedin: "sarah-johnson-edu",
              website: "https://sarahjohnson.com"
            }
          },
          featuredImage: {
            src: "/api/placeholder/800/400",
            alt: "Online learning setup for children",
            width: 800,
            height: 400,
            caption: "A well-organized learning space for online education"
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
          tags: ["online learning", "parenting", "education", "digital learning", "child development"],
          status: "published",
          publishedAt: new Date("2024-01-15"),
          updatedAt: new Date("2024-01-15"),
          createdAt: new Date("2024-01-10"),
          readingTime: 8,
          viewCount: 1250,
          seoMetadata: {
            title: "Getting Started with Online Learning: A Parent's Guide - Kidato Blog",
            description: "Learn how to set up the perfect online learning environment for your child with our comprehensive parent's guide.",
            keywords: ["online learning", "parenting", "education", "digital learning"]
          }
        };
        
        setPost(mockPost);
        
        // Mock related posts
        const mockRelatedPosts: BlogPost[] = [
          {
            id: "2",
            slug: "benefits-of-personalized-education",
            title: "The Benefits of Personalized Education in Africa",
            excerpt: "Exploring how personalized learning approaches are transforming education across the continent.",
            content: "Full content...",
            author: {
              id: "2",
              name: "Prof. Michael Ochieng",
              bio: "Educational Technology Researcher",
              avatar: "/api/placeholder/40/40"
            },
            featuredImage: {
              src: "/api/placeholder/300/200",
              alt: "Personalized education",
              width: 300,
              height: 200
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
            readingTime: 6,
            viewCount: 2100,
            seoMetadata: {
              title: "Benefits of Personalized Education in Africa - Kidato Blog",
              description: "Discover how personalized learning is transforming education in Africa.",
              keywords: ["personalized learning", "africa", "education"]
            }
          }
        ];
        
        setRelatedPosts(mockRelatedPosts);
      } catch (error) {
        console.error('Error loading post:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadPost();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-gray-50 pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="h-64 bg-gray-200 rounded mb-8"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-gray-50 pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
              <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
              <Link to="/blog">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  Back to Blog
                </button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <BlogPostHeader post={post} />
              <BlogPostContent post={post} />
              <BlogPostComments postId={post.id} />
              <BlogPostNavigation post={post} />
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <BlogPostSidebar post={post} relatedPosts={relatedPosts} />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPostPage;
