"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Check } from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubscribed(true);
      setEmail("");
    }, 1500);
  };

  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <Mail className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-3xl font-bold tracking-tight mb-3">
            Stay Updated with Our Newsletter
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8">
            Get the latest e-commerce insights, trends, and exclusive content delivered directly to your inbox.
          </p>
          
          {isSubscribed ? (
            <div className="flex items-center justify-center space-x-2 text-xl animate-in fade-in slide-in-from-bottom-5 duration-500">
              <Check className="h-6 w-6" />
              <span>Thank you for subscribing!</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 h-12"
                  />
                  {error && (
                    <p className="text-sm text-red-300 mt-1 text-left">
                      {error}
                    </p>
                  )}
                </div>
                <Button 
                  type="submit" 
                  size="lg" 
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 h-12"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Subscribing..." : "Subscribe"}
                </Button>
              </div>
            </form>
          )}
          
          <p className="text-xs text-primary-foreground/60 mt-4">
            By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
          </p>
        </div>
      </div>
    </section>
  );
}