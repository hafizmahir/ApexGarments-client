import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { useToast } from '../context/ToastContext.tsx';

export const Contact: React.FC = () => {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    document.title = 'Contact & Factory Inquiries - ApexGarments';
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
    showToast('Inquiry received! Our merchandising director will reply within 24 hours.', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Get in Touch with Merchandising
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Have an RFP, custom tech-pack inquiry, or looking to schedule a factory floor visit? Reach our merchandising desk directly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-6 shadow-xs">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Export Headquarters</h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 dark:text-slate-100">Factory Campus</strong>
                  <span className="text-slate-500">Plot 124-128, Sector 4, Dhaka EPZ, Savar, Dhaka 1349</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 dark:text-slate-100">Direct Commercial Desk</strong>
                  <span className="text-slate-500">+880 2 779 1234 / +1 (800) 427-6368</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 dark:text-slate-100">Sourcing & RFPs</strong>
                  <span className="text-slate-500">orders@garmentflow.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md">
            {isSent ? (
              <div className="text-center py-12 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Inquiry Dispatched</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Thank you for reaching out. A Senior Merchandiser has received your technical details.
                </p>
                <button
                  onClick={() => setIsSent(false)}
                  className="px-4 py-2 text-xs font-semibold text-indigo-600 hover:underline"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Work Email *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject / Order Reference *</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. Custom 5,000 Pcs Loopback Hoodie Quote"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Inquiry Details *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide details on target quantity, target delivery date, destination country..."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Inquiries</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
