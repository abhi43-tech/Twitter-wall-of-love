import React from "react";
import { useNavigate } from "react-router-dom";
import defaultImage from "../images/Twitter-wall-of-love.png"; // Replace with your logo

const MainPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <img
            src={defaultImage}
            alt="Twitter Wall of Love Logo"
            className="w-20 h-20 md:w-28 md:h-28 mx-auto mb-6 rounded-full border-4 border-white shadow-lg"
          />
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
            Twitter Wall of Love
          </h1>
          <p className="text-lg md:text-2xl max-w-2xl mx-auto mb-8 leading-relaxed opacity-90">
            Turn your community’s tweets into a stunning, customizable showcase
            — shareable anywhere.
          </p>
          <div className="flex justify-center gap-4 flex-col sm:flex-row">
            <button
              onClick={() => navigate("/signup")}
              className="bg-white text-indigo-600 px-8 py-3 rounded-full font-semibold text-lg hover:bg-indigo-50 hover:shadow-md transition-all duration-300"
            >
              Get Started Free
            </button>
            <button
              onClick={() => navigate("/login")}
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-white hover:text-indigo-600 hover:shadow-md transition-all duration-300"
            >
              Log In
            </button>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">
            Build Your Perfect Tweet Wall
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
              <span className="text-3xl mb-4 block">🔐</span>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                Seamless Sign-Up
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Sign up with email or Twitter OAuth, manage your account, and
                unlock API access.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
              <span className="text-3xl mb-4 block">🛠️</span>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                Customizable Walls
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Create multiple walls with custom titles, logos, and social
                links—public or private.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
              <span className="text-3xl mb-4 block">📝</span>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                Easy Tweet Adding
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Paste tweet links to auto-fetch details, then reorder or
                randomize with ease.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
              <span className="text-3xl mb-4 block">🌍</span>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                Share Anywhere
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Get a public link or embed your wall via iframe—perfect for any
                site.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
              <span className="text-3xl mb-4 block">📱</span>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                Responsive Design
              </h3>
              <p className="text-gray-600 leading-relaxed">
                A stunning grid layout that shines on mobile, tablet, or
                desktop.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
              <span className="text-3xl mb-4 block">🛡️</span>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                Full API Power
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Control everything programmatically with our robust API-first
                design.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Showcase Your Community?
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Join now and start building your Twitter Wall of Love in minutes.
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="bg-white text-indigo-600 px-8 py-3 rounded-full font-semibold text-lg hover:bg-indigo-50 hover:shadow-md transition-all duration-300"
          >
            Start for Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="mb-2">
              © {new Date().getFullYear()} Twitter Wall of Love
            </p>
            <p className="text-sm opacity-75">Built with ❤️ by [Your Name]</p>
          </div>
          <div className="flex justify-center gap-8">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
            >
              Twitter
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainPage;