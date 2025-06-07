"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";

declare global {
  interface Window {
    google: any;
  }
}

export function GoogleAuthButton() {
  const { googleAuth, loading } = useAuth();

  useEffect(() => {
    // Load Google SDK
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleGoogleSignIn = async (response: any) => {
    try {
      await googleAuth(response.credential);
    } catch (error) {
      console.error('Google sign-in error:', error);
    }
  };

  useEffect(() => {
    // Initialize Google button when SDK is loaded
    const initializeGoogleButton = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: process.env.GOOGLE_CLIENT_ID,
          callback: handleGoogleSignIn
        });

        window.google.accounts.id.renderButton(
          document.getElementById('googleSignInButton'),
          { 
            type: 'standard',
            theme: 'outline',
            size: 'large',
            text: 'continue_with',
            shape: 'rectangular',
            logo_alignment: 'left'
          }
        );
      }
    };

    const timer = setInterval(() => {
      if (window.google) {
        initializeGoogleButton();
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <div id="googleSignInButton" className="w-full"></div>
  );
}