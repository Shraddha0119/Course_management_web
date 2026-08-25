import Hero from "../components/home/Hero";
import Categories from "../components/home/Categories";
import PopularCourses from "../components/home/PopularCourses";
import WhyChooseUs from "../components/home/WhyChooseUs";
import Stats from "../components/home/Stats";
import Process from "../components/home/Process";
import AISection from "../components/home/AISection";
import Testimonials from "../components/home/Testimonials";
import Instructors from "../components/home/Instructors";
import CertificatePreview from "../components/home/CertificatePreview";
import AppPromo from "../components/home/AppPromo";
import Newsletter from "../components/home/Newsletter";

/**
 * Home - premium landing page composed of modular, reusable sections.
 * Glassmorphism + soft gradients + scroll-reveal animations + dark mode.
 */
function Home() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <Hero />

      {/* Trusted by */}
      <div className="max-w-7xl mx-auto px-6">
        <Stats />
      </div>

      {/* Categories */}
      <Categories />

      {/* Popular courses (fetches real data) */}
      <PopularCourses />

      {/* Why choose us */}
      <WhyChooseUs />

      {/* Learning process timeline */}
      <Process />

      {/* AI assistant promo */}
      <AISection />

      {/* Testimonials */}
      <Testimonials />

      {/* Instructors */}
      <Instructors />

      {/* Certificate */}
      <CertificatePreview />

      {/* Mobile app */}
      <AppPromo />

      {/* Newsletter */}
      <Newsletter />
    </div>
  );
}

export default Home;
