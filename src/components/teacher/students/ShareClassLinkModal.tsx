import React, { useState, useEffect } from 'react';
import {
    Link2,
    X,
    Copy,
    Check,
    Share2,
    Mail,
    MessageCircle,
    QrCode,
    Download,
    ExternalLink,
    Users,
    Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { TeacherClassSummary } from '@/types/enhanced-classes';

interface ShareClassLinkModalProps {
    isOpen: boolean;
    onClose: () => void;
    classes?: TeacherClassSummary[];
}

const ShareClassLinkModal: React.FC<ShareClassLinkModalProps> = ({
    isOpen,
    onClose,
    classes = []
}) => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [selectedClass, setSelectedClass] = useState<TeacherClassSummary | null>(null);
    const [copied, setCopied] = useState(false);
    const [shareMethod, setShareMethod] = useState<'link' | 'email' | 'whatsapp' | 'qr'>('link');

    const baseUrl = window.location.origin;

    // Generate the class link
    const getClassLink = () => {
        if (!selectedClass) return '';
        return `${baseUrl}/class/${selectedClass.classId}`;
    };

    // Generate cohort-specific links
    const getCohortLink = (cohortId: string) => {
        if (!selectedClass) return '';
        return `${baseUrl}/class/${selectedClass.classId}/enroll?cohort=${cohortId}`;
    };

    // Copy link to clipboard
    const handleCopyLink = async (link: string) => {
        try {
            await navigator.clipboard.writeText(link);
            setCopied(true);
            toast({
                title: "Link copied!",
                description: "The class link has been copied to your clipboard.",
            });
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast({
                title: "Failed to copy",
                description: "Could not copy the link. Please try again.",
                variant: "destructive"
            });
        }
    };

    // Share via email
    const handleEmailShare = () => {
        const link = getClassLink();
        const subject = encodeURIComponent(`Join my class: ${selectedClass?.title || 'Class'}`);
        const body = encodeURIComponent(
            `Hi,\n\nI'd like to invite you to join my class "${selectedClass?.title}" on Kidato.\n\n` +
            `Click here to enroll: ${link}\n\n` +
            `Best regards,\n${user?.fullName || 'Your Teacher'}`
        );
        window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
    };

    // Share via WhatsApp
    const handleWhatsAppShare = () => {
        const link = getClassLink();
        const message = encodeURIComponent(
            `🎓 Join my class "${selectedClass?.title}" on Kidato!\n\n` +
            `📚 ${selectedClass?.subject || 'Various subjects'}\n` +
            `👥 ${selectedClass?.enrolledStudents || 0} students enrolled\n\n` +
            `Click here to enroll: ${link}`
        );
        window.open(`https://wa.me/?text=${message}`, '_blank');
    };

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setCopied(false);
            setShareMethod('link');
            // Auto-select first class if only one
            if (classes.length === 1 && !selectedClass) {
                setSelectedClass(classes[0]);
            }
        }
    }, [isOpen, classes]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-2xl bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 animate-in slide-in-from-bottom-4 zoom-in-95 duration-300 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#5e6ad2] to-[#abb4dd] p-6 pb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                <Share2 className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Share Class Link</h2>
                                <p className="text-sm text-white/80">Invite students to join your class</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="text-white/80 hover:text-white hover:bg-white/20 rounded-full w-8 h-8 p-0"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Class Selection */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Select Class to Share
                        </label>
                        <Select
                            value={selectedClass?.classId || ''}
                            onValueChange={(value) => {
                                const cls = classes.find(c => c.classId === value);
                                setSelectedClass(cls || null);
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Choose a class" />
                            </SelectTrigger>
                            <SelectContent>
                                {classes.length === 0 ? (
                                    <SelectItem value="none" disabled>
                                        No classes available
                                    </SelectItem>
                                ) : (
                                    classes.map((cls) => (
                                        <SelectItem key={cls.classId} value={cls.classId}>
                                            <div className="flex items-center gap-2">
                                                <span>{cls.title}</span>
                                                <Badge variant="outline" className="text-xs">
                                                    {cls.enrolledStudents} students
                                                </Badge>
                                            </div>
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    {selectedClass && (
                        <>
                            {/* Class Info Card */}
                            <Card className="bg-gradient-to-r from-[#5e6ad2]/10 to-[#abb4dd]/10 border-[#5e6ad2]/20">
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-[#5e6ad2] rounded-xl flex items-center justify-center flex-shrink-0">
                                            <Users className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900">{selectedClass.title}</h3>
                                            <p className="text-sm text-gray-600">{selectedClass.subject}</p>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                <Badge variant="outline" className="text-xs bg-white/50">
                                                    {selectedClass.type}
                                                </Badge>
                                                <Badge variant="outline" className="text-xs bg-white/50">
                                                    {selectedClass.enrolledStudents} enrolled
                                                </Badge>
                                                {selectedClass.activeCohorts && (
                                                    <Badge variant="outline" className="text-xs bg-white/50">
                                                        {selectedClass.activeCohorts} cohorts
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Share Link Section */}
                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Class Enrollment Link
                                </label>
                                <div className="flex gap-2">
                                    <div className="flex-1 relative">
                                        <Input
                                            value={getClassLink()}
                                            readOnly
                                            className="pr-10 bg-gray-50 font-mono text-sm"
                                        />
                                        <Link2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    </div>
                                    <Button
                                        onClick={() => handleCopyLink(getClassLink())}
                                        className={`px-4 transition-all ${copied
                                                ? 'bg-green-500 hover:bg-green-600'
                                                : 'bg-[#5e6ad2] hover:bg-[#5e6ad2]/90'
                                            }`}
                                    >
                                        {copied ? (
                                            <>
                                                <Check className="w-4 h-4 mr-2" />
                                                Copied!
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-4 h-4 mr-2" />
                                                Copy
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>

                            {/* Share Methods */}
                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Quick Share Options
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    <Button
                                        variant="outline"
                                        className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-[#5e6ad2]/10 hover:border-[#5e6ad2]/30"
                                        onClick={() => handleCopyLink(getClassLink())}
                                    >
                                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                            <Link2 className="w-5 h-5 text-gray-600" />
                                        </div>
                                        <span className="text-xs font-medium">Copy Link</span>
                                    </Button>

                                    <Button
                                        variant="outline"
                                        className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-blue-50 hover:border-blue-200"
                                        onClick={handleEmailShare}
                                    >
                                        <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                                            <Mail className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <span className="text-xs font-medium">Email</span>
                                    </Button>

                                    <Button
                                        variant="outline"
                                        className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-green-50 hover:border-green-200"
                                        onClick={handleWhatsAppShare}
                                    >
                                        <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                                            <MessageCircle className="w-5 h-5 text-green-600" />
                                        </div>
                                        <span className="text-xs font-medium">WhatsApp</span>
                                    </Button>

                                    <Button
                                        variant="outline"
                                        className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-purple-50 hover:border-purple-200"
                                        onClick={() => window.open(getClassLink(), '_blank')}
                                    >
                                        <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center">
                                            <ExternalLink className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <span className="text-xs font-medium">Preview</span>
                                    </Button>
                                </div>
                            </div>

                            {/* AI Tips */}
                            <div className="bg-gradient-to-r from-[#5e6ad2]/10 to-[#abb4dd]/10 rounded-xl p-4 border border-[#5e6ad2]/20">
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles className="w-4 h-4 text-[#5e6ad2]" />
                                    <span className="text-sm font-medium text-[#5e6ad2]">Sharing Tips</span>
                                </div>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#5e6ad2]">•</span>
                                        Share during peak hours (Tuesday 2-4 PM) for better engagement
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#5e6ad2]">•</span>
                                        WhatsApp shares have 3x higher conversion rates
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#5e6ad2]">•</span>
                                        Add a personal message when sharing via email
                                    </li>
                                </ul>
                            </div>
                        </>
                    )}

                    {/* Empty State */}
                    {!selectedClass && classes.length > 0 && (
                        <div className="text-center py-8 text-gray-500">
                            <Share2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p>Select a class above to get the shareable link</p>
                        </div>
                    )}

                    {classes.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p>No classes available to share</p>
                            <p className="text-sm mt-1">Create a class first to share it with students</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                    <div className="flex justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="border-gray-300"
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShareClassLinkModal;
