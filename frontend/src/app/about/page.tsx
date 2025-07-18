import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Package,
  BarChart2,
  Truck,
  MoveRight,
  Activity,
  ShieldCheck,
  TrendingUp,
  Sparkle,
} from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const testimonials = [
    {
      quote:
        "Switching to InventoryMS has transformed our store operations. We've improved stock visibility and reduced over-ordering by 40%.",
      author: "Aarav S., Store Manager – SuperMart",
    },
    {
      quote:
        "The system is very intuitive and easy to train our employees on. We save hours each week managing inventory.",
      author: "Priya R., Inventory Head – DailyMart",
    },
    {
      quote:
        "Real-time alerts and clean reports changed how we restock completely. This is a game changer for retail stores like ours.",
      author: "Karan J., Operations – LocalBasket",
    },
  ];

  return (
    <div className="w-full bg-gradient-to-b from-white via-neutral-50 to-white text-black antialiased">
      <div className="container mx-auto px-4 py-20 md:py-32">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto">
          <p className="text-lg font-semibold text-neutral-500 tracking-wider">
            Smart Inventory Management
          </p>
          <h1 className="mt-2 text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-black to-neutral-600">
            Efficiency in Every Item
          </h1>
          <p className="mt-8 text-xl text-neutral-600">
            Our Smart Inventory Management System is designed for supermarkets
            to maintain full control of stock, reduce waste, and gain valuable
            insights.
          </p>
          <div className="mt-10">
            <Link href="/login" passHref>
              <Button
                size="lg"
                className="text-lg py-3 px-6 bg-black text-white hover:bg-neutral-800"
              >
                Login <MoveRight className="ml-2 h-6 w-6" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="mt-28 grid gap-8 md:grid-cols-3">
          <FeatureCard
            Icon={Package}
            title="Real-Time Tracking"
            desc="Track stock levels, expiry dates, and receive low-stock alerts instantly."
          />
          <FeatureCard
            Icon={BarChart2}
            title="Insightful Reports"
            desc="Reports on sales trends, inventory turnover, and supplier performance."
          />
          <FeatureCard
            Icon={Truck}
            title="Supplier Management"
            desc="Centralize supplier data, manage purchase orders, and streamline procurement."
          />
        </div>

        {/* Stats Section */}
        <div className="mt-28 grid grid-cols-2 md:grid-cols-4 text-center gap-12 border-t border-b py-12 border-gray-200">
          <StatItem value="99.9%" label="Stock Accuracy" />
          <StatItem value="24/7" label="Monitoring" />
          <StatItem value="42%" label="Reduced Waste" />
          <StatItem value="15+" label="Integrated Suppliers" />
        </div>

        {/* How It Works */}
        <div className="mt-28 max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">How It Works</h2>
          <div className="grid gap-12 md:grid-cols-3 text-left text-neutral-700">
            <Step title="Monitor" icon={<Activity className="w-6 h-6 mr-3" />}>
              Track items from arrival to expiry, with all stock updates in
              real time.
            </Step>
            <Step title="Analyze" icon={<TrendingUp className="w-6 h-6 mr-3" />}>
              Get actionable data about your store’s inventory ROI and
              shrinkage rate.
            </Step>
            <Step
              title="Optimize"
              icon={<ShieldCheck className="w-6 h-6 mr-3" />}
            >
              Automate restocks, set reorder thresholds, and minimize human
              error.
            </Step>
          </div>
        </div>

        {/* 👍 Testimonials Section */}
        <div className="mt-28 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-16">
            What Our Clients Say
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((feedback, index) => (
              <div
                key={index}
                className="bg-neutral-100 rounded-xl p-8 shadow-sm text-left hover:shadow-md transition"
              >
                <Sparkle className="w-6 h-6 text-neutral-500 mb-4" />
                <p className="text-lg text-neutral-800 leading-relaxed mb-6">
                  “{feedback.quote}”
                </p>
                <div className="text-sm uppercase text-neutral-500 tracking-wide font-medium">
                  {feedback.author}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-28 text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to take control of your inventory?
          </h3>
          <Link href="/login">
            <Button
              size="lg"
              className="text-lg py-3 px-8 bg-black text-white hover:bg-neutral-900"
            >
              Login <MoveRight className="ml-2 h-6 w-6" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// Feature Card Component
function FeatureCard({
  Icon,
  title,
  desc,
}: {
  Icon: React.ElementType;
  title: string;
  desc: string;
}) {
  return (
    <Card className="bg-white/50 border-neutral-200 p-8 transition-all duration-300 hover:border-neutral-300 hover:bg-neutral-100/60">
      <CardHeader>
        <div className="p-4 bg-neutral-100 border border-neutral-200 rounded-lg w-fit">
          <Icon className="h-7 w-7 text-neutral-800" />
        </div>
        <CardTitle className="mt-6 text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-lg text-neutral-600">{desc}</CardContent>
    </Card>
  );
}

// Stats Item Component
function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-5xl md:text-6xl font-extrabold text-black">
        {value}
      </div>
      <div className="mt-2 text-base text-neutral-500">{label}</div>
    </div>
  );
}

// Step Component
function Step({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="flex items-center text-lg font-semibold text-black mb-3">
        {icon}
        {title}
      </h4>
      <p className="text-lg text-neutral-600">{children}</p>
    </div>
  );
}
