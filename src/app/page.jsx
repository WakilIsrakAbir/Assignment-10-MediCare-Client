import BannerSection from '../components/home/BannerSection';
import FeaturedDoctors from '../components/home/FeaturedDoctors';
import MedicalSpecializations from '../components/home/MedicalSpecializations';
import PlatformStatistics from '../components/home/PlatformStatistics';
import PatientSuccessStories from '../components/home/PatientSuccessStories';
import WhyChooseUs from '../components/home/WhyChooseUs';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Healthcare Themed Banner with CTA & Framer Motion */}
      <BannerSection />

      {/* 2. Dynamic Featured Doctors from DB */}
      <FeaturedDoctors />

      {/* 3. Static Medical Specializations */}
      <MedicalSpecializations />

      {/* 4. Dynamic Platform Statistics with Framer Motion */}
      <PlatformStatistics />

      {/* 5. Extra Section 1 (Dynamic): Patient Success Stories */}
      <PatientSuccessStories />

      {/* 6. Extra Section 2 (Static): Why Choose MediCare Connect */}
      <WhyChooseUs />
    </div>
  );
}
