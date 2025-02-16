import { useState } from "react";
import { TravelForm } from "@/components/TravelForm";
import { TravelItinerary } from "@/components/TravelItinerary";
import { generateTravelPlan, TravelPreferences } from "@/lib/gemini";
import { useToast } from "@/components/ui/use-toast";
import { ParallaxProvider } from "react-scroll-parallax";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"; // For Font Awesome 6


const Index = () => {
  const [itinerary, setItinerary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (preferences: TravelPreferences) => {
    setIsLoading(true);
    try {
      const plan = await generateTravelPlan(preferences);
      setItinerary(plan);
      toast({ title: "Success!", description: "Your travel plan is ready!" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to generate plan.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ParallaxProvider>
      {/* Hero Section with Blur */}
      <div className="relative h-screen flex items-center justify-center text-center px-6 bg-cover bg-center"
        style={{ backgroundImage: "url('https://wallpapers.com/images/featured-full/travel-ibk7fgrvtvhs7qzg.jpg')" }}
      >
        {/* Blur only in the hero section */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-md"></div>
        
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 max-w-3xl text-white"
        >
       <h1 className="text-5xl md:text-7xl font-extrabold tracking-wide text-center text-gray-900">
  <span className="bg-gradient-to-r from-sky-500 to-cyan-300 text-transparent bg-clip-text">
    Itinex
  </span>
  <span className="bg-gradient-to-r from-green-600 to-lime-400 text-transparent bg-clip-text">
    AI
  </span>
</h1>


          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Plan Your Dream Getaway
          </h1>
          <p className="mt-4 text-xl md:text-2xl opacity-90">
            AI-powered itineraries tailored just for you.
          </p>
        </motion.div>
      </div>

      {/* Travel Form Section - No Blur Beyond This */}
      <div className="relative z-20 container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
            Plan Your Adventure
          </h2>
          <TravelForm onSubmit={handleSubmit} isLoading={isLoading} />
        </motion.div>
      </div>

      {/* Travel Itinerary Section */}
      {itinerary && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 py-12"
        >
          <TravelItinerary itinerary={itinerary} />
        </motion.div>
      )}

      {/* Footer */}
<footer className="bg-gray-900 text-gray-300 text-center py-6 mt-12">
  <p className="text-sm">&copy; {new Date().getFullYear()} ItinexAI. All rights reserved.</p>
  <div className="flex justify-center gap-4 mt-2">
    <a href="https://x.com/whymahesh" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
      <FaXTwitter size={20} />
    </a>
    <a href="https://www.linkedin.com/in/maheshh-s/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
      <FaLinkedin size={20} />
    </a>
    <a href="https://github.com/Maheshh-S" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
      <FaGithub size={20} />
    </a>
  </div>
</footer>

    </ParallaxProvider>
  );
};

export default Index;
