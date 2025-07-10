"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("Message sent successfully!");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("Failed to send message.");
      }
    } catch (error) {
      console.error("Error:", error);
      setStatus("An error occurred.");
    }
  };

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
                <p className="text-muted-foreground">+254 111-524-408</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-1">Team Inquiries</h4>
                <p className="text-muted-foreground">team@moderntrademarket.com</p>
                <p className="text-muted-foreground">+254 727-980-000</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-1">Office Address</h4>
                <p className="text-muted-foreground">
                  Rosters, Nairobi
                </p>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="container mx-auto px-4 md:px-6 max-w-2xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="name">Name</label>
                  <input
                    className="w-full border border-input rounded-md px-4 py-2"
                    id="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
                  <input
                    className="w-full border border-input rounded-md px-4 py-2"
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="message">Message</label>
                  <textarea
                    className="w-full border border-input rounded-md px-4 py-2 h-32 resize-none"
                    id="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                <Button type="submit" className="w-full">Send Message</Button>
                <p className="text-sm text-muted-foreground mt-2">{status}</p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
