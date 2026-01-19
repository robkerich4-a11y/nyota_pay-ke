import { Zap, FileText, Shield, Users } from "lucide-react";

const features = [
  { icon: Zap, label: "5-Minute Approval" },
  { icon: FileText, label: "No Paperwork" },
  { icon: Shield, label: "Bank-Level Security" },
  { icon: Users, label: "No Guarantors" },
];

const Features = () => {
  return (
    <section className="my-[60px]">
      <div className="text-center mb-10">
        <h2 className="text-[1.8rem] text-foreground mb-2.5 font-bold">
          Why Choose Okoa Chapaa?
        </h2>
        <p className="text-muted-foreground max-w-[600px] mx-auto">
          We make borrowing simple, fast, and secure
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1000px] mx-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-card rounded-lg py-[30px] px-5 text-center shadow-card transition-all duration-300 border-t-4 border-t-primary hover:-translate-y-1 hover:shadow-hover"
          >
            <feature.icon className="w-9 h-9 text-primary mx-auto mb-4" />
            <p className="font-semibold text-base text-foreground">
              {feature.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
