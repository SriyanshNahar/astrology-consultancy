import { Moon } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-dark text-white/80 py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <Moon className="h-8 w-8 text-gold" />
              <span className="font-serif text-2xl font-bold text-white tracking-wide">Pranjal Pandey</span>
            </div>
            <p className="text-white/60 font-light leading-relaxed max-w-sm">
              Spiritual guidance with positivity, wisdom, and clarity. Unlocking destiny through the ancient science of astrology. Recognized as the Best Astrologer in Bhilwara.
            </p>
          </div>
          
          <div>
            <h4 className="text-xl font-serif font-semibold text-white mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="/#services" className="hover:text-gold transition-colors">Services</a></li>
              <li><a href="/#kundli" className="hover:text-gold transition-colors">Book Consultation</a></li>
              <li><a href="/#testimonials" className="hover:text-gold transition-colors">Testimonials</a></li>
              <li><a href="/#contact" className="hover:text-gold transition-colors">Contact</a></li>
              <li><a href="/admin" className="hover:text-gold transition-colors">Admin Login</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-serif font-semibold text-white mb-6">Contact Info</h4>
            <ul className="space-y-3 text-white/60">
              <li>Email: pandey.pranjal246@gmail.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/50">
          <p>&copy; {new Date().getFullYear()} Pranjal Pandey Astrology. All rights reserved.</p>
          <p className="text-center md:text-right max-w-lg text-xs leading-relaxed">
            Disclaimer: Astrology is for guidance purposes only. The platform is not responsible for any decisions made based on astrological advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
