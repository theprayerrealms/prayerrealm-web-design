import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import About from "./pages/About";
import PrayerRequest from "./pages/PrayerRequest";
import Events from "./pages/Events";
import Sermons from "./pages/Sermons";
import Volunteer from "./pages/Volunteer";
import Testimonies from "./pages/Testimonies";
import PrayerWall from "./pages/PrayerWall";
import Give from "./pages/Give";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/prayer-request" element={<PrayerWall />} />
            <Route path="/events" element={<Events />} />
            <Route path="/sermons" element={<Sermons />} />
            <Route path="/volunteer" element={<Volunteer />} />
            <Route path="/testimonies" element={<Testimonies />} />
            <Route path="/prayer-wall" element={<PrayerWall />} />
            <Route path="/give" element={<Give />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
