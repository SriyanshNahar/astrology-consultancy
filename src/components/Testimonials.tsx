import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "Rahul Sharma",
    text: "Pranjal ji is undoubtedly the best astrologer in Bhilwara. His insights are incredibly accurate, and his career guidance helped me make a crucial decision that completely changed my life for the better.",
    rating: 5
  },
  {
    name: "Priya Desai",
    text: "The kundli matching for our marriage was so detailed. He explained everything with patience and positivity. Highly recommended for any astrological needs.",
    rating: 5
  },
  {
    name: "Amit Patel",
    text: "I was going through a tough phase in my business. The remedies and gemstone consultation provided by Pranjal Pandey worked wonders. A very genuine astrologer.",
    rating: 5
  }
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-dark mb-4">Client Experiences</h2>
          <div className="w-24 h-1 bg-gold mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="glass-card p-8 rounded-3xl"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-gold text-gold" />
                ))}
              </div>
              <p className="text-dark/80 italic mb-6 leading-relaxed">"{testimonial.text}"</p>
              <div className="font-serif font-semibold text-dark text-lg">- {testimonial.name}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
