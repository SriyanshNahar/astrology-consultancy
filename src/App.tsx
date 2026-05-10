import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Services from './components/Services';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import ConsultationForm from './components/ConsultationForm';
import SubtleBackground from './components/SubtleBackground';
import AdminPanel from './components/AdminPanel';
import ScrollingBanner from './components/ScrollingBanner';

function HomePage() {
  return (
    <>
      <SubtleBackground />
      <Hero />
      <Services />
      <ConsultationForm />
      <Testimonials />
      <Contact />
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col relative bg-cream">
        <Navbar />
        <main className="flex-grow z-10 pt-20">
          <ScrollingBanner />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
