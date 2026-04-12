"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    id: 1,
    name: "Alexandra Chen",
    role: "Tech Executive",
    location: "San Francisco, CA",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c1ca?q=80&w=200&auto=format&fit=crop",
    content: "LuxeLiving made finding our dream home effortless. Their agents understood exactly what we wanted and found us the perfect penthouse with stunning views. The entire process was smooth and professional.",
    rating: 5,
    property: "Luxury Penthouse",
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    role: "Investment Banker",
    location: "New York, NY",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    content: "As a real estate investor, I've worked with many agencies, but LuxeLiving stands out. Their market insights and exclusive access to premium properties helped me build an impressive portfolio.",
    rating: 5,
    property: "Manhattan Townhouse",
  },
  {
    id: 3,
    name: "Sophia Williams",
    role: "Fashion Designer",
    location: "Los Angeles, CA",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
    content: "The virtual tour feature was incredible! I was able to view multiple properties from my studio in Paris. When I finally visited in person, the property exceeded all expectations.",
    rating: 5,
    property: "Beverly Hills Villa",
  },
  {
    id: 4,
    name: "David Thompson",
    role: "Entrepreneur",
    location: "Miami, FL",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
    content: "Outstanding service from start to finish. The team's attention to detail and commitment to finding the perfect property for my family was remarkable. Highly recommend!",
    rating: 5,
    property: "Oceanfront Estate",
  },
  {
    id: 5,
    name: "Isabella Martinez",
    role: "Art Collector",
    location: "Dubai, UAE",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
    content: "LuxeLiving understands luxury real estate like no other. They found me a property that not only meets my needs but also provides the perfect space for my art collection.",
    rating: 5,
    property: "Dubai Marina Penthouse",
  },
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const visibleTestimonials = [
    testimonials[currentIndex],
    testimonials[(currentIndex + 1) % testimonials.length],
    testimonials[(currentIndex + 2) % testimonials.length],
  ];

  return (
    <section className="py-20 bg-linear-to-b from-background to-muted/20">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Client <span className="text-luxury-gold">Testimonials</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hear from our satisfied clients who found their perfect properties 
            through LuxeLiving&apos;s exceptional service.
          </p>
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-background/80 backdrop-blur-sm border-white/20"
            onClick={prevTestimonial}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-background/80 backdrop-blur-sm border-white/20"
            onClick={nextTestimonial}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {visibleTestimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, x: index === 1 ? 0 : index === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-card p-6"
              >
                {/* Quote Icon */}
                <Quote className="h-8 w-8 text-luxury-gold mb-4" />
                
                {/* Content */}
                <p className="text-muted-foreground leading-relaxed">
                  {testimonial.content}
                </p>
                
                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-luxury-gold text-luxury-gold" />
                  ))}
                </div>
                
                {/* Property */}
                <div className="text-sm text-luxury-gold font-medium mb-4">
                  {testimonial.property}
                </div>
                
                {/* Author */}
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback className="bg-luxury-gold text-luxury-slate">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.location}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-luxury-gold w-8' 
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>

        {/* Overall Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="glass-strong rounded-2xl p-8 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold text-luxury-gold mb-2">4.9/5</div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
                <div className="flex justify-center gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-luxury-gold text-luxury-gold" />
                  ))}
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-luxury-gold mb-2">2,500+</div>
                <div className="text-sm text-muted-foreground">Happy Clients</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-luxury-gold mb-2">98%</div>
                <div className="text-sm text-muted-foreground">Would Recommend</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
