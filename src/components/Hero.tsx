import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  const handleApply = () => {
    navigate("/eligibility");
  };

  return (
    <section className="gradient-primary text-primary-foreground py-20 pb-[120px] px-5 text-center relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-[-50%] right-[-20%] w-[400px] h-[400px] rounded-full bg-white/10" />
      <div className="absolute bottom-[-30%] left-[-10%] w-[300px] h-[300px] rounded-full bg-white/5" />
      
      <div className="max-w-[600px] mx-auto relative z-[1]">
        <h1 className="text-[2.5rem] md:text-[2.5rem] text-[2rem] font-bold mb-4 leading-tight">
          Instant M-Pesa Loans
        </h1>
        <p className="text-[1.1rem] opacity-90 mb-8">
          Get funds directly to your M-Pesa in minutes. Simple, fast, and secure when you need it most.
        </p>
        <button
          onClick={handleApply}
          className="px-8 py-3.5 border-none rounded-full bg-card text-primary text-base font-semibold cursor-pointer transition-all duration-300 shadow-card hover:-translate-y-0.5 hover:shadow-btn inline-flex items-center gap-2"
        >
          Apply Now <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};

export default Hero;
