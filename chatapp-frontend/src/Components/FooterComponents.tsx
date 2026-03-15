export default function FooterComponents() {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
        {/* Copyright */}
        <p className="text-sm">
          &copy; {new Date().getFullYear()} ChatApp. All rights reserved.
        </p>

        {/* Footer Links */}
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="/about" className="hover:text-gray-400 text-sm">
            About
          </a>
          <a href="/contact" className="hover:text-gray-400 text-sm">
            Contact
          </a>
          <a href="/privacy" className="hover:text-gray-400 text-sm">
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
}