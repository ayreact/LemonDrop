import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Citrus, Shield, Eye, AlertTriangle, MessageSquare } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const About = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 lemon-gradient">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-block bg-white p-3 rounded-full mb-6">
                <Citrus className="h-10 w-10 text-lemon-400" />
              </div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">
                About LemonDrop
              </h1>
              <p className="text-muted-foreground md:text-xl">
                Learn about our mission to create a safe space for honest communication and feedback.
              </p>
            </div>
          </div>
        </section>
        
        {/* Story Section */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter mb-4">Our Story</h2>
                <p className="text-muted-foreground mb-4">
                  LemonDrop was created with a simple mission: to provide a platform where people can give and receive honest feedback in a safe, anonymous environment.
                </p>
                <p className="text-muted-foreground mb-4">
                  We believe that anonymity, when used responsibly, can foster genuine communication that might otherwise never happen. Sometimes the things we most need to hear are the hardest for others to say.
                </p>
                <p className="text-muted-foreground">
                  Founded in 2025, our team is dedicated to building features that encourage positive interactions while maintaining user privacy and security.
                </p>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-lemon-200 rounded-2xl transform -rotate-3"></div>
                <img 
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                  alt="Team collaboration" 
                  className="relative rounded-2xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Values Section */}
        <section className="py-16 md:py-24 bg-secondary">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter mb-4">Our Values</h2>
              <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto">
                These core principles guide everything we do at LemonDrop.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="bg-background p-6 rounded-lg border text-center">
                <div className="bg-lemon-200 p-3 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-lemon-500" />
                </div>
                <h3 className="text-xl font-medium mb-2">Privacy</h3>
                <p className="text-muted-foreground">
                  We prioritize user privacy and data protection in everything we build.
                </p>
              </div>
              
              <div className="bg-background p-6 rounded-lg border text-center">
                <div className="bg-lemon-200 p-3 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
                  <Eye className="h-6 w-6 text-lemon-500" />
                </div>
                <h3 className="text-xl font-medium mb-2">Transparency</h3>
                <p className="text-muted-foreground">
                  We're clear about how our platform works and how your data is used.
                </p>
              </div>
              
              <div className="bg-background p-6 rounded-lg border text-center">
                <div className="bg-lemon-200 p-3 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="h-6 w-6 text-lemon-500" />
                </div>
                <h3 className="text-xl font-medium mb-2">Safety</h3>
                <p className="text-muted-foreground">
                  We work to prevent misuse and provide tools to report inappropriate content.
                </p>
              </div>
              
              <div className="bg-background p-6 rounded-lg border text-center">
                <div className="bg-lemon-200 p-3 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-6 w-6 text-lemon-500" />
                </div>
                <h3 className="text-xl font-medium mb-2">Connection</h3>
                <p className="text-muted-foreground">
                  We believe in fostering meaningful interactions and honest communication.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter mb-4">Frequently Asked Questions</h2>
              <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto">
                Find answers to common questions about LemonDrop.
              </p>
            </div>
            
            <div className="grid gap-6 max-w-3xl mx-auto">
              <div className="bg-card rounded-lg border shadow-sm p-6">
                <h3 className="text-xl font-medium mb-2">Is LemonDrop really anonymous?</h3>
                <p className="text-muted-foreground">
                  Yes! Message senders remain completely anonymous. Recipients can never see who sent a message, and we don't track or store that information.
                </p>
              </div>
              
              <div className="bg-card rounded-lg border shadow-sm p-6">
                <h3 className="text-xl font-medium mb-2">Can I delete messages I receive?</h3>
                <p className="text-muted-foreground">
                  Absolutely. You have full control over your inbox and can delete any message at any time.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-secondary">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tighter">Join LemonDrop Today</h2>
              <p className="text-muted-foreground md:text-lg">
                Ready to experience anonymous messaging in a safe, positive environment? Create your account and start receiving messages now.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Link to="/signup">
                  <Button size="lg" className="bg-lemon-400 hover:bg-lemon-500 text-white">
                    Sign Up Free
                  </Button>
                </Link>
                <Link to="/">
                  <Button size="lg" variant="outline">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
