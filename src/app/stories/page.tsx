'use client';

import { useState } from 'react';
import { useLang } from '@/lib/i18n';
import NavBar from '@/components/NavBar';

const TESTIMONIALS = [
  { name: 'Sarah Chen', trip: 'Everest Base Camp Trek', initials: 'SC', quote: 'The Everest Base Camp Trek is one of those adventures that changes everything. The breathtaking Himalayan views made me forget to breathe, and the Sherpa people became my heroes. Standing at the base of Mount Everest — that Everest — is something you never forget.' },
  { name: 'Marcus Weber', trip: 'Annapurna Circuit Trek', initials: 'MW', quote: 'The Annapurna Circuit is undoubtedly the world\'s most well-known trek for good reason. Crossing Thorong-La Pass at 5,416m with 360° views of Dhaulagiri, Annapurna, and Nilgiri was the most incredible moment of my life. The team made everything seamless.' },
  { name: 'Priya Sharma', trip: 'Upper Mustang Trek', initials: 'PS', quote: 'Upper Mustang is a life-changing adventure you won\'t find anywhere else in the world. The walled city of Lo Manthang took my breath away — monasteries, prayer wheels, and traditional mud-brick houses around every corner. Truly the Last Forbidden Kingdom.' },
  { name: 'James Morrison', trip: 'Manaslu Circuit Trek', initials: 'JM', quote: 'If you want a remote and wild trek far from the crowds, Manaslu is it. Crossing the Larkya La Pass with untouched Tibetan-influenced villages along the way was extraordinary. Our guide\'s expertise and calm presence made all the difference at high altitude.' },
  { name: 'Elena Rossi', trip: 'Langtang Valley Trek', initials: 'ER', quote: 'Langtang Valley exceeded all my expectations. The Tamang culture, the red panda sighting, the glacier views — every day was a new discovery. As a solo female traveler, I felt completely safe and supported the entire time.' },
  { name: 'David Kim', trip: 'Gokyo Lakes Trek', initials: 'DK', quote: 'The turquoise Gokyo Lakes are unreal — like something from another planet. Climbing Gokyo Ri at sunrise and seeing four 8000m peaks including Everest was the highlight of my trekking career. Highly recommend over the standard EBC route.' },
];

const GALLERY_ITEMS = [
  { title: 'Everest Sunrise', location: 'Everest Region', image: 'https://sfile.chatglm.cn/images-ppt/8f4b99205d53.jpg' },
  { title: 'Annapurna Trail', location: 'Annapurna Region', image: 'https://sfile.chatglm.cn/images-ppt/51dae135f694.jpeg' },
  { title: 'Prayer Flags', location: 'Multiple Regions', image: 'https://sfile.chatglm.cn/images-ppt/a584ed1012a4.jpg' },
  { title: 'Sherpa Village', location: 'Everest Region', image: 'https://sfile.chatglm.cn/images-ppt/fbbf0535de7f.jpg' },
  { title: 'Mountain Mist', location: 'Annapurna Region', image: 'https://sfile.chatglm.cn/images-ppt/a2a5f7dbfe1a.jpg' },
  { title: 'Tea House Lodge', location: 'Everest Region', image: 'https://sfile.chatglm.cn/images-ppt/8acd3895ccb2.jpg' },
  { title: 'Suspension Bridge', location: 'Multiple Regions', image: 'https://sfile.chatglm.cn/images-ppt/53a7a771425b.jpg' },
  { title: 'Thorong La Pass', location: 'Annapurna Region', image: 'https://sfile.chatglm.cn/images-ppt/f6ac0d61e23a.jpg' },
  { title: 'Base Camp', location: 'Everest Region', image: 'https://sfile.chatglm.cn/images-ppt/c0f8f8a55b8e.jpg' },
  { title: 'Ancient Monastery', location: 'Mustang Region', image: 'https://sfile.chatglm.cn/images-ppt/51746f7caf03.jpg' },
  { title: 'Yak Caravan', location: 'Everest Region', image: 'https://sfile.chatglm.cn/images-ppt/c3f423040db8.jpg' },
  { title: 'Rhododendron Forest', location: 'Annapurna Region', image: 'https://sfile.chatglm.cn/images-ppt/b68ff7ecfce6.jpg' },
];

