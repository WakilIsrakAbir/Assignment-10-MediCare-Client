'use client';

import React, { useState } from 'react';
import { Mail, PhoneCall, MapPin, Clock, Send, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Your message has been sent to our medical support team.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-100/80 px-3.5 py-1.5 rounded-full">
            24/7 Patient Support
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Get in Touch With MediCare
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Have questions about doctor appointments, hospital facilities, or technical assistance? We are here 24 hours a day to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                <PhoneCall className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Emergency & General Help</h4>
                <p className="text-xs text-slate-500 mt-0.5">24/7 Dispatch and appointment helpdesk</p>
                <p className="text-sm font-extrabold text-teal-700 mt-2">+1 (800) 456-7890 / +1 (555) 019-2834</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-600 shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Email Inquiry</h4>
                <p className="text-xs text-slate-500 mt-0.5">We respond within 2 business hours</p>
                <p className="text-sm font-extrabold text-cyan-700 mt-2">support@medicareconnect.com</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Medical Headquarters</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  450 Healthcare Boulevard, Suite 800, Medical City, NY 10001
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Send Us a Direct Message</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. John Doe"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 placeholder-slate-500 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 placeholder-slate-500 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Inquiry about doctor scheduling or clinic"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 placeholder-slate-500 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Message</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your inquiry or question..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 placeholder-slate-500 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20"
                ></textarea>
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 shadow-md transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" /> Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
