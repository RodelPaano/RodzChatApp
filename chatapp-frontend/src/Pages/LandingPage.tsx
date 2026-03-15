import React from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Users, Shield } from "lucide-react";
import FooterComponents from "../Components/FooterComponents";
import NavbarLandingPage from "../Components/NavbarLandingPageComponent";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-screen flex flex-col bg-gray-100">
      {/* Header */}
      <NavbarLandingPage />

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center  text-center px-62 py-12">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-gray-800">
          Welcome to ChatApp
        </h1>
        <p className="text-lg md:text-2xl mb-8 text-gray-600 max-w-2xl">
          Connect with your friends and family in real-time with secure and
          fast messaging.
        </p>

        {/* CTA Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            Get Started
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-12 px-6">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
          Why Choose ChatApp?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg shadow">
            <MessageSquare size={40} className="text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Real-Time Chat</h3>
            <p className="text-gray-600">
              Enjoy instant messaging with your friends and family anytime,
              anywhere.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg shadow">
            <Users size={40} className="text-green-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Community</h3>
            <p className="text-gray-600">
              Create groups and chatrooms to stay connected with your circle.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg shadow">
            <Shield size={40} className="text-purple-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
            <p className="text-gray-600">
              Your conversations are protected with top-notch security features.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <FooterComponents />
    </div>
  );
}