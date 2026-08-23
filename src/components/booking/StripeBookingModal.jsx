'use client';

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import API from '../../services/api';
import { X, CreditCard, ShieldCheck, CheckCircle2, Lock, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_51MockPublishableKey1234567890abcdef'
);

function CheckoutForm({ doctor, selectedDay, selectedSlot, symptoms, onClose, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [cardHolder, setCardHolder] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    setLoading(true);

    try {
      // Step 1: Create Appointment in DB
      const apptRes = await API.post('/appointments', {
        doctorId: doctor._id,
        appointmentDate: selectedDay,
        appointmentTime: selectedSlot,
        symptoms: symptoms || 'General Medical Consultation',
        fee: doctor.consultationFee,
      });

      if (!apptRes.data.success) {
        throw new Error(apptRes.data.message || 'Failed to create appointment');
      }

      const appointment = apptRes.data.data;

      // Step 2: Request Stripe Payment Intent
      const intentRes = await API.post('/payments/create-intent', {
        amount: doctor.consultationFee,
        appointmentId: appointment._id,
      });

      // Step 3: Record Payment in DB
      const confirmRes = await API.post('/payments/confirm', {
        appointmentId: appointment._id,
        doctorId: doctor._id,
        amount: doctor.consultationFee,
        transactionId: `txn_stripe_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        paymentMethod: 'Stripe Card (Visa/Mastercard)',
      });

      if (confirmRes.data.success) {
        toast.success('Payment successful & Appointment confirmed!');
        onSuccess(appointment);
        onClose();
      }
    } catch (err) {
      console.error('Payment Error:', err);
      toast.error(err.response?.data?.message || err.message || 'Payment processing failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Appointment Summary Box */}
      <div className="bg-teal-50/70 border border-teal-200/80 rounded-2xl p-4 text-xs space-y-1.5">
        <div className="flex justify-between items-center text-teal-900 font-bold">
          <span>Specialist:</span>
          <span>{doctor.doctorName}</span>
        </div>
        <div className="flex justify-between items-center text-slate-600">
          <span>Schedule:</span>
          <span>{selectedDay} at {selectedSlot}</span>
        </div>
        <div className="flex justify-between items-center text-teal-950 font-extrabold text-sm pt-2 border-t border-teal-200">
          <span>Total Fee:</span>
          <span className="text-teal-700">${doctor.consultationFee}.00 USD</span>
        </div>
      </div>

      {/* Cardholder Name */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
          Cardholder Name
        </label>
        <input
          type="text"
          required
          placeholder="e.g. John Doe"
          value={cardHolder}
          onChange={(e) => setCardHolder(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-teal-500"
        />
      </div>

      {/* Stripe Card Element Box */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 flex items-center justify-between">
          <span>Credit / Debit Card</span>
          <span className="text-[11px] text-teal-600 font-semibold flex items-center gap-1">
            <Lock className="w-3 h-3" /> 256-bit Encrypted
          </span>
        </label>
        <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '14px',
                  color: '#1e293b',
                  '::placeholder': {
                    color: '#94a3b8',
                  },
                },
                invalid: {
                  color: '#ef4444',
                },
              },
            }}
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 shadow-lg shadow-teal-600/20 hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <span>Processing Stripe Payment...</span>
        ) : (
          <>
            <CreditCard className="w-4 h-4" /> Pay ${doctor.consultationFee} & Confirm
          </>
        )}
      </button>

      <p className="text-[11px] text-center text-slate-400">
        By clicking Pay, you authorize MediCare Connect to charge your card for the consultation fee.
      </p>
    </form>
  );
}

export default function StripeBookingModal({
  isOpen,
  onClose,
  doctor,
  selectedDay,
  selectedSlot,
  symptoms,
  onSuccess,
}) {
  if (!isOpen || !doctor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-teal-100 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Secure Stripe Checkout</h3>
            <p className="text-xs text-slate-500">Pay consultation fee to finalize booking</p>
          </div>
        </div>

        {/* Elements Form */}
        <Elements stripe={stripePromise}>
          <CheckoutForm
            doctor={doctor}
            selectedDay={selectedDay}
            selectedSlot={selectedSlot}
            symptoms={symptoms}
            onClose={onClose}
            onSuccess={onSuccess}
          />
        </Elements>
      </div>
    </div>
  );
}
