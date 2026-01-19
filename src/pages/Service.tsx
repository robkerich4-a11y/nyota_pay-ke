import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, Copy, Check, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface LoanData {
  name: string;
  phone_number: string;
  id_number: string;
  loan_type: string;
  loan_amount: number;
  processing_fee: number;
}

const TILL_NUMBER = "4019420";
const EXPECTED_TILL_NAME = "Inuka Ventures"; // Updated expected till name

const Service = () => {
  const navigate = useNavigate();
  const [loanData, setLoanData] = useState<LoanData | null>(null);
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [mpesaMessage, setMpesaMessage] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  useEffect(() => {
    const data = sessionStorage.getItem("myLoan");
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed.loan_amount && parsed.processing_fee) {
        setLoanData(parsed);
      } else {
        navigate("/apply");
      }
    } else {
      navigate("/apply");
    }
  }, [navigate]);

  const formatCurrency = (amount: number) => {
    return `Ksh ${amount.toLocaleString("en-KE")}`;
  };

  const handleCopyTill = async () => {
    try {
      await navigator.clipboard.writeText(TILL_NUMBER);
      setCopied(true);
      toast.success("Till number copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  const handleVerifyPayment = () => {
    if (!mpesaMessage.trim()) {
      toast.error("Please paste your M-Pesa confirmation message");
      return;
    }

    if (!loanData) return;

    // Normalize message: lowercase, remove commas (spaces kept for better matching)
    const normalizedMsg = mpesaMessage.toLowerCase().replace(/,/g, "");

    // Extract paid amount from SMS
    const amountMatch = normalizedMsg.match(/ksh\s*(\d+(\.\d{1,2})?)/i);
    const paidAmount = amountMatch ? parseFloat(amountMatch[1]) : 0;
    const expectedAmount = loanData.processing_fee;

    // Verify
    const feeMatches = Math.round(paidAmount) === Math.round(expectedAmount);
    const tillMatches = normalizedMsg.includes(EXPECTED_TILL_NAME.toLowerCase());

    if (feeMatches && tillMatches) {
      setShowModal(false);
      setIsVerifying(true);

      setTimeout(() => {
        setVerificationSuccess(true);
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      }, 2000);
    } else {
      toast.error(
        `Invalid M-Pesa message. Please ensure you paid ${formatCurrency(
          expectedAmount
        )} to ${EXPECTED_TILL_NAME}`
      );
    }
  };

  if (!loanData) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const totalRepayment = Math.round(loanData.loan_amount * 1.1);

  if (isVerifying) {
    return (
      <div className="fixed inset-0 bg-white/95 z-50 flex flex-col items-center justify-center">
        {verificationSuccess ? (
          <>
            <CheckCircle className="w-16 h-16 text-primary mb-6 animate-pulse" />
            <p className="text-xl font-medium text-dark">Payment verified successfully!</p>
          </>
        ) : (
          <>
            <Loader2 className="w-12 h-12 text-primary mb-6 animate-spin" />
            <p className="text-xl font-medium text-dark">Verifying your payment...</p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light p-5">
      <div className="max-w-[500px] mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 text-primary font-bold text-3xl mb-3">
            <Zap className="w-7 h-7" />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Okoa Chapaa
            </span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            Complete Your Payment
          </h1>
          <p className="text-gray text-[0.95rem]">
            Verify payment to receive your loan instantly
          </p>
        </div>

        {/* Payment Card */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-card border border-primary/10">
          {/* Payment Summary */}
          <div className="mb-6 pb-5 border-b border-dashed border-primary/20">
            <div className="flex justify-between mb-4">
              <span className="text-gray text-[0.95rem]">Loan Amount:</span>
              <span className="font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {formatCurrency(loanData.loan_amount)}
              </span>
            </div>
            <div className="flex justify-between mb-4">
              <span className="text-gray text-[0.95rem]">Processing Fee:</span>
              <span className="font-semibold">{formatCurrency(loanData.processing_fee)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray text-[0.95rem]">Repayment Amount:</span>
              <span className="font-semibold">{formatCurrency(totalRepayment)}</span>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-primary mb-4">Payment Instructions:</h3>

            {[ 
              "Go to M-Pesa on your phone",
              "Select Lipa na M-Pesa then Buy Goods and Services",
              "Enter the Till Number below:",
              `Enter Amount: ${formatCurrency(loanData.processing_fee)}`,
              "Enter your M-Pesa PIN to complete payment"
            ].map((step, idx) => (
              <div key={idx} className="flex mb-4 items-start">
                <div className="bg-gradient-to-r from-primary to-secondary text-white w-[26px] h-[26px] rounded-full flex items-center justify-center text-sm mr-3.5 flex-shrink-0">
                  {idx + 1}
                </div>
                <p className="text-[0.95rem] pt-0.5">{step}</p>
              </div>
            ))}

            {/* Till Container */}
            <div className="bg-primary/10 p-5 rounded-2xl my-5 text-center border border-dashed border-primary">
              <p className="text-sm text-gray mb-2.5">Till Number</p>
              <p className="font-mono text-2xl font-bold text-primary tracking-wider">{TILL_NUMBER}</p>
              <Button
                onClick={handleCopyTill}
                className="mt-4 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl px-5 py-3 text-[0.95rem] font-medium gap-2.5 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> Copy Till
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Verify Button */}
          <Button
            onClick={() => setShowModal(true)}
            className="w-full py-4 h-auto bg-gradient-to-r from-primary to-secondary text-white rounded-2xl text-lg font-semibold mt-6 gap-2.5 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
          >
            <CheckCircle className="w-5 h-5" /> Verify Payment
          </Button>
        </div>
      </div>

      {/* Verification Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[420px] rounded-2xl border-primary/10">
          <DialogHeader>
            <DialogTitle className="text-xl text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-semibold">
              Verify Payment
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray text-[0.95rem]">
              Please paste the M-Pesa confirmation message you received after making the payment:
            </p>
            <Textarea
              value={mpesaMessage}
              onChange={(e) => setMpesaMessage(e.target.value)}
              placeholder="Paste M-Pesa message here..."
              className="h-[140px] resize-none rounded-2xl border-primary/30 focus:border-primary focus:ring-primary/10"
            />
            <Button
              onClick={handleVerifyPayment}
              className="w-full py-4 h-auto bg-gradient-to-r from-primary to-secondary text-white rounded-2xl text-lg font-semibold gap-2.5 shadow-lg hover:shadow-xl transition-all"
            >
              <CheckCircle className="w-5 h-5" /> Verify Payment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Service;
