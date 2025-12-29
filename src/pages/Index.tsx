
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Citrus, Copy, CheckCheck, MessageSquare, Shield, Users } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from '@/components/ui/use-toast';
import { AuthContext } from '@/auth/AuthProvider';

const Index = () => {
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const { user } = useContext(AuthContext) || {};
  const navigate = useNavigate();

  const generateLink = () => {
    if (user && user.username) {
      const link = `${window.location.origin}/send/${user.username}`;
      setGeneratedLink(link);

      toast({
        title: "Link Generated!",
        description: "Share this link with friends to receive anonymous messages.",
        variant: "default",
      });
    } else {
      toast({
        title: "Authentication Required",
        description: "Please login or signup to generate your unique link.",
        variant: "destructive",
      });
      navigate('/signup');
    }
  };

  const copyToClipboard = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      setIsCopied(true);

      toast({
        title: "Link Copied!",
        description: "The link has been copied to your clipboard.",
        variant: "default",
      });

      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 lemon-gradient">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">
                  Get Anonymous <span className="text-lemon-500">Messages</span> From Anyone
                </h1>
                <p className="text-muted-foreground md:text-xl">
                  Create your personalized link, share it with friends, and receive honest feedback anonymously.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    size="lg"
                    onClick={generateLink}
                    className="bg-lemon-500 hover:bg-lemon-500 text-white"
                  >
                    {generatedLink ? "Regenerate Link" : "Generate Your Link"}
                  </Button>
                  {!user && (
                    <Link to="/signup">
                      <Button size="lg" variant="outline" className='hover:text-white hover:bg-lemon-500'>
                        Create Account
                      </Button>
                    </Link>
                  )}
                  {user && (
                    <Link to="/messages">
                      <Button size="lg" variant="outline" className='hover:text-white hover:bg-lemon-500'>
                        View Messages
                      </Button>
                    </Link>
                  )}
                </div>

                {generatedLink && (
                  <div className="mt-6 p-4 bg-white rounded-lg border flex items-center justify-between shadow-sm">
                    <span className="text-sm truncate">{generatedLink}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={copyToClipboard}
                      className="ml-2"
                    >
                      {isCopied ? <CheckCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex justify-center">
                <div className="relative w-full max-w-md">
                  <div className="absolute inset-0 bg-lemon-200 rounded-2xl transform rotate-3 animate-pulse-light"></div>
                  <div className="relative bg-white p-6 rounded-2xl shadow-lg lemon-shadow border">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Citrus className="h-5 w-5 text-lemon-400" />
                        <p className="font-medium">Anonymous Message</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm">Hey! Just wanted to say I really admire your creativity. Your recent project was amazing!</p>
                        <p className="text-xs text-right text-muted-foreground">2 hours ago</p>
                      </div>
                      <div className="pt-2 space-y-2">
                        <p className="text-sm">I've always been too shy to tell you this in person, but you're a great friend and I appreciate you!</p>
                        <p className="text-xs text-right text-muted-foreground">Yesterday</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter">How It Works</h2>
              <p className="text-muted-foreground md:text-lg mt-4 max-w-md mx-auto">
                LemonDrop makes anonymous messaging simple and fun for everyone.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center p-6 bg-secondary rounded-lg">
                <div className="bg-lemon-300 p-3 rounded-full mb-4">
                  <Users className="h-6 w-6 text-lemon-500" />
                </div>
                <h3 className="text-xl font-medium mb-2">Create Your Account</h3>
                <p className="text-muted-foreground">Sign up to create your personal profile and customize your message box.</p>
              </div>

              <div className="flex flex-col items-center text-center p-6 bg-secondary rounded-lg">
                <div className="bg-lemon-300 p-3 rounded-full mb-4">
                  <MessageSquare className="h-6 w-6 text-lemon-500" />
                </div>
                <h3 className="text-xl font-medium mb-2">Share Your Link</h3>
                <p className="text-muted-foreground">Share your unique link on social media or with friends directly.</p>
              </div>

              <div className="flex flex-col items-center text-center p-6 bg-secondary rounded-lg">
                <div className="bg-lemon-300 p-3 rounded-full mb-4">
                  <Shield className="h-6 w-6 text-lemon-500" />
                </div>
                <h3 className="text-xl font-medium mb-2">Receive Messages</h3>
                <p className="text-muted-foreground">Get anonymous feedback and messages in your inbox securely.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 md:py-24 bg-secondary">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter">What People Say</h2>
              <p className="text-muted-foreground md:text-lg mt-4 max-w-md mx-auto">
                Don't just take our word for it - here's what our users have to say.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-background p-6 rounded-lg border shadow-sm">
                <p className="text-muted-foreground mb-4">"I've received such uplifting anonymous messages from my friends. It's a great way to hear honest opinions."</p>
                <p className="font-medium">- Sarah K.</p>
              </div>

              <div className="bg-background p-6 rounded-lg border shadow-sm">
                <p className="text-muted-foreground mb-4">"I love the clean interface and how easy it is to share my link with friends. The messages I get are always interesting!"</p>
                <p className="font-medium">- Miguel R.</p>
              </div>

              <div className="bg-background p-6 rounded-lg border shadow-sm">
                <p className="text-muted-foreground mb-4">"As someone who's shy about giving compliments, this platform lets me express appreciation anonymously."</p>
                <p className="font-medium">- Jamie T.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter">Ready to Get Started?</h2>
              <p className="text-muted-foreground md:text-lg max-w-md">
                Create your account today and start receiving anonymous messages from your friends.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Button
                  size="lg"
                  className="bg-lemon-500 hover:bg-lemon-500 text-white"
                  onClick={generateLink}
                >
                  {generatedLink ? "Regenerate Link" : "Generate Your Link"}
                </Button>
                {!user && (
                  <Link to="/signup">
                    <Button size="lg" variant="outline">
                      Create Account
                    </Button>
                  </Link>
                )}
                {user && (
                  <Link to="/messages">
                    <Button size="lg" variant="outline" className='hover:text-white hover:bg-lemon-500'>
                      View Messages
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
