import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { MvpSupportService, CreateTicketDto } from '@/integrations/api/services/mvp-support.service';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, MessageSquare, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function UserSupportPage() {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
    const { toast } = useToast();
    const queryClient = useQueryClient();

    // Fetch user tickets
    const { data: tickets, isLoading } = useQuery({
        queryKey: ['myTickets'],
        queryFn: () => MvpSupportService.getMyTickets(),
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'open': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'in_progress': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'pending_user': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
            case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'resolved': return <CheckCircle className="h-4 w-4 mr-1" />;
            case 'pending_user': return <AlertCircle className="h-4 w-4 mr-1" />;
            default: return <Clock className="h-4 w-4 mr-1" />;
        }
    };

    return (
        <div className="container mx-auto py-8 px-4 max-w-5xl">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Support Requests</h1>
                    <p className="text-muted-foreground mt-1">
                        Track and manage your support tickets
                    </p>
                </div>
                <Button onClick={() => setCreateModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Ticket
                </Button>
            </div>

            {isLoading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : tickets && tickets.length > 0 ? (
                <div className="grid gap-4">
                    {tickets.map((ticket: any) => (
                        <Card
                            key={ticket._id}
                            className="cursor-pointer hover:bg-slate-50 transition-colors"
                            onClick={() => setSelectedTicket(ticket)}
                        >
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-lg">{ticket.subject}</span>
                                            <Badge variant="secondary" className="text-xs">
                                                #{ticket.ticketNumber}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {ticket.message}
                                        </p>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                                            <span className="capitalize">{ticket.category.replace('_', ' ')}</span>
                                            <span>•</span>
                                            <span>{format(new Date(ticket.createdAt), 'MMM d, yyyy h:mm a')}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <Badge variant="outline" className={getStatusColor(ticket.status)}>
                                            {getStatusIcon(ticket.status)}
                                            <span className="capitalize">{ticket.status.replace('_', ' ')}</span>
                                        </Badge>
                                        {ticket.messages?.length > 0 && (
                                            <div className="flex items-center text-xs text-muted-foreground">
                                                <MessageSquare className="h-3 w-3 mr-1" />
                                                {ticket.messages.length} messages
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No tickets yet</h3>
                    <p className="text-muted-foreground mb-4">
                        Have a question or issue? Create a new support ticket.
                    </p>
                    <Button onClick={() => setCreateModalOpen(true)}>
                        Create Ticket
                    </Button>
                </div>
            )}

            <CreateTicketDialog
                open={createModalOpen}
                onOpenChange={setCreateModalOpen}
            />

            {/* Basic detail view in a dialog for MVP */}
            {selectedTicket && (
                <TicketDetailDialog
                    ticket={selectedTicket}
                    open={!!selectedTicket}
                    onOpenChange={(open) => !open && setSelectedTicket(null)}
                />
            )}
        </div>
    );
}

function CreateTicketDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState<CreateTicketDto>({
        subject: '',
        message: '',
        category: 'general',
        priority: 'medium'
    });

    const createMutation = useMutation({
        mutationFn: (data: CreateTicketDto) => MvpSupportService.createTicket(data),
        onSuccess: () => {
            toast({ title: 'Ticket created successfully' });
            queryClient.invalidateQueries({ queryKey: ['myTickets'] });
            onOpenChange(false);
            setFormData({ subject: '', message: '', category: 'general', priority: 'medium' });
        },
        onError: () => {
            toast({ title: 'Failed to create ticket', variant: 'destructive' });
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate(formData);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create Support Ticket</DialogTitle>
                    <DialogDescription>
                        Describe your issue and we'll get back to you as soon as possible.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                            id="subject"
                            required
                            value={formData.subject}
                            onChange={e => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                            placeholder="Brief summary of the issue"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(val: any) => setFormData(prev => ({ ...prev, category: val }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="account_access">Account Access</SelectItem>
                                    <SelectItem value="payment">Payment</SelectItem>
                                    <SelectItem value="technical">Technical Issue</SelectItem>
                                    <SelectItem value="content">Content/Course</SelectItem>
                                    <SelectItem value="general">General Question</SelectItem>
                                    <SelectItem value="feature_request">Feature Request</SelectItem>
                                    <SelectItem value="bug_report">Bug Report</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="priority">Priority</Label>
                            <Select
                                value={formData.priority}
                                onValueChange={(val: any) => setFormData(prev => ({ ...prev, priority: val }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="urgent">Urgent</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="message">Description</Label>
                        <Textarea
                            id="message"
                            required
                            rows={5}
                            value={formData.message}
                            onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
                            placeholder="Please provide details about your issue..."
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={createMutation.isPending}>
                            {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Submit Ticket
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function TicketDetailDialog({ ticket, open, onOpenChange }: { ticket: any, open: boolean, onOpenChange: (open: boolean) => void }) {
    // We're not implementing full message history/reply for this MVP step purely because checking existing components
    // showed TicketDetails was admin-heavy. For MVP, showing status and initial request is a good start. 
    // Ideally we replicate the message view here too.

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <DialogTitle className="text-xl">{ticket.subject}</DialogTitle>
                        <Badge variant="outline">#{ticket.ticketNumber}</Badge>
                    </div>
                    <DialogDescription>
                        Created on {format(new Date(ticket.createdAt), 'PPP p')}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="font-semibold text-muted-foreground block mb-1">Status</span>
                            <Badge className="capitalize">{ticket.status.replace('_', ' ')}</Badge>
                        </div>
                        <div>
                            <span className="font-semibold text-muted-foreground block mb-1">Category</span>
                            <span className="capitalize">{ticket.category.replace('_', ' ')}</span>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2 text-sm text-slate-900">Description</h4>
                        <p className="text-sm text-slate-600 whitespace-pre-wrap">{ticket.message}</p>
                    </div>

                    {ticket.messages && ticket.messages.length > 0 && (
                        <div className="space-y-4">
                            <h4 className="font-medium text-sm border-b pb-2">Messages</h4>
                            {ticket.messages.map((msg: any, i: number) => (
                                <div key={i} className={`p-3 rounded-lg text-sm ${msg.senderType === 'user' ? 'bg-blue-50 ml-8' : 'bg-gray-100 mr-8'}`}>
                                    <div className="flex justify-between mb-1 text-xs text-muted-foreground">
                                        <span className="font-medium capitalize">{msg.senderType === 'user' ? 'You' : 'Support Team'}</span>
                                        <span>{format(new Date(msg.createdAt || new Date()), 'MMM d, h:mm a')}</span>
                                    </div>
                                    <p>{msg.message}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
