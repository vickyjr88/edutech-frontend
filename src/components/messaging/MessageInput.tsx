import { useState, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Send,
    PlusCircle,
    Paperclip,
    Image as ImageIcon,
    Smile,
    X,
    FileText,
    Video,
    Mic,
    Calendar,
    Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Common emojis for the picker
const EMOJI_LIST = [
    "😀", "😃", "😄", "😁", "😅", "😂", "🤣", "😊", "😇", "🙂",
    "😉", "😍", "🥰", "😘", "😋", "😜", "🤗", "🤔", "🤫", "😏",
    "😎", "🤩", "🥳", "😢", "😭", "😤", "😡", "🤯", "😱", "🥺",
    "👍", "👎", "👏", "🙌", "🤝", "💪", "❤️", "🔥", "⭐", "✨",
    "🎉", "🎊", "💯", "✅", "❌", "⚠️", "💡", "📌", "📎", "🎯"
];

interface Attachment {
    file: File;
    preview?: string;
    type: 'image' | 'file';
}

interface MessageInputProps {
    placeholder: string;
    onSendMessage: (content: string, attachments?: File[]) => Promise<void>;
    disabled?: boolean;
    isLoading?: boolean;
}

export default function MessageInput({
    placeholder,
    onSendMessage,
    disabled = false,
    isLoading = false,
}: MessageInputProps) {
    const { toast } = useToast();
    const [message, setMessage] = useState("");
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [isSending, setIsSending] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'file') => {
        const files = e.target.files;
        if (!files) return;

        const newAttachments: Attachment[] = [];

        Array.from(files).forEach((file) => {
            if (type === 'image' && !file.type.startsWith('image/')) {
                toast({ title: "Invalid file", description: "Please select an image file", variant: "destructive" });
                return;
            }

            if (file.size > 10 * 1024 * 1024) { // 10MB limit
                toast({ title: "File too large", description: "File size must be less than 10MB", variant: "destructive" });
                return;
            }

            const attachment: Attachment = { file, type };

            if (type === 'image') {
                attachment.preview = URL.createObjectURL(file);
            }

            newAttachments.push(attachment);
        });

        setAttachments(prev => [...prev, ...newAttachments]);
        e.target.value = ''; // Reset input
    }, [toast]);

    const removeAttachment = (index: number) => {
        setAttachments(prev => {
            const updated = [...prev];
            if (updated[index].preview) {
                URL.revokeObjectURL(updated[index].preview!);
            }
            updated.splice(index, 1);
            return updated;
        });
    };

    const handleEmojiSelect = (emoji: string) => {
        setMessage(prev => prev + emoji);
        setShowEmojiPicker(false);
    };

    const handleSend = async () => {
        if ((!message.trim() && attachments.length === 0) || disabled) return;

        setIsSending(true);
        try {
            const files = attachments.map(a => a.file);
            await onSendMessage(message, files.length > 0 ? files : undefined);
            setMessage("");
            setAttachments([]);
        } catch (error) {
            console.error("Failed to send message:", error);
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="p-4 border-t bg-gray-50">
            {/* Attachment Preview */}
            {attachments.length > 0 && (
                <div className="max-w-4xl mx-auto mb-3">
                    <div className="flex flex-wrap gap-2 p-3 bg-white rounded-lg border">
                        {attachments.map((attachment, index) => (
                            <div key={index} className="relative group">
                                {attachment.type === 'image' && attachment.preview ? (
                                    <div className="relative w-20 h-20 rounded-lg overflow-hidden border">
                                        <img src={attachment.preview} alt="Preview" className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => removeAttachment(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="relative flex items-center gap-2 p-2 bg-gray-100 rounded-lg border">
                                        <FileText className="h-5 w-5 text-gray-500" />
                                        <span className="text-sm text-gray-700 max-w-[100px] truncate">{attachment.file.name}</span>
                                        <button
                                            onClick={() => removeAttachment(index)}
                                            className="ml-1 text-gray-400 hover:text-red-500"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Message Input Bar */}
            <div className="max-w-4xl mx-auto flex items-end gap-2 bg-white rounded-xl border shadow-sm p-2">
                {/* Plus Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full">
                            <PlusCircle className="h-5 w-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                        <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                            <Paperclip className="h-4 w-4 mr-2" />
                            Upload File
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => imageInputRef.current?.click()}>
                            <ImageIcon className="h-4 w-4 mr-2" />
                            Upload Image
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled>
                            <Video className="h-4 w-4 mr-2" />
                            Record Video
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled>
                            <Mic className="h-4 w-4 mr-2" />
                            Voice Message
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled>
                            <Calendar className="h-4 w-4 mr-2" />
                            Schedule Message
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* File Upload Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Paperclip className="h-5 w-5" />
                </Button>

                {/* Image Upload Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full"
                    onClick={() => imageInputRef.current?.click()}
                >
                    <ImageIcon className="h-5 w-5" />
                </Button>

                {/* Hidden File Inputs */}
                <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    multiple
                    onChange={(e) => handleFileSelect(e, 'file')}
                />
                <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    multiple
                    onChange={(e) => handleFileSelect(e, 'image')}
                />

                {/* Input Field */}
                <div className="flex-1 py-1">
                    <Input
                        placeholder={placeholder}
                        className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-2 py-2 text-base shadow-none"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={disabled || isSending}
                    />
                </div>

                {/* Emoji Picker */}
                <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full">
                            <Smile className="h-5 w-5" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-2" align="end">
                        <div className="grid grid-cols-10 gap-1">
                            {EMOJI_LIST.map((emoji, i) => (
                                <button
                                    key={i}
                                    className="p-1.5 hover:bg-gray-100 rounded text-xl"
                                    onClick={() => handleEmojiSelect(emoji)}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>

                {/* Send Button */}
                <Button
                    onClick={handleSend}
                    disabled={(!message.trim() && attachments.length === 0) || isLoading || disabled || isSending}
                    className="h-9 w-9 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center justify-center p-0 ml-1"
                >
                    {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
            </div>

            <div className="text-center mt-2">
                <p className="text-xs text-gray-400">Press Enter to send, Shift + Enter for new line</p>
            </div>
        </div>
    );
}
