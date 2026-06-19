'use client';

import { useState, useCallback } from 'react';
import { useLang } from '@/lib/i18n';

const FEATURES = [
  { title: 'Expert Local Guides', desc: 'Our team comprises experts in tourism and destinations, knowledgeable local guides who possess a deep understanding of the local culture and history.', icon: '🧭' },
  { title: 'Your Safety First', desc: 'We place the utmost importance on your safety and enjoyment, going above and beyond to ensure your trip is seamless and unforgettable.', icon: '🛡️' },
  { title: 'Tailored Itineraries', desc: 'Our expertise lies in creating tailored itineraries that cater to your desired experience. Cultural exploration or extreme adventure — we create the perfect trip plan.', icon: '📅' },
  { title: 'Dedicated Support', desc: 'When you travel with us, a dedicated local staff is always available to cater to your every need. From airport pickup to the final farewell, we\'re with you.', icon: '💬' },
];

const DESTINATIONS = [
  { name: 'Everest Region', tagline: 'Land of Sherpas & Sagarmatha', trips: 18, priceFrom: 1299, rating: 4.9, gradient: 'from-emerald-700/50 via-teal-700/40 to-cyan-800/50' },
  { name: 'Annapurna Region', tagline: 'World\'s Most Popular Trek', trips: 15, priceFrom: 850, rating: 4.8, gradient: 'from-amber-700/50 via-orange-700/40 to-rose-800/50' },
  { name: 'Langtang Region', tagline: 'Valley of Glaciers', trips: 8, priceFrom: 850, rating: 4.7, gradient: 'from-green-700/50 via-emerald-700/40 to-teal-800/50' },
  { name: 'Manaslu Region', tagline: 'Wild & Untouched Circuit', trips: 6, priceFrom: 1350, rating: 4.9, gradient: 'from-rose-700/50 via-pink-700/40 to-fuchsia-800/50' },
  { name: 'Mustang Region', tagline: 'Last Forbidden Kingdom', trips: 5, priceFrom: 1890, rating: 4.8, gradient: 'from-yellow-700/50 via-amber-700/40 to-orange-800/50' },
  { name: 'Dolpo Region', tagline: 'Hidden Himalayan Paradise', trips: 4, priceFrom: 2950, rating: 4.9, gradient: 'from-blue-700/50 via-indigo-700/40 to-violet-800/50' },
];

const ALL_DESTINATIONS_FOR_CUSTOM = [
  'Everest Base Camp Trek', 'Annapurna Circuit Trek', 'Upper Mustang Trek', 'Langtang Valley Trek',
  'Manaslu Circuit Trek', 'Upper Dolpo Trek', 'Gokyo Lakes Trek', 'Mera Peak Climbing',
  'Island Peak Climbing', 'Kanchenjunga Trek', 'Helambu Trek', 'Ghorepani Poon Hill Trek',
  'Tsum Valley Trek', 'Rara Lake Trek', 'Khopra Ridge Trek', 'Kathmandu Valley Cultural Tour',
];

