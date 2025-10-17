import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, BookOpen, MessageCircle } from "lucide-react";

const BlogStats = () => {
  const stats = [
    {
      icon: <BookOpen className="w-5 h-5" />,
      label: "Total Articles",
      value: "150+",
      color: "text-blue-600"
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: "Monthly Readers",
      value: "50K+",
      color: "text-green-600"
    },
    {
      icon: <MessageCircle className="w-5 h-5" />,
      label: "Comments",
      value: "2.5K+",
      color: "text-purple-600"
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: "Growth Rate",
      value: "25%",
      color: "text-orange-600"
    }
  ];

  const popularCategories = [
    { name: "Parenting", count: 45, color: "#3B82F6" },
    { name: "Education", count: 38, color: "#10B981" },
    { name: "Teachers", count: 32, color: "#F59E0B" },
    { name: "Technology", count: 28, color: "#8B5CF6" },
    { name: "Success Stories", count: 22, color: "#EF4444" }
  ];

  const recentTags = [
    "online learning",
    "parenting tips",
    "education technology",
    "teacher resources",
    "student success",
    "african education",
    "digital learning",
    "curriculum"
  ];

  return (
    <div className="space-y-6">
      {/* Blog Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Blog Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {stats.map((stat, index) => (
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
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{category.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {category.count}
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
                #{tag}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { BlogStats };
