"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

export default function About() {
  const teamRef = useRef<HTMLDivElement>(null);

  const scrollTeam = (direction: "left" | "right") => {
    if (teamRef.current) {
      teamRef.current.scrollBy({
        left: direction === "left" ? -250 : 250,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="pt-16">
      {/* Hero + Our Story Combined Section */}
      <section className="flex flex-col lg:flex-row h-auto lg:h-[400px] bg-muted">
        {/* Image Section */}
        <div className="relative w-full lg:w-1/2 h-[250px] lg:h-auto overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/60 z-10" />
          <Image
            src="/banner.png"
            alt="About Us"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg text-center px-4">
              About Us
            </h1>
          </div>
        </div>

        {/* Text Section */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
          <div className="max-w-xl text-center lg:text-left">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Story</h2>
            <p className="text-muted-foreground text-lg mb-4">
              We started as a small group of marketers, developers, and
              entrepreneurs with a shared passion for building successful online
              businesses.
            </p>
            <p className="text-muted-foreground text-lg">
              Now, we’re a growing media brand offering insights and tools that
              help e-commerce brands scale smart — driven by data, fueled by
              creativity, and obsessed with impact.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-10">
            What Our Clients Say
          </h2>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            {[
              {
                name: "Alex R.",
                quote:
                  "This site helped me double my store’s revenue in just 3 months. The articles are pure gold.",
              },
              {
                name: "Maya L.",
                quote:
                  "Love the practical tips and case studies. It's like having an e-commerce mentor on demand.",
              },
              {
                name: "Dev S.",
                quote:
                  "Beautiful design, useful content, and always up-to-date. Highly recommended.",
              },
            ].map(({ name, quote }, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                <p className="italic text-muted-foreground mb-4">“{quote}”</p>
                <h4 className="font-semibold text-sm text-muted-foreground">
                  — {name}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section with Horizontal Scroll on Mobile */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-10">Meet the Team</h2>

          <div className="relative">
            {/* Horizontal scrollable team list */}
            <div
              ref={teamRef}
              className="flex gap-6 overflow-x-auto sm:grid sm:grid-cols-2 md:grid-cols-4 sm:overflow-x-visible scroll-smooth snap-x snap-mandatory pb-4"
            >
              {[
                { name: "Jane Doe", role: "Editor-in-Chief", img: "" },
                { name: "Mark L.", role: "Head of Strategy", img: "" },
                { name: "Sara Patel", role: "Lead Developer", img: "" },
                { name: "Leo Thompson", role: "Growth Specialist", img: "" },
              ].map((member, i) => {
                const initials = member.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase();

                return (
                  <div
                    key={i}
                    className="min-w-[200px] sm:min-w-0 flex-shrink-0 snap-center text-center bg-background p-4 rounded-lg shadow-sm"
                  >
                    {member.img ? (
                      <Image
                        src={member.img}
                        alt={initials}
                        width={120}
                        height={120}
                        className="rounded-full mx-auto mb-4 object-cover"
                      />
                    ) : (
                      <div className="w-[120px] h-[120px] mx-auto mb-4 flex items-center justify-center rounded-full bg-muted text-xl font-semibold text-primary border">
                        {initials}
                      </div>
                    )}
                    <h4 className="font-semibold">{member.name}</h4>
                    <p className="text-muted-foreground text-sm">
                      {member.role}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Optional Scroll Arrows */}
            <button
              onClick={() => scrollTeam("left")}
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 bg-background border rounded-full p-2 shadow hover:bg-muted z-10"
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scrollTeam("right")}
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 bg-background border rounded-full p-2 shadow hover:bg-muted z-10"
              aria-label="Scroll right"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