export default function ExperiencesPage() {
  const { t } = useLang();
  const [activeToolTab, setActiveToolTab] = useState<'budget' | 'altitude' | 'packing' | 'difficulty'>('budget');

  // Budget calculator state
  const [budgetDest, setBudgetDest] = useState('nepal');
  const [budgetDuration, setBudgetDuration] = useState(10);
  const [budgetStyle, setBudgetStyle] = useState('mid');
  const [budgetTravelers, setBudgetTravelers] = useState(2);
  const [budgetResult, setBudgetResult] = useState<Record<string, number> | null>(null);

  // Altitude calculator state
  const [altMax, setAltMax] = useState(5364);
  const [altStart, setAltStart] = useState(2800);
  const [altDays, setAltDays] = useState(10);
  const [altResult, setAltResult] = useState<{ risk: string; acclimDays: number; maxDailyGain: number; oxygenPct: number } | null>(null);

  // Packing checklist state
  const PACKING_ITEMS: Record<string, string[]> = {
    Clothing: ['Down Jacket', 'Thermal Base Layers', 'Fleece Pullover', 'Trekking Pants', 'Rain Shell', 'Warm Hat', 'Gloves', 'Buff/Neck Gaiter'],
    Footwear: ['Trekking Boots', 'Camp Shoes', 'Trekking Socks (3 pairs)'],
    Gear: ['Daypack', 'Sleeping Bag', 'Trekking Poles', 'Headlamp', 'Water Bottles', 'Sunglasses'],
    Documents: ['Passport', 'Travel Insurance', 'Flight Tickets', 'Visa Documents', 'Emergency Contacts Card'],
    Electronics: ['Phone + Charger', 'Power Bank', 'Camera', 'Adapter'],
    Medications: ['Altitude Sickness Pills', 'First Aid Kit', 'Personal Medications', 'Water Purification Tablets'],
  };
  const [packedItems, setPackedItems] = useState<Record<string, boolean>>({});

  // Difficulty calculator state
  const [diffDistance, setDiffDistance] = useState(65);
  const [diffAltitude, setDiffAltitude] = useState(2500);
  const [diffAscent, setDiffAscent] = useState(8);
  const [diffTerrain, setDiffTerrain] = useState(5);
  const [diffFitness, setDiffFitness] = useState(5);
  const [diffResult, setDiffResult] = useState<{ score: number; label: string; time: string; training: string } | null>(null);

  // Custom package state
  const [customDestinations, setCustomDestinations] = useState<string[]>([]);
  const [customTrip, setCustomTrip] = useState({
    startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    duration: 14, travelers: 2, budget: '1000-2000',
    name: '', email: '', phone: '', nationality: '', message: '',
  });
  const [customSubmitting, setCustomSubmitting] = useState(false);
  const [customResult, setCustomResult] = useState<string | null>(null);

  const calculateBudget = useCallback(() => {
    const destCosts: Record<string, Record<string, number>> = {
      nepal: { flights: 800, accommodation: 50, food: 30, activities: 40, insurance: 12, visa: 30 },
      bhutan: { flights: 1200, accommodation: 80, food: 45, activities: 60, insurance: 15, visa: 40 },
      tibet: { flights: 1000, accommodation: 70, food: 35, activities: 50, insurance: 14, visa: 50 },
      pakistan: { flights: 900, accommodation: 55, food: 25, activities: 45, insurance: 13, visa: 35 },
      india: { flights: 700, accommodation: 45, food: 20, activities: 35, insurance: 11, visa: 25 },
      china: { flights: 1100, accommodation: 75, food: 40, activities: 55, insurance: 14, visa: 60 },
    };
    const styleMult: Record<string, number> = { budget: 0.7, mid: 1, luxury: 1.8 };
    const d = destCosts[budgetDest] || destCosts.nepal;
    const mult = styleMult[budgetStyle] || 1;
    const result: Record<string, number> = {};
    Object.keys(d).forEach((k) => {
      result[k] = Math.round(d[k] * mult * budgetDuration);
    });
    result.total = Object.values(result).reduce((a, b) => a + b, 0);
    result.perPerson = Math.round(result.total / budgetTravelers);
    setBudgetResult(result);
  }, [budgetDest, budgetDuration, budgetStyle, budgetTravelers]);

  const calculateAltitude = useCallback(() => {
    const gain = altMax - altStart;
    const acclimDays = Math.max(0, Math.ceil(gain / 600));
    const maxDailyGain = altMax > 3500 ? Math.max(300, 500 - Math.floor((altMax - 3500) / 100) * 5) : 500;
    const oxygenPct = Math.round((100 * (1 - altMax / 10000)) * 10) / 10;
    let risk = 'Low';
    if (altMax > 5500) risk = 'Extreme';
    else if (altMax > 4500) risk = 'High';
    else if (altMax > 3500) risk = 'Moderate';
    setAltResult({ risk, acclimDays, maxDailyGain, oxygenPct });
  }, [altMax, altStart]);

  const calculateDifficulty = useCallback(() => {
    const score = Math.round(
      (diffDistance / 15) + (diffAltitude / 500) + (diffAscent * 0.8) + (diffTerrain * 0.7) + (diffFitness * 0.5)
    );
    let label = 'Easy';
    if (score >= 8) label = 'Strenuous';
    else if (score >= 6) label = 'Challenging';
    else if (score >= 3.5) label = 'Moderate';
    const baseTime = diffDistance / 3;
    const time = `${Math.round(baseTime * (score / 5))}-${Math.round(baseTime * (score / 5) + 2)} days`;
    const trainingRecs: Record<string, string> = {
      Easy: 'Regular walking 3x/week. Basic fitness sufficient.',
      Moderate: 'Cardio 4x/week, hiking with a pack, stair climbing recommended.',
      Challenging: 'Intensive cardio 5x/week, strength training, practice hikes at altitude if possible.',
      Strenuous: 'Elite-level preparation required. Mountaineering experience essential. 6+ months dedicated training.',
    };
    setDiffResult({ score, label, time, training: trainingRecs[label] });
  }, [diffDistance, diffAltitude, diffAscent, diffTerrain, diffFitness]);

  const submitCustomPackage = useCallback(async () => {
    if (customDestinations.length === 0 || !customTrip.name || !customTrip.email) return;
    setCustomSubmitting(true);
    setCustomResult(null);
    try {
      const res = await fetch('/api/custom-package', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destinations: customDestinations,
          startDate: customTrip.startDate,
          duration: customTrip.duration,
          travelers: customTrip.travelers,
          budget: customTrip.budget,
          name: customTrip.name,
          email: customTrip.email,
          phone: customTrip.phone,
          nationality: customTrip.nationality,
          message: customTrip.message,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCustomResult(`Request sent! Reference: ${data.ref}. Our team will contact you within 24 hours.`);
        setCustomDestinations([]);
        setCustomTrip({
          startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          duration: 14, travelers: 2, budget: '1000-2000',
          name: '', email: '', phone: '', nationality: '', message: '',
        });
      } else {
        setCustomResult('Something went wrong. Please try again.');
      }
    } catch {
      setCustomResult('Network error. Please try again.');
    } finally {
      setCustomSubmitting(false);
    }
  }, [customDestinations, customTrip]);

  const totalItems = Object.values(PACKING_ITEMS).flat().length;
  const packedCount = Object.values(PACKING_ITEMS).flat().filter((item) => packedItems[item]).length;

  return (
    <main className="min-h-screen bg-transparent text-[#f0f4f8] overflow-x-hidden relative z-0 pt-20">

      {/* Header */}
      <section className="py-12 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="pill-cinematic mb-6">✦ Experiences & Tools</span>
          <h1 className="font-cinematic text-5xl sm:text-6xl font-bold mt-6 mb-4 text-readable-hero">
            Plan Your <span className="text-golden-shimmer italic">Adventure</span>
          </h1>
          <p className="text-readable text-white text-lg max-w-2xl mx-auto">
            Use our planning tools, build a custom package, and discover what makes trekking with us special.
          </p>
          <div className="divider-golden" />
        </div>
      </section>

      {/* Why travel with us */}
      <section className="px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-cinematic text-4xl font-bold text-readable-strong mb-3">Why Travel <span className="text-golden-shimmer italic">With Us</span></h2>
            <div className="divider-golden" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="card-premium p-6 text-center">
                <div className="text-4xl mb-3">{f.icon}</div>
                <h3 className="font-cinematic text-lg font-bold text-himalaya-gold mb-2">{f.title}</h3>
                <p className="text-white text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section className="px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-cinematic text-4xl font-bold text-readable-strong mb-3">Trekking <span className="text-golden-shimmer italic">Regions</span></h2>
            <p className="text-white">Discover the diverse regions of Nepal</p>
            <div className="divider-golden" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {DESTINATIONS.map((dest) => (
              <div key={dest.name} className="card-premium overflow-hidden group cursor-pointer">
                <div className={`relative h-40 bg-gradient-to-br ${dest.gradient} flex items-end p-4`}>
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="relative z-10">
                    <h3 className="font-cinematic text-xl font-bold text-white text-readable-strong">{dest.name}</h3>
                    <p className="text-white text-xs">{dest.tagline}</p>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-white">from</div>
                    <div className="font-cinematic text-xl font-bold text-golden-shimmer">${dest.priceFrom}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-white">{dest.trips} trips</div>
                    <div className="text-xs text-himalaya-gold">★ {dest.rating}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Planning Tools */}
      <section className="px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-cinematic text-4xl font-bold text-readable-strong mb-3">Planning <span className="text-golden-shimmer italic">Tools</span></h2>
            <p className="text-white">Calculate your budget, check altitude safety, pack smart, and assess trek difficulty</p>
            <div className="divider-golden" />
          </div>

          {/* Tool tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {(['budget', 'altitude', 'packing', 'difficulty'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveToolTab(tab)}
                className={`px-4 py-2 rounded-full text-sm font-display font-medium capitalize transition-all ${
                  activeToolTab === tab
                    ? 'bg-gradient-to-r from-himalaya-gold to-himalaya-orange text-black'
                    : 'glass-card-static text-white hover:text-himalaya-gold'
                }`}
              >
                {tab === 'budget' && '💰 Budget'}
                {tab === 'altitude' && '🏔️ Altitude'}
                {tab === 'packing' && '🎒 Packing'}
                {tab === 'difficulty' && '⚡ Difficulty'}
              </button>
            ))}
          </div>

          <div className="card-premium p-6 sm:p-8">
            {/* Budget Calculator */}
            {activeToolTab === 'budget' && (
              <div>
                <h3 className="font-cinematic text-2xl font-bold text-white mb-4">Budget Calculator</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-sm text-white font-display mb-1 block">Destination</label>
                    <select value={budgetDest} onChange={(e) => setBudgetDest(e.target.value)} className="form-select w-full">
                      <option value="nepal">Nepal</option>
                      <option value="bhutan">Bhutan</option>
                      <option value="tibet">Tibet</option>
                      <option value="pakistan">Pakistan</option>
                      <option value="india">India</option>
                      <option value="china">China</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-white font-display mb-1 block">Duration (days): {budgetDuration}</label>
                    <input type="range" min="3" max="30" value={budgetDuration} onChange={(e) => setBudgetDuration(Number(e.target.value))} className="w-full" />
                  </div>
                  <div>
                    <label className="text-sm text-white font-display mb-1 block">Travel Style</label>
                    <select value={budgetStyle} onChange={(e) => setBudgetStyle(e.target.value)} className="form-select w-full">
                      <option value="budget">Budget</option>
                      <option value="mid">Mid-range</option>
                      <option value="luxury">Luxury</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-white font-display mb-1 block">Travelers: {budgetTravelers}</label>
                    <input type="range" min="1" max="10" value={budgetTravelers} onChange={(e) => setBudgetTravelers(Number(e.target.value))} className="w-full" />
                  </div>
                </div>
                <button onClick={calculateBudget} className="btn-cinematic w-full sm:w-auto">Calculate Budget</button>
                {budgetResult && (
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    {Object.entries(budgetResult).filter(([k]) => k !== 'total' && k !== 'perPerson').map(([k, v]) => (
                      <div key={k} className="bg-white/5 rounded-lg p-3">
                        <div className="text-xs text-white capitalize">{k}</div>
                        <div className="font-cinematic font-bold text-white">${v.toLocaleString()}</div>
                      </div>
                    ))}
                    <div className="col-span-2 bg-himalaya-gold/10 border border-himalaya-gold/30 rounded-lg p-4 text-center">
                      <div className="text-xs text-white">Total for {budgetTravelers} traveler(s)</div>
                      <div className="font-cinematic text-3xl font-bold text-golden-shimmer">${budgetResult.total.toLocaleString()}</div>
                      <div className="text-xs text-white mt-1">≈ ${budgetResult.perPerson.toLocaleString()} per person</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Altitude Calculator */}
            {activeToolTab === 'altitude' && (
              <div>
                <h3 className="font-cinematic text-2xl font-bold text-white mb-4">Altitude Safety Calculator</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="text-sm text-white font-display mb-1 block">Max Altitude: {altMax}m</label>
                    <input type="range" min="1000" max="6000" step="100" value={altMax} onChange={(e) => setAltMax(Number(e.target.value))} className="w-full" />
                  </div>
                  <div>
                    <label className="text-sm text-white font-display mb-1 block">Start Altitude: {altStart}m</label>
                    <input type="range" min="0" max="4000" step="100" value={altStart} onChange={(e) => setAltStart(Number(e.target.value))} className="w-full" />
                  </div>
                  <div>
                    <label className="text-sm text-white font-display mb-1 block">Trek Days: {altDays}</label>
                    <input type="range" min="1" max="30" value={altDays} onChange={(e) => setAltDays(Number(e.target.value))} className="w-full" />
                  </div>
                </div>
                <button onClick={calculateAltitude} className="btn-cinematic w-full sm:w-auto">Analyze Safety</button>
                {altResult && (
                  <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-white/5 rounded-lg p-3 text-center"><div className="text-xs text-white">Risk Level</div><div className="font-cinematic text-lg font-bold text-white">{altResult.risk}</div></div>
                    <div className="bg-white/5 rounded-lg p-3 text-center"><div className="text-xs text-white">Acclim. Days</div><div className="font-cinematic text-lg font-bold text-white">{altResult.acclimDays}</div></div>
                    <div className="bg-white/5 rounded-lg p-3 text-center"><div className="text-xs text-white">Max Daily Gain</div><div className="font-cinematic text-lg font-bold text-white">{altResult.maxDailyGain}m</div></div>
                    <div className="bg-white/5 rounded-lg p-3 text-center"><div className="text-xs text-white">Oxygen</div><div className="font-cinematic text-lg font-bold text-white">{altResult.oxygenPct}%</div></div>
                  </div>
                )}
              </div>
            )}

            {/* Packing Checklist */}
            {activeToolTab === 'packing' && (
              <div>
                <h3 className="font-cinematic text-2xl font-bold text-white mb-4">Packing Checklist</h3>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-white">Progress: {packedCount}/{totalItems}</span>
                    <span className="text-sm text-himalaya-gold font-bold">{Math.round((packedCount / totalItems) * 100)}%</span>
                  </div>
                  <div className="progress-bar"><div className="progress-fill" style={{ width: `${(packedCount / totalItems) * 100}%` }} /></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(PACKING_ITEMS).map(([cat, items]) => (
                    <div key={cat} className="bg-white/5 rounded-lg p-4">
                      <h4 className="font-display font-bold text-himalaya-gold text-sm mb-2">{cat}</h4>
                      <div className="space-y-1.5">
                        {items.map((item) => (
                          <label key={item} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={!!packedItems[item]}
                              onChange={() => setPackedItems((prev) => ({ ...prev, [item]: !prev[item] }))}
                              className="w-4 h-4 accent-himalaya-gold"
                            />
                            <span className={`text-sm ${packedItems[item] ? 'line-through text-white' : 'text-white'}`}>{item}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Difficulty Calculator */}
            {activeToolTab === 'difficulty' && (
              <div>
                <h3 className="font-cinematic text-2xl font-bold text-white mb-4">Trek Difficulty Calculator</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-sm text-white font-display mb-1 block">Distance: {diffDistance} km</label>
                    <input type="range" min="5" max="200" value={diffDistance} onChange={(e) => setDiffDistance(Number(e.target.value))} className="w-full" />
                  </div>
                  <div>
                    <label className="text-sm text-white font-display mb-1 block">Altitude Gain: {diffAltitude}m</label>
                    <input type="range" min="100" max="5000" step="100" value={diffAltitude} onChange={(e) => setDiffAltitude(Number(e.target.value))} className="w-full" />
                  </div>
                  <div>
                    <label className="text-sm text-white font-display mb-1 block">Daily Ascent: {diffAscent}h</label>
                    <input type="range" min="2" max="12" value={diffAscent} onChange={(e) => setDiffAscent(Number(e.target.value))} className="w-full" />
                  </div>
                  <div>
                    <label className="text-sm text-white font-display mb-1 block">Terrain Difficulty: {diffTerrain}/10</label>
                    <input type="range" min="1" max="10" value={diffTerrain} onChange={(e) => setDiffTerrain(Number(e.target.value))} className="w-full" />
                  </div>
                  <div>
                    <label className="text-sm text-white font-display mb-1 block">Fitness Level: {diffFitness}/10</label>
                    <input type="range" min="1" max="10" value={diffFitness} onChange={(e) => setDiffFitness(Number(e.target.value))} className="w-full" />
                  </div>
                </div>
                <button onClick={calculateDifficulty} className="btn-cinematic w-full sm:w-auto">Calculate Difficulty</button>
                {diffResult && (
                  <div className="mt-6 space-y-3">
                    <div className="bg-white/5 rounded-lg p-4 text-center">
                      <div className="text-xs text-white mb-1">Difficulty Score: {diffResult.score}/15</div>
                      <div className={`font-cinematic text-3xl font-bold uppercase difficulty-${diffResult.label.toLowerCase()}`}>{diffResult.label}</div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-white/5 rounded-lg p-3"><div className="text-xs text-white">Est. Duration</div><div className="font-display font-bold text-white">{diffResult.time}</div></div>
                      <div className="bg-white/5 rounded-lg p-3"><div className="text-xs text-white">Training Required</div><div className="text-xs text-white">{diffResult.training}</div></div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Custom Package Builder */}
      <section className="px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="pill-cinematic mb-6">✦ Custom Package</span>
            <h2 className="font-cinematic text-4xl sm:text-5xl font-bold mt-6 mb-3 text-readable-strong">
              Build Your <span className="text-golden-shimmer italic">Dream Adventure</span>
            </h2>
            <p className="text-readable text-white max-w-2xl mx-auto">
              Can&apos;t find the perfect package? Create your own custom itinerary. Select the destinations you want to visit, tell us your preferences, and our team will craft a personalized trek just for you.
            </p>
            <div className="divider-golden" />
          </div>

          <div className="card-premium p-6 sm:p-8">
            {/* Step 1 */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-himalaya-gold to-himalaya-orange flex items-center justify-center font-cinematic font-bold text-black text-sm">1</div>
                <h3 className="font-cinematic text-xl font-bold text-white">Select Destinations You Want to Visit</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {ALL_DESTINATIONS_FOR_CUSTOM.map((dest) => (
                  <label
                    key={dest}
                    className={`flex items-center gap-2 p-2.5 rounded-lg cursor-pointer transition-all border ${
                      customDestinations.includes(dest)
                        ? 'bg-himalaya-gold/15 border-himalaya-gold/50 text-white'
                        : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={customDestinations.includes(dest)}
                      onChange={() => {
                        setCustomDestinations((prev) =>
                          prev.includes(dest) ? prev.filter((d) => d !== dest) : [...prev, dest]
                        );
                      }}
                      className="w-4 h-4 accent-himalaya-gold"
                    />
                    <span className="text-xs font-display leading-tight">{dest}</span>
                  </label>
                ))}
              </div>
              {customDestinations.length > 0 && (
                <p className="text-xs text-himalaya-gold mt-2 font-display">
                  ✓ {customDestinations.length} destination{customDestinations.length > 1 ? 's' : ''} selected
                </p>
              )}
            </div>

            {/* Step 2 */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-himalaya-gold to-himalaya-orange flex items-center justify-center font-cinematic font-bold text-black text-sm">2</div>
                <h3 className="font-cinematic text-xl font-bold text-white">Trip Details</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs text-white mb-1 block font-display">Preferred Start Date</label>
                  <input type="date" value={customTrip.startDate} onChange={(e) => setCustomTrip({...customTrip, startDate: e.target.value})} className="input-cinematic !py-2 !text-sm" />
                </div>
                <div>
                  <label className="text-xs text-white mb-1 block font-display">Duration (days)</label>
                  <input type="number" min="1" max="60" value={customTrip.duration} onChange={(e) => setCustomTrip({...customTrip, duration: Number(e.target.value)})} className="input-cinematic !py-2 !text-sm" />
                </div>
                <div>
                  <label className="text-xs text-white mb-1 block font-display">Travelers</label>
                  <input type="number" min="1" max="20" value={customTrip.travelers} onChange={(e) => setCustomTrip({...customTrip, travelers: Number(e.target.value)})} className="input-cinematic !py-2 !text-sm" />
                </div>
                <div>
                  <label className="text-xs text-white mb-1 block font-display">Budget per Person (USD)</label>
                  <select value={customTrip.budget} onChange={(e) => setCustomTrip({...customTrip, budget: e.target.value})} className="form-select w-full !py-2 !text-sm">
                    <option value="500-1000">$500 - $1,000</option>
                    <option value="1000-2000">$1,000 - $2,000</option>
                    <option value="2000-3000">$2,000 - $3,000</option>
                    <option value="3000+">$3,000+</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-himalaya-gold to-himalaya-orange flex items-center justify-center font-cinematic font-bold text-black text-sm">3</div>
                <h3 className="font-cinematic text-xl font-bold text-white">Your Contact Information</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input type="text" placeholder="Full Name *" value={customTrip.name} onChange={(e) => setCustomTrip({...customTrip, name: e.target.value})} className="input-cinematic !py-2.5" />
                <input type="email" placeholder="Email Address *" value={customTrip.email} onChange={(e) => setCustomTrip({...customTrip, email: e.target.value})} className="input-cinematic !py-2.5" />
                <input type="tel" placeholder="Phone Number" value={customTrip.phone} onChange={(e) => setCustomTrip({...customTrip, phone: e.target.value})} className="input-cinematic !py-2.5" />
                <input type="text" placeholder="Nationality" value={customTrip.nationality} onChange={(e) => setCustomTrip({...customTrip, nationality: e.target.value})} className="input-cinematic !py-2.5" />
              </div>
            </div>

            {/* Step 4 */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-himalaya-gold to-himalaya-orange flex items-center justify-center font-cinematic font-bold text-black text-sm">4</div>
                <h3 className="font-cinematic text-xl font-bold text-white">Your Wishes & Special Requests</h3>
              </div>
              <textarea
                placeholder="Tell us what you want to experience, your fitness level, dietary needs, special interests, accessibility requirements..."
                value={customTrip.message}
                onChange={(e) => setCustomTrip({...customTrip, message: e.target.value})}
                rows={5}
                className="input-cinematic !rounded-2xl resize-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
              <p className="text-xs text-white text-center sm:text-left">Our team will respond within 24 hours with a personalized itinerary and quote.</p>
              <button
                onClick={submitCustomPackage}
                disabled={customSubmitting || customDestinations.length === 0 || !customTrip.name || !customTrip.email}
                className="btn-cinematic disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {customSubmitting ? 'Sending...' : 'Send My Custom Request →'}
              </button>
            </div>
            {customResult && (
              <div className="mt-4 p-4 rounded-xl bg-himalaya-emerald/10 border border-himalaya-emerald/30 text-center">
                <p className="text-himalaya-emerald font-display font-semibold">✓ {customResult}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
