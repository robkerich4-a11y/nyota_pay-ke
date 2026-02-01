import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, CheckCircle, Loader2, Smartphone, Home } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const BACKEND_URL = "https://okoa-chapaa-backend.onrender.com";

interface LoanData {
  name: string;
  phone_number: string;
  id_number: string;
  loan_type: string;
  loan_amount: number;
  processing_fee: number;
}

type PaymentStatus = "idle" | "initiating" | "pending" | "success" | "failed";

const Service = () => {
  const navigate = useNavigate();
  const [loanData, setLoanData] = useState<LoanData | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle");

  useEffect(() => {
    const data = sessionStorage.getItem("myLoan");
    if (!data) {
      navigate("/apply");
      return;
    }

    const parsed = JSON.parse(data);
    if (!parsed.loan_amount || !parsed.processing_fee) {
      navigate("/apply");
      return;
    }

    setLoanData(parsed);
  }, [navigate]);

  const formatCurrency = (amount: number) =>
    `Ksh ${amount.toLocaleString("en-KE")}`;

  const formatPhoneNumber = (phone: string): string => {
    let cleaned = phone.replace(/\D/g, "");

    if (cleaned.startsWith("0")) {
      cleaned = "254" + cleaned.slice(1);
    }

    if (!cleaned.startsWith("254")) {
      cleaned = "254" + cleaned;
    }

    return cleaned;
  };

  const initiateSTKPush = async () => {
    if (!loanData) return;

    setPaymentStatus("initiating");

    try {
      const response = await fetch(`${BACKEND_URL}/api/stk-push`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: formatPhoneNumber(loanData.phone_number),
          amount: loanData.processing_fee,
          reference: `PROC_${Date.now()}`,
        }),
      });

      const data = await response.json();
      console.log("STK Push response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to initiate STK push");
      }

      setPaymentStatus("pending");
      toast.success("Check your phone for the M-Pesa prompt!");
    } catch (err) {
      console.error(err);
      setPaymentStatus("failed");
      toast.error(
        err instanceof Error ? err.message : "Payment initiation failed"
      );
    }
  };

  if (!loanData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const totalRepayment = Math.round(loanData.loan_amount * 1.1);

  /* ================= STATUS OVERLAY ================= */

  if (
    paymentStatus === "initiating" ||
    paymentStatus === "pending" ||
    paymentStatus === "success"
  ) {
    const handleGoBack = () => {
      setPaymentStatus("idle");
    };

    return (
      <div className="fixed inset-0 bg-background/95 z-50 flex flex-col items-center justify-center p-6 text-center">
        {paymentStatus === "initiating" && (
          <>
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <p className="text-xl font-semibold">Initiating payment…</p>
          </>
        )}

        {paymentStatus === "pending" && (
          <>
            <Smartphone className="w-14 h-14 text-primary mb-4 animate-bounce" />
            <p className="text-xl font-semibold">Check your phone</p>
            <p className="text-muted-foreground mt-2">
              Enter your M-Pesa PIN to complete payment
            </p>
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={handleGoBack}
                className="gap-2"
              >
                <Home className="w-4 h-4" />
                Go Back
              </Button>
              <Button
                onClick={initiateSTKPush}
                className="gap-2"
              >
                <Smartphone className="w-4 h-4" />
                Retry
              </Button>
            </div>
          </>
        )}

        {paymentStatus === "success" && (
          <>
            <CheckCircle className="w-16 h-16 text-primary mb-4" />
            <p className="text-xl font-semibold">Payment successful</p>
            <p className="text-muted-foreground mt-2">
              Redirecting to dashboard…
            </p>
          </>
        )}
      </div>
    );
  }

  /* ================= MAIN UI ================= */

  return (
    <div className="min-h-screen bg-background p-5">
      <div className="max-w-[500px] mx-auto">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 text-primary font-bold text-3xl mb-2">
            <Zap className="w-7 h-7" />
            Okoa Chapaa
          </div>
          <p className="text-muted-foreground">
            Pay processing fee to receive your loan
          </p>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow border">
          <div className="space-y-3 mb-6">
            <Row label="Applicant" value={loanData.name} />
            <Row label="Phone" value={loanData.phone_number} />
            <Row label="Loan Amount" value={formatCurrency(loanData.loan_amount)} />
            <Row label="Processing Fee" value={formatCurrency(loanData.processing_fee)} />
            <Row label="Repayment" value={formatCurrency(totalRepayment)} />
          </div>

          <div className="bg-accent/50 rounded-xl p-4 mb-6 text-center">
            <p className="text-sm text-muted-foreground">Amount to Pay</p>
            <p className="text-3xl font-bold text-primary">
              {formatCurrency(loanData.processing_fee)}
            </p>
          </div>

          <Button
            onClick={initiateSTKPush}
            className="w-full py-6 text-lg gap-2 rounded-xl"
          >
            <Smartphone className="w-5 h-5" />
            Pay with M-Pesa
          </Button>

          {paymentStatus === "failed" && (
            <p className="text-center text-destructive mt-4">
              Payment failed. Please try again.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-semibold">{value}</span>
  </div>
);

export default Service;
