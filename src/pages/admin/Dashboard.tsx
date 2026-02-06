import { motion } from "framer-motion";
import { Star, GraduationCap, Route, TrendingUp, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const { data: featureCount } = useQuery({
    queryKey: ["admin-features-count"],
    queryFn: async () => {
      const { count } = await supabase.from("features").select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const { data: programCount } = useQuery({
    queryKey: ["admin-programs-count"],
    queryFn: async () => {
      const { count } = await supabase.from("programs").select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const { data: journeyCount } = useQuery({
    queryKey: ["admin-journey-count"],
    queryFn: async () => {
      const { count } = await supabase.from("journey_steps").select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const { data: outcomeCount } = useQuery({
    queryKey: ["admin-outcomes-count"],
    queryFn: async () => {
      const { count } = await supabase.from("outcomes").select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const { data: testimonialCount } = useQuery({
    queryKey: ["admin-testimonials-count"],
    queryFn: async () => {
      const { count } = await supabase.from("testimonials").select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const sections = [
    { name: "Features", count: featureCount, icon: Star, path: "/admin/features", color: "from-primary to-secondary" },
    { name: "Programs", count: programCount, icon: GraduationCap, path: "/admin/programs", color: "from-secondary to-primary" },
    { name: "Journey Steps", count: journeyCount, icon: Route, path: "/admin/journey", color: "from-accent to-primary" },
    { name: "Outcomes", count: outcomeCount, icon: TrendingUp, path: "/admin/outcomes", color: "from-primary to-accent" },
    { name: "Testimonials", count: testimonialCount, icon: MessageSquare, path: "/admin/testimonials", color: "from-secondary to-accent" },
  ];

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-display font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground mb-8">Manage your website content from one place.</p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sections.map((section, index) => (
            <motion.div
              key={section.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={section.path}
                className="block p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all group"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${section.color} mb-4`}>
                  <section.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-display font-bold mb-1 group-hover:text-primary transition-colors">
                  {section.name}
                </h3>
                <p className="text-3xl font-bold text-muted-foreground">
                  {section.count ?? "..."}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  items configured
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