const BLOG_POSTS = [
  { title: 'Everest Base Camp Trek: Complete 14-Day Itinerary', category: 'Itinerary', readTime: '12 min', excerpt: 'Everything you need to know about the EBC trek — day-by-day breakdown, acclimatization, costs, packing list, and insider tips from our guides.', image: 'https://sfile.chatglm.cn/images-ppt/931b93f13c50.jpg' },
  { title: 'Best Time to Trek in Nepal: Month-by-Month Guide', category: 'Guide', readTime: '8 min', excerpt: 'When to go, what to expect weather-wise, and which treks are best in each season. Spring, summer, monsoon, autumn, or winter — we cover it all.', image: 'https://sfile.chatglm.cn/images-ppt/beb25e4341d0.jpg' },
  { title: 'AMS: Preventing Altitude Sickness on Himalayan Treks', category: 'Safety', readTime: '10 min', excerpt: 'Altitude sickness is real. Learn the symptoms, prevention strategies, acclimatization techniques, and when to descend. Your safety depends on it.', image: 'https://sfile.chatglm.cn/images-ppt/eddc45d8a60a.jpg' },
  { title: 'Packing List for Himalayan Treks: The Ultimate Guide', category: 'Gear', readTime: '15 min', excerpt: 'Don\'t overpack, don\'t underpack. Our comprehensive packing list covers clothing, footwear, gear, electronics, and medications for every trek type.', image: 'https://sfile.chatglm.cn/images-ppt/bd16c81f7a2f.jpg' },
];

const FAQ_DATA = [
  { q: 'How far in advance should I book?', a: 'We recommend booking at least 3-6 months in advance for popular treks like EBC and Annapurna. For peak seasons (Oct-Nov and Mar-May), booking 6-12 months ahead ensures availability.', cat: 'Booking' },
  { q: 'What is included in the tour price?', a: 'Our tour prices include airport transfers, accommodation, meals during the trek, experienced guide and porter services, TIMS and conservation area permits, and emergency evacuation arrangements. International flights, travel insurance, and personal expenses are not included.', cat: 'Booking' },
  { q: 'What payment methods do you accept?', a: 'The payment is encrypted and transmitted securely with an SSL protocol. We accept Visa, Mastercard, bank transfers, and PayPal. A deposit is required to confirm your booking, with the balance due before departure.', cat: 'Payment' },
  { q: 'Can I customize my itinerary?', a: 'Yes! Our expertise lies in creating tailored itineraries that cater to your desired experience. Whether it\'s cultural exploration or extreme adventure such as trekking Mount Everest Base Camp, our team can help create a great trip plan according to your requirements.', cat: 'Booking' },
  { q: 'What permits do I need for trekking?', a: 'Most treks require a TIMS card and a conservation area permit. Restricted area treks like Upper Mustang and Upper Dolpo require special permits. We handle all permit arrangements for you.', cat: 'Permits' },
  { q: 'What is the best time to trek in Nepal?', a: 'Autumn (September to November) and Spring (March to May) are the best times for trekking in Nepal. The Annapurna and EBC treks are doable year-round, but these seasons offer the best conditions.', cat: 'Seasons' },
  { q: 'Is travel insurance mandatory?', a: 'Yes, comprehensive travel insurance covering high-altitude trekking (up to 6,000m), emergency helicopter evacuation, medical treatment, and trip cancellation is mandatory for all our expeditions.', cat: 'Insurance' },
  { q: 'What about altitude sickness?', a: 'We focus on keeping you safe through proper acclimatization. Our itineraries include acclimatization days built in for safety and comfort. Stay hydrated, ascend gradually, and follow your guide\'s advice. Our guides are trained to recognize and respond to altitude-related issues.', cat: 'Health' },
];

