import React, { useState, useEffect, useContext } from 'react';
import { Loader2 } from 'lucide-react';

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Citrus, Trash2, Heart, Calendar, Search, RefreshCw, Archive, ArchiveRestore, Share } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from '@/components/ui/use-toast';
import { getMessages, deleteMessage as apiDeleteMessage } from '@/auth/api';
import { AuthContext } from '@/auth/AuthProvider';

// Define the message type for better type safety
interface Message {
  id: number;
  content: string;
  date: string;
  favorite: boolean;
  archived: boolean;
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
  const { user } = useContext(AuthContext);

  const fetchMessages = async (showRefreshLoading = false) => {
    if (!user?.username) return;

    if (showRefreshLoading) {
      setIsRefreshing(true);
    }

    try {
      const data = await getMessages(user.username);

      const mappedMessages = data.map((msg: any) => ({
        id: msg.id,
        content: msg.message_content || "",
        date: formatTimestamp(msg.created_at),
        favorite: false,
        archived: false
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
    setMessages(messages.map(message =>
      message.id === id ? { ...message, favorite: !message.favorite } : message
    ));

    const message = messages.find(m => m.id === id);
    if (message) {
      toast({
        title: message.favorite ? "Removed from favorites" : "Added to favorites",
        variant: "default",
      });
    }
  };

  const toggleArchive = (id: number) => {
    setMessages(messages.map(message =>
      message.id === id ? { ...message, archived: !message.archived } : message
    ));

    const message = messages.find(m => m.id === id);
    if (message) {
      toast({
        title: message.archived ? "Restored from archive" : "Moved to archive",
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
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <Citrus className="h-4 w-4 text-lemon-400" />
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {message.date}
                            </span>
                          </div>

                          <div className="flex m-0 items-center">
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
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <Citrus className="h-4 w-4 text-lemon-400" />
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {message.date}
                            </span>
                          </div>

                          <div className="flex m-0 items-center">
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
                          <p>{message.content}</p>
                          <p className='text-xs text-muted-foreground m-0 mt-1'>- Anonymous</p>
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
    </div>
  );
};

export default Messages;
