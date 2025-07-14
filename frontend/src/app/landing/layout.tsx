// src/app/(landing)/layout.tsx

import "../../globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Inventory Management",
  description: "Your modern inventory platform",
};

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 font-sans">
        {children}
      </body>
    </html>
  );
}
