import { motion } from 'framer-motion';
import { Sparkles, Calendar, MessageCircle } from 'lucide-react';
import zodiacBg from '../assets/zodiac-bg.jpg';

export default function Hero() {
  return (
    <section id="home" className="relative min-h-[90vh] flex items-center justify-center pt-20 pb-32 overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.12] dark:opacity-[0.25] mix-blend-multiply dark:mix-blend-screen transition-opacity duration-500 pointer-events-none"
        style={{
          backgroundImage: `url(${zodiacBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-card text-gold-dark text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Spiritual Guidance & Astrology</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-dark mb-6 tracking-tight">
            Unlock Your <span className="text-gold">Destiny</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-dark/70 font-light mb-10">
            Discover life paths and possibilities through premium astrological guidance by Pranjal Pandey.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#kundli" className="px-8 py-4 bg-gold hover:bg-gold-dark text-white rounded-full transition-all flex items-center gap-2 shadow-[0_4px_14px_0_rgba(212,175,55,0.39)] hover:shadow-[0_6px_20px_rgba(212,175,55,0.23)] hover:-translate-y-1 w-full sm:w-auto justify-center text-lg font-medium">
              <Calendar className="w-5 h-5" />
              Book Your Consultation Now
            </a>
          </div>


        </motion.div>
      </div>

    </section>
  );
}
