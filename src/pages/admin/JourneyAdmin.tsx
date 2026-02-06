import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface JourneyStep {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon_name: string;
  features: string[];
  step_number: number;
}

const defaultFormData = {
  title: "",
  subtitle: "",
  description: "",
  icon_name: "BookOpen",
  features: "",
};

const JourneyAdmin = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStep, setEditingStep] = useState<JourneyStep | null>(null);
  const [deleteStep, setDeleteStep] = useState<JourneyStep | null>(null);
  const [formData, setFormData] = useState(defaultFormData);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: steps, isLoading } = useQuery({
    queryKey: ["admin-journey"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("journey_steps")
        .select("*")
        .order("step_number", { ascending: true });
      if (error) throw error;
      return data as JourneyStep[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<JourneyStep, "id">) => {
      const { error } = await supabase.from("journey_steps").insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-journey"] });
      toast({ title: "Step created successfully" });
      resetForm();
    },
    onError: (error) => {
      toast({ variant: "destructive", title: "Error", description: error.message });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: JourneyStep) => {
      const { error } = await supabase.from("journey_steps").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-journey"] });
      toast({ title: "Step updated successfully" });
      resetForm();
    },
    onError: (error) => {
      toast({ variant: "destructive", title: "Error", description: error.message });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("journey_steps").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-journey"] });
      toast({ title: "Step deleted successfully" });
      setDeleteStep(null);
    },
    onError: (error) => {
      toast({ variant: "destructive", title: "Error", description: error.message });
    },
  });

  const resetForm = () => {
    setFormData(defaultFormData);
    setEditingStep(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (step: JourneyStep) => {
    setEditingStep(step);
    setFormData({
      title: step.title,
      subtitle: step.subtitle,
      description: step.description,
      icon_name: step.icon_name,
      features: step.features?.join(", ") || "",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const stepData = {
      title: formData.title,
      subtitle: formData.subtitle,
      description: formData.description,
      icon_name: formData.icon_name,
      features: formData.features.split(",").map(f => f.trim()).filter(Boolean),
      step_number: editingStep?.step_number || (steps?.length || 0) + 1,
    };
    
    if (editingStep) {
      updateMutation.mutate({ id: editingStep.id, ...stepData });
    } else {
      createMutation.mutate(stepData);
    }
  };

  const iconOptions = ["BookOpen", "Code", "Shield", "Briefcase", "GraduationCap", "Target", "Rocket", "Award"];

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-display font-bold">Journey Steps</h1>
          <p className="text-muted-foreground">Manage the learning journey timeline</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) resetForm(); else setIsDialogOpen(true); }}>
          <DialogTrigger asChild>
            <Button variant="hero">
              <Plus className="w-5 h-5 mr-2" />
              Add Step
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingStep ? "Edit Step" : "Add Step"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Learn"
                  required
                />
              </div>
              <div>
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g., Foundation Building"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="icon">Icon</Label>
                <select
                  id="icon"
                  value={formData.icon_name}
                  onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-md border border-input bg-background"
                >
                  {iconOptions.map((icon) => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="features">Features (comma-separated)</Label>
                <Input
                  id="features"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  placeholder="Live Sessions, Hands-on Labs, Projects"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                <Button type="submit" variant="hero">{editingStep ? "Update" : "Create"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
          />
        </div>
      ) : steps?.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No journey steps yet. Click "Add Step" to create one.
        </div>
      ) : (
        <div className="space-y-3">
          {steps?.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground font-bold">
                {step.step_number}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.subtitle}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded bg-muted">{step.icon_name}</span>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(step)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setDeleteStep(step)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteStep} onOpenChange={() => setDeleteStep(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Step</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete step "{deleteStep?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteStep && deleteMutation.mutate(deleteStep.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default JourneyAdmin;
