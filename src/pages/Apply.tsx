import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight, Loader2, Download, ArrowLeft } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface LoanOption {
  amount: number;
  fee: number;
}

const loanOptions: LoanOption[] = [
  { amount: 11200, fee: 180 },
  { amount: 16800, fee: 200 },
  { amount: 21200, fee: 220 },
  { amount: 25600, fee: 350 },
  { amount: 30000, fee: 420 },
  { amount: 35400, fee: 540 },
  { amount: 39800, fee: 680 },
  { amount: 44200, fee: 960 },
  { amount: 48600, fee: 1550 },
  { amount: 60600, fee: 2000 },
];

const Apply = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Customer");
  const [selectedLoan, setSelectedLoan] = useState<LoanOption | null>(null);
  const [showError, setShowError] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAppPromo, setShowAppPromo] = useState(false);

  useEffect(() => {
    const userData = sessionStorage.getItem("myLoan");
    if (!userData) {
      navigate("/eligibility");
      return;
    }
    try {
      const data = JSON.parse(userData);
      if (!data.phone_number) {
        navigate("/eligibility");
        return;
      }
      setUserName(data.name || "Customer");
    } catch {
      navigate("/eligibility");
    }
  }, [navigate]);

  const handleSelectLoan = (option: LoanOption) => {
    setSelectedLoan(option);
    setShowError(false);

    // Update session storage
    const userData = JSON.parse(sessionStorage.getItem("myLoan") || "{}");
    userData.loan_amount = option.amount;
    userData.processing_fee = option.fee;
    sessionStorage.setItem("myLoan", JSON.stringify(userData));
  };

  const handleApply = () => {
    if (!selectedLoan) {
      setShowError(true);
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setShowAppPromo(true);
      navigate("/service");
    }, 2000);
  };

  const formatCurrency = (amount: number) => {
    return `Ksh ${amount.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-background font-poppins p-5">
      <div className="max-w-[500px] mx-auto">
        {/* Welcome Card */}
        <div className="bg-card rounded-2xl p-6 mb-5 shadow-card border border-primary/10">
          <p className="text-base">
            Hi{" "}
            <span className="font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {userName}
            </span>
            , you qualify for these loan options based on your M-Pesa records
            (2-month term at 10% interest).
          </p>
        </div>

        {/* Loan Card */}
        <div className="bg-card rounded-2xl p-6 mb-6 shadow-card border border-primary/10">
          <h2 className="text-center text-xl font-bold mb-5 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Select Your Loan Amount
          </h2>

          {/* Loan Grid */}
          <div className="grid grid-cols-2 gap-3">
            {loanOptions.map((option) => (
              <button
                key={option.amount}
                onClick={() => handleSelectLoan(option)}
                className={`bg-background border rounded-2xl py-4 px-2.5 text-center cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
                  selectedLoan?.amount === option.amount
                    ? "border-primary bg-primary/10 shadow-lg"
                    : "border-primary/20"
                }`}
              >
                <p className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-1.5">
                  {formatCurrency(option.amount)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Fee: {formatCurrency(option.fee)}
                </p>
              </button>
            ))}
          </div>

          {/* Apply Button */}
          <button
            onClick={handleApply}
            disabled={isProcessing}
            className="w-full py-4 gradient-primary text-primary-foreground rounded-2xl text-lg font-semibold mt-5 cursor-pointer transition-all duration-300 shadow-btn hover:-translate-y-0.5 hover:shadow-hover disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Get Loan Now <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Error Message */}
          {showError && (
            <p className="text-destructive text-sm text-center mt-3">
              Please select a loan amount to continue
            </p>
          )}

          {/* App Promo */}
          {showAppPromo && (
            <div className="text-center mt-6 bg-card p-5 rounded-2xl shadow-card border border-primary/10">
              <p className="text-sm text-primary font-medium mb-3">
                For loans up to Ksh 80,000, download our app:
              </p>
              <button className="bg-card border border-primary text-primary rounded-2xl py-3 px-5 text-sm font-medium inline-flex items-center gap-2.5 transition-all hover:bg-primary/10">
                <Download className="w-4 h-4" />
                Download App
              </button>
            </div>
          )}
        </div>

        {/* Back Link */}
        <Link
          to="/"
          className="flex items-center justify-center gap-2 text-muted-foreground text-sm hover:text-primary transition-colors mt-7"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">
              Confirm Loan Application
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="text-left space-y-2 pt-2">
                <p className="text-foreground">You are applying for:</p>
                <p>
                  <strong>Loan Amount:</strong>{" "}
                  {selectedLoan && formatCurrency(selectedLoan.amount)}
                </p>
                <p>
                  <strong>Processing Fee:</strong>{" "}
                  {selectedLoan && formatCurrency(selectedLoan.fee)}
                </p>
                <p>
                  <strong>Total Repayment:</strong>{" "}
                  {selectedLoan && formatCurrency(selectedLoan.amount * 1.1)}
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3 sm:gap-3">
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className="gradient-primary rounded-xl"
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Apply;
