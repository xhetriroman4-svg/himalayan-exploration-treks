'use client';

import { useLang } from '@/lib/i18n';
import NavBar from '@/components/NavBar';

const TEAM_MEMBERS = [
  { name: 'Kumar Lama', role: 'Founder & Managing Director', initials: 'KL', image: '/team/kumar-lama.jpg', bio: 'Born in Kabhre Palanchok, Kumar started as a trekking porter and kitchen assistant before founding Himalayan Exploration Treks in 2013. A member of the indigenous Tamang community, he works with guides who love their country and try to make a difference by working in their villages and mountains.', gradient: 'from-himalaya-gold/40 to-himalaya-gold/15' },
  { name: 'Pushpa Tamang', role: 'Australia Representative', initials: 'PT', bio: 'Based in Campsie, NSW, Pushpa handles international inquiries and bookings for our Australian clients, ensuring seamless coordination across time zones.', gradient: 'from-himalaya-teal/40 to-himalaya-teal/15' },
  { name: 'Senior Trekking Guide', role: 'Head Guide', initials: 'SG', bio: 'Our lead guides are tourism experts with deep knowledge of local culture and history. They possess a deep understanding of the mountains and ensure every trekker\'s safety and enjoyment.', gradient: 'from-himalaya-blue/40 to-himalaya-blue/15' },
  { name: 'Operations Team', role: 'Logistics & Support', initials: 'OT', bio: 'Our Kathmandu-based operations team ensures every expedition runs seamlessly — from airport pickups and hotel bookings to permit arrangements and emergency support, 24/7.', gradient: 'from-himalaya-emerald/40 to-himalaya-emerald/15' },
];

const VALUES = [
  { icon: '🏔️', title: 'Authentic Adventure', desc: 'Real Himalayan experiences crafted by locals who know every trail, village, and hidden viewpoint.' },
  { icon: '🛡️', title: 'Safety First', desc: 'Your safety is our priority. Trained guides, proper acclimatization, and 24/7 emergency support on every trek.' },
  { icon: '🤝', title: 'Community Driven', desc: 'We employ local staff, support village economies, and ensure your trip contributes to the communities you visit.' },
  { icon: '🌱', title: 'Responsible Travel', desc: 'Leave-no-trace principles, environmental conservation, and respect for local culture and traditions.' },
];

export default function AboutPage() {
  const { t } = useLang();

  return (
    <main className="min-h-screen bg-transparent text-[#f0f4f8] overflow-x-hidden relative z-0 pt-20">
      <NavBar />

      {/* Header */}
      <section className="py-12 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="pill-cinematic mb-6">🏔️ Our Story</span>
          <h1 className="font-cinematic text-5xl sm:text-6xl font-bold mt-6 mb-4 text-readable-hero">
            About <span className="text-golden-shimmer italic">Us</span>
          </h1>
          <p className="text-readable text-white text-lg max-w-2xl mx-auto">
            A small company based in Kathmandu, providing adventure travel packages that deliver amazing adventures since 2013.
          </p>
          <div className="divider-golden" />
        </div>
      </section>

      {/* Founder story */}
      <section className="px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="card-premium p-6 sm:p-10">
            <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
              <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-himalaya-gold/40 flex-shrink-0">
                <img src="/team/kumar-lama.jpg" alt="Kumar Lama" className="w-full h-full object-cover" />
              </div>
              <div className="text-center md:text-left">
                <h2 className="font-cinematic text-3xl font-bold text-golden-shimmer mb-1">Kumar Lama</h2>
                <p className="text-himalaya-gold font-display text-sm mb-2">Founder & Managing Director</p>
                <p className="text-white text-xs">Tamang community • Kabhre Palanchok • Since 2013</p>
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

      {/* Values */}
      <section className="px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-cinematic text-4xl font-bold text-readable-strong mb-3">Our <span className="text-golden-shimmer italic">Values</span></h2>
            <p className="text-white">What we stand for and why trekkers choose us</p>
            <div className="divider-golden" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v) => (
              <div key={v.title} className="card-premium p-6 text-center">
                <div className="text-4xl mb-3">{v.icon}</div>
                <h3 className="font-cinematic text-lg font-bold text-himalaya-gold mb-2">{v.title}</h3>
                <p className="text-white text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-cinematic text-4xl font-bold text-readable-strong mb-3">Meet Our <span className="text-golden-shimmer italic">Team</span></h2>
            <p className="text-white">The people who make your Himalayan dreams come true</p>
            <div className="divider-golden" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {TEAM_MEMBERS.map((member) => (
              <div key={member.name} className="glass-card p-4 text-center">
                {member.image ? (
                  <div className={`w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden bg-gradient-to-br ${member.gradient} ring-2 ring-himalaya-gold/40 flex items-center justify-center`}>
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                ) : (
                  <div className={`w-14 h-14 mx-auto mb-3 rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center text-lg font-bold text-himalaya-gold`}>
                    {member.initials}
                  </div>
                )}
                <h4 className="font-semibold text-sm text-white">{member.name}</h4>
                <div className="text-xs text-himalaya-gold mb-2">{member.role}</div>
                <p className="text-[11px] text-white leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto card-premium p-8">
          <h2 className="font-cinematic text-3xl font-bold text-readable-strong mb-3">Ready to Trek With Us?</h2>
          <p className="text-white mb-6">Browse our 16 trekking packages or build a custom itinerary tailored to your wishes.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/trekking" className="btn-cinematic">View All Treks →</a>
            <a href="/contact" className="btn-outline-cinematic">Contact Us</a>
          </div>
        </div>
      </section>
    </main>
  );
}
