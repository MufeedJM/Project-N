import React, { useState } from 'react';
import { inquiryService } from '../../services/inquiryService';
import { useStore } from '../../context/StoreContext';
import { INITIAL_PRODUCTS } from '../../data/products';
import {
  MessageCircleQuestion,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  PhoneCall,
  Sparkles,
} from 'lucide-react';

export const QuestionForm: React.FC = () => {
  const { addToast } = useStore();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    varietyInterest: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const result = await inquiryService.submitInquiry(formData);
      setIsSubmitting(false);
      setSubmitted(true);
      addToast('Question Submitted', result.message, 'success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        varietyInterest: '',
        message: '',
      });
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg(err.message || 'Something went wrong. Please check your inputs.');
    }
  };

  return (
    <section id="question-section" className="py-16 sm:py-24 bg-earth-50/60 relative overflow-hidden">
      {/* Decorative leaf backdrop subtle circles */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-agro-200/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-gold-200/20 blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white rounded-3xl sm:rounded-4xl p-6 sm:p-10 lg:p-12 border border-agro-100 shadow-soft-xl">
          <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-agro-100 text-agro-800 text-xs font-bold mb-3 border border-agro-200">
              <HelpCircle className="w-3.5 h-3.5 text-agro-700" />
              <span>Agricultural Advisory Service</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-charcoal-900 font-display">
              Have a Question About Our Seeds?
            </h2>

            <p className="text-xs sm:text-sm text-charcoal-800/80 mt-2.5 leading-relaxed">
              Not sure which variety is right for you? Send us your question and our team of Sri
              Lankan agricultural specialists will help you select the ideal cultivar for your soil and season.
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-8 px-4 bg-agro-50/80 rounded-2xl border border-agro-200 max-w-md mx-auto animate-in zoom-in-95">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-agro-950 font-display">
                Question Received!
              </h3>
              <p className="text-xs text-charcoal-800/80 mt-1 leading-relaxed">
                Thank you! Our agronomist has received your message and will email you detailed
                guidance shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 text-xs font-bold text-agro-800 hover:text-agro-950 underline"
              >
                Send another question
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-charcoal-900 mb-1">
                    Your Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Mahinda Silva"
                    className="w-full px-4 py-2.5 rounded-xl border border-earth-200 bg-earth-50/50 text-xs sm:text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-agro-500/20 focus:border-agro-600"
                  />
                </div>

                {/* Email (Required) */}
                <div>
                  <label className="block text-xs font-bold text-charcoal-900 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. mahinda@gmail.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-earth-200 bg-earth-50/50 text-xs sm:text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-agro-500/20 focus:border-agro-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Phone (Optional) */}
                <div>
                  <label className="block text-xs font-bold text-charcoal-900 mb-1">
                    Phone Number <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. 077 123 4567"
                    className="w-full px-4 py-2.5 rounded-xl border border-earth-200 bg-earth-50/50 text-xs sm:text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-agro-500/20 focus:border-agro-600"
                  />
                </div>

                {/* Seed Variety of Interest */}
                <div>
                  <label className="block text-xs font-bold text-charcoal-900 mb-1">
                    Variety of Interest <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <select
                    name="varietyInterest"
                    value={formData.varietyInterest}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-earth-200 bg-earth-50/50 text-xs sm:text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-agro-500/20 focus:border-agro-600 cursor-pointer"
                  >
                    <option value="">-- General Agricultural Inquiry --</option>
                    {INITIAL_PRODUCTS.map((p) => (
                      <option key={p.id} value={`${p.name} (${p.variety})`}>
                        {p.name} - Variety: {p.variety}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Message / Question */}
              <div>
                <label className="block text-xs font-bold text-charcoal-900 mb-1">
                  Question / Message <span className="text-rose-500">*</span>
                </label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Ask about suitable soil types, planting season in your district (e.g. Kurunegala, Nuwara Eliya), fertilizer plans, pest resistance..."
                  className="w-full px-4 py-2.5 rounded-xl border border-earth-200 bg-earth-50/50 text-xs sm:text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-agro-500/20 focus:border-agro-600"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2 text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-agro-700 hover:bg-agro-800 active:scale-95 text-white font-bold text-sm shadow-soft transition disabled:bg-gray-400"
                >
                  {isSubmitting ? (
                    <span>Sending question...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Question</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-center pt-2">
                <span className="text-[11px] text-gray-500 flex items-center justify-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-agro-700" />
                  Urgent farming query? WhatsApp our agronomist directly at{' '}
                  <strong className="text-agro-800">+94 77 123 4567</strong>
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
