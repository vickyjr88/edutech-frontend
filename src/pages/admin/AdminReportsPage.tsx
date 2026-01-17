
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2, Users, BookOpen, DollarSign } from 'lucide-react';
import { adminService } from '@/integrations/api/services/admin.service';
import { useToast } from '@/hooks/use-toast';


export default function AdminReportsPage() {
    const { toast } = useToast();
    const [loading, setLoading] = useState<string | null>(null);

    const handleDownload = async (type: 'bookings' | 'teachers' | 'revenue') => {
        setLoading(type);
        try {
            let response: any;
            let filename = '';

            switch (type) {
                case 'bookings':
                    response = await adminService.exportBookings();
                    filename = `bookings-export-${new Date().toISOString().split('T')[0]}.csv`;
                    break;
                case 'teachers':
                    response = await adminService.exportTeachers();
                    filename = `teachers-export-${new Date().toISOString().split('T')[0]}.csv`;
                    break;
                case 'revenue':
                    response = await adminService.exportRevenue();
                    filename = `revenue-export-${new Date().toISOString().split('T')[0]}.csv`;
                    break;
            }

            if (response.data) {
                // Create blob link to download
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', filename);
                document.body.appendChild(link);
                link.click();
                link.remove();

                toast({
                    title: "Export Successful",
                    description: `Successfully downloaded ${type} report.`,
                });
            } else {
                toast({
                    title: "Export Failed",
                    description: "No data received from server.",
                    variant: "destructive"
                });
            }

        } catch (error) {
            console.error("Export failed:", error);
            toast({
                title: "Export Failed",
                description: "There was an error generating the report.",
                variant: "destructive"
            });
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Reports & Data Exports</h1>
                <p className="text-gray-500">Generate and download CSV reports for platform data analysis.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Bookings Report */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-indigo-600" />
                            Bookings Report
                        </CardTitle>
                        <CardDescription>
                            Full history of all bookings including student, parent, and teacher details, status, and pricing.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button
                            onClick={() => handleDownload('bookings')}
                            disabled={loading === 'bookings'}
                            className="w-full"
                        >
                            {loading === 'bookings' ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <FileDown className="mr-2 h-4 w-4" />
                            )}
                            Export CSV
                        </Button>
                    </CardFooter>
                </Card>

                {/* Teachers Report */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-green-600" />
                            Teachers List
                        </CardTitle>
                        <CardDescription>
                            Comprehensive list of all teachers, their profile status, contact info, and bio.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button
                            onClick={() => handleDownload('teachers')}
                            disabled={loading === 'teachers'}
                            className="w-full"
                        >
                            {loading === 'teachers' ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <FileDown className="mr-2 h-4 w-4" />
                            )}
                            Export CSV
                        </Button>
                    </CardFooter>
                </Card>

                {/* Revenue Report */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-amber-600" />
                            Revenue Report
                        </CardTitle>
                        <CardDescription>
                            Detailed transaction logs including Paystack references, payer details, and payment status.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button
                            onClick={() => handleDownload('revenue')}
                            disabled={loading === 'revenue'}
                            className="w-full"
                        >
                            {loading === 'revenue' ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <FileDown className="mr-2 h-4 w-4" />
                            )}
                            Export CSV
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
