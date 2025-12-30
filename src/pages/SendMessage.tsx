import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Citrus, Send, EyeOff, Mail } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from '@/components/ui/use-toast';
import { Link } from "react-router-dom";
import { sendMessage } from "@/auth/api";

const SendMessage = () => {
  const { username } = useParams();
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      toast({
        title: "Empty message",
        description: "Please write a message before sending",
        variant: "destructive",
      });
      return;
    }

    if (!username) {
      toast({
        title: "Error",
        description: "User not specified",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);

    try {
      await sendMessage(username, message, email || undefined);
      setIsSending(false);
      setIsSent(true);
      setMessage('');
      setEmail('');

      toast({
        title: "Message sent!",
        description: "Your anonymous message has been delivered successfully",
        variant: "default",
      });
    } catch (error) {
      setIsSending(false);
      console.error("Failed to send message", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto w-full max-w-md px-4 sm:px-0">
          {!isSent ? (
            <>
              <div className="text-center mb-6 sm:mb-8">
                <div className="inline-block bg-lemon-200 p-3 rounded-full mb-4">
                  <Citrus className="h-6 w-6 sm:h-8 sm:w-8 text-lemon-500" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold">Send a Message</h1>
                <p className="text-muted-foreground mt-2">
                  Send an anonymous message to <span className="font-medium">{username || "user"}</span>
                </p>
              </div>

              <div className="bg-card rounded-lg border shadow-sm p-4 sm:p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Your Email (Optional)</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="name@example.com"
                        className="pl-9 bg-background"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1 ml-1">
                      Only provide if you want to receive a reply.
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Message</label>
                    <Textarea
                      placeholder="Type your anonymous message here..."
                      className="min-h-[150px] resize-none"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      maxLength={500}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <div className="flex items-center gap-1">
                        <EyeOff className="h-3 w-3" />
                        <span>100% Anonymous</span>
                      </div>
                      <span>{message.length}/500</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-lemon-400 hover:bg-lemon-500 text-white"
                    disabled={isSending}
                  >
                    {isSending ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        Send Message
                      </span>
                    )}
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="bg-lemon-200 p-6 rounded-full mx-auto w-24 h-24 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-lemon-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold">Message Sent!</h1>
              <p className="text-muted-foreground mt-2 mb-6">
                Your anonymous message has been delivered successfully.
              </p>
              <div className='flex flex-col sm:flex-row items-center gap-3 justify-center w-full'>
                <Button
                  onClick={() => setIsSent(false)}
                  className="w-full sm:w-auto bg-lemon-400 hover:bg-lemon-500 text-white"
                >
                  Send Another Message
                </Button>
                <Link to="/signup" className="w-full sm:w-auto">
                  <Button variant="outline" className='w-full hover:text-white hover:bg-lemon-500'>
                    Get Your Own Link
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SendMessage;
