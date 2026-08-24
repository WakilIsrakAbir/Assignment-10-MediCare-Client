'use client';

import React from 'react';
import Link from 'next/link';
import { 
  HeartPulse, 
  PhoneCall, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck,
  ArrowRight,
  Ambulance,
  PhoneForwarded
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* 24/7 Emergency Hotline Banner */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-teal-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center animate-pulse">
              <Ambulance className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-red-100 block sm:inline mr-2">
                24/7 Medical Emergency Hotline:
              </span>
              <span className="font-extrabold text-base tracking-wide text-white">
                Call 999 / +1 (800) 432-5888
              </span>
            </div>
          </div>
          <a
            href="tel:+18004325888"
            className="inline-flex items-center gap-2 bg-white text-rose-700 hover:bg-rose-50 font-bold px-4 py-1.5 rounded-full text-xs shadow-md transition-transform hover:scale-105"
          >
            <PhoneForwarded className="w-3.5 h-3.5" /> Call Emergency Now
          </a>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Logo & Brand Info & Social Media Links */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center text-white shadow-md">
                <HeartPulse className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">
                MediCare<span className="text-teal-400">Connect</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              MediCare Connect is your trusted digital healthcare partner, bridging patient care with top verified physicians, seamless appointments, and secure electronic health records.
            </p>

            {/* Social Media Links */}
            <div className="space-y-2 pt-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Connect With Us</p>
              <div className="flex items-center gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-teal-600 hover:text-white flex items-center justify-center text-slate-400 transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-teal-600 hover:text-white flex items-center justify-center text-slate-400 transition-colors"
                  aria-label="Twitter"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-teal-600 hover:text-white flex items-center justify-center text-slate-400 transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                  </svg>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-teal-600 hover:text-white flex items-center justify-center text-slate-400 transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-white tracking-wide border-b border-slate-800 pb-2">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-teal-400 transition-colors flex items-center gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-teal-500" /> Home
                </Link>
              </li>
              <li>
                <Link href="/doctors" className="hover:text-teal-400 transition-colors flex items-center gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-teal-500" /> Find Verified Doctors
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-teal-400 transition-colors flex items-center gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-teal-500" /> About Our Mission
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-teal-400 transition-colors flex items-center gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-teal-500" /> Contact Support
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-teal-400 transition-colors flex items-center gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-teal-500" /> User Portal & Appointments
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Medical Services & Emergency Helpline */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-white tracking-wide border-b border-slate-800 pb-2">
              Departments & Care
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-teal-500"></span> Cardiology Diagnostics
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-teal-500"></span> Neurology & Brain Care
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-teal-500"></span> Orthopedic Surgery
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-teal-500"></span> Pediatric Wellness
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-teal-500"></span> Dermatology & Skin Clinic
              </li>
            </ul>
          </div>

          {/* Col 4: Contact Information & Emergency Hotline */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-white tracking-wide border-b border-slate-800 pb-2">
              Contact Information
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-teal-400 mt-1 shrink-0" />
                <span>450 Healthcare Boulevard, Suite 800, Medical City, NY 10001</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span>support@medicareconnect.com</span>
              </div>
              <div className="flex items-center gap-3">
                <PhoneCall className="w-4 h-4 text-teal-400 shrink-0" />
                <span>+1 (555) 019-2834</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Mon - Sun: 24/7 Available</span>
              </div>
              <div className="p-3 bg-red-950/40 border border-red-900/50 rounded-xl mt-2">
                <p className="text-[11px] font-bold uppercase text-red-400">Emergency Hotline</p>
                <a href="tel:999" className="text-sm font-extrabold text-white hover:text-red-300 transition-colors">
                  📞 999 / +1 (800) 432-5888
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Terms */}
        <div className="border-t border-slate-800 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} MediCare Connect. All rights reserved. Hospital Appointment & Healthcare Management System.</p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-teal-400 transition-colors">Privacy Policy</Link>
            <Link href="/about" className="hover:text-teal-400 transition-colors">Terms of Service</Link>
            <Link href="/contact" className="hover:text-teal-400 transition-colors">HIPAA Compliance</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

