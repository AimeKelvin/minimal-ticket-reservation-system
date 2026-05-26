import React from 'react';
import { Link } from 'react-router-dom';
import { Bus, Twitter, Facebook, Instagram, Linkedin } from 'lucide-react';
export function Footer() {
  return (
    <footer className="bg-white border-t border-border pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="bg-secondary text-accent p-1.5 rounded-lg">
                <Bus size={20} />
              </div>
              <span className="text-xl font-bold tracking-tight text-ink">
                SwiftWheels
              </span>
            </Link>
            <p className="text-ink-muted text-sm leading-relaxed max-w-sm mb-8">
              Premium bus ticket reservation platform. Book reliable,
              comfortable, and safe journeys across Rwanda with our trusted
              operator network.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-ink-muted hover:text-accent transition-colors">
                
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-ink-muted hover:text-accent transition-colors">
                
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-ink-muted hover:text-accent transition-colors">
                
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-ink-muted hover:text-accent transition-colors">
                
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-ink mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-ink-muted">
              <li>
                <Link to="/search" className="hover:text-ink transition-colors">
                  Search Routes
                </Link>
              </li>
              <li>
                <Link
                  to="/tickets"
                  className="hover:text-ink transition-colors">
                  
                  My Tickets
                </Link>
              </li>
              <li>
                <Link to="/fleet" className="hover:text-ink transition-colors">
                  Fleet Manager
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-ink transition-colors">
                  Mobile App
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-ink mb-6">Popular Routes</h4>
            <ul className="space-y-4 text-sm text-ink-muted">
              <li>
                <Link
                  to="/search?source=Kigali&destination=Huye"
                  className="hover:text-ink transition-colors">
                  
                  Kigali → Huye
                </Link>
              </li>
              <li>
                <Link
                  to="/search?source=Kigali&destination=Musanze"
                  className="hover:text-ink transition-colors">
                  
                  Kigali → Musanze
                </Link>
              </li>
              <li>
                <Link
                  to="/search?source=Kigali&destination=Rubavu"
                  className="hover:text-ink transition-colors">
                  
                  Kigali → Rubavu
                </Link>
              </li>
              <li>
                <Link
                  to="/search?source=Kigali&destination=Nyagatare"
                  className="hover:text-ink transition-colors">
                  
                  Kigali → Nyagatare
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-ink mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-ink-muted">
              <li>
                <a href="#" className="hover:text-ink transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-ink transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-ink transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-ink transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-ink-subtle">
            © {new Date().getFullYear()} SwiftWheels. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-ink-subtle">
            <a href="#" className="hover:text-ink transition-colors">
              Support
            </a>
            <a href="#" className="hover:text-ink transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>);

}