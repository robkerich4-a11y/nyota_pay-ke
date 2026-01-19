import { Lock, Award, CheckCircle } from "lucide-react";

const badges = [
  { icon: Lock, label: "SSL Secured" },
  { icon: Award, label: "CBK Licensed" },
  { icon: CheckCircle, label: "Verified Service" },
];

const TrustSection = () => {
  return (
    <section className="my-[60px]">
      <div className="text-center mb-10">
        <h2 className="text-[1.8rem] text-foreground mb-2.5 font-bold">
          Trusted & Secure
        </h2>
        <p className="text-muted-foreground max-w-[600px] mx-auto">
          Your security and trust are our top priorities
        </p>
      </div>

      <div className="flex justify-center gap-4 my-[30px] flex-wrap max-w-[700px] mx-auto">
        {badges.map((badge, index) => (
          <div
            key={index}
            className="bg-card border border-primary/20 py-3 px-5 rounded-full text-[0.9rem] flex items-center gap-2 shadow-card"
          >
            <badge.icon className="w-4 h-4 text-primary" />
            <span>{badge.label}</span>
          </div>
        ))}
      </div>

      <p className="text-center text-muted-foreground text-[0.95rem] mt-10 mb-[60px]">
        Trusted by over 50,000 Kenyans nationwide
      </p>
    </section>
  );
};

export default TrustSection;
