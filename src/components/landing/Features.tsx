"use client";

import { motion } from "framer-motion";
import { 
  Shield, 
  Home, 
  Users, 
  Clock, 
  MapPin, 
  Star,
  TrendingUp,
  Heart
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Verified Properties",
    description: "All properties are thoroughly verified and inspected to ensure quality and authenticity.",
  },
  {
    icon: Home,
    title: "Virtual Tours",
    description: "Experience properties through immersive 3D virtual tours from the comfort of your home.",
  },
  {
    icon: Users,
    title: "Expert Agents",
    description: "Work with experienced real estate professionals who understand the luxury market.",
  },
  {
    icon: Clock,
    title: "Quick Closing",
    description: "Streamlined processes ensure fast and efficient property transactions.",
  },
  {
    icon: MapPin,
    title: "Prime Locations",
    description: "Access exclusive properties in the most desirable neighborhoods worldwide.",
  },
  {
    icon: Star,
    title: "Premium Service",
    description: "Receive white-glove service throughout your entire property journey.",
  },
  {
    icon: TrendingUp,
    title: "Market Insights",
    description: "Get detailed market analysis and investment potential for each property.",
  },
  {
    icon: Heart,
    title: "Personalized Matching",
    description: "Our AI-powered system matches you with properties that fit your exact preferences.",
  },
];

export function Features() {
  return (
    <section className="py-20 bg-background">
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
            Why Choose <span className="text-luxury-gold">LuxeLiving</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We combine cutting-edge technology with personalized service to deliver 
            an unparalleled real estate experience.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <div className="glass-card text-center p-6 h-full">
                {/* Icon */}
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-luxury-gold/10 flex items-center justify-center group-hover:bg-luxury-gold/20 transition-colors">
                  <feature.icon className="h-8 w-8 text-luxury-gold" />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-semibold mb-3 group-hover:text-luxury-gold transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
