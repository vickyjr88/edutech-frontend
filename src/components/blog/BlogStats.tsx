import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, BookOpen, MessageCircle } from "lucide-react";
import { BlogStats as BlogStatsType } from "@/types/blog";
import { blogApiService } from "@/services/blogApi";

const BlogStats: React.FC<{ stats?: BlogStatsType | null }> = ({ stats: initialStats }) => {
  const [stats, setStats] = useState<BlogStatsType | null>(initialStats || null);
  const [loading, setLoading] = useState(!initialStats);

  useEffect(() => {
    if (initialStats) {
      setStats(initialStats);
      setLoading(false);
      return;
    }

    const loadStats = async () => {
      try {
        const statsData = await blogApiService.getStats();
        setStats(statsData);
      } catch (error) {
        console.error('Failed to load blog stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [initialStats]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Blog Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-gray-200 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const statsData = [
    {
      icon: <BookOpen className="w-5 h-5" />,
      label: "Total Articles",
      value: stats ? `${stats.totalPosts}+` : "0",
      color: "text-blue-600"
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: "Total Views",
      value: stats ? `${Math.floor(stats.totalViews / 1000)}K+` : "0",
      color: "text-green-600"
    },
    {
      icon: <MessageCircle className="w-5 h-5" />,
      label: "Comments",
      value: stats ? `${Math.floor(stats.totalComments / 1000)}K+` : "0",
      color: "text-purple-600"
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: "Subscribers",
      value: stats ? `${Math.floor(stats.totalSubscribers / 1000)}K+` : "0",
      color: "text-orange-600"
    }
  ];

  const popularCategories = stats?.topCategories || [];
  const recentTags = stats?.topTags || [];

  return (
    <div className="space-y-6">
      {/* Blog Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Blog Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {statsData.map((stat, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`${stat.color}`}>
                  {stat.icon}
                </div>
                <span className="text-sm text-gray-600">{stat.label}</span>
              </div>
              <span className={`font-semibold ${stat.color}`}>
                {stat.value}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Popular Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Popular Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {popularCategories.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color || '#3B82F6' }}
                  ></div>
                  <span className="text-sm text-gray-600">{category.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {category.postCount}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Popular Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Popular Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {recentTags.map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full hover:bg-gray-200 cursor-pointer transition-colors"
              >
                #{tag.tag} ({tag.count})
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { BlogStats };
