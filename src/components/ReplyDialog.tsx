import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { replyToMessage } from '@/auth/api';
import { toast } from '@/components/ui/use-toast';
import { Loader2, Send } from 'lucide-react';

interface ReplyDialogProps {
    messageId: number | null;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onReplySent: (messageId: number, content: string) => void;
}

const ReplyDialog = ({ messageId, isOpen, onOpenChange, onReplySent }: ReplyDialogProps) => {
    const [replyContent, setReplyContent] = useState('');
    const [isSending, setIsSending] = useState(false);

    const handleReply = async () => {
        if (!messageId || !replyContent.trim()) return;

        setIsSending(true);
        try {
            await replyToMessage(messageId, replyContent);
            toast({
                title: "Reply sent",
                description: "Your reply has been sent successfully.",
            });
            onReplySent(messageId, replyContent);
            setReplyContent('');
            onOpenChange(false);
        } catch (error) {
            console.error("Failed to send reply", error);
            toast({
                title: "Error",
                description: "Failed to send reply. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSending(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Reply to Message</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    <p className="text-sm text-muted-foreground">
                        The sender provided an email address. They will receive your reply anonymously via LemonDrop.
                    </p>
                    <Textarea
                        placeholder="Type your reply here..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        className="min-h-[120px]"
                        maxLength={1000}
                    />
                    <div className="flex justify-end text-xs text-muted-foreground">
                        <span>{replyContent.length}/1000</span>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" type="button">Cancel</Button>
                    </DialogClose>
                    <Button
                        onClick={handleReply}
                        disabled={isSending || !replyContent.trim()}
                        className="bg-lemon-400 hover:bg-lemon-500 text-white"
                    >
                        {isSending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Send className="mr-2 h-4 w-4" />
                        )}
                        Send Reply
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ReplyDialog;
