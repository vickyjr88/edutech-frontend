import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Upload, Download, Trash2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import MvpTeacherService from '@/integrations/api/services/mvp-teacher.service';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function TeacherResourcesPage() {
    const { user } = useAuth();
    const [resources, setResources] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadResources();
    }, []);

    const loadResources = async () => {
        try {
            setIsLoading(true);
            const data = await MvpTeacherService.getResources();
            setResources(data || []);
        } catch (error) {
            console.error('Error loading resources:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 space-y-6 md:ml-64 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Resources</h1>
                    <p className="text-gray-600 mt-1">Manage your teaching materials</p>
                </div>
                <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Resource
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>My Resources</CardTitle>
                    <CardDescription>
                        Documents, videos, and files for your classes
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-2 mb-4">
                        <Search className="text-gray-400" />
                        <Input placeholder="Search resources..." className="max-w-sm" />
                    </div>

                    {isLoading ? (
                        <div className="text-center py-8">Loading resources...</div>
                    ) : resources.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed rounded-lg">
                            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                            <h3 className="text-lg font-medium text-gray-900">No resources yet</h3>
                            <p className="text-gray-500 mt-1 mb-4">Upload your first resource to get started</p>
                            <Button variant="outline">
                                <Upload className="h-4 w-4 mr-2" />
                                Upload File
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {resources.map((resource: any, index: number) => (
                                <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-5 w-5 text-blue-500" />
                                        <div>
                                            <p className="font-medium">{resource.name || 'Untitled Resource'}</p>
                                            <p className="text-xs text-gray-500">{resource.type || 'File'} • {new Date(resource.createdAt || Date.now()).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="ghost">
                                            <Download className="h-4 w-4" />
                                        </Button>
                                        <Button size="sm" variant="ghost" className="text-red-500">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
