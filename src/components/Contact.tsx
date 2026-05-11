import { motion } from 'framer-motion';
import { Mail, MapPin, Globe, AlertTriangle } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contact" className="py-24 relative z-10 bg-white/30 border-t border-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-dark mb-4">Get in Touch</h2>
          <div className="w-24 h-1 bg-gold mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="glass-card p-8 rounded-3xl flex items-start gap-6 border-l-4 border-l-red-500/80">
              <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-semibold text-red-600 dark:text-red-400 mb-2">Communication Policy</h3>
                <p className="text-dark/80 text-sm leading-relaxed">
                  Please <strong>do not call or send WhatsApp messages</strong>. To request a reading or ask questions, kindly use the <a href="#kundli" className="text-gold font-medium hover:text-gold-dark transition-colors">Consultation Form</a> exclusively.
                </p>
              </div>
            </div>

            <div className="glass-card p-8 rounded-3xl flex items-start gap-6">
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-gold" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-semibold text-dark mb-2">Email</h3>
                <p className="text-dark/70 mb-3">pandey.pranjal246@gmail.com</p>
                <a href="mailto:pandey.pranjal246@gmail.com" className="text-gold hover:text-gold-dark font-medium transition-colors">Send an Email &rarr;</a>
              </div>
            </div>

            {/* WhatsApp Link with Tracking (As requested for support) */}
            <div className="glass-card p-8 rounded-3xl flex items-start gap-6">
              <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.662-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
              </div>
              <div>
                <h3 className="text-xl font-serif font-semibold text-dark mb-2">WhatsApp Support</h3>
                <p className="text-dark/70 mb-3">For general inquiries only</p>
                <a 
                  href="https://wa.me/919876543210" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-700 font-medium transition-colors"
                  onClick={() => {
                    if (typeof window !== 'undefined' && (window as any).gtag) {
                      (window as any).gtag('event', 'click', {
                        event_category: 'Contact',
                        event_label: 'WhatsApp',
                        value: 1
                      });
                    }
                  }}
                >
                  Chat on WhatsApp &rarr;
                </a>
              </div>
            </div>

            <div className="glass-card p-8 rounded-3xl flex items-start gap-6">
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Globe className="w-6 h-6 text-gold" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-semibold text-dark mb-2">Social Media</h3>
                <p className="text-dark/70 mb-3">Follow for daily astrology insights</p>
                <a href="#" className="text-gold hover:text-gold-dark font-medium transition-colors">Visit Profile &rarr;</a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl overflow-hidden h-[400px] lg:h-auto border border-gold/20 relative shadow-md group min-h-[400px]"
          >
            {/* Google Maps iframe */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d114674.65476080359!2d74.56847043818302!3d25.34625574579979!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3968c2368ee23e75%3A0xc6651bc70c634044!2sBhilwara%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-105"
            ></iframe>
            
            {/* Floating Glass Box over Map */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-dark/10 to-transparent pointer-events-none"></div>
            <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-white/40 shadow-lg text-center pointer-events-none transition-transform duration-500 group-hover:-translate-y-2">
              <div className="flex justify-center mb-2">
                <MapPin className="w-8 h-8 text-gold" />
              </div>
              <h3 className="text-xl font-serif font-semibold text-dark mb-1">Bhilwara, Rajasthan</h3>
              <p className="text-sm text-dark/70">Top Astrologer in Bhilwara • Available Worldwide</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
