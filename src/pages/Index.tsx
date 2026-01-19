import Header from "@/components/Header";
import Hero from "@/components/Hero";
import LoanHighlight from "@/components/LoanHighlight";
import Features from "@/components/Features";
import TrustSection from "@/components/TrustSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <main className="max-w-[1200px] mx-auto px-5">
        <LoanHighlight />
        <Features />
        <TrustSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
