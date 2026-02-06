import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Dashboard from "./pages/admin/Dashboard";
import FeaturesAdmin from "./pages/admin/FeaturesAdmin";
import ProgramsAdmin from "./pages/admin/ProgramsAdmin";
import JourneyAdmin from "./pages/admin/JourneyAdmin";
import OutcomesAdmin from "./pages/admin/OutcomesAdmin";
import TestimonialsAdmin from "./pages/admin/TestimonialsAdmin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<Admin />}>
              <Route index element={<Dashboard />} />
              <Route path="features" element={<FeaturesAdmin />} />
              <Route path="programs" element={<ProgramsAdmin />} />
              <Route path="journey" element={<JourneyAdmin />} />
              <Route path="outcomes" element={<OutcomesAdmin />} />
              <Route path="testimonials" element={<TestimonialsAdmin />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