export default function StoriesPage() {
  const { t } = useLang();
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(null);
  const [faqCategory, setFaqCategory] = useState('All');

  const filteredFaqs = faqCategory === 'All' ? FAQ_DATA : FAQ_DATA.filter((f) => f.cat === faqCategory);
  const faqCats = ['All', 'Booking', 'Payment', 'Permits', 'Seasons', 'Insurance', 'Health'];

  return (
    <main className="min-h-screen bg-transparent text-[#f0f4f8] overflow-x-hidden relative z-0 pt-20">
      <NavBar />

      {/* Header */}
      <section className="py-12 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="pill-cinematic mb-6">📖 Stories & Reviews</span>
          <h1 className="font-cinematic text-5xl sm:text-6xl font-bold mt-6 mb-4 text-readable-hero">
            Trekker <span className="text-golden-shimmer italic">Stories</span>
          </h1>
          <p className="text-readable text-white text-lg max-w-2xl mx-auto">
            Real experiences from real trekkers. Read their stories, see their photos, and find answers to common questions.
          </p>
          <div className="divider-golden" />
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-cinematic text-4xl font-bold text-readable-strong mb-3">What Our <span className="text-golden-shimmer italic">Adventurers Say</span></h2>
            <p className="text-white">Real stories from real trekkers who explored the Himalayas with us</p>
            <div className="divider-golden" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((tm) => (
              <div key={tm.name} className="card-premium holo-sheen p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-himalaya-gold to-himalaya-orange flex items-center justify-center font-cinematic font-bold text-red-600">
                    {tm.initials}
                  </div>
                  <div>
                    <div className="font-display font-semibold text-white">{tm.name}</div>
                    <div className="text-xs text-white">{tm.trip}</div>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, s) => (
                    <svg key={s} className="w-4 h-4 text-himalaya-gold" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6 4.4 2.3 7.4-6.3-4.6-6.3 4.6L7.9 14 2 9.4h7.6z"/></svg>
                  ))}
                </div>
                <p className="text-white text-sm leading-relaxed">&ldquo;{tm.quote}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder — Kumar Lama */}
      <section className="px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="card-premium p-6 sm:p-10">
            <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
              <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-himalaya-gold/40 flex-shrink-0">
                <img src="/team/kumar-lama.jpg" alt="Kumar Lama" className="w-full h-full object-cover" />
              </div>
              <div className="text-center md:text-left">
                <span className="pill-cinematic mb-3">🏔️ Founder Story</span>
                <h2 className="font-cinematic text-3xl font-bold text-golden-shimmer mb-1">Kumar Lama</h2>
                <p className="text-himalaya-gold font-display text-sm mb-2">Founder & Managing Director</p>
                <p className="text-white text-xs">Tamang community · Kabhre Palanchok · Since 2013</p>
              </div>
            </div>
            <div className="space-y-4 text-white leading-relaxed">
              <p>
                I am from the hill district of Kabhre Palanchok, a half-day road trip from Kathmandu. As a member of the Tamang family, one of the indigenous hill groups of Nepal, born to work in the mountains, I started my career as a trekking porter and kitchen assistant before founding this agency in 2013.
              </p>
              <p>
                Your trip with our team means a lot to us. It&apos;s not just another trekking trip — it contributes to a group of local staff who care about their country, places, and fellow people. You are in good hands with us and will surely get a happy and lasting holiday!
              </p>
              <p>
                At Himalayan Exploration Treks, our team is committed to assisting you in discovering Nepal&apos;s breathtaking natural landscapes and diverse cultural heritage. We provide easy access to the wonders of Nepal and ensure everyone can enjoy them to the fullest.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-cinematic text-4xl font-bold text-readable-strong mb-3">From The <span className="text-golden-shimmer italic">Himalayas</span></h2>
            <p className="text-white">Real moments captured by our trekkers and guides</p>
            <div className="divider-golden" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {GALLERY_ITEMS.map((tile, i) => (
              <div key={i} className="ig-tile" style={{ backgroundImage: `url(${tile.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="ig-tile-overlay">
                  <div className="text-xs font-display text-white">{tile.title}</div>
                  <div className="text-[10px] text-white mt-0.5">📍 {tile.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog */}
      <section className="px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-cinematic text-4xl font-bold text-readable-strong mb-3">Travel <span className="text-golden-shimmer italic">Guides & Tips</span></h2>
            <p className="text-white">Expert advice from our team to help you prepare for your trek</p>
            <div className="divider-golden" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {BLOG_POSTS.map((post) => (
              <article key={post.title} className="card-premium overflow-hidden group cursor-pointer">
                <div className="relative h-40 overflow-hidden">
                  <img src={post.image} alt={post.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <span className="absolute top-3 left-3 text-[10px] px-2 py-0.5 rounded bg-black/50 text-white backdrop-blur-sm">{post.category}</span>
                  <h3 className="absolute bottom-3 left-3 right-3 font-cinematic text-lg font-bold text-white text-readable-strong">{post.title}</h3>
                </div>
                <div className="p-4">
                  <p className="text-white text-sm leading-relaxed mb-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-white">
                    <span>⏱ {post.readTime} read</span>
                    <span className="text-himalaya-gold">Read more →</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-cinematic text-4xl font-bold text-readable-strong mb-3">Frequently Asked <span className="text-golden-shimmer italic">Questions</span></h2>
            <p className="text-white">Everything you need to know before booking your trek</p>
            <div className="divider-golden" />
          </div>
          {/* Category filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {faqCats.map((c) => (
              <button
                key={c}
                onClick={() => setFaqCategory(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-display font-medium transition-all ${
                  faqCategory === c
                    ? 'bg-gradient-to-r from-himalaya-gold to-himalaya-orange text-red-600'
                    : 'glass-card-static text-white hover:text-himalaya-gold'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          {/* FAQ items */}
          <div className="space-y-3">
            {filteredFaqs.map((faq, i) => (
              <div key={faq.q} className="glass-card overflow-hidden">
                <button
                  onClick={() => setFaqOpenIndex(faqOpenIndex === i ? null : i)}
                  className="w-full text-left p-4 flex items-center justify-between gap-4"
                >
                  <span className="font-display font-semibold text-white text-sm">{faq.q}</span>
                  <svg className={`w-4 h-4 text-himalaya-gold flex-shrink-0 transition-transform ${faqOpenIndex === i ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                </button>
                {faqOpenIndex === i && (
                  <div className="px-4 pb-4 text-white text-sm leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto card-premium p-8">
          <h2 className="font-cinematic text-3xl font-bold text-readable-strong mb-3">Ready to Write Your Own Story?</h2>
          <p className="text-white mb-6">Join hundreds of trekkers who&apos;ve experienced the Himalayas with us.</p>
          <a href="/trekking" className="btn-cinematic">Browse Treks →</a>
        </div>
      </section>
    </main>
  );
}
