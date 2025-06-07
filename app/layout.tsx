import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/hooks/use-auth';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'E-Commerce Blog | Share Insights and Boost Sales',
  description: 'Discover the latest trends, tips, and insights about our products and industry through our regularly updated blog.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ecommerce-blog.com',
    siteName: 'E-Commerce Blog',
    images: [
      {
        url: 'https://ecommerce-blog.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'E-Commerce Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'E-Commerce Blog | Share Insights and Boost Sales',
    description: 'Discover the latest trends, tips, and insights about our products and industry through our regularly updated blog.',
    creator: '@ecommerceblog',
    images: ['https://ecommerce-blog.com/twitter-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
            <SonnerToaster position="top-right" />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}