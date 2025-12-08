import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { messagingService, DirectMessageUser } from "@/integrations/api/services/messaging.service";
import { Loader2, Search, Check, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface NewConversationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConversationStarted: (conversationId: string) => void;
}

export default function NewConversationDialog({ open, onOpenChange, onConversationStarted }: NewConversationDialogProps) {
    const { toast } = useToast();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<DirectMessageUser[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<DirectMessageUser[]>([]);
    const [groupName, setGroupName] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (!searchQuery.trim()) {
                setSearchResults([]);
                return;
            }

            setIsSearching(true);
            try {
                const response = await messagingService.searchUsers(searchQuery);
                if (response.data) {
                    // Filter out already selected users
                    const filtered = response.data.filter(u =>
                        !selectedUsers.find(selected => selected.id === u.id)
                    );
                    setSearchResults(filtered);
                }
            } catch (error) {
                console.error("Search failed:", error);
            } finally {
                setIsSearching(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery, selectedUsers]);

    const handleSelectUser = (user: DirectMessageUser) => {
        setSelectedUsers(prev => [...prev, user]);
        setSearchResults(prev => prev.filter(u => u.id !== user.id));
        setSearchQuery(""); // clear search to allow finding more
    };

    const handleRemoveUser = (userId: string) => {
        setSelectedUsers(prev => prev.filter(u => u.id !== userId));
    };

    const handleSubmit = async () => {
        if (selectedUsers.length === 0) return;

        setIsSubmitting(true);
        try {
            if (selectedUsers.length === 1 && !groupName) {
                // Start DM
                const response = await messagingService.startDirectMessage(selectedUsers[0].id);
                if (response.data) {
                    onConversationStarted(response.data.conversationId);
                    onOpenChange(false);
                }
            } else {
                // Start Group Chat
                const response = await messagingService.createGroupConversation(
                    selectedUsers.map(u => u.id),
                    groupName || undefined
                );
                if (response.data) {
                    onConversationStarted(response.data.conversationId);
                    onOpenChange(false);
                }
            }
        } catch (error) {
            console.error("Failed to start conversation:", error);
            toast({
                title: "Error",
                description: "Failed to start conversation. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>New Message</DialogTitle>
                    <DialogDescription>
                        Start a conversation with one or more people.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {/* Selected Users Area */}
                    <div className="flex flex-wrap gap-2 mb-2">
                        {selectedUsers.map(user => (
                            <Badge key={user.id} variant="secondary" className="pl-1 pr-2 py-1 flex items-center">
                                <Avatar className="h-4 w-4 mr-1">
                                    <AvatarImage src={user.avatar} />
                                    <AvatarFallback className="text-[10px]">{user.name[0]}</AvatarFallback>
                                </Avatar>
                                {user.name}
                                <button onClick={() => handleRemoveUser(user.id)} className="ml-1 hover:text-red-500">
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>

                    {/* Group Name Input (only if multiple users selected) */}
                    {(selectedUsers.length > 1) && (
                        <div className="space-y-2">
                            <Label htmlFor="groupName">Group Name (Optional)</Label>
                            <Input
                                id="groupName"
                                placeholder="e.g. Study Group"
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                            />
                        </div>
                    )}

                    {/* Search Input */}
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Type a name to search..."
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {isSearching && (
                            <Loader2 className="absolute right-2.5 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
                        )}
                    </div>

                    {/* Search Results */}
                    <ScrollArea className="h-[200px] border rounded-md p-2">
                        {searchResults.length === 0 && searchQuery && !isSearching ? (
                            <p className="text-sm text-center text-gray-500 py-4">No users found.</p>
                        ) : searchResults.length === 0 && !searchQuery ? (
                            <p className="text-sm text-center text-gray-500 py-4">Type to find people.</p>
                        ) : (
                            <div className="space-y-1">
                                {searchResults.map(user => (
                                    <div
                                        key={user.id}
                                        className="flex items-center p-2 hover:bg-gray-100 rounded-md cursor-pointer transition-colors"
                                        onClick={() => handleSelectUser(user)}
                                    >
                                        <Avatar className="h-8 w-8 mr-3">
                                            <AvatarImage src={user.avatar} />
                                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-medium">{user.name}</p>
                                            <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                                        </div>
                                        <Check className="ml-auto h-4 w-4 text-transparent hover:text-gray-300" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={selectedUsers.length === 0 || isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {selectedUsers.length > 1 ? 'Create Group' : 'Start Chat'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
