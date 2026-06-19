#!/usr/bin/env python3
"""Replace the checkout overlay with a simplified WhatsApp-booking version."""

with open('/home/z/my-project/src/app/page.tsx', 'r') as f:
    content = f.read()

# Find the checkout overlay start and end
start_marker = '      {/* ═══════════ 25. CHECKOUT OVERLAY ═══════════ */}'
end_marker = '    </main>\n  );\n}'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print("ERROR: Could not find markers")
    exit(1)

new_checkout = '''      {/* ═══════════ 25. BOOKING OVERLAY — Simplified, sends to WhatsApp ═══════════ */}
      {checkoutOpen && selectedTour && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" ref={checkoutRef}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) closeCheckout(); }} />

          {/* Modal */}
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto glass-card-strong rounded-2xl">
            {/* Close button */}
            <button onClick={closeCheckout} className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>

            {/* Tour Summary Bar */}
            <div className="p-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={selectedTour.image} alt={selectedTour.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h2 className="font-cinematic text-lg font-bold text-white">{selectedTour.title}</h2>
                  <div className="flex items-center gap-2 text-xs text-white">
                    <span>{selectedTour.days} Days</span>
                    <span>·</span>
                    <span>{selectedTour.altitude}</span>
                    <span>·</span>
                    <span className="font-cinematic text-golden-shimmer font-bold">${selectedTour.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              {checkoutStep === 'details' && (
                <div className="space-y-4">
                  <div className="text-center mb-2">
                    <h3 className="font-cinematic text-xl font-bold text-white mb-1">Book This Trek</h3>
                    <p className="text-xs text-white">Fill in your details — we&apos;ll confirm via WhatsApp.</p>
                  </div>

                  <div>
                    <label className="text-sm text-white font-display mb-1 block">Full Name *</label>
                    <input
                      type="text"
                      value={bookingForm.fullName}
                      onChange={(e) => setBookingForm(p => ({ ...p, fullName: e.target.value }))}
                      className="form-input w-full"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-white font-display mb-1 block">Email Address *</label>
                    <input
                      type="email"
                      value={bookingForm.email}
                      onChange={(e) => setBookingForm(p => ({ ...p, email: e.target.value }))}
                      className="form-input w-full"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-white font-display mb-1 block">WhatsApp Number *</label>
                    <input
                      type="tel"
                      value={bookingForm.whatsapp}
                      onChange={(e) => setBookingForm(p => ({ ...p, whatsapp: e.target.value }))}
                      className="form-input w-full"
                      placeholder="+977 98XXXXXXXX"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm text-white font-display mb-1 block">Nationality *</label>
                      <input
                        type="text"
                        value={bookingForm.nationality}
                        onChange={(e) => setBookingForm(p => ({ ...p, nationality: e.target.value }))}
                        className="form-input w-full"
                        placeholder="e.g., Nepali"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-white font-display mb-1 block">Current Location *</label>
                      <input
                        type="text"
                        value={bookingForm.currentLocation}
                        onChange={(e) => setBookingForm(p => ({ ...p, currentLocation: e.target.value }))}
                        className="form-input w-full"
                        placeholder="City, Country"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-white font-display mb-1 block">Message <span className="text-white">(optional)</span></label>
                    <textarea
                      value={bookingForm.message}
                      onChange={(e) => setBookingForm(p => ({ ...p, message: e.target.value }))}
                      className="form-input w-full"
                      rows={3}
                      placeholder="Any questions or special requests..."
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (!bookingForm.fullName || !bookingForm.email || !bookingForm.whatsapp || !bookingForm.nationality || !bookingForm.currentLocation) {
                        alert('Please fill in all required fields.');
                        return;
                      }
                      submitBooking();
                    }}
                    disabled={isSubmitting}
                    className="btn-cinematic w-full disabled:opacity-50"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Booking via WhatsApp →'}
                  </button>

                  <p className="text-xs text-white text-center">
                    Your details will be sent to our WhatsApp (<span className="text-himalaya-gold">+977 9841023371</span>) for confirmation.
                  </p>
                </div>
              )}

              {checkoutStep === 'confirmation' && bookingResult && (
                <div className="text-center py-4">
                  {/* Success animation */}
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-himalaya-emerald/20 flex items-center justify-center animate-bounce-gentle">
                    <svg className="w-10 h-10 text-himalaya-emerald" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/>
                    </svg>
                  </div>

                  <h3 className="font-cinematic text-2xl font-bold text-white mb-2">Booking Sent!</h3>
                  <p className="text-sm text-white mb-6">{bookingResult}</p>

                  <div className="glass-card-static p-4 rounded-xl mb-6 max-w-sm mx-auto">
                    <div className="text-xs text-white mb-2">Your booking details for:</div>
                    <div className="font-cinematic text-lg font-bold text-himalaya-gold mb-2">{selectedTour.title}</div>
                    <div className="text-xs text-white space-y-1 text-left">
                      <div>👤 {bookingForm.fullName}</div>
                      <div>✉️ {bookingForm.email}</div>
                      <div>💬 {bookingForm.whatsapp}</div>
                      <div>🌍 {bookingForm.nationality}</div>
                      <div>📍 {bookingForm.currentLocation}</div>
                    </div>
                  </div>

                  <p className="text-xs text-white mb-6">
                    If WhatsApp didn&apos;t open automatically, click below:
                  </p>

                  <a
                    href={`https://wa.me/9779841023371?text=${encodeURIComponent(`🏔️ BOOKING REQUEST\\n\\nTour: ${selectedTour.title}\\nName: ${bookingForm.fullName}\\nEmail: ${bookingForm.email}\\nWhatsApp: ${bookingForm.whatsapp}\\nNationality: ${bookingForm.nationality}\\nLocation: ${bookingForm.currentLocation}\\n${bookingForm.message ? 'Message: ' + bookingForm.message : ''}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-cinematic inline-block"
                  >
                    Open WhatsApp Manually
                  </a>

                  <div className="mt-4">
                    <button onClick={closeCheckout} className="text-sm text-white hover:text-himalaya-gold transition-colors">
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
'''

new_content = content[:start_idx] + new_checkout + '\n' + content[end_idx:]

with open('/home/z/my-project/src/app/page.tsx', 'w') as f:
    f.write(new_content)

print(f"Old length: {len(content)} chars")
print(f"New length: {len(new_content)} chars")
print(f"Removed: {len(content) - len(new_content)} chars")
print("Done.")
