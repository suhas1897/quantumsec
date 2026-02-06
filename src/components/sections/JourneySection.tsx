import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, Code, Shield, Briefcase, CheckCircle, Star, ArrowRight } from "lucide-react";
import trainImage from "@/assets/train.png";
import { ConsultationPopup } from "@/components/ConsultationPopup";
import { Button } from "@/components/ui/button";

const iconMap: { [key: string]: any } = {
  BookOpen,
  Code,
  Shield,
  Briefcase,
  CheckCircle,
  Star,
};

const defaultSteps = [
  {
    id: 1,
    icon: BookOpen,
    title: "Learn",
    subtitle: "Foundation Building",
    description: "Start with comprehensive, industry-aligned curriculum taught by certified experts. Build strong fundamentals in your chosen domain.",
    features: ["Live Expert Sessions", "Self-Paced Modules", "Industry Curriculum"],
  },
  {
    id: 2,
    icon: Code,
    title: "Practice",
    subtitle: "Hands-On Experience",
    description: "Apply your knowledge through hands-on labs, coding exercises, and real-world tools used by top companies.",
    features: ["Interactive Labs", "Real Tools", "Project Assignments"],
  },
  {
    id: 3,
    icon: Shield,
    title: "Simulate",
    subtitle: "Real-World Scenarios",
    description: "Experience real SOC simulations, data engineering sandboxes, and AI model deployments in production-like environments.",
    features: ["SOC Simulations", "Cloud Sandboxes", "Production Scenarios"],
  },
  {
    id: 4,
    icon: Briefcase,
    title: "Get Placed",
    subtitle: "Career Launch",
    description: "Receive dedicated placement support with resume building, interview prep, and direct connections to hiring partners.",
    features: ["Resume Building", "Interview Prep", "Hiring Partners"],
  },
];

export const JourneySection = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const trainY = useTransform(scrollYProgress, [0.1, 0.9], ["0%", "85%"]);

  const { data: steps = defaultSteps } = useQuery({
    queryKey: ["journey_steps"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("journey_steps")
        .select("*")
        .order("step_number", { ascending: true });
      if (error) throw error;
      return data.map((s: any) => ({
        id: s.step_number,
        icon: iconMap[s.icon_name] || BookOpen,
        title: s.title,
        subtitle: s.subtitle,
        description: s.description,
        features: s.features || [],
      }));
    },
    staleTime: 1000 * 60 * 5,
  });

  return (
    <>
    <section id="journey" className="section-padding bg-card relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid-small opacity-10" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-primary font-semibold text-sm tracking-wider uppercase">
            Your Journey
          </span>
          <h2 className="mt-4 text-3xl md:text-5xl font-display font-bold text-foreground">
            From Beginner to <span className="text-gradient-primary">Industry Expert</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            A proven 4-step methodology that transforms aspiring professionals into job-ready experts.
          </p>
          <Button
            variant="hero"
            size="lg"
            onClick={() => setIsPopupOpen(true)}
            className="mt-8 group"
          >
            Start Your Journey
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>

        {/* Timeline */}
        <div ref={containerRef} className="relative max-w-5xl mx-auto">
          {/* Progress Line (Desktop) - starts from first icon center */}
          <div className="hidden md:block absolute left-1/2 top-10 bottom-10 w-2 -translate-x-1/2">
            <div className="absolute inset-0 bg-border/50 rounded-full" />
            <motion.div
              style={{ height: lineHeight }}
              className="absolute top-0 left-0 right-0 bg-gradient-to-b from-primary via-secondary to-accent rounded-full"
            />
          </div>
          
          {/* Animated Train - goes behind the step icons */}
          <motion.div
            style={{ top: trainY }}
            className="hidden md:block absolute left-1/2 -translate-x-1/2 z-0 pointer-events-none"
          >
            <motion.div
              className="relative"
              animate={{ 
                y: [0, -3, 0],
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <img
                src={trainImage}
                alt="Journey Train"
                className="w-5 h-auto"
                style={{
                  filter: "drop-shadow(0 2px 6px rgba(0, 0, 0, 0.15))"
                }}
              />
            </motion.div>
          </motion.div>

          {/* Steps */}
          <div className="space-y-16 md:space-y-32">
            {steps.map((step, index) => (
              <StepCard key={step.id} step={step} index={index} isLast={index === steps.length - 1} />
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Consultation Popup */}
    <ConsultationPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
    </>
  );
};

const StepCard = ({
  step,
  index,
  isLast,
}: {
  step: (typeof steps)[0];
  index: number;
  isLast: boolean;
}) => {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className={`relative flex flex-col md:flex-row items-center gap-8 ${
        isEven ? "md:flex-row" : "md:flex-row-reverse"
      }`}
    >
      {/* Content */}
      <div className={`flex-1 ${isEven ? "md:text-right" : "md:text-left"}`}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-8 rounded-2xl bg-background border border-border/50 hover:border-primary/30 transition-all duration-300"
        >
          {/* Step Number */}
          <div className={`flex items-center gap-3 mb-4 ${isEven ? "md:justify-end" : ""}`}>
            <span className="text-5xl font-display font-bold text-gradient-primary opacity-50">
              0{step.id}
            </span>
          </div>

          {/* Title & Subtitle */}
          <h3 className="text-2xl font-display font-bold mb-1">{step.title}</h3>
          <p className="text-primary font-medium mb-3">{step.subtitle}</p>

          {/* Description */}
          <p className="text-muted-foreground mb-4 leading-relaxed">
            {step.description}
          </p>

          {/* Features */}
          <div className={`flex flex-wrap gap-3 ${isEven ? "md:justify-end" : ""}`}>
            {step.features.map((feature) => (
              <span
                key={feature}
                className="inline-flex items-center gap-1 text-sm text-primary"
              >
                <CheckCircle className="w-4 h-4" />
                {feature}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Center Icon */}
      <div className="relative z-10 flex-shrink-0">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-xl shadow-primary/30"
        >
          <step.icon className="w-10 h-10 text-primary-foreground" />
        </motion.div>
        
        {/* Pulse Ring */}
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-2xl bg-primary/20"
        />
      </div>

      {/* Spacer for alternating layout */}
      <div className="flex-1 hidden md:block" />
    </motion.div>
  );
};
