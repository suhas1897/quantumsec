import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  BookOpen,
  Users,
  Shield,
  Database,
  Briefcase,
  Laptop,
  Award,
  HeadphonesIcon,
  Cog,
  Target,
  Star,
  Zap,
} from "lucide-react";

const iconMap: { [key: string]: any } = {
  BookOpen, Users, Shield, Database, Briefcase, Laptop, Award, HeadphonesIcon, Cog, Target, Star, Zap,
};

const defaultFeatures = [
  {
    icon: BookOpen,
    title: "Industry-Aligned Curriculum",
    description: "Curriculum crafted by experts and aligned with current industry standards and demands.",
  },
  {
    icon: Laptop,
    title: "Hands-On Learning",
    description: "Project-based learning with real tools used by top tech companies.",
  },
  {
    icon: Users,
    title: "Expert Mentorship",
    description: "Get guidance from recruiters and hiring managers from leading companies.",
  },
  {
    icon: Shield,
    title: "Real SOC Simulations",
    description: "Experience real-time Security Operations Center simulations.",
  },
  {
    icon: Database,
    title: "Data Engineering Sandbox",
    description: "Work with Spark, Redshift, AWS, and enterprise-grade data tools.",
  },
  {
    icon: Target,
    title: "Real-World Projects",
    description: "Build portfolio-worthy projects based on actual industry use cases.",
  },
  {
    icon: Award,
    title: "Certified Trainers",
    description: "Learn from certified professionals with years of industry experience.",
  },
  {
    icon: HeadphonesIcon,
    title: "360° Career Support",
    description: "Complete tech and career support throughout your journey.",
  },
  {
    icon: Cog,
    title: "End-to-End Services",
    description: "From audits to automation, we provide comprehensive solutions.",
  },
  {
    icon: Briefcase,
    title: "Job-Oriented Training",
    description: "Training designed specifically to get you hired in your dream role.",
  },
];

export const WhyUsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [isDragging, setIsDragging] = useState(false);

  const { data: features = defaultFeatures } = useQuery({
    queryKey: ["features"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("features")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data.map((f: any) => ({
        icon: iconMap[f.icon_name] || Star,
        title: f.title,
        description: f.description,
      }));
    },
    staleTime: 1000 * 60 * 5,
  });
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section id="why-us" className="section-padding bg-card relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-small opacity-30" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm tracking-wider uppercase">
            Why Choose Us
          </span>
          <h2 className="mt-4 text-3xl md:text-5xl font-display font-bold">
            What Makes <span className="text-gradient-primary">QuantumSec Labs</span> Different
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            We don't just teach technology—we shape innovators, defenders, and data visionaries.
          </p>
        </motion.div>

        {/* Horizontal Scrolling Cards (Desktop) */}
        <div ref={containerRef} className="relative">
          {/* Desktop Scroll Container */}
          <div className="hidden lg:block relative">
            <div 
              ref={scrollContainerRef}
              className="overflow-x-auto pb-6 cursor-grab active:cursor-grabbing scrollbar-hide"
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
            >
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={isInView ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: 0.8 }}
                className="flex gap-6 px-4 w-max"
              >
                {features.map((feature, index) => (
                  <FeatureCard key={index} feature={feature} index={index} />
                ))}
              </motion.div>
            </div>
            {/* Scroll fade indicators */}
            <div className="absolute left-0 top-0 bottom-6 w-20 bg-gradient-to-r from-card to-transparent pointer-events-none z-10" />
            <div className="absolute right-0 top-0 bottom-6 w-20 bg-gradient-to-l from-card to-transparent pointer-events-none z-10" />
          </div>

          {/* Mobile/Tablet Grid */}
          <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </div>

        {/* Scroll Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="hidden lg:flex items-center justify-center gap-2 mt-6 text-muted-foreground"
        >
          <motion.div
            animate={{ x: [-10, 0, -10] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ←
          </motion.div>
          <span className="text-sm">Drag or scroll to explore</span>
          <motion.div
            animate={{ x: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            →
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const FeatureCard = ({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group relative w-[300px] lg:w-[320px] p-6 rounded-2xl bg-background border border-border/50 hover:border-primary/50 transition-all duration-300"
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Icon */}
      <motion.div
        whileHover={{ rotate: 5, scale: 1.1 }}
        className="relative w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors"
      >
        <feature.icon className="w-7 h-7 text-primary" />
      </motion.div>

      {/* Content */}
      <h3 className="text-lg font-display font-semibold mb-2 group-hover:text-primary transition-colors">
        {feature.title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {feature.description}
      </p>
    </motion.div>
  );
};
