"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { 
  Home, 
  Users, 
  MapPin, 
  Star,
  DollarSign,
  Award,
} from "lucide-react";

const stats = [
  {
    icon: Home,
    value: 500,
    suffix: "+",
    label: "Premium Properties",
    description: "Handpicked luxury homes worldwide",
  },
  {
    icon: Users,
    value: 50,
    suffix: "+",
    label: "Expert Agents",
    description: "Professional real estate specialists",
  },
  {
    icon: MapPin,
    value: 25,
    suffix: "+",
    label: "Cities Covered",
    description: "Major metropolitan areas globally",
  },
  {
    icon: Star,
    value: 98,
    suffix: "%",
    label: "Client Satisfaction",
    description: "Happy homeowners and investors",
  },
  {
    icon: DollarSign,
    value: 2.5,
    suffix: "B+",
    label: "Properties Value",
    description: "Total worth of listed properties",
  },
  {
    icon: Award,
    value: 15,
    suffix: "+",
    label: "Industry Awards",
    description: "Recognition for excellence",
  },
];

function AnimatedCounter({ value, suffix = "", duration = 2000 }: { 
  value: number; 
  suffix?: string; 
  duration?: number; 
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView && count === 0) {
      let startTime: number;
      let animationFrame: number;

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentCount = Math.floor(easeOutQuart * value);
        
        setCount(currentCount);
        
        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        }
      };

      animationFrame = requestAnimationFrame(animate);

      return () => {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
        }
      };
    }
  }, [isInView, value, duration, count]);

  return (
    <div ref={ref}>
      {count}{suffix}
    </div>
  );
}

export function Statistics() {
  return (
    <section className="py-20 bg-linear-to-b from-muted/20 to-background">
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
            Our <span className="text-luxury-gold">Achievements</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Numbers that reflect our commitment to excellence and the trust 
            our clients place in us every day.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <div className="glass-card p-8">
                {/* Icon */}
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-luxury-gold/10 flex items-center justify-center">
                  <stat.icon className="h-8 w-8 text-luxury-gold" />
                </div>
                
                {/* Animated Value */}
                <div className="text-4xl md:text-5xl font-bold text-luxury-gold mb-2">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                
                {/* Label */}
                <h3 className="text-xl font-semibold mb-2">{stat.label}</h3>
                
                {/* Description */}
                <p className="text-muted-foreground text-sm">
                  {stat.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Growth Chart Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="glass-strong rounded-2xl p-8"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold mb-4">
              Year Over Year <span className="text-luxury-gold">Growth</span>
            </h3>
            <p className="text-muted-foreground">
              Consistent growth reflecting market confidence and service excellence
            </p>
          </div>
          
          {/* Simple Bar Chart Visualization */}
          <div className="flex items-end justify-center gap-4 h-40">
            {[65, 75, 85, 90, 95, 100].map((height, index) => (
              <motion.div
                key={index}
                initial={{ height: 0 }}
                whileInView={{ height: `${height}%` }}
                transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                viewport={{ once: true }}
                className="w-12 bg-linear-to-t from-luxury-gold to-luxury-gold/60 rounded-t-lg"
              />
            ))}
          </div>
          
          <div className="flex justify-center gap-4 mt-4 text-xs text-muted-foreground">
            {['2019', '2020', '2021', '2022', '2023', '2024'].map((year) => (
              <span key={year} className="w-12 text-center">{year}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
