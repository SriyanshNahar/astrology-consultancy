import { motion } from 'framer-motion';
import { Star, Briefcase, Heart, TrendingUp, Gem, Hash } from 'lucide-react';

const services = [
  { title: 'Kundli Analysis', description: 'Deep dive into your birth chart to uncover life patterns.', icon: Star },
  { title: 'Career Guidance', description: 'Astrological insights for professional growth and success.', icon: Briefcase },
  { title: 'Love & Marriage', description: 'Compatibility checks and relationship timing predictions.', icon: Heart },
  { title: 'Business Astrology', description: 'Strategic planetary advice for business expansions.', icon: TrendingUp },
  { title: 'Gemstone Consultation', description: 'Discover lucky stones to enhance positive energies.', icon: Gem },
  { title: 'Numerology', description: 'Understanding life numbers for harmony and fortune.', icon: Hash },
];

export default function Services() {
  return (
    <section id="services" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-dark mb-4">Premium Astrology Services in Bhilwara</h2>
          <div className="w-24 h-1 bg-gold mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="glass-card p-8 rounded-3xl text-center group cursor-pointer"
            >
              <div className="w-16 h-16 mx-auto bg-gold/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-gold/20 transition-colors">
                <service.icon className="w-8 h-8 text-gold" />
              </div>
              <h3 className="text-xl font-serif font-semibold text-dark mb-3">{service.title}</h3>
              <p className="text-dark/70 font-light">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
