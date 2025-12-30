import React, { useState, useEffect, useContext } from 'react';
import { Loader2 } from 'lucide-react';

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Citrus, Trash2, Heart, Calendar, Search, RefreshCw, Archive, ArchiveRestore, Share, Reply, Mail } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from '@/components/ui/use-toast';
import { getMessages, deleteMessage as apiDeleteMessage } from '@/auth/api';
import { AuthContext } from '@/auth/AuthProvider';
import ReplyDialog from '@/components/ReplyDialog';

interface Message {
  id: number;
  content: string;
  date: string;
  favorite: boolean;
  archived: boolean;
  has_email: boolean;
  reply: {
    reply_content: string;
    created_at: string;
  } | null;
}

const formatTimestamp = (isoString: string) => {
  try {
    const date = new Date(isoString);
    return date.toLocaleString();
  } catch (e) {
    return isoString;
  }
};

const Messages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Reply State
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<number | null>(null);

  const { user } = useContext(AuthContext);

  const fetchMessages = async (showRefreshLoading = false) => {
    if (!user?.username) return;

    if (showRefreshLoading) {
      setIsRefreshing(true);
    }

    try {
      const data = await getMessages(user.username);


      // Load local storage states
      const savedFavorites = JSON.parse(localStorage.getItem('lemon_drop_favorites') || '[]');
      const savedArchived = JSON.parse(localStorage.getItem('lemon_drop_archived') || '[]');

      const mappedMessages = data.map((msg: any) => ({
        id: msg.id,
        content: msg.message_content || "",
        date: formatTimestamp(msg.created_at),
        favorite: savedFavorites.includes(msg.id),
        archived: savedArchived.includes(msg.id),
        has_email: msg.has_email || false,
        reply: msg.reply || null
      })).reverse();
      setMessages(mappedMessages);

      if (showRefreshLoading) {
        toast({
          title: "Updated",
          description: "Messages loaded successfully",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Failed to load messages", error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    } finally {
      setIsLoadingMessages(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [user]);

  const filteredMessages = messages.filter(message => {
    const content = message.content || "";
    const matchesSearch = content.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeTab === 'all') return matchesSearch && !message.archived;
    if (activeTab === 'favorites') return matchesSearch && message.favorite && !message.archived;
    if (activeTab === 'archived') return matchesSearch && message.archived;
    return matchesSearch && !message.archived;
  });

  const toggleFavorite = (id: number) => {
    let isNowFavorite = false;

    setMessages(messages.map(message => {
      if (message.id === id) {
        isNowFavorite = !message.favorite;
        return { ...message, favorite: isNowFavorite };
      }
      return message;
    }));

    const savedFavorites = JSON.parse(localStorage.getItem('lemon_drop_favorites') || '[]');
    let newFavorites;
    if (isNowFavorite) {
      newFavorites = [...savedFavorites, id];
    } else {
      newFavorites = savedFavorites.filter((favId: number) => favId !== id);
    }
    localStorage.setItem('lemon_drop_favorites', JSON.stringify(newFavorites));

    const message = messages.find(m => m.id === id);
    if (message) {
      toast({
        title: isNowFavorite ? "Added to favorites" : "Removed from favorites",
        variant: "default",
      });
    }
  };

  const toggleArchive = (id: number) => {
    let isNowArchived = false;

    setMessages(messages.map(message => {
      if (message.id === id) {
        isNowArchived = !message.archived;
        return { ...message, archived: isNowArchived };
      }
      return message;
    }));

    const savedArchived = JSON.parse(localStorage.getItem('lemon_drop_archived') || '[]');
    let newArchived;
    if (isNowArchived) {
      newArchived = [...savedArchived, id];
    } else {
      newArchived = savedArchived.filter((archId: number) => archId !== id);
    }
    localStorage.setItem('lemon_drop_archived', JSON.stringify(newArchived));

    const message = messages.find(m => m.id === id);
    if (message) {
      toast({
        title: isNowArchived ? "Moved to archive" : "Restored from archive",
        variant: "default",
      });
    }
  };

  const deleteMessage = async (id: number) => {
    try {
      await apiDeleteMessage(id);
      setMessages(messages.filter(message => message.id !== id));
      toast({
        title: "Message deleted",
        description: "The message has been permanently removed",
        variant: "default",
      });
    } catch (error) {
      console.error("Failed to delete message", error);
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      });
    }
  };

  const openReplyDialog = (id: number) => {
    setSelectedMessageId(id);
    setReplyDialogOpen(true);
  };

  const handleReplySent = (messageId: number, content: string) => {
    setMessages(messages.map(msg =>
      msg.id === messageId
        ? {
          ...msg,
          reply: {
            reply_content: content,
            created_at: new Date().toISOString()
          }
        }
        : msg
    ));
  };

  const copyShareLink = () => {
    const username = user?.username || "username";
    const link = `${window.location.origin}/send/${username}`;
    navigator.clipboard.writeText(link);

    toast({
      title: "Link copied!",
      description: "Your sharing link has been copied to clipboard",
      variant: "default",
    });
  };

  const refreshMessages = () => {
    fetchMessages(true);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 py-12 px-4">
        <div className="mx-auto max-w-5xl w-full sm:w-11/12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold">Your Messages</h1>
              <p className="text-muted-foreground">View and manage your messages</p>
              <p className="text-muted-foreground text-sm">Only messages within 36 hours from submission is visible!</p>
            </div>

            <div className="flex items-center gap-3">
              <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Share className="mr-2 h-4 w-4" />
                    Share Your Link
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Share Your Anonymous Link</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <p className="text-sm text-muted-foreground">
                      Share this link with friends to receive messages.
                    </p>
                    <div className="flex items-center space-x-2">
                      <Input
                        value={`${window.location.origin}/send/${user?.username || 'username'}`}
                        readOnly
                      />
                      <Button onClick={copyShareLink}>
                        Copy
                      </Button>
                    </div>
                    <div className="pt-4">
                      <p className="text-sm font-medium mb-2">Share on social media</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Twitter</Button>
                        <Button variant="outline" size="sm">Instagram</Button>
                        <Button variant="outline" size="sm">Facebook</Button>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button variant="outline" onClick={refreshMessages} isLoading={isRefreshing}>
                {!isRefreshing && <RefreshCw className="mr-2 h-4 w-4" />}
                Refresh
              </Button>
            </div>
          </div>

          <div className="bg-card rounded-lg border shadow-sm">
            <div className="p-6 px-4">
              <Tabs defaultValue="all" onValueChange={setActiveTab}>
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
                  <div className="w-full max-w-[400px]">
                    <TabsList className="flex flex-col sm:grid sm:w-full sm:grid-cols-3 h-auto sm:h-10 gap-1 sm:gap-0 bg-muted/50 sm:bg-muted p-1 rounded-lg">
                      <TabsTrigger value="all" className="w-full">All Messages</TabsTrigger>
                      <TabsTrigger value="favorites" className="w-full">Favorites</TabsTrigger>
                      <TabsTrigger value="archived" className="w-full">Archived</TabsTrigger>
                    </TabsList>
                  </div>

                  <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search messages..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <TabsContent value="all" className="space-y-4 mt-0">
                  {isLoadingMessages ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                      <Loader2 className="h-8 w-8 animate-spin text-lemon-400" />
                      <p className="text-muted-foreground">Loading your messages...</p>
                    </div>
                  ) : filteredMessages.length > 0 ? (
                    filteredMessages.map((message) => (
                      <div key={message.id} className="bg-background p-4 rounded-lg border">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-0 gap-3 sm:gap-0">
                          <div className="flex items-center gap-2">
                            <Citrus className="h-4 w-4 text-lemon-400" />
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {message.date}
                            </span>
                          </div>

                          <div className="flex items-center justify-end w-full sm:w-auto gap-1">
                            {/* Reply Button - Only if enabled and not yet replied */}
                            {message.has_email && !message.reply && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openReplyDialog(message.id)}
                                title="Reply to sender"
                                className="text-lemon-500 hover:text-lemon-600 hover:bg-lemon-50"
                              >
                                <Reply className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                            )}

                            {/* Replied Indicator */}
                            {message.reply && (
                              <div className="px-2" title="You replied to this message">
                                <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                              </div>
                            )}

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleFavorite(message.id)}
                              className={message.favorite ? "text-lemon-400" : ""}
                            >
                              <Heart className="h-3 w-3 sm:h-4 sm:w-4" fill={message.favorite ? "currentColor" : "none"} />
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleArchive(message.id)}
                              title="Archive message"
                            >
                              <Archive className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Message</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this message? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deleteMessage(message.id)}>
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                        <div>
                          <p>{message.content}</p>
                          <p className='text-xs text-muted-foreground m-0 mt-1'>- Anonymous</p>

                          {/* Display Reply if exists */}
                          {message.reply && (
                            <div className="mt-3 ml-4 pl-4 border-l-2 border-lemon-200">
                              <p className="text-xs font-medium text-muted-foreground mb-1">
                                You replied on {formatTimestamp(message.reply.created_at)}:
                              </p>
                              <p className="text-sm text-foreground/90 italic">
                                "{message.reply.reply_content}"
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No messages found</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="favorites" className="space-y-4 mt-0">
                  {isLoadingMessages ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-lemon-400" />
                    </div>
                  ) : filteredMessages.length > 0 ? (
                    filteredMessages.map((message) => (
                      <div key={message.id} className="bg-background p-4 rounded-lg border">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3 sm:gap-0">
                          <div className="flex items-center gap-2">
                            <Citrus className="h-4 w-4 text-lemon-400" />
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {message.date}
                            </span>
                          </div>

                          <div className="flex items-center justify-end w-full sm:w-auto gap-1">

                            {/* Reply Button Logic for Favorites tab too */}
                            {message.has_email && !message.reply && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openReplyDialog(message.id)}
                                title="Reply to sender"
                                className="text-lemon-500 hover:text-lemon-600 hover:bg-lemon-50"
                              >
                                <Reply className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                            )}
                            {message.reply && (
                              <div className="px-2" title="You replied to this message">
                                <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                              </div>
                            )}


                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleFavorite(message.id)}
                              className={message.favorite ? "text-lemon-400" : ""}
                            >
                              <Heart className="h-3 w-3 sm:h-4 sm:w-4" fill={message.favorite ? "currentColor" : "none"} />
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleArchive(message.id)}
                              title="Archive message"
                            >
                              <Archive className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Message</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this message? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deleteMessage(message.id)}>
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                        <div>
                          <p className="whitespace-pre-wrap">{message.content}</p>
                          <p className='text-xs text-muted-foreground m-0 mt-1'>- Anonymous</p>
                          {/* Display Reply if exists */}
                          {message.reply && (
                            <div className="mt-3 ml-4 pl-4 border-l-2 border-lemon-200">
                              <p className="text-xs font-medium text-muted-foreground mb-1">
                                You replied on {formatTimestamp(message.reply.created_at)}:
                              </p>
                              <p className="text-sm text-foreground/90 italic">
                                "{message.reply.reply_content}"
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No favorite messages</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="archived" className="space-y-4 mt-0">
                  {isLoadingMessages ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-lemon-400" />
                    </div>
                  ) : filteredMessages.length > 0 ? (
                    filteredMessages.map((message) => (
                      <div key={message.id} className="bg-background p-4 rounded-lg border">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <Citrus className="h-4 w-4 text-lemon-400" />
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {message.date}
                            </span>
                          </div>

                          <div className="flex m-0 items-center">
                            {/* Reply Button Logic for Archived tab too */}
                            {message.has_email && !message.reply && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openReplyDialog(message.id)}
                                title="Reply to sender"
                                className="text-lemon-500 hover:text-lemon-600 hover:bg-lemon-50"
                              >
                                <Reply className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                            )}
                            {message.reply && (
                              <div className="px-2" title="You replied to this message">
                                <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                              </div>
                            )}

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleFavorite(message.id)}
                              className={message.favorite ? "text-lemon-400" : ""}
                            >
                              <Heart className="h-3 w-3 sm:h-4 sm:w-4" fill={message.favorite ? "currentColor" : "none"} />
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleArchive(message.id)}
                              title="Archive message"
                            >
                              <ArchiveRestore className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Message</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this message? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deleteMessage(message.id)}>
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                        <div>
                          <p className="whitespace-pre-wrap">{message.content}</p>
                          <p className='text-xs text-muted-foreground m-0 mt-1'>- Anonymous</p>
                          {/* Display Reply if exists */}
                          {message.reply && (
                            <div className="mt-3 ml-4 pl-4 border-l-2 border-lemon-200">
                              <p className="text-xs font-medium text-muted-foreground mb-1">
                                You replied on {formatTimestamp(message.reply.created_at)}:
                              </p>
                              <p className="text-sm text-foreground/90 italic">
                                "{message.reply.reply_content}"
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No archived messages</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Reply Dialog Integration */}
      <ReplyDialog
        isOpen={replyDialogOpen}
        onOpenChange={setReplyDialogOpen}
        messageId={selectedMessageId}
        onReplySent={handleReplySent}
      />
    </div>
  );
};

export default Messages;
