import { Button } from "@/components/ui/button";

export default function Contact() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="bg-muted h-[300px] flex items-center justify-center text-center px-4">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Get In Touch</h1>
          <p className="text-muted-foreground text-lg">
            We’d love to hear from you! Whether you have a question, feedback,
            or just want to say hi, drop us a message below.
          </p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Left: Contact Info */}
            <div className="lg:w-1/2 space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Get in Touch
              </h2>
              <div>
                <h4 className="text-lg font-semibold mb-1">Support</h4>
                <p className="text-muted-foreground">support@moderntrademarket.com</p>
                <p className="text-muted-foreground">+253 727-980-000</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-1">Team Inquiries</h4>
                <p className="text-muted-foreground">team@moderntrademarket.com</p>
                <p className="text-muted-foreground">+253 727-980-000</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-1">Office Address</h4>
                <p className="text-muted-foreground">
                  Spring Valley
                  <br />
                  Westlands Nairobi, Kenya
                </p>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="container mx-auto px-4 md:px-6 max-w-2xl">
              <form className="space-y-6">
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="name"
                  >
                    Name
                  </label>
                  <input
                    className="w-full border border-input rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    id="name"
                    type="text"
                    required
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    className="w-full border border-input rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    id="email"
                    type="email"
                    required
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="message"
                  >
                    Message
                  </label>
                  <textarea
                    className="w-full border border-input rounded-md px-4 py-2 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    id="message"
                    required
                  ></textarea>
                </div>
                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
