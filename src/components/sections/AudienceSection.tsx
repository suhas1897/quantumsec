import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Building2, Users, Briefcase, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const audiences = [
  {
    id: "students",
    icon: GraduationCap,
    title: "Aspiring Professionals",
    subtitle: "Students & Career Switchers",
    description: "Transform your career with industry-aligned training in Cybersecurity, Data Engineering, and AI.",
    benefits: [
      "Zero to job-ready in 12-16 weeks",
      "Hands-on projects for your portfolio",
      "Dedicated placement support",
      "Mentorship from industry experts",
    ],
    cta: "Start Your Journey",
    gradient: "from-primary to-secondary",
  },
  {
    id: "corporate",
    icon: Building2,
    title: "Corporate Teams",
    subtitle: "Enterprise Training",
    description: "Upskill your workforce with customized training programs tailored to your organization's needs.",
    benefits: [
      "Customized curriculum",
      "Flexible delivery modes",
      "Progress tracking dashboard",
      "Dedicated account manager",
    ],
    cta: "Get Enterprise Quote",
    gradient: "from-secondary to-primary",
  },
  {
    id: "recruiters",
    icon: Users,
    title: "Recruitment Partners",
    subtitle: "Pre-Vetted Talent",
    description: "Access a pipeline of pre-vetted, job-ready tech talent trained on the latest industry tools.",
    benefits: [
      "Pre-assessed candidates",
      "Skill-verified profiles",
      "Reduced hiring time",
      "No upfront fees",
    ],
    cta: "Partner With Us",
    gradient: "from-accent to-primary",
  },
  {
    id: "enterprise",
    icon: Briefcase,
    title: "Enterprises",
    subtitle: "Consulting & Solutions",
    description: "Custom consulting, security audits, and technology solutions for your business challenges.",
    benefits: [
      "Security assessments",
      "Data infrastructure setup",
      "AI implementation",
      "Ongoing support",
    ],
    cta: "Request Consultation",
    gradient: "from-primary to-accent",
  },
];

export const AudienceSection = () => {
  const [activeTab, setActiveTab] = useState("students");
  const activeAudience = audiences.find((a) => a.id === activeTab)!;

  return (
    <section id="audience" className="section-padding bg-card relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid-small opacity-20" />
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
            Who We Serve
          </span>
          <h2 className="mt-4 text-3xl md:text-5xl font-display font-bold">
            Solutions for <span className="text-gradient-primary">Everyone</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Whether you're an aspiring professional, a corporate team, or an enterprise, we have the right solution for you.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {audiences.map((audience) => (
            <button
              key={audience.id}
              onClick={() => setActiveTab(audience.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === audience.id
                  ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg shadow-primary/30"
                  : "bg-background border border-border hover:border-primary/50"
              }`}
            >
              <audience.icon className="w-5 h-5" />
              <span className="hidden sm:inline">{audience.title}</span>
            </button>
          ))}
        </motion.div>

        {/* Content Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="max-w-4xl mx-auto"
          >
            <div className="p-8 md:p-12 rounded-3xl bg-background border border-border/50 relative overflow-hidden">
              {/* Gradient Background */}
              <div
                className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-br ${activeAudience.gradient} opacity-10 blur-3xl`}
              />

              <div className="relative z-10 grid md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div>
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${activeAudience.gradient} mb-6`}
                  >
                    <activeAudience.icon className="w-8 h-8 text-primary-foreground" />
                  </div>

                  <h3 className="text-2xl md:text-3xl font-display font-bold mb-2">
                    {activeAudience.title}
                  </h3>
                  <p className="text-primary font-medium mb-4">
                    {activeAudience.subtitle}
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {activeAudience.description}
                  </p>

                  <Button variant="hero" size="lg" className="group">
                    {activeAudience.cta}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>

                {/* Right Column - Benefits */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg mb-4">What you get:</h4>
                  {activeAudience.benefits.map((benefit, index) => (
                    <motion.div
                      key={benefit}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-4 rounded-xl bg-muted/30"
                    >
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
