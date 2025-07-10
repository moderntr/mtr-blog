import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Modern Trade Market</h3>
            <p className="text-muted-foreground mb-4">
              Bringing you the latest trends, insights, and industry knowledge
              to help your business grow.
            </p>
            <div className="flex space-x-4">
              <Link href="https://www.facebook.com/moderntrademarket.info?rdid=GstW7yqdpDk9ZXmn&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1867xcLini%2F#">
                <Button variant="ghost" size="icon" aria-label="Facebook">
                  <Facebook className="h-5 w-5" />
                </Button>
              </Link>

              <Link href="https://x.com/Kennedy01604415?t=bzISJQEE2GuwaLO37gEF4g&s=09">
                <Button variant="ghost" size="icon" aria-label="Twitter">
                  <Twitter className="h-5 w-5" />
                </Button>
              </Link>

              <Link href="https://www.instagram.com/modern_trade_market/?igsh=MXY3NjkxMmw1cmRsag%3D%3D#">
                {" "}
                <Button variant="ghost" size="icon" aria-label="Instagram">
                  <Instagram className="h-5 w-5" />
                </Button>
              </Link>

              {/* <Button variant="ghost" size="icon" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </Button> */}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Mobile Qrcode</h3>
            <ul className="space-y-2">
              <li>
                <img src="qrcode.jpg" alt="" width={130} height={130} />
              </li>
              <li>
                <Link rel="stylesheet" href="https://shorturl.at/tHfvv">
                  <img src="play.png" alt="" width={130} height={130} />
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/latest"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Latest Articles
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Subscribe</h3>
            <p className="text-muted-foreground mb-4">
              Stay updated with our latest articles and news.
            </p>
            <form className="space-y-2">
              <Input
                type="email"
                placeholder="Your email address"
                className="w-full"
              />
              <Button className="w-full">Subscribe</Button>
            </form>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Modern Trade Market. All rights
            reserved.
          </p>
          <div className="flex space-x-4 text-sm text-muted-foreground">
            <Link
              href="/privacy-policy"
              className="hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/cookie-policy"
              className="hover:text-foreground transition-colors"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
