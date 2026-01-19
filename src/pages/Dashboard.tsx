import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Zap, CheckCircle, Clock, Wallet, ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LoanData {
  name: string;
  phone_number: string;
  loan_amount: number;
  processing_fee: number;
  loan_type: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [loanData, setLoanData] = useState<LoanData | null>(null);

  useEffect(() => {
    const data = sessionStorage.getItem("myLoan");
    if (data) {
      setLoanData(JSON.parse(data));
    } else {
      navigate("/");
    }
  }, [navigate]);

  const formatCurrency = (amount: number) => {
    return `Ksh ${amount.toLocaleString("en-KE")}`;
  };

  if (!loanData) {
    return null;
  }

  const totalRepayment = Math.round(loanData.loan_amount * 1.1);
  const dueDate = new Date();
  dueDate.setMonth(dueDate.getMonth() + 2);

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
        </div>

        {/* Success Card */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-card border border-primary/10 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-dark mb-2">Payment Verified!</h1>
          <p className="text-gray">
            Your loan application has been processed successfully.
          </p>
        </div>

        {/* Loan Details Card */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-card border border-primary/10">
          <h2 className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            Loan Details
          </h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-primary" />
                </div>
                <span className="text-gray">Loan Amount</span>
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {formatCurrency(loanData.loan_amount)}
              </span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <span className="text-gray">Loan Term</span>
              </div>
              <span className="font-semibold">2 Months</span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray">Processing Fee Paid</span>
              <span className="font-semibold">{formatCurrency(loanData.processing_fee)}</span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray">Interest Rate</span>
              <span className="font-semibold">10%</span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray">Total Repayment</span>
              <span className="font-bold text-lg">{formatCurrency(totalRepayment)}</span>
            </div>

            <div className="flex justify-between items-center py-3">
              <span className="text-gray">Due Date</span>
              <span className="font-semibold text-primary">
                {dueDate.toLocaleDateString("en-KE", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 mb-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <Clock className="w-6 h-6" />
            <h3 className="font-semibold text-lg">Disbursement Status</h3>
          </div>
          <p className="opacity-90 mb-4">
            Your loan of {formatCurrency(loanData.loan_amount)} will be sent to your M-Pesa number{" "}
            <strong>{loanData.phone_number}</strong> within 24 hours.
          </p>
          <div className="bg-white/20 rounded-xl p-3 text-sm">
            <p>📱 You will receive an M-Pesa confirmation message once the funds are disbursed.</p>
          </div>
        </div>

        {/* Apply Again Button */}
        <Button
          onClick={() => {
            sessionStorage.removeItem("myLoan");
            navigate("/");
          }}
          className="w-full py-4 h-auto bg-white text-primary border border-primary/20 rounded-2xl text-lg font-semibold gap-2.5 shadow-md hover:shadow-lg transition-all hover:bg-primary/5"
        >
          <Home className="w-5 h-5" /> Back to Home
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
