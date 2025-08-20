import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="mt-40 py-20 text-center border-t border-neutral-200 dark:border-neutral-800">
      <h3 className="text-3xl md:text-4xl font-bold mb-8">
        Ready to transform inventory management?
      </h3>
      <Link href="/login">
        <Button
          size="lg"
          className="text-lg py-4 px-10 rounded-full bg-black text-white dark:bg-white dark:text-black hover:scale-[1.02] transition-all"
        >
          Start Now <MoveRight className="ml-2 h-6 w-6" />
        </Button>
      </Link>
    </section>
  );
}
