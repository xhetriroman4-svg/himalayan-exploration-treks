'use client';

import { useState, useCallback } from 'react';
import { useLang } from '@/lib/i18n';

const TOURS = [
  { title: 'Everest Base Camp Trek', days: 14, difficulty: 'strenuous' as const, price: 1299, oldPrice: 1599, country: 'Nepal', altitude: '5,545m', rating: 5, region: 'Everest Region', season: 'Mar-May, Sep-Nov', groupSize: '2-12', image: 'https://sfile.chatglm.cn/images-ppt/931b93f13c50.jpg', desc: 'Join the adventure of a lifetime with the Everest Base Camp Trek. Trek through Sagarmatha National Park, experience genuine Sherpa hospitality, and stand at the foot of the world\'s tallest mountain.', highlights: ['Sagarmatha National Park', 'Sherpa villages & monasteries', 'Kala Patthar sunrise viewpoint', 'Base Camp at 5,364m'] },
  { title: 'Annapurna Circuit Trek', days: 21, difficulty: 'strenuous' as const, price: 1150, oldPrice: 1399, country: 'Nepal', altitude: '5,416m', rating: 5, region: 'Annapurna Region', season: 'Mar-May, Oct-Nov', groupSize: '2-15', image: 'https://sfile.chatglm.cn/images-ppt/beb25e4341d0.jpg', desc: 'The world\'s most well-known trek through beautiful landscapes, Thorong-La Pass, and Muktinath\'s holiest pilgrimage site. Cross the highest pass at 5,416m with breathtaking mountain scenery.', highlights: ['Thorong La Pass (5,416m)', 'Muktinath temple', 'Apple orchards of Marpha', 'Hot springs at Tatopani'] },
  { title: 'Upper Mustang Trek', days: 18, difficulty: 'moderate' as const, price: 1890, oldPrice: 2199, country: 'Nepal', altitude: '3,800m', rating: 5, region: 'Mustang Region', season: 'Jun-Sep', groupSize: '2-10', image: 'https://sfile.chatglm.cn/images-ppt/eccfdc1f7215.jpg', desc: 'A life-changing adventure to the Last Forbidden Kingdom, closed until 1992. Explore dramatic landscapes, ancient monasteries, sky caves, and the walled city of Lo Manthang.', highlights: ['Lo Manthang walled city', 'Ancient sky caves', 'Century-old monasteries', 'Tibetan Buddhist culture'] },
  { title: 'Langtang Valley Trek', days: 10, difficulty: 'easy' as const, price: 850, oldPrice: 999, country: 'Nepal', altitude: '4,984m', rating: 4, region: 'Langtang Region', season: 'Mar-May, Oct-Nov', groupSize: '2-16', image: 'https://sfile.chatglm.cn/images-ppt/bd16c81f7a2f.jpg', desc: 'A beautiful valley trek north of Kathmandu, offering stunning glacier views, Tamang culture, and diverse wildlife including red pandas. Perfect for beginners seeking Himalayan beauty.', highlights: ['Langtang Glacier', 'Tamang heritage villages', 'Red panda habitat', 'Kyanjin Gompa monastery'] },
  { title: 'Manaslu Circuit Trek', days: 17, difficulty: 'challenging' as const, price: 1350, oldPrice: 1599, country: 'Nepal', altitude: '5,106m', rating: 5, region: 'Manaslu Region', season: 'Mar-May, Sep-Nov', groupSize: '2-12', image: 'https://sfile.chatglm.cn/images-ppt/eddc45d8a60a.jpg', desc: 'A remote and wild circuit around the 8th highest mountain. Cross the Larkya La Pass, experience untouched Tibetan-influenced villages, and trek through pristine valleys far from the crowds.', highlights: ['Larkya La Pass (5,106m)', 'Tibetan-influenced villages', 'Manaslu Conservation Area', 'Off-the-beaten-path experience'] },
  { title: 'Upper Dolpo Trek', days: 22, difficulty: 'strenuous' as const, price: 2950, oldPrice: 3299, country: 'Nepal', altitude: '5,360m', rating: 5, region: 'Dolpo Region', season: 'May-Sep', groupSize: '2-8', image: 'https://sfile.chatglm.cn/images-ppt/1df7a0c87620.jpg', desc: 'One of Nepal\'s most remote and restricted trekking regions. Explore the mystical Phoksundo Lake, ancient Bon monasteries, and a landscape that remains untouched by modern civilization.', highlights: ['Phoksundo Lake (turquoise jewel)', 'Ancient Bon monasteries', 'Kang La Pass (5,360m)', 'Caravans of yak and sheep'] },
  { title: 'Gokyo Lakes Trek', days: 12, difficulty: 'challenging' as const, price: 1450, oldPrice: 1699, country: 'Nepal', altitude: '5,357m', rating: 5, region: 'Everest Region', season: 'Mar-May, Sep-Nov', groupSize: '2-12', image: 'https://sfile.chatglm.cn/images-ppt/4b0e35093d66.jpg', desc: 'Trek to the sacred turquoise Gokyo Lakes and climb Gokyo Ri for one of the most spectacular mountain panoramas in the world, including four of the 8000m peaks.', highlights: ['Six sacred Gokyo Lakes', 'Gokyo Ri summit (5,357m)', 'Ngozumpa Glacier', 'Panorama of 4 eight-thousanders'] },
  { title: 'Mera Peak Climbing', days: 16, difficulty: 'strenuous' as const, price: 2150, oldPrice: 2499, country: 'Nepal', altitude: '6,476m', rating: 5, region: 'Everest Region', season: 'Apr-May, Oct-Nov', groupSize: '2-8', image: 'https://sfile.chatglm.cn/images-ppt/bb8056ee082e.jpeg', desc: 'Nepal\'s highest trekking peak at 6,476m. A challenging but non-technical climb offering breathtaking views of five 8000m peaks including Everest, Kanchenjunga, and Makalu from the summit.', highlights: ['Summit at 6,476m', 'Views of 5 eight-thousanders', 'Hinku Valley wilderness', 'Basic mountaineering experience'] },
  { title: 'Island Peak Climbing', days: 14, difficulty: 'challenging' as const, price: 1850, oldPrice: 2150, country: 'Nepal', altitude: '6,189m', rating: 5, region: 'Everest Region', season: 'Apr-May, Oct-Nov', groupSize: '2-10', image: 'https://sfile.chatglm.cn/images-ppt/693b17c880a1.jpg', desc: 'Also known as Imja Tse, Island Peak is the most popular trekking peak in Nepal. Combined with Everest Base Camp trek, it offers a perfect introduction to Himalayan mountaineering.', highlights: ['Summit at 6,189m', 'Combined with EBC trek', 'Crevassed glacier travel', 'Stunning Lhotse views'] },
  { title: 'Kanchenjunga Trek', days: 24, difficulty: 'strenuous' as const, price: 2450, oldPrice: 2799, country: 'Nepal', altitude: '5,160m', rating: 5, region: 'Kanchenjunga Region', season: 'Mar-May, Sep-Nov', groupSize: '2-8', image: 'https://sfile.chatglm.cn/images-ppt/72069db765db.jpg', desc: 'A remote wilderness trek to the base of the world\'s third-highest mountain. Experience incredible biodiversity, pristine forests, and the rich culture of eastern Nepal far from tourist crowds.', highlights: ['3rd highest mountain base camp', 'Kanchenjunga Conservation Area', 'Rich biodiversity & wildlife', 'Remote eastern Nepal culture'] },
  { title: 'Helambu Trek', days: 7, difficulty: 'easy' as const, price: 650, oldPrice: 799, country: 'Nepal', altitude: '3,650m', rating: 4, region: 'Langtang Region', season: 'Mar-May, Oct-Nov', groupSize: '2-16', image: 'https://sfile.chatglm.cn/images-ppt/7cedbd4edb89.jpg', desc: 'A short and scenic trek near Kathmandu perfect for beginners and families. Experience Hyolmo culture, terraced hillsides, rhododendron forests, and stunning mountain views without high altitude.', highlights: ['Perfect for beginners & families', 'Hyolmo culture & villages', 'Rhododendron forests', 'Close to Kathmandu'] },
  { title: 'Ghorepani Poon Hill Trek', days: 5, difficulty: 'easy' as const, price: 450, oldPrice: 599, country: 'Nepal', altitude: '3,210m', rating: 5, region: 'Annapurna Region', season: 'Year-round', groupSize: '2-20', image: 'https://sfile.chatglm.cn/images-ppt/f49c8ede96b2.jpg', desc: 'The classic short trek in Annapurna offering the most spectacular sunrise view over the Dhaulagiri and Annapurna ranges from Poon Hill. Ideal for those with limited time.', highlights: ['Poon Hill sunrise (3,210m)', 'Dhaulagiri & Annapurna panorama', 'Gurung villages & culture', 'Best short trek in Nepal'] },
  { title: 'Tsum Valley Trek', days: 15, difficulty: 'moderate' as const, price: 1650, oldPrice: 1899, country: 'Nepal', altitude: '3,700m', rating: 5, region: 'Manaslu Region', season: 'Mar-May, Sep-Nov', groupSize: '2-10', image: 'https://sfile.chatglm.cn/images-ppt/17598ed382b6.jpg', desc: 'Known as the "Hidden Valley," Tsum Valley is a sacred Himalayan pilgrimage valley with ancient Buddhist heritage, monasteries, and unique Tibetan culture unchanged for centuries.', highlights: ['Sacred hidden valley', 'Mu Gompa monastery', 'Ancient Buddhist heritage', 'Unique Tsumba culture'] },
  { title: 'Rara Lake Trek', days: 12, difficulty: 'moderate' as const, price: 1550, oldPrice: 1799, country: 'Nepal', altitude: '2,990m', rating: 5, region: 'Far West Nepal', season: 'Apr-Jun, Sep-Oct', groupSize: '2-10', image: 'https://sfile.chatglm.cn/images-ppt/3238c3c3cb05.jpg', desc: 'Trek to Nepal\'s largest lake, surrounded by pine forests and snow-capped peaks. Rara Lake\'s pristine turquoise waters and rich wildlife make this a true off-the-beaten-path gem.', highlights: ['Nepal\'s largest lake', 'Rara National Park', 'Rare wildlife & birds', 'Pristine turquoise waters'] },
  { title: 'Khopra Ridge Trek', days: 9, difficulty: 'easy' as const, price: 750, oldPrice: 899, country: 'Nepal', altitude: '3,640m', rating: 5, region: 'Annapurna Region', season: 'Mar-May, Oct-Nov', groupSize: '2-14', image: 'https://sfile.chatglm.cn/images-ppt/347203ac82e5.jpg', desc: 'A community-based trek offering stunning views of Annapurna and Dhaulagiri from Khopra Ridge. Stay in community lodges, visit sacred Kaire Lake, and support local communities.', highlights: ['Khopra Ridge viewpoint', 'Sacred Kaire Lake', 'Community-based lodges', 'Annapurna & Dhaulagiri views'] },
  { title: 'Kathmandu Valley Cultural Tour', days: 4, difficulty: 'easy' as const, price: 350, oldPrice: 450, country: 'Nepal', altitude: '1,400m', rating: 5, region: 'Kathmandu Valley', season: 'Year-round', groupSize: '1-20', image: 'https://sfile.chatglm.cn/images-ppt/56d4ad1920e0.jpg', desc: 'Explore 7 UNESCO World Heritage sites in Kathmandu Valley including Pashupatinath, Boudhanath, Swayambhunath, and the Durbar Squares. A cultural immersion into Nepal\'s rich heritage.', highlights: ['7 UNESCO World Heritage sites', 'Pashupatinath & Boudhanath', 'Swayambhunath (Monkey Temple)', 'Ancient royal palaces'] },
];

