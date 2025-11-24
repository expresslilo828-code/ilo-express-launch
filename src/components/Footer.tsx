import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import logoImage from "@/assets/logolilo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-lilo-dark text-lilo-offwhite">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src={logoImage}
                alt="Lilo Express Logo"
                className="h-20 w-auto object-contain bg-white/90 p-1 rounded-lg"
                loading="lazy"
              />
              <div>
                <h3 className="font-bold text-lg">Lilo Express LLC</h3>
                <p className="text-xs text-lilo-beige">Transportation Compliance</p>
              </div>
            </div>
            <p className="text-sm text-lilo-beige mb-4">
              Your trusted partner for DOT compliance, business formation, and transportation services.
            </p>
            <div className="flex gap-3">
              <a href="#" className="hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-lilo-beige hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-lilo-beige hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-lilo-beige hover:text-primary transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="text-lilo-beige hover:text-primary transition-colors">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-lilo-beige hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-lg mb-4">Our Services</h4>
            <ul className="space-y-2 text-lilo-beige">
              <li>DOT Compliance</li>
              <li>Business Formation</li>
              <li>UCR Registration</li>
              <li>MC Authority</li>
              <li>IFTA Registration</li>
              <li>Compliance Consulting</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3 text-lilo-beige">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">123 Business Ave, Suite 100<br />City, State 12345</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                <a href="tel:+1234567890" className="hover:text-primary transition-colors">
                  (123) 456-7890
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                <a href="mailto:info@liloexpress.com" className="hover:text-primary transition-colors">
                  info@liloexpress.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-lilo-brown mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-lilo-beige">
            <div className="flex flex-col md:flex-row items-center gap-2">
              <p>&copy; {currentYear} Lilo Express LLC. All rights reserved.</p>
              <span className="hidden md:inline text-lilo-brown">|</span>
              <p className="flex items-center gap-1">
                Powered by <a href="https://wa.me/251913901952" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 font-medium transition-colors">Haileab Shimels</a>
              </p>
            </div>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;