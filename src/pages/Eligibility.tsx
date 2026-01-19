import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Zap, Lock, Shield, CheckCircle, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

const nameRegex = /^[a-zA-Z\s.'-]{2,}$/;
const phoneRegex = /^(?:\+?254|0)[17]\d{8}$/;
const idRegex = /^\d{7,10}$/;

interface FormData {
  name: string;
  phone_number: string;
  id_number: string;
  loan_type: string;
}

const Eligibility = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone_number: "",
    id_number: "",
    loan_type: "",
  });

  useEffect(() => {
    const saved = sessionStorage.getItem("myLoan");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setFormData({
          name: data.name || "",
          phone_number: data.phone_number || "",
          id_number: data.id_number || "",
          loan_type: data.loan_type || "",
        });
      } catch {
        // Invalid data, ignore
      }
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { name, phone_number, id_number, loan_type } = formData;

    if (!nameRegex.test(name.trim())) {
      toast.error("Invalid Name", {
        description: "Please enter your full name (letters only)",
      });
      return;
    }

    if (!phoneRegex.test(phone_number.trim())) {
      toast.error("Invalid Phone", {
        description: "Please enter a valid Safaricom number (07XXXXXXXX)",
      });
      return;
    }

    if (!idRegex.test(id_number.trim())) {
      toast.error("Invalid ID", {
        description: "Please enter a valid Kenyan ID (7-10 digits)",
      });
      return;
    }

    if (!loan_type) {
      toast.error("Missing Loan Type", {
        description: "Please select your loan purpose",
      });
      return;
    }

    // Store data
    sessionStorage.setItem(
      "myLoan",
      JSON.stringify({
        name: name.trim(),
        phone_number: phone_number.trim(),
        id_number: id_number.trim(),
        loan_type,
      })
    );

    // Show loading
    setIsLoading(true);

    // Simulate API check
    setTimeout(() => {
      setIsLoading(false);
      navigate("/apply");
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-background font-poppins">
      {/* Header */}
      <header className="bg-card shadow-card sticky top-0 z-10">
        <div className="max-w-[1200px] mx-auto px-5 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 font-bold text-xl text-primary">
            <Zap className="w-5 h-5" />
            <span>Okoa Chapaa</span>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-5 py-8">
        {/* Hero Card */}
        <div className="gradient-primary text-primary-foreground rounded-2xl p-6 text-center mb-8 relative overflow-hidden">
          <div className="absolute top-[-50%] right-[-30%] w-[200px] h-[200px] rounded-full bg-white/10" />
          <div className="absolute bottom-[-40%] left-[-20%] w-[150px] h-[150px] rounded-full bg-white/5" />
          
          <div className="relative z-10">
            <h1 className="text-xl font-bold mb-2">Check Your Loan Eligibility</h1>
            <p className="text-sm opacity-90 mb-4">
              Find out how much you qualify for instantly
            </p>
            <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="font-semibold">Ksh. 1,500 – 10,000</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              maxLength={100}
            />
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phone_number" className="block text-sm font-medium text-foreground mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
              placeholder="07XXXXXXXX"
              className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              maxLength={13}
            />
          </div>

          {/* ID Number */}
          <div>
            <label htmlFor="id_number" className="block text-sm font-medium text-foreground mb-2">
              ID Number
            </label>
            <input
              type="text"
              id="id_number"
              name="id_number"
              value={formData.id_number}
              onChange={handleInputChange}
              placeholder="Enter your ID number"
              className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              maxLength={10}
            />
          </div>

          {/* Loan Type */}
          <div>
            <label htmlFor="loan_type" className="block text-sm font-medium text-foreground mb-2">
              Loan Type
            </label>
            <select
              id="loan_type"
              name="loan_type"
              value={formData.loan_type}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 12px center",
                backgroundSize: "20px",
              }}
            >
              <option value="">Select Loan Type</option>
              <option value="business">Business Loan</option>
              <option value="personal">Personal Loan</option>
              <option value="education">Education Loan</option>
              <option value="medical">Medical Loan</option>
              <option value="emergency">Emergency Loan</option>
            </select>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-3 py-4">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Lock className="w-3.5 h-3.5 text-primary" />
              <span>Secure Application</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Shield className="w-3.5 h-3.5 text-primary" />
              <span>No CRB Check</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CheckCircle className="w-3.5 h-3.5 text-primary" />
              <span>Instant Approval</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full gradient-primary text-primary-foreground py-4 rounded-full font-semibold text-base flex items-center justify-center gap-2 shadow-card hover:shadow-btn transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Checking Eligibility...
              </>
            ) : (
              <>
                Check Eligibility <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-center text-xs text-muted-foreground pt-2">
            No paperwork required. No guarantors needed.
          </p>
        </form>
      </main>
    </div>
  );
};

export default Eligibility;
