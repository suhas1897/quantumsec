import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Shield, 
  Database, 
  Brain, 
  Sparkles, 
  Clock, 
  Users, 
  ArrowRight,
  ChevronLeft,
  ChevronRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";

type CourseCategory = "all" | "cybersecurity" | "data" | "ai" | "genai";

const categories = [
  { id: "all" as CourseCategory, label: "All Programs", icon: Sparkles },
  { id: "cybersecurity" as CourseCategory, label: "Cybersecurity", icon: Shield },
  { id: "data" as CourseCategory, label: "Data Engineering", icon: Database },
  { id: "ai" as CourseCategory, label: "AI & ML", icon: Brain },
  { id: "genai" as CourseCategory, label: "Generative AI", icon: Sparkles },
];

const defaultCourses = [
  {
    id: 1,
    category: "cybersecurity",
    title: "Certified SOC Analyst",
    description: "Master Security Operations Center skills with real-time threat monitoring and incident response.",
    duration: "12 weeks",
    level: "Intermediate",
    tools: ["Splunk", "SIEM", "Wireshark", "Python"],
    outcomes: ["SOC Analyst", "Security Engineer", "Threat Hunter"],
    color: "from-primary to-secondary",
  },
];

export const CoursesSection = () => {
  const [activeCategory, setActiveCategory] = useState<CourseCategory>("all");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: courses = defaultCourses } = useQuery({
    queryKey: ["programs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("programs")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data.map((p: any) => ({
        id: p.id,
        category: p.category || "cybersecurity",
        title: p.title,
        description: p.description,
        duration: p.duration,
        level: p.level,
        tools: p.tools || [],
        outcomes: p.outcomes || [],
        color: "from-primary to-secondary",
      }));
    },
    staleTime: 1000 * 60 * 5,
  });

  const filteredCourses = activeCategory === "all" 
    ? courses 
    : courses.filter(c => c.category === activeCategory);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="courses" className="section-padding bg-background relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-mesh-gradient" />
      
      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-primary font-semibold text-sm tracking-wider uppercase">
            Our Programs
          </span>
          <h2 className="mt-4 text-3xl md:text-5xl font-display font-bold">
            Industry-Leading <span className="text-gradient-primary">Courses</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Choose from our comprehensive programs designed to transform you into an industry-ready professional.
          </p>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 ${
                activeCategory === category.id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
              }`}
            >
              <category.icon className="w-4 h-4" />
              {category.label}
            </button>
          ))}
        </motion.div>

        {/* Courses Carousel */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 hidden lg:flex items-center justify-center w-12 h-12 rounded-full bg-card border border-border hover:bg-muted hover:border-primary/50 transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 hidden lg:flex items-center justify-center w-12 h-12 rounded-full bg-card border border-border hover:bg-muted hover:border-primary/50 transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Scroll Container - Desktop horizontal, Mobile vertical */}
          <div
            ref={scrollRef}
            className="flex flex-col md:flex-row gap-6 md:overflow-x-auto scrollbar-hide md:snap-x md:snap-mandatory pb-4 md:px-4 md:-mx-4"
          >
            <AnimatePresence mode="popLayout">
              {filteredCourses.map((course, index) => (
                <CourseCard key={course.id} course={course} index={index} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

const CourseCard = ({
  course,
  index,
}: {
  course: (typeof courses)[0];
  index: number;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className={`relative flex-shrink-0 md:snap-center rounded-2xl border border-border/50 bg-card overflow-hidden transition-all duration-500 w-full md:w-[340px] ${
        isExpanded ? "md:w-[380px]" : ""
      }`}
    >
      {/* Gradient Header */}
      <div className={`h-2 bg-gradient-to-r ${course.color}`} />

      <div className="p-6">
        {/* Category & Level */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
            {course.category}
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
            {course.level}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-display font-bold mb-2">{course.title}</h3>
        
        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {course.description}
        </p>

        {/* Meta Info */}
        <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {course.duration}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            Limited Seats
          </span>
        </div>

        {/* Tools */}
        <div className="flex flex-wrap gap-2 mb-4">
          {course.tools.slice(0, isExpanded ? course.tools.length : 3).map((tool) => (
            <span
              key={tool}
              className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary"
            >
              {tool}
            </span>
          ))}
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="pt-4 border-t border-border">
                <p className="text-sm font-medium mb-2">Career Outcomes:</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {course.outcomes.map((outcome) => (
                    <span
                      key={outcome}
                      className="text-xs px-2 py-1 rounded-md bg-secondary/20 text-secondary"
                    >
                      {outcome}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA */}
        <Button variant="gradient" className="w-full group">
          View Curriculum
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </motion.div>
  );
};
