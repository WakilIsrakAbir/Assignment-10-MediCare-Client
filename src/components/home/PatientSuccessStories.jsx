'use client';

import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import { motion } from 'framer-motion';
import { Star, Quote, CheckCircle2, User } from 'lucide-react';

export default function PatientSuccessStories() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await API.get('/reviews/featured');
        if (res.data.success && res.data.data.length > 0) {
          setReviews(res.data.data);
        } else {
          setReviews([
            {
              _id: 'r1',
              patientName: 'Emma Watson',
              patientRole: 'Patient (Heart Care)',
              patientPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
              rating: 5,
              reviewText: 'Dr. Sarah Jenkins made me feel completely relaxed during my consultation. Her diagnosis was spot on and the treatment plan improved my health tremendously!',
            },
            {
              _id: 'r2',
              patientName: 'Liam Hemsworth',
              patientRole: 'Patient (Neurology)',
              patientPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
              rating: 5,
              reviewText: 'The online booking was flawless, and the doctor took the time to answer all my questions about migraine management. Outstanding healthcare service!',
            },
            {
              _id: 'r3',
              patientName: 'Sophia Miller',
              patientRole: 'Mother of 4-year-old',
              patientPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
              rating: 5,
              reviewText: 'Gentle pediatric care and transparent booking. My son was calm and happy throughout the visit. Highly recommended to all parents!',
            },
          ]);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return (
    <section className="py-24 bg-gradient-to-b from-teal-50/50 via-slate-50/60 to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Motion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-100/90 px-3.5 py-1.5 rounded-full border border-teal-200">
            Real Experiences
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 tracking-tight">
            Patient Success Stories & Testimonials
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Read verified feedback from patients who booked consultations and received care via MediCare Connect.
          </p>
        </motion.div>

        {/* Testimonials Grid with Stagger */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.slice(0, 3).map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: index * 0.15, duration: 0.7 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white rounded-3xl p-8 shadow-xs hover:shadow-2xl border border-slate-200/80 transition-all duration-300 flex flex-col justify-between relative group"
            >
              <div className="absolute top-6 right-6 text-teal-100 group-hover:text-teal-300 transition-colors">
                <Quote className="w-12 h-12" />
              </div>

              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(item.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                <p className="text-slate-700 text-sm sm:text-base leading-relaxed italic relative z-10">
                  &ldquo;{item.reviewText}&rdquo;
                </p>
              </div>

              {/* Patient Profile */}
              <div className="flex items-center gap-4 mt-8 pt-6 border-t border-slate-100">
                <img
                  src={item.patientPhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
                  alt={item.patientName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-teal-500 shadow-xs"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{item.patientName}</h4>
                  <p className="text-xs text-slate-500">{item.patientRole || 'Verified Patient'}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
