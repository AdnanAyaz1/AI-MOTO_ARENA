import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-10 ">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <Image
              src="/logo-white.png"
              alt="Logo"
              width={150}
              height={45}
              className="h-12 w-auto object-contain brightness-200" // Made logo brighter for dark background
            />
            <p className="mt-4 text-gray-400 text-sm">
              Your trusted platform for finding and comparing vehicles. We make car shopping easier and more informed.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/cars" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
                  Browse Cars
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-gray-400 text-sm">Email: info@example.com</li>
              <li className="text-gray-400 text-sm">Phone: (123) 456-7890</li>
              <li className="flex space-x-4 mt-4">
                <Facebook className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
                <Twitter className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
                <Instagram className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
                <Linkedin className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} MotoVerser Ai. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;