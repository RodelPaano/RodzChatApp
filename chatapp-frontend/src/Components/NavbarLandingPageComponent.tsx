import { LogIn, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

export default function NavbarLandingPage() {
  return (
    <header className="bg-white shadow fixed top-0 left-0 w-full z-10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between ">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-gray-800">Rodz <span className="text-blue-600"> ChatApp </span></h1>

        {/* Navigation */}
        <nav className="flex gap-4">
          <Link
            to="/login"
            className="text-gray-600 hover:text-gray-800 flex items-center"
          >
            <LogIn size={20} className="inline-block mr-1" />
            Sign In
          </Link>
          <Link
            to="/register"
            className="text-gray-600 hover:text-gray-800 flex items-center"
          >
            <UserPlus size={20} className="inline-block mr-1" />
            Sign Up
          </Link>
        </nav>
      </div>
    </header>
  );
}