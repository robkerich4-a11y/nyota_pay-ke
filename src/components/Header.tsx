import { Zap } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-card shadow-card sticky top-0 z-10">
      <div className="max-w-[1200px] mx-auto px-5 py-[18px]">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2.5 font-bold text-[1.4rem] text-primary">
            <Zap className="w-6 h-6" />
            <span>Nyota Pay</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
