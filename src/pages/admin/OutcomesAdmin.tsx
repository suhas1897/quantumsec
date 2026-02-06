import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

interface Outcome {
  id: string;
  label: string;
  value: string;
  suffix: string | null;
  display_order: number;
}

const defaultFormData = {
  label: "",
  value: "",
  suffix: "",
};

const OutcomesAdmin = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOutcome, setEditingOutcome] = useState<Outcome | null>(null);
  const [deleteOutcome, setDeleteOutcome] = useState<Outcome | null>(null);
  const [formData, setFormData] = useState(defaultFormData);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: outcomes, isLoading } = useQuery({
    queryKey: ["admin-outcomes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("outcomes")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data as Outcome[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<Outcome, "id">) => {
      const { error } = await supabase.from("outcomes").insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-outcomes"] });
      toast({ title: "Outcome created successfully" });
      resetForm();
    },
    onError: (error) => {
      toast({ variant: "destructive", title: "Error", description: error.message });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: Outcome) => {
      const { error } = await supabase.from("outcomes").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-outcomes"] });
      toast({ title: "Outcome updated successfully" });
      resetForm();
    },
    onError: (error) => {
      toast({ variant: "destructive", title: "Error", description: error.message });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("outcomes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-outcomes"] });
      toast({ title: "Outcome deleted successfully" });
      setDeleteOutcome(null);
    },
    onError: (error) => {
      toast({ variant: "destructive", title: "Error", description: error.message });
    },
  });

  const resetForm = () => {
    setFormData(defaultFormData);
    setEditingOutcome(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (outcome: Outcome) => {
    setEditingOutcome(outcome);
    setFormData({
      label: outcome.label,
      value: outcome.value,
      suffix: outcome.suffix || "",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const outcomeData = {
      label: formData.label,
      value: formData.value,
      suffix: formData.suffix || null,
      display_order: editingOutcome?.display_order || (outcomes?.length || 0) + 1,
    };
    
    if (editingOutcome) {
      updateMutation.mutate({ id: editingOutcome.id, ...outcomeData });
    } else {
      createMutation.mutate(outcomeData);
    }
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-display font-bold">Outcomes</h1>
          <p className="text-muted-foreground">Manage statistics and results</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) resetForm(); else setIsDialogOpen(true); }}>
          <DialogTrigger asChild>
            <Button variant="hero">
              <Plus className="w-5 h-5 mr-2" />
              Add Outcome
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingOutcome ? "Edit Outcome" : "Add Outcome"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="label">Label</Label>
                <Input
                  id="label"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="e.g., Students Placed"
                  required
                />
              </div>
              <div>
                <Label htmlFor="value">Value</Label>
                <Input
                  id="value"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder="e.g., 500"
                  required
                />
              </div>
              <div>
                <Label htmlFor="suffix">Suffix (optional)</Label>
                <Input
                  id="suffix"
                  value={formData.suffix}
                  onChange={(e) => setFormData({ ...formData, suffix: e.target.value })}
                  placeholder="e.g., +, %, K"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                <Button type="submit" variant="hero">{editingOutcome ? "Update" : "Create"}</Button>
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
      ) : outcomes?.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No outcomes yet. Click "Add Outcome" to create one.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {outcomes?.map((outcome, index) => (
            <motion.div
              key={outcome.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors text-center"
            >
              <div className="text-4xl font-bold text-gradient-primary mb-2">
                {outcome.value}{outcome.suffix}
              </div>
              <div className="text-muted-foreground">{outcome.label}</div>
              <div className="flex justify-center gap-2 mt-4">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(outcome)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setDeleteOutcome(outcome)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteOutcome} onOpenChange={() => setDeleteOutcome(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Outcome</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteOutcome?.label}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteOutcome && deleteMutation.mutate(deleteOutcome.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default OutcomesAdmin;
