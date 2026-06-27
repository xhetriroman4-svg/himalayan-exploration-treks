'use client';

import { useState, useCallback } from 'react';
import { useLang } from '@/lib/i18n';
import NavBar from '@/components/NavBar';

export default function ContactPage() {
  const { t } = useLang();
  const [form, setForm] = useState({
    name: '', email: '', phone: '', subject: '', message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSubmitting(true);
    setResult(null);
    try {
      const res = await fetch('/api/custom-package', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destinations: [form.subject || 'General Inquiry'],
          startDate: '',
          duration: 0,
          travelers: 1,
          budget: 'flexible',
          name: form.name,
          email: form.email,
          phone: form.phone,
          nationality: '',
          message: form.message,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(`✓ Message sent! Reference: ${data.ref}. We'll respond within 24 hours.`);
        setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        setResult('Something went wrong. Please try again.');
      }
    } catch {
      setResult('Network error. Please try again or WhatsApp us directly.');
    } finally {
      setSubmitting(false);
    }
  }, [form]);

  return (
    <main className="min-h-screen bg-transparent text-[#f0f4f8] overflow-x-hidden relative z-0 pt-20">
      <NavBar />

      {/* Header */}
      <section className="py-12 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="pill-cinematic mb-6">💬 Get In Touch</span>
          <h1 className="font-cinematic text-5xl sm:text-6xl font-bold mt-6 mb-4 text-readable-hero">
            Contact <span className="text-golden-shimmer italic">Us</span>
          </h1>
          <p className="text-readable text-white text-lg max-w-2xl mx-auto">
            Have questions about our treks, custom packages, or anything else? We&apos;re here to help you plan your Himalayan adventure.
          </p>
          <div className="divider-golden" />
        </div>
      </section>

      {/* Contact info cards */}
      <section className="px-4 mb-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* WhatsApp */}
          <a
            href="https://wa.me/9779841023371?text=Namaste! I have a question about your treks."
            target="_blank"
            rel="noopener noreferrer"
            className="card-premium p-6 text-center group"
          >
            <div className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}>
              <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </div>
            <h3 className="font-cinematic text-xl font-bold text-white mb-1">WhatsApp</h3>
            <p className="text-himalaya-gold font-display text-sm mb-2">+977 9841023371</p>
            <p className="text-xs text-white">Fastest response — chat now</p>
          </a>

          {/* Email */}
          <a href="mailto:info@himalayanexploration.com" className="card-premium p-6 text-center group">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-himalaya-gold to-himalaya-orange flex items-center justify-center">
              <svg className="w-7 h-7 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </div>
            <h3 className="font-cinematic text-xl font-bold text-white mb-1">Email</h3>
            <p className="text-himalaya-gold font-display text-sm mb-2 break-all">info@himalayanexploration.com</p>
            <p className="text-xs text-white">We reply within 24 hours</p>
          </a>

          {/* Office */}
          <div className="card-premium p-6 text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-himalaya-teal to-himalaya-blue flex items-center justify-center">
              <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <h3 className="font-cinematic text-xl font-bold text-white mb-1">Office</h3>
            <p className="text-himalaya-gold font-display text-sm mb-2">Kathmandu, Nepal</p>
            <p className="text-xs text-white">Thamel, Kathmandu Metropolitan City</p>
          </div>
        </div>
      </section>

      {/* Customer support form */}
      <section className="px-4 pb-16">
        <div className="max-w-3xl mx-auto">
          <div className="card-premium p-6 sm:p-8">
            <div className="text-center mb-6">
              <h2 className="font-cinematic text-3xl font-bold text-readable-strong mb-2">Send Us a Message</h2>
              <p className="text-white text-sm">Fill out the form below and our team will get back to you within 24 hours.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-white font-display mb-1 block">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    className="input-cinematic"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="text-sm text-white font-display mb-1 block">Email *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({...form, email: e.target.value})}
                    className="input-cinematic"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="text-sm text-white font-display mb-1 block">Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({...form, phone: e.target.value})}
                    className="input-cinematic"
                    placeholder="+1 234 567 890"
                  />
                </div>
                <div>
                  <label className="text-sm text-white font-display mb-1 block">Subject</label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({...form, subject: e.target.value})}
                    className="form-select w-full"
                  >
                    <option value="">Select a topic</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Trek Booking">Trek Booking</option>
                    <option value="Custom Package">Custom Package</option>
                    <option value="Pricing & Quotes">Pricing & Quotes</option>
                    <option value="Visa & Permits">Visa & Permits</option>
                    <option value="Travel Insurance">Travel Insurance</option>
                    <option value="Gear & Packing">Gear & Packing</option>
                    <option value="Feedback">Feedback</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm text-white font-display mb-1 block">Message *</label>
                <textarea
                  required
                  value={form.message}
                  onChange={(e) => setForm({...form, message: e.target.value})}
                  rows={6}
                  className="input-cinematic !rounded-2xl resize-none"
                  placeholder="Tell us about your trekking plans, questions, or how we can help..."
                />
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <p className="text-xs text-white text-center sm:text-left">
                  Or message us directly on WhatsApp for instant response.
                </p>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-cinematic disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Sending...' : 'Send Message →'}
                </button>
              </div>
              {result && (
                <div className="p-4 rounded-xl bg-himalaya-emerald/10 border border-himalaya-emerald/30 text-center">
                  <p className="text-himalaya-emerald font-display font-semibold">{result}</p>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Quick FAQ teaser */}
      <section className="px-4 pb-16">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="font-cinematic text-2xl font-bold text-readable-strong mb-4">Quick Answers</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="glass-card p-4 text-left">
              <p className="text-himalaya-gold text-sm font-display font-semibold mb-1">Best time to trek?</p>
              <p className="text-white text-xs">Autumn (Sep-Nov) and Spring (Mar-May) offer the best weather and mountain views.</p>
            </div>
            <div className="glass-card p-4 text-left">
              <p className="text-himalaya-gold text-sm font-display font-semibold mb-1">Need travel insurance?</p>
              <p className="text-white text-xs">Yes, comprehensive insurance covering high-altitude trekking and emergency evacuation is mandatory.</p>
            </div>
            <div className="glass-card p-4 text-left">
              <p className="text-himalaya-gold text-sm font-display font-semibold mb-1">How far in advance to book?</p>
              <p className="text-white text-xs">3-6 months for popular treks; 6-12 months for peak season (Oct-Nov, Mar-May).</p>
            </div>
            <div className="glass-card p-4 text-left">
              <p className="text-himalaya-gold text-sm font-display font-semibold mb-1">Payment methods?</p>
              <p className="text-white text-xs">Visa, Mastercard, PayPal, bank transfer, and eSewa. Deposit required to confirm.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