export default function TrekkingPage() {
  const { t } = useLang();
  const [tourFilter, setTourFilter] = useState('All');
  const [selectedTour, setSelectedTour] = useState<typeof TOURS[0] | null>(null);

  const REGIONS = ['All', 'Everest Region', 'Annapurna Region', 'Langtang Region', 'Manaslu Region', 'Mustang Region', 'Dolpo Region', 'Kanchenjunga Region', 'Far West Nepal', 'Kathmandu Valley'];

  return (
    <main className="min-h-screen bg-transparent text-[#f0f4f8] overflow-x-hidden relative z-0 pt-20">

      <section className="py-12 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="pill-cinematic mb-6">{t('section.trekking.pill')}</span>
          <h1 className="font-cinematic text-5xl sm:text-6xl font-bold mt-6 mb-4 text-readable-hero">
            All <span className="text-golden-shimmer italic">Trekking Expeditions</span>
          </h1>
          <p className="text-readable text-white text-lg max-w-2xl mx-auto">
            {t('section.trekking.subtitle')}
          </p>
          <div className="divider-golden" />
        </div>
      </section>

      <section className="px-4 mb-8">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-2">
          {REGIONS.map((region) => (
            <button
              key={region}
              onClick={() => setTourFilter(region)}
              className={`px-4 py-2 rounded-full text-sm font-display font-medium transition-all ${
                tourFilter === region
                  ? 'bg-gradient-to-r from-himalaya-gold to-himalaya-orange text-black'
                  : 'glass-card-static text-white hover:text-himalaya-gold'
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      </section>

      <section className="px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOURS.filter((tour) => tourFilter === 'All' || tour.region === tourFilter).map((tour) => {
              const discount = Math.round(((tour.oldPrice - tour.price) / tour.oldPrice) * 100);
              return (
                <div key={tour.title} className="card-premium holo-sheen overflow-hidden group">
                  <div className="relative h-56 overflow-hidden">
                    <img src={tour.image} alt={tour.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    {discount > 0 && <span className="discount-badge">-{discount}%</span>}
                    <span className="absolute top-3 left-3 text-xs text-white bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full font-display">{tour.country}</span>
                    <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                      <svg className="w-3 h-3 text-himalaya-gold" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6 4.4 2.3 7.4-6.3-4.6-6.3 4.6L7.9 14 2 9.4h7.6z"/></svg>
                      <span className="text-xs text-white font-display">{tour.rating}.0</span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-12">
                      <h3 className="text-readable-strong font-cinematic text-lg font-bold text-white leading-tight">{tour.title}</h3>
                      <p className="text-readable text-xs text-white mt-0.5">{tour.region}</p>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                      <div className="bg-white/5 rounded-lg py-2"><div className="text-xs text-white">Days</div><div className="font-cinematic font-bold text-golden-shimmer text-lg">{tour.days}</div></div>
                      <div className="bg-white/5 rounded-lg py-2"><div className="text-xs text-white">Altitude</div><div className="font-display font-bold text-white text-sm">{tour.altitude}</div></div>
                      <div className="bg-white/5 rounded-lg py-2"><div className="text-xs text-white">Difficulty</div><div className={`font-display font-bold text-xs uppercase difficulty-${tour.difficulty}`}>{tour.difficulty}</div></div>
                    </div>
                    <p className="text-readable text-xs text-white leading-relaxed mb-3 line-clamp-2">{tour.desc}</p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {tour.highlights.slice(0, 2).map((h) => (
                        <span key={h} className="text-[10px] px-2 py-0.5 rounded-full bg-himalaya-gold/10 text-himalaya-gold border border-himalaya-gold/20">{h}</span>
                      ))}
                      {tour.highlights.length > 2 && <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white">+{tour.highlights.length - 2} more</span>}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-white mb-4">
                      <span>📅 {tour.season}</span>
                      <span>👥 {tour.groupSize}</span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <div>
                        <div className="text-xs text-white line-through">${tour.oldPrice.toLocaleString()}</div>
                        <div className="font-cinematic text-2xl font-bold text-golden-shimmer">${tour.price.toLocaleString()}</div>
                      </div>
                      <button onClick={() => setSelectedTour(tour)} className="btn-cinematic !text-xs !py-2 !px-4">View Details</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {selectedTour && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setSelectedTour(null)}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-card-strong rounded-2xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedTour(null)} className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
            <div className="relative h-64 overflow-hidden rounded-t-2xl">
              <img src={selectedTour.image} alt={selectedTour.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h2 className="font-cinematic text-3xl font-bold text-white text-readable-strong">{selectedTour.title}</h2>
                <p className="text-himalaya-gold text-sm">{selectedTour.region}</p>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-4 gap-3 mb-6">
                <div className="text-center bg-white/5 rounded-lg p-3"><div className="text-xs text-white">Days</div><div className="font-cinematic text-xl font-bold text-golden-shimmer">{selectedTour.days}</div></div>
                <div className="text-center bg-white/5 rounded-lg p-3"><div className="text-xs text-white">Altitude</div><div className="font-display font-bold text-white">{selectedTour.altitude}</div></div>
                <div className="text-center bg-white/5 rounded-lg p-3"><div className="text-xs text-white">Difficulty</div><div className={`font-display font-bold text-xs uppercase difficulty-${selectedTour.difficulty}`}>{selectedTour.difficulty}</div></div>
                <div className="text-center bg-white/5 rounded-lg p-3"><div className="text-xs text-white">Rating</div><div className="font-display font-bold text-white">{selectedTour.rating}.0⭐</div></div>
              </div>
              <p className="text-white leading-relaxed mb-4">{selectedTour.desc}</p>
              <div className="mb-4">
                <h4 className="font-display font-bold text-himalaya-gold mb-2">Highlights</h4>
                <ul className="space-y-1">
                  {selectedTour.highlights.map((h) => (
                    <li key={h} className="text-sm text-white flex items-center gap-2"><span className="text-himalaya-gold">✦</span> {h}</li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div><span className="text-white">Best Season:</span> <span className="text-white font-medium">{selectedTour.season}</span></div>
                <div><span className="text-white">Group Size:</span> <span className="text-white font-medium">{selectedTour.groupSize}</span></div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div>
                  <div className="text-sm text-white line-through">${selectedTour.oldPrice.toLocaleString()}</div>
                  <div className="font-cinematic text-3xl font-bold text-golden-shimmer">${selectedTour.price.toLocaleString()}</div>
                </div>
                <a href="/" className="btn-cinematic">Book Now</a>
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto card-premium p-8">
          <h2 className="font-cinematic text-3xl font-bold text-readable-strong mb-3">Can&apos;t Find Your Perfect Trek?</h2>
          <p className="text-white mb-6">Build a custom package tailored to your wishes. Select destinations, dates, and budget — we&apos;ll craft your dream adventure.</p>
          <a href="/experiences" className="btn-cinematic">Build Custom Package →</a>
        </div>
      </section>
    </main>
  );
}
