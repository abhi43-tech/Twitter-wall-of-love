import React, { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import defaultImage from "../images/Twitter-wall-of-love.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTwitter,
    faLinkedin,
    faGithub,
    faYoutube,
} from "@fortawesome/free-brands-svg-icons";

const MainPage = () => {
    const navigate = useNavigate();
    const [showBackToTop, setShowBackToTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowBackToTop(true);
            } else {
                setShowBackToTop(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="min-h-screen flex flex-col font-sans">
            {/* Header */}
            <header className="flex justify-between items-center px-8 py-5 shadow-md bg-white">
                <a href="/"><img src={defaultImage} alt="Logo" className="h-12 rounded-lg" /></a>
                <nav className="hidden md:flex space-x-8">
                    <a
                        href="#features"
                        className="text-gray-700 hover:text-blue-600 font-medium"
                    >
                        Features
                    </a>
                    <a
                        href="#how-it-works"
                        className="text-gray-700 hover:text-blue-600 font-medium"
                    >
                        How it Works
                    </a>
                    <a
                        href="#contact"
                        className="text-gray-700 hover:text-blue-600 font-medium"
                    >
                        Contact
                    </a>
                </nav>
                <div>
                    <button
                        onClick={() => navigate("/login")}
                        className="mr-4 text-gray-700 hover:text-blue-600 font-medium"
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => navigate("/signup")}
                        className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition"
                    >
                        Get Started
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <section className="flex flex-col md:flex-row items-center bg-gray-100 py-16 px-10">
                <div className="w-full md:w-1/2 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight text-gray-900">
                        Showcase Your Twitter Love in One Place
                    </h1>
                    <p className="text-gray-600 text-lg mb-6">
                        Easily create and manage customizable Twitter walls to
                        highlight the love from your community.
                    </p>
                    <button
                        onClick={() => navigate("/signup")}
                        className="bg-blue-600 text-white px-6 py-3 rounded-full text-lg hover:bg-blue-700 transition"
                    >
                        Start Your Free Trial
                    </button>
                </div>
                <div className="w-full md:w-1/2 flex justify-center mt-8 md:mt-0">
                    <img
                        src={defaultImage}
                        alt="Demo"
                        className="rounded-lg shadow-xl"
                    />
                </div>
            </section>

            
            {/* Features Section */}
            <section className="py-20 px-6 bg-white text-center" id="features">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
                    Build Your Perfect Tweet Wall
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
                    {[
                        {
                            icon: "🔐",
                            title: "Seamless Sign-Up",
                            text: "Sign up with email or Twitter OAuth, manage your account, and unlock API access.",
                        },
                        {
                            icon: "🛠️",
                            title: "Customizable Walls",
                            text: "Create multiple walls with custom titles, logos, and social links—public or private.",
                        },
                        {
                            icon: "📝",
                            title: "Easy Tweet Adding",
                            text: "Paste tweet links to auto-fetch details, then reorder or randomize with ease.",
                        },
                        {
                            icon: "🌍",
                            title: "Share Anywhere",
                            text: "Get a public link or embed your wall via iframe—perfect for any site.",
                        },
                        {
                            icon: "📱",
                            title: "Responsive Design",
                            text: "A stunning grid layout that shines on mobile, tablet, or desktop.",
                        },
                        {
                            icon: "🛡️",
                            title: "Full API Power",
                            text: "Control everything programmatically with our robust API-first design.",
                        },
                    ].map(({ icon, title, text }, index) => (
                        <div
                            key={index}
                            className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-all"
                        >
                            <span className="text-4xl mb-4 block">{icon}</span>
                            <h3 className="text-xl font-semibold mb-3 text-gray-800">
                                {title}
                            </h3>
                            <p className="text-gray-600">{text}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-20 px-6 bg-gray-100 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
                    How It Works
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
                    {[  
                        { 
                            step: "1", 
                            title: "Sign Up & Log In", 
                            text: "Create an account using your email or Twitter OAuth to start building your tweet wall." 
                        },
                        { 
                            step: "2", 
                            title: "Create Wall", 
                            text: "Simply create the wall with title and logo, then add tweets by pasting tweet links." 
                        },
                        { 
                            step: "3", 
                            title: "Share & Embed", 
                            text: "Generate a public link or embed the tweet wall anywhere using an iframe. Also you can use our API." 
                        }
                    ].map(({ step, title, text }, index) => (
                        <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
                            <span className="text-5xl font-bold text-blue-600 mb-4 block">{step}</span>
                            <h3 className="text-xl font-semibold mb-3 text-gray-800">{title}</h3>
                            <p className="text-gray-600">{text}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-indigo-600 text-white py-16 px-6 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    Ready to Showcase Your Community?
                </h2>
                <p className="text-lg md:text-xl mb-8 opacity-90">
                    Join now and start building your Twitter Wall of Love in
                    minutes.
                </p>
                <button
                    onClick={() => navigate("/signup")}
                    className="bg-white text-indigo-600 px-8 py-3 rounded-full font-semibold text-lg hover:bg-indigo-50 hover:shadow-md transition"
                >
                    Start for Free
                </button>
            </section>

            {showBackToTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-5 right-5 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
                >
                    ↑
                </button>
            )}

            {/* Footer */}
            <footer className="bg-gray-100 text-gray-800 py-12 px-6">
                <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {/* Product */}
                    <div>
                        <h4 className="font-semibold text-lg mb-3">Product</h4>
                        <ul className="space-y-2 text-gray-600">
                            <li>
                                <a href="#" className="hover:text-black">
                                    What's New
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-black">
                                    AI Site Builder
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-black">
                                    Webflow Library
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-black">
                                    Figma Library
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-black">
                                    React Library
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-black">
                                    Chrome Extension
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-black">
                                    Libraries
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-black">
                                    Pricing
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Power ups */}
                    <div>
                        <h4 className="font-semibold text-lg mb-3">
                            Power ups
                        </h4>
                        <ul className="space-y-2 text-gray-600">
                            <li>
                                <a href="#" className="hover:text-black">
                                    Relume Icons
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-black">
                                    Color Palettes
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-black">
                                    Attributes
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-black">
                                    Untitled UI
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-black">
                                    Learn
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-black">
                                    Webflow Style Guide
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-black">
                                    Client-First Docs
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Community */}
                    <div>
                        <h4 className="font-semibold text-lg mb-3">
                            Community
                        </h4>
                        <ul className="space-y-2 text-gray-600">
                            <li>
                                <a href="#" className="hover:text-black">
                                    Community Love
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-black">
                                    Showcase
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-black">
                                    Inspiration Feed
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-black">
                                    Voting Board
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-black">
                                    Slack
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-black">
                                    Request Components
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-black">
                                    Provide Feedback
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-black">
                                    Hire an Expert
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-semibold text-lg mb-3">Company</h4>
                        <ul className="space-y-2 text-gray-600">
                            <li>
                                <a href="#" className="hover:text-black">
                                    Careers{" "}
                                    <span className="text-red-500 bg-gray-200 px-2 py-1 text-xs rounded-md">
                                        Hiring!
                                    </span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-black">
                                    Contact Sales
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-black">
                                    Support
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-black">
                                    FAQ
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-black">
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-black">
                                    Terms & Conditions
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-black">
                                    Licensing Agreement
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-black">
                                    Cookie Settings
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Social Links */}
                <div className="flex justify-between items-center text-gray-600 text-sm mt-6" id="contact">
                    {/* Left Side: Logo and Copyright */}
                    <div className="flex items-center space-x-3">
                        <img
                            src={defaultImage}
                            alt="Your Logo"
                            className="w-12 rounded-full"
                        />
                        <p>
                            © {new Date().getFullYear()} Twitter Wall of Love.
                            All rights reserved.
                        </p>
                    </div>

                    {/* Right Side: Social Links */}
                    <div className="flex space-x-6" >
                        <a href="https://twitter.com" className="hover:text-black" target="_blank">
                            <FontAwesomeIcon icon={faTwitter} size="lg" />
                        </a>
                        <a href="https://linkedin.com" className="hover:text-black" target="_blank">
                            <FontAwesomeIcon icon={faLinkedin} size="lg" />
                        </a>
                        <a href="https://github.com" className="hover:text-black" target="_blank">
                            <FontAwesomeIcon icon={faGithub} size="lg" />
                        </a>
                        <a href="https://youtube.com" className="hover:text-black" target="_blank">
                            <FontAwesomeIcon icon={faYoutube} size="lg" />
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default MainPage;
