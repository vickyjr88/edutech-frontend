import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { messagingService } from "@/integrations/api/services/messaging.service";
import { Loader2 } from "lucide-react";

interface CreateChannelDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onChannelCreated: () => void;
}

export default function CreateChannelDialog({ open, onOpenChange, onChannelCreated }: CreateChannelDialogProps) {
    const { toast } = useToast();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState<"public" | "private">("public");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        try {
            setIsSubmitting(true);
            await messagingService.createChannel({
                name,
                description,
                type
            });

            toast({
                title: "Success",
                description: "Channel created successfully",
            });

            onChannelCreated();
            onOpenChange(false);
            setName("");
            setDescription("");
            setType("public");
        } catch (error) {
            console.error("Failed to create channel:", error);
            toast({
                title: "Error",
                description: "Failed to create channel. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Channel</DialogTitle>
                    <DialogDescription>
                        Create a new space for discussions.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Channel Name</Label>
                        <Input
                            id="name"
                            placeholder="e.g. general, homework-help"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description (optional)</Label>
                        <Textarea
                            id="description"
                            placeholder="What is this channel for?"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Visibility</Label>
                        <RadioGroup value={type} onValueChange={(val) => setType(val as "public" | "private")}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="public" id="public" />
                                <Label htmlFor="public">Public - Anyone can join</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="private" id="private" />
                                <Label htmlFor="private">Private - Invite only</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting || !name.trim()}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Channel
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
