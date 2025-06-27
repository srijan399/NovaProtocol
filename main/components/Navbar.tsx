import { Menu, Shield, X } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { useState } from "react";
import { ConnectKitButton } from "connectkit";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <>
      {/* Floating Navigation */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-black/20 backdrop-blur-lg border border-gray-700/50 rounded-full px-6 py-3 shadow-2xl">
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-cyan-400" />
              <span className="font-bold text-xl">Aegis</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              href="/"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Features
            </Link>
            <Link
              href="/"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Docs
            </Link>
            <ConnectKitButton />
            {/* <Button
              variant="outline"
              className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/20"
            >
              Launch App
            </Button> */}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 mt-2 bg-black/90 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-4">
            <div className="flex flex-col space-y-3">
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors py-2"
              >
                Home
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors py-2"
              >
                Features
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors py-2"
              >
                Docs
              </a>
              {/* <Button
                variant="outline"
                className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/20 mt-2"
              >
                Launch App
              </Button> */}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
