export default function Footer() {
  return (
    <footer className="bg-black text-white border-t border-neutral-800 py-12">
      <div className="container mx-auto px-6 text-center space-y-4">
        <p className="text-sm md:text-base text-gray-400">
          &copy; {new Date().getFullYear()} InventoryMS. All rights reserved.
        </p>

        {/* Contact Information */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm text-gray-400">
          <span>
            Email:{" "}
            <a
              href="mailto:support@inventoryms.com"
              className="hover:underline text-white"
            >
              support@inventoryms.com
            </a>
          </span>
          <span className="hidden md:inline">|</span>
          <span>
            Phone:{" "}
            <a
              href="tel:+911234567890"
              className="hover:underline text-white"
            >
              +91 12345 67890
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
