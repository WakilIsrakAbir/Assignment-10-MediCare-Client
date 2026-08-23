'use client';

import React, { useEffect, useState } from 'react';
import API from '../../services/api';
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
          // Fallback testimonials
          setReviews([
            {
              _id: 'r1',
              patientName: 'Emma Watson',
              patientRole: 'Patient (Heart Care)',
              patientPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
              rating: 5,
              reviewText: 'Dr. Sarah Jenkins made me feel completely relaxed during my consultation. Her diagnosis was spot on and the treatment plan improved my stamina tremendously!',
            },
            {
              _id: 'r2',
              patientName: 'Liam Hemsworth',
              patientRole: 'Patient (Neurology)',
              patientPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
              rating: 5,
              reviewText: 'The online booking was flawless, and Dr. Marcus Vance took the time to answer all my questions about migraine management. Outstanding service!',
            },
            {
              _id: 'r3',
              patientName: 'Sophia Miller',
              patientRole: 'Mother of 4-year-old',
              patientPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
              rating: 5,
              reviewText: 'Dr. Elena Rostova is the gentlest pediatrician we have ever met. My son was calm and happy throughout the visit. Highly recommended!',
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
    <section className="py-20 bg-teal-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-100 px-3.5 py-1.5 rounded-full">
            Real Experiences
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Patient Success Stories & Testimonials
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Read verified feedback from patients who booked consultations and received treatments via MediCare Connect.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.slice(0, 3).map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl border border-slate-200/80 transition-all duration-300 flex flex-col justify-between relative group"
            >
              <div className="absolute top-6 right-6 text-teal-200 group-hover:text-teal-400 transition-colors">
                <Quote className="w-10 h-10" />
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
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    {item.patientName}
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    {item.patientRole || 'Verified Patient'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
