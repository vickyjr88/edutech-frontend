
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResourcesManager } from "@/components/teacher/content/ResourcesManager";
import { ArticlesManager } from "@/components/teacher/content/ArticlesManager";
import { VideosManager } from "@/components/teacher/content/VideosManager";
import { SuccessStoriesManager } from "@/components/teacher/content/SuccessStoriesManager";

export const ContentManager = () => {
    const [activeTab, setActiveTab] = useState("resources");
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const subtab = searchParams.get('subtab');
        if (subtab && ['resources', 'articles', 'videos', 'stories'].includes(subtab)) {
            setActiveTab(subtab);
        }
    }, [searchParams]);

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            newParams.set('subtab', value);
            return newParams;
        });
    };

    return (
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <div className="bg-white rounded-lg p-1 border shadow-sm inline-flex mb-6">
                <TabsList className="bg-transparent p-0">
                    <TabsTrigger value="resources" className="px-4 py-2">Resources</TabsTrigger>
                    <TabsTrigger value="articles" className="px-4 py-2">Articles</TabsTrigger>
                    <TabsTrigger value="videos" className="px-4 py-2">Videos</TabsTrigger>
                    <TabsTrigger value="stories" className="px-4 py-2">Success Stories</TabsTrigger>
                </TabsList>
            </div>

            <TabsContent value="resources">
                <div className="max-w-4xl">
                    <ResourcesManager />
                </div>
            </TabsContent>

            <TabsContent value="articles">
                <div className="max-w-4xl">
                    <ArticlesManager />
                </div>
            </TabsContent>

            <TabsContent value="videos">
                <div className="max-w-4xl">
                    <VideosManager />
                </div>
            </TabsContent>

            <TabsContent value="stories">
                <div className="max-w-4xl">
                    <SuccessStoriesManager />
                </div>
            </TabsContent>
        </Tabs>
    );
};
