'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useLang, LANGUAGES } from '@/lib/i18n';

/* ──────────── DATA ──────────── */

const NAV_LINKS = ['Experiences', 'Trekking', 'About', 'Stories', 'Contact'];

const TOURS = [
  {
    title: 'Everest Base Camp Trek',
    days: 14, difficulty: 'strenuous' as const, price: 1299, oldPrice: 1599,
    country: 'Nepal', altitude: '5,545m', rating: 5, region: 'Everest Region',
    season: 'Mar-May, Sep-Nov', groupSize: '2-12',
    image: 'https://sfile.chatglm.cn/images-ppt/931b93f13c50.jpg',
    gradient: 'from-emerald-700/50 via-teal-700/40 to-cyan-800/50',
    desc: 'Join the adventure of a lifetime with the Everest Base Camp Trek. Trek through Sagarmatha National Park, experience genuine Sherpa hospitality, and stand at the foot of the world\'s tallest mountain.',
    highlights: ['Sagarmatha National Park', 'Sherpa villages & monasteries', 'Kala Patthar sunrise viewpoint', 'Base Camp at 5,364m'],
  },
  {
    title: 'Annapurna Circuit Trek',
    days: 21, difficulty: 'strenuous' as const, price: 1150, oldPrice: 1399,
    country: 'Nepal', altitude: '5,416m', rating: 5, region: 'Annapurna Region',
    season: 'Mar-May, Oct-Nov', groupSize: '2-15',
    image: 'https://sfile.chatglm.cn/images-ppt/beb25e4341d0.jpg',
    gradient: 'from-amber-700/50 via-orange-700/40 to-rose-800/50',
    desc: 'The world\'s most well-known trek through beautiful landscapes, Thorong-La Pass, and Muktinath\'s holiest pilgrimage site. Cross the highest pass at 5,416m with breathtaking mountain scenery.',
    highlights: ['Thorong La Pass (5,416m)', 'Muktinath temple', 'Apple orchards of Marpha', 'Hot springs at Tatopani'],
  },
  {
    title: 'Upper Mustang Trek',
    days: 18, difficulty: 'moderate' as const, price: 1890, oldPrice: 2199,
    country: 'Nepal', altitude: '3,800m', rating: 5, region: 'Mustang Region',
    season: 'Jun-Sep', groupSize: '2-10',
    image: 'https://sfile.chatglm.cn/images-ppt/eccfdc1f7215.jpg',
    gradient: 'from-yellow-700/50 via-amber-700/40 to-orange-800/50',
    desc: 'A life-changing adventure to the Last Forbidden Kingdom, closed until 1992. Explore dramatic landscapes, ancient monasteries, sky caves, and the walled city of Lo Manthang.',
    highlights: ['Lo Manthang walled city', 'Ancient sky caves', 'Century-old monasteries', 'Tibetan Buddhist culture'],
  },
  {
    title: 'Langtang Valley Trek',
    days: 10, difficulty: 'easy' as const, price: 850, oldPrice: 999,
    country: 'Nepal', altitude: '4,984m', rating: 4, region: 'Langtang Region',
    season: 'Mar-May, Oct-Nov', groupSize: '2-16',
    image: 'https://sfile.chatglm.cn/images-ppt/bd16c81f7a2f.jpg',
    gradient: 'from-green-700/50 via-emerald-700/40 to-teal-800/50',
    desc: 'A beautiful valley trek north of Kathmandu, offering stunning glacier views, Tamang culture, and diverse wildlife including red pandas. Perfect for beginners seeking Himalayan beauty.',
    highlights: ['Langtang Glacier', 'Tamang heritage villages', 'Red panda habitat', 'Kyanjin Gompa monastery'],
  },
  {
    title: 'Manaslu Circuit Trek',
    days: 17, difficulty: 'challenging' as const, price: 1350, oldPrice: 1599,
    country: 'Nepal', altitude: '5,106m', rating: 5, region: 'Manaslu Region',
    season: 'Mar-May, Sep-Nov', groupSize: '2-12',
    image: 'https://sfile.chatglm.cn/images-ppt/eddc45d8a60a.jpg',
    gradient: 'from-rose-700/50 via-red-700/40 to-orange-800/50',
    desc: 'A remote and wild circuit around the 8th highest mountain. Cross the Larkya La Pass, experience untouched Tibetan-influenced villages, and trek through pristine valleys far from the crowds.',
    highlights: ['Larkya La Pass (5,106m)', 'Tibetan-influenced villages', 'Manaslu Conservation Area', 'Off-the-beaten-path experience'],
  },
  {
    title: 'Upper Dolpo Trek',
    days: 22, difficulty: 'strenuous' as const, price: 2950, oldPrice: 3299,
    country: 'Nepal', altitude: '5,360m', rating: 5, region: 'Dolpo Region',
    season: 'May-Sep', groupSize: '2-8',
    image: 'https://sfile.chatglm.cn/images-ppt/1df7a0c87620.jpg',
    gradient: 'from-blue-700/50 via-indigo-700/40 to-violet-800/50',
    desc: 'One of Nepal\'s most remote and restricted trekking regions. Explore the mystical Phoksundo Lake, ancient Bon monasteries, and a landscape that remains untouched by modern civilization.',
    highlights: ['Phoksundo Lake (turquoise jewel)', 'Ancient Bon monasteries', 'Kang La Pass (5,360m)', 'Caravans of yak and sheep'],
  },
  {
    title: 'Gokyo Lakes Trek',
    days: 12, difficulty: 'challenging' as const, price: 1450, oldPrice: 1699,
    country: 'Nepal', altitude: '5,357m', rating: 5, region: 'Everest Region',
    season: 'Mar-May, Sep-Nov', groupSize: '2-12',
    image: 'https://sfile.chatglm.cn/images-ppt/4b0e35093d66.jpg',
    gradient: 'from-cyan-700/50 via-blue-700/40 to-indigo-800/50',
    desc: 'Trek to the sacred turquoise Gokyo Lakes and climb Gokyo Ri for one of the most spectacular mountain panoramas in the world, including four of the 8000m peaks.',
    highlights: ['Six sacred Gokyo Lakes', 'Gokyo Ri summit (5,357m)', 'Ngozumpa Glacier', 'Panorama of 4 eight-thousanders'],
  },
  {
    title: 'Mera Peak Climbing',
    days: 16, difficulty: 'strenuous' as const, price: 2150, oldPrice: 2499,
    country: 'Nepal', altitude: '6,476m', rating: 5, region: 'Everest Region',
    season: 'Apr-May, Oct-Nov', groupSize: '2-8',
    image: 'https://sfile.chatglm.cn/images-ppt/bb8056ee082e.jpeg',
    gradient: 'from-slate-700/50 via-zinc-700/40 to-stone-800/50',
    desc: 'Nepal\'s highest trekking peak at 6,476m. A challenging but non-technical climb offering breathtaking views of five 8000m peaks including Everest, Kanchenjunga, and Makalu from the summit.',
    highlights: ['Summit at 6,476m', 'Views of 5 eight-thousanders', 'Hinku Valley wilderness', 'Basic mountaineering experience'],
  },
  {
    title: 'Island Peak Climbing',
    days: 14, difficulty: 'challenging' as const, price: 1850, oldPrice: 2150,
    country: 'Nepal', altitude: '6,189m', rating: 5, region: 'Everest Region',
    season: 'Apr-May, Oct-Nov', groupSize: '2-10',
    image: 'https://sfile.chatglm.cn/images-ppt/693b17c880a1.jpg',
    gradient: 'from-sky-700/50 via-cyan-700/40 to-blue-800/50',
    desc: 'Also known as Imja Tse, Island Peak is the most popular trekking peak in Nepal. Combined with Everest Base Camp trek, it offers a perfect introduction to Himalayan mountaineering.',
    highlights: ['Summit at 6,189m', 'Combined with EBC trek', 'Crevassed glacier travel', 'Stunning Lhotse views'],
  },
  {
    title: 'Kanchenjunga Trek',
    days: 24, difficulty: 'strenuous' as const, price: 2450, oldPrice: 2799,
    country: 'Nepal', altitude: '5,160m', rating: 5, region: 'Kanchenjunga Region',
    season: 'Mar-May, Sep-Nov', groupSize: '2-8',
    image: 'https://sfile.chatglm.cn/images-ppt/72069db765db.jpg',
    gradient: 'from-emerald-700/50 via-green-700/40 to-teal-800/50',
    desc: 'A remote wilderness trek to the base of the world\'s third-highest mountain. Experience incredible biodiversity, pristine forests, and the rich culture of eastern Nepal far from tourist crowds.',
    highlights: ['3rd highest mountain base camp', 'Kanchenjunga Conservation Area', 'Rich biodiversity & wildlife', 'Remote eastern Nepal culture'],
  },
  {
    title: 'Helambu Trek',
    days: 7, difficulty: 'easy' as const, price: 650, oldPrice: 799,
    country: 'Nepal', altitude: '3,650m', rating: 4, region: 'Langtang Region',
    season: 'Mar-May, Oct-Nov', groupSize: '2-16',
    image: 'https://sfile.chatglm.cn/images-ppt/7cedbd4edb89.jpg',
    gradient: 'from-lime-700/50 via-green-700/40 to-emerald-800/50',
    desc: 'A short and scenic trek near Kathmandu perfect for beginners and families. Experience Hyolmo culture, terraced hillsides, rhododendron forests, and stunning mountain views without high altitude.',
    highlights: ['Perfect for beginners & families', 'Hyolmo culture & villages', 'Rhododendron forests', 'Close to Kathmandu'],
  },
  {
    title: 'Ghorepani Poon Hill Trek',
    days: 5, difficulty: 'easy' as const, price: 450, oldPrice: 599,
    country: 'Nepal', altitude: '3,210m', rating: 5, region: 'Annapurna Region',
    season: 'Year-round', groupSize: '2-20',
    image: 'https://sfile.chatglm.cn/images-ppt/f49c8ede96b2.jpg',
    gradient: 'from-orange-700/50 via-amber-700/40 to-yellow-800/50',
    desc: 'The classic short trek in Annapurna offering the most spectacular sunrise view over the Dhaulagiri and Annapurna ranges from Poon Hill. Ideal for those with limited time.',
    highlights: ['Poon Hill sunrise (3,210m)', 'Dhaulagiri & Annapurna panorama', 'Gurung villages & culture', 'Best short trek in Nepal'],
  },
  {
    title: 'Tsum Valley Trek',
    days: 15, difficulty: 'moderate' as const, price: 1650, oldPrice: 1899,
    country: 'Nepal', altitude: '3,700m', rating: 5, region: 'Manaslu Region',
    season: 'Mar-May, Sep-Nov', groupSize: '2-10',
    image: 'https://sfile.chatglm.cn/images-ppt/17598ed382b6.jpg',
    gradient: 'from-violet-700/50 via-purple-700/40 to-fuchsia-800/50',
    desc: 'Known as the "Hidden Valley," Tsum Valley is a sacred Himalayan pilgrimage valley with ancient Buddhist heritage, monasteries, and unique Tibetan culture unchanged for centuries.',
    highlights: ['Sacred hidden valley', 'Mu Gompa monastery', 'Ancient Buddhist heritage', 'Unique Tsumba culture'],
  },
  {
    title: 'Rara Lake Trek',
    days: 12, difficulty: 'moderate' as const, price: 1550, oldPrice: 1799,
    country: 'Nepal', altitude: '2,990m', rating: 5, region: 'Far West Nepal',
    season: 'Apr-Jun, Sep-Oct', groupSize: '2-10',
    image: 'https://sfile.chatglm.cn/images-ppt/3238c3c3cb05.jpg',
    gradient: 'from-blue-700/50 via-sky-700/40 to-cyan-800/50',
    desc: 'Trek to Nepal\'s largest lake, surrounded by pine forests and snow-capped peaks. Rara Lake\'s pristine turquoise waters and rich wildlife make this a true off-the-beaten-path gem.',
    highlights: ['Nepal\'s largest lake', 'Rara National Park', 'Rare wildlife & birds', 'Pristine turquoise waters'],
  },
  {
    title: 'Khopra Ridge Trek',
    days: 9, difficulty: 'easy' as const, price: 750, oldPrice: 899,
    country: 'Nepal', altitude: '3,640m', rating: 5, region: 'Annapurna Region',
    season: 'Mar-May, Oct-Nov', groupSize: '2-14',
    image: 'https://sfile.chatglm.cn/images-ppt/347203ac82e5.jpg',
    gradient: 'from-teal-700/50 via-cyan-700/40 to-blue-800/50',
    desc: 'A community-based trek offering stunning views of Annapurna and Dhaulagiri from Khopra Ridge. Stay in community lodges, visit sacred Kaire Lake, and support local communities.',
    highlights: ['Khopra Ridge viewpoint', 'Sacred Kaire Lake', 'Community-based lodges', 'Annapurna & Dhaulagiri views'],
  },
  {
    title: 'Kathmandu Valley Cultural Tour',
    days: 4, difficulty: 'easy' as const, price: 350, oldPrice: 450,
    country: 'Nepal', altitude: '1,400m', rating: 5, region: 'Kathmandu Valley',
    season: 'Year-round', groupSize: '1-20',
    image: 'https://sfile.chatglm.cn/images-ppt/56d4ad1920e0.jpg',
    gradient: 'from-rose-700/50 via-pink-700/40 to-red-800/50',
    desc: 'Explore 7 UNESCO World Heritage sites in Kathmandu Valley including Pashupatinath, Boudhanath, Swayambhunath, and the Durbar Squares. A cultural immersion into Nepal\'s rich heritage.',
    highlights: ['7 UNESCO World Heritage sites', 'Pashupatinath & Boudhanath', 'Swayambhunath (Monkey Temple)', 'Ancient royal palaces'],
  },
];

const DESTINATIONS = [
  { name: 'Everest Region', tagline: 'Land of Sherpas & Sagarmatha', trips: 18, priceFrom: 1299, rating: 4.9, gradient: 'from-emerald-700/50 via-teal-700/40 to-cyan-800/50' },
  { name: 'Annapurna Region', tagline: 'World\'s Most Popular Trek', trips: 15, priceFrom: 850, rating: 4.8, gradient: 'from-amber-700/50 via-orange-700/40 to-rose-800/50' },
  { name: 'Langtang Region', tagline: 'Valley of Glaciers', trips: 8, priceFrom: 850, rating: 4.7, gradient: 'from-green-700/50 via-emerald-700/40 to-teal-800/50' },
  { name: 'Manaslu Region', tagline: 'Wild & Untouched Circuit', trips: 6, priceFrom: 1350, rating: 4.9, gradient: 'from-rose-700/50 via-pink-700/40 to-fuchsia-800/50' },
  { name: 'Mustang Region', tagline: 'Last Forbidden Kingdom', trips: 5, priceFrom: 1890, rating: 4.8, gradient: 'from-yellow-700/50 via-amber-700/40 to-orange-800/50' },
  { name: 'Dolpo Region', tagline: 'Hidden Himalayan Paradise', trips: 4, priceFrom: 2950, rating: 4.9, gradient: 'from-blue-700/50 via-indigo-700/40 to-violet-800/50' },
];

const FEATURES = [
  { title: 'Expert Local Guides', desc: 'Our team comprises experts in tourism and destinations, knowledgeable local guides who possess a deep understanding of the local culture and history.', icon: 'compass' },
  { title: 'Your Safety First', desc: 'We place the utmost importance on your safety and enjoyment, going above and beyond to ensure your trip is seamless and unforgettable.', icon: 'gps' },
  { title: 'Tailored Itineraries', desc: 'Our expertise lies in creating tailored itineraries that cater to your desired experience. Cultural exploration or extreme adventure — we create the perfect trip plan.', icon: 'calendar' },
  { title: 'Dedicated Support', desc: 'When you travel with us, a dedicated local staff is always available to cater to your every need. From airport pickup to the final farewell, we\'re with you.', icon: 'chart' },
];

const PACKING_ITEMS: Record<string, string[]> = {
  Clothing: ['Down Jacket', 'Thermal Base Layers', 'Fleece Pullover', 'Trekking Pants', 'Rain Shell', 'Warm Hat', 'Gloves', 'Buff/Neck Gaiter'],
  Footwear: ['Trekking Boots', 'Camp Shoes', 'Trekking Socks (3 pairs)'],
  Gear: ['Daypack', 'Sleeping Bag', 'Trekking Poles', 'Headlamp', 'Water Bottles', 'Sunglasses'],
  Documents: ['Passport', 'Travel Insurance', 'Flight Tickets', 'Visa Documents', 'Emergency Contacts Card'],
  Electronics: ['Phone + Charger', 'Power Bank', 'Camera', 'Adapter'],
  Medications: ['Altitude Sickness Pills', 'First Aid Kit', 'Personal Medications', 'Water Purification Tablets'],
};

const FAQ_DATA = [
  { q: 'How far in advance should I book?', a: 'We recommend booking at least 3-6 months in advance for popular treks like EBC and Annapurna. For peak seasons (Oct-Nov and Mar-May), booking 6-12 months ahead ensures availability. Please feel free to contact us before booking — we\'ll be glad to help you with these details.', cat: 'Booking' },
  { q: 'What is included in the tour price?', a: 'Our tour prices include airport transfers (from Kathmandu airport/bus station), accommodation, meals during the trek, experienced guide and porter services, TIMS and conservation area permits, and emergency evacuation arrangements. International flights, travel insurance, and personal expenses are not included.', cat: 'Booking' },
  { q: 'What payment methods do you accept?', a: 'The payment is encrypted and transmitted securely with an SSL protocol. We accept Visa, Mastercard, bank transfers, and PayPal. A deposit is required to confirm your booking, with the balance due before departure.', cat: 'Payment' },
  { q: 'Can I customize my itinerary?', a: 'Yes! Our expertise lies in creating tailored itineraries that cater to your desired experience. Whether it\'s cultural exploration or extreme adventure such as trekking Mount Everest Base Camp, our team can help create a great trip plan according to your requirements.', cat: 'Booking' },
  { q: 'What permits do I need for trekking?', a: 'Most treks require a Trekkers Information Management System (TIMS) card and a conservation area permit (like ACAP for Annapurna, MCAP for Manaslu). Restricted area treks like Upper Mustang and Upper Dolpo require special permits. We handle all permit arrangements for you.', cat: 'Permits' },
  { q: 'What is the best time to trek in Nepal?', a: 'Autumn (September to November) and Spring (March to May) are the best times for trekking in Nepal. During Autumn, the weather is warm during the day and cool at night. Spring brings blooming rhododendrons and warmer days. The Annapurna and EBC treks are doable year-round, but these seasons offer the best conditions.', cat: 'Seasons' },
  { q: 'Is travel insurance mandatory?', a: 'Yes, comprehensive travel insurance covering high-altitude trekking (up to 6,000m), emergency helicopter evacuation, medical treatment, and trip cancellation is mandatory for all our expeditions. We can recommend suitable coverage.', cat: 'Insurance' },
  { q: 'What about altitude sickness?', a: 'We focus on keeping you safe through proper acclimatization. Our itineraries include acclimatization days built in for safety and comfort. During the trek, stay hydrated, ascend gradually, and follow your guide\'s acclimatization advice. Our guides are trained to recognize and respond to altitude-related issues.', cat: 'Health' },
  { q: 'Do you arrange transportation from the airport?', a: 'Yes! If you require travel-related services during your stay, such as transportation arrangements from Kathmandu airport or bus station, please feel free to contact us before booking. All necessary arrangements will be made well before your arrival, giving you complete peace of mind.', cat: 'Booking' },
  { q: 'What gear do I need to bring?', a: 'Essential items include trekking boots, down jacket, sleeping bag, daypack, headlamp, and proper layering. We provide a comprehensive packing list tailored to your specific trek. Rental gear is available in Kathmandu at affordable prices.', cat: 'Gear' },
];

const TESTIMONIALS = [
  { name: 'Sarah Chen', trip: 'Everest Base Camp Trek', initials: 'SC', quote: 'The Everest Base Camp Trek is one of those adventures that changes everything. The breathtaking Himalayan views made me forget to breathe, and the Sherpa people became my heroes. Standing at the base of Mount Everest — that Everest — is something you never forget.' },
  { name: 'Marcus Weber', trip: 'Annapurna Circuit Trek', initials: 'MW', quote: 'The Annapurna Circuit is undoubtedly the world\'s most well-known trek for good reason. Crossing Thorong-La Pass at 5,416m with 360° views of Dhaulagiri, Annapurna, and Nilgiri was the most incredible moment of my life. The team made everything seamless.' },
  { name: 'Priya Sharma', trip: 'Upper Mustang Trek', initials: 'PS', quote: 'Upper Mustang is a life-changing adventure you won\'t find anywhere else in the world. The walled city of Lo Manthang took my breath away — monasteries, prayer wheels, and traditional mud-brick houses around every corner. Truly the Last Forbidden Kingdom.' },
  { name: 'James Morrison', trip: 'Manaslu Circuit Trek', initials: 'JM', quote: 'If you want a remote and wild trek far from the crowds, Manaslu is it. Crossing the Larkya La Pass with untouched Tibetan-influenced villages along the way was extraordinary. Our guide\'s expertise and calm presence made all the difference at high altitude.' },
];

const BLOG_POSTS = [
  { title: 'Everest Base Camp Trek Guide: Everything You Need to Know', category: 'Trekking Guide', readTime: '12 min', excerpt: 'The complete guide to EBC — from preparation and packing to acclimatization days, the 14-day itinerary, and what it\'s really like standing at the foot of the world\'s tallest mountain.', gradient: 'from-teal-700/50 via-cyan-700/40 to-blue-800/50' },
  { title: 'Upper Dolpo Trek Cost: Does It Really Cost That Much?', category: 'Destination', readTime: '8 min', excerpt: 'We break down the real costs of trekking to Upper Dolpo — permits, guides, flights, and accommodation. Plus tips on how to plan your budget for Nepal\'s most remote trekking region.', gradient: 'from-amber-700/50 via-orange-700/40 to-rose-800/50' },
  { title: 'Will the Manaslu Circuit Trek Remain Wild and Quiet in 2026?', category: 'Responsible Travel', readTime: '6 min', excerpt: 'Manaslu is one of Nepal\'s last truly wild circuits. As popularity grows, we explore what makes it special and how we can keep it that way for future generations of trekkers.', gradient: 'from-green-700/50 via-emerald-700/40 to-teal-800/50' },
];

const TRUST_ITEMS = [
  { title: '24/7 Emergency Hotline', desc: '+977-9851-188161', icon: 'phone' },
  { title: 'Certified Local Guides', desc: 'Tourism experts with deep cultural knowledge', icon: 'shield' },
  { title: 'Safety Track Record', desc: 'Since 2013, zero major incidents', icon: 'check-circle' },
  { title: 'SSL Encrypted Payments', desc: 'Secure payment with SSL protocol', icon: 'satellite' },
  { title: 'Nepal Tourism Board', desc: 'Government registered trekking agency', icon: 'insurance' },
  { title: 'Industry Certifications', desc: 'TAAN, NMA, Nepal Tourism Board', icon: 'award' },
];

const PRICING_TIERS = [
  { name: 'Explorer', price: 850, features: ['Group treks (8-12 people)', 'Teahouse accommodation', 'Licensed trekking guide', 'Basic meals during trek', 'TIMS & ACAP permits', 'Airport transfers', 'Emergency evacuation arrangement'], highlighted: false },
  { name: 'Adventurer', price: 1350, features: ['Small group treks (4-6 people)', 'Best available lodges', 'Senior mountain guide', 'All meals + snacks', 'All permits & conservation fees', 'Airport transfers & domestic flights', 'Acclimatization days included', 'Emergency evacuation arrangement', 'Pre-trip fitness plan'], highlighted: true },
  { name: 'Summit', price: 2950, features: ['Private or duo expedition', 'Luxury lodges & premium camps', 'Expert mountaineer guide', 'Gourmet meals & supplements', 'All permits, fees & restricted area permits', 'All flights & transfers', 'GPS + satellite communication', 'Comprehensive insurance', 'Personal porter', 'Post-trip recovery package'], highlighted: false },
];

const TEAM_MEMBERS = [
  { name: 'Kumar Lama', role: 'Founder & Managing Director', initials: 'KL', image: '/team/kumar-lama.jpg', bio: 'Born in Kabhre Palanchok, Kumar started as a trekking porter and kitchen assistant before founding Himalayan Exploration Treks in 2013. A member of the indigenous Tamang community, he works with guides who love their country and try to make a difference by working in their villages and mountains.', gradient: 'from-himalaya-gold/40 to-himalaya-gold/15' },
  { name: 'Pushpa Tamang', role: 'Australia Representative', initials: 'PT', bio: 'Based in Campsie, NSW, Pushpa handles international inquiries and bookings for our Australian clients, ensuring seamless coordination across time zones.', gradient: 'from-himalaya-teal/40 to-himalaya-teal/15' },
  { name: 'Senior Trekking Guide', role: 'Head Guide', initials: 'SG', bio: 'Our lead guides are tourism experts with deep knowledge of local culture and history. They possess a deep understanding of the mountains and ensure every trekker\'s safety and enjoyment.', gradient: 'from-himalaya-blue/40 to-himalaya-blue/15' },
  { name: 'Operations Team', role: 'Logistics & Support', initials: 'OT', bio: 'Our Kathmandu-based operations team ensures every expedition runs seamlessly — from airport pickups and hotel bookings to permit arrangements and emergency support, 24/7.', gradient: 'from-himalaya-emerald/40 to-himalaya-emerald/15' },
];

const RESOURCES = [
  { title: 'Visa Information', desc: 'Complete visa requirements for Nepal, Bhutan, Tibet, and Pakistan. Check by nationality.', cta: 'Check Visa Requirements', icon: 'passport' },
  { title: 'Travel Insurance', desc: 'Comprehensive coverage for high-altitude treks. Partnered with World Nomads & Allianz.', cta: 'Get Insurance Quote', icon: 'shield' },
  { title: 'Health & Vaccinations', desc: 'Required and recommended vaccinations, altitude sickness prevention, and health tips.', cta: 'View Health Guide', icon: 'heart' },
  { title: 'Packing Guide', desc: 'Interactive packing checklists customized for your specific trip and season.', cta: 'Open Packing List', icon: 'backpack' },
  { title: 'Currency & Budgeting', desc: 'Exchange rates, tipping customs, and daily budget estimates per destination.', cta: 'Currency Guide', icon: 'wallet' },
  { title: 'Cultural Etiquette', desc: "Local customs, do's and don'ts, and cultural sensitivity guides for each region.", cta: 'Learn More', icon: 'book' },
];

const GALLERY_ITEMS = [
  { title: 'Sunrise at Poon Hill', location: 'Nepal', gradient: 'from-orange-600/60 via-amber-600/50 to-yellow-700/60' },
  { title: 'Tiger\'s Nest Monastery', location: 'Bhutan', gradient: 'from-blue-600/60 via-indigo-600/50 to-violet-700/60' },
  { title: 'Everest Panorama', location: 'Nepal', gradient: 'from-teal-600/60 via-cyan-600/50 to-emerald-700/60' },
  { title: 'K2 at Dawn', location: 'Pakistan', gradient: 'from-rose-600/60 via-pink-600/50 to-fuchsia-700/60' },
  { title: 'Potala Palace', location: 'Tibet', gradient: 'from-red-600/60 via-orange-600/50 to-amber-700/60' },
  { title: 'Annapurna Range', location: 'Nepal', gradient: 'from-emerald-600/60 via-teal-600/50 to-cyan-700/60' },
  { title: 'Paro Valley', location: 'Bhutan', gradient: 'from-green-600/60 via-emerald-600/50 to-lime-700/60' },
  { title: 'Mount Kailash', location: 'China', gradient: 'from-purple-600/60 via-violet-600/50 to-indigo-700/60' },
];

/* ──────────── HELPERS ──────────── */

function MountainSVG({ className = '', color = 'rgba(255,255,255,0.06)' }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="mtn-sky" x1="200" y1="0" x2="200" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="rgba(249,115,22,0.15)" />
          <stop offset="0.5" stopColor="rgba(236,72,153,0.1)" />
          <stop offset="1" stopColor="rgba(124,58,237,0.05)" />
        </linearGradient>
        <linearGradient id="mtn-fill" x1="200" y1="40" x2="200" y2="200" gradientUnits="userSpaceOnUse">
          <stop stopColor={color} />
          <stop offset="1" stopColor="rgba(0,0,0,0.3)" />
        </linearGradient>
      </defs>
      <rect width="400" height="100" fill="url(#mtn-sky)" />
      <path d="M0 200L80 80L130 130L200 40L270 120L320 70L400 200Z" fill="url(#mtn-fill)" />
      <path d="M0 200L60 120L120 150L180 90L250 140L310 100L400 170V200Z" fill={color} opacity="0.5" />
      <path d="M200 40L230 85L170 85Z" fill="rgba(212,168,83,0.08)" />
      <circle cx="340" cy="25" r="8" fill="rgba(212,168,83,0.12)" />
      <circle cx="340" cy="25" r="5" fill="rgba(212,168,83,0.08)" />
    </svg>
  );
}

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} className="w-3.5 h-3.5" viewBox="0 0 20 20" fill={i < count ? '#d4a853' : 'rgba(255,255,255,0.15)'}>
          <path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.33L10 13.27l-4.77 2.51.91-5.33L2.27 6.68l5.34-.78L10 1z" />
        </svg>
      ))}
    </div>
  );
}

function ResourceIcon({ type }: { type: string }) {
  const icons: Record<string, JSX.Element> = {
    passport: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="4" y="2" width="16" height="20" rx="2"/><circle cx="12" cy="10" r="3"/><path d="M7 18h10"/></svg>,
    shield: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2l8 4v6c0 5.25-3.5 9.74-8 11-4.5-1.26-8-5.75-8-11V6l8-4z"/><path d="M9 12l2 2 4-4"/></svg>,
    heart: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 21C12 21 3 13.5 3 8.5 3 5.42 5.42 3 8.5 3c1.74 0 3.41.81 4.5 2.09A5.99 5.99 0 0117.5 3C20.58 3 23 5.42 23 8.5 23 13.5 12 21 12 21z"/></svg>,
    backpack: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="5" y="6" width="14" height="16" rx="2"/><path d="M8 6V4a4 4 0 018 0v2"/><path d="M5 10h14"/></svg>,
    wallet: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="6" width="20" height="14" rx="2"/><path d="M2 10h20"/><path d="M16 14h2"/></svg>,
    book: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M4 4.5A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15z"/></svg>,
  };
  return icons[type] || icons.book;
}

function FeatureIcon({ type }: { type: string }) {
  const icons: Record<string, JSX.Element> = {
    compass: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" strokeWidth="1.5"><circle cx="12" cy="12" r="10" stroke="#d4a853"/><path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" stroke="#f0d68a"/></svg>,
    gps: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/><circle cx="12" cy="12" r="8" strokeDasharray="4 4" stroke="#06b6d4"/></svg>,
    calendar: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="#4a90d9" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" stroke="#3b82f6"/></svg>,
    chart: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.5"><path d="M18 20V10M12 20V4M6 20v-6" stroke="#2dd4bf"/></svg>,
  };
  return icons[type] || icons.chart;
}

function TrustIcon({ type }: { type: string }) {
  const icons: Record<string, JSX.Element> = {
    phone: <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>,
    shield: <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="#d4a853" strokeWidth="1.5"><path d="M12 2l8 4v6c0 5.25-3.5 9.74-8 11-4.5-1.26-8-5.75-8-11V6l8-4z"/><path d="M9 12l2 2 4-4"/></svg>,
    'check-circle': <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>,
    satellite: <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="#4a90d9" strokeWidth="1.5"><path d="M12 12l4-4"/><path d="M17.5 6.5a2.12 2.12 0 013 3L17.5 6.5z"/><path d="M2 12l4-4"/><path d="M6 8l4 4"/><circle cx="12" cy="12" r="3"/></svg>,
    insurance: <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
    award: <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="1.5"><circle cx="12" cy="8" r="7"/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12"/></svg>,
  };
  return icons[type] || icons.award;
}

/* ──────────── MAIN COMPONENT ──────────── */

export default function HimalayanExplorer() {
  /* Language context */
  const { t, lang, setLang } = useLang();

  /* State */
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [ringPos, setRingPos] = useState({ x: -100, y: -100 });
  const [cursorHovering, setCursorHovering] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [activeToolTab, setActiveToolTab] = useState<'budget' | 'altitude' | 'packing' | 'difficulty'>('budget');
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(null);
  const [faqCategory, setFaqCategory] = useState('All');
  const [galleryFilter, setGalleryFilter] = useState('All');
  const [backToTopVisible, setBackToTopVisible] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [heroMouse, setHeroMouse] = useState({ x: 0, y: 0 });
  const [statsAnimated, setStatsAnimated] = useState(false);
  const [statsValues, setStatsValues] = useState([0, 0, 0, 0]);
  const [wishlistCount] = useState(3);
  const [currency, setCurrency] = useState('USD');
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  /* Tour filter + Custom package states */
  const [tourFilter, setTourFilter] = useState('All');
  const [customDestinations, setCustomDestinations] = useState<string[]>([]);
  const [customTrip, setCustomTrip] = useState({
    startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    duration: 14,
    travelers: 2,
    budget: '1000-2000',
    name: '',
    email: '',
    phone: '',
    nationality: '',
    message: '',
  });
  const [customSubmitting, setCustomSubmitting] = useState(false);
  const [customResult, setCustomResult] = useState<string | null>(null);

  /* Lightbox state */
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  /* Sticky CTA state */
  const [stickyCtaVisible, setStickyCtaVisible] = useState(false);

  /* Trek Match Quiz state */
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizResult, setQuizResult] = useState<typeof TOURS | null>(null);

  /* Trek Comparison state */
  const [compareSelections, setCompareSelections] = useState<string[]>(['', '', '']);

  const QUIZ_QUESTIONS = [
    {
      key: 'experience',
      question: 'What\'s your trekking experience level?',
      options: [
        { icon: '🌱', label: 'Beginner', desc: 'First time trekking', value: 'easy' },
        { icon: '🥾', label: 'Intermediate', desc: 'Some hiking experience', value: 'moderate' },
        { icon: '⛰️', label: 'Experienced', desc: 'Multiple treks done', value: 'challenging' },
        { icon: '🏔️', label: 'Expert', desc: 'High altitude veteran', value: 'strenuous' },
      ],
    },
    {
      key: 'duration',
      question: 'How many days can you trek?',
      options: [
        { icon: '⚡', label: 'Short (3-7 days)', desc: 'Quick getaway', value: 'short' },
        { icon: '📅', label: 'Medium (8-14 days)', desc: 'Standard trek', value: 'medium' },
        { icon: '🗓️', label: 'Long (15+ days)', desc: 'Deep immersion', value: 'long' },
      ],
    },
    {
      key: 'interest',
      question: 'What interests you most?',
      options: [
        { icon: '🏔️', label: 'Mountain Views', desc: 'Panoramic peaks', value: 'mountains' },
        { icon: '🛕', label: 'Culture & Monasteries', desc: 'Ancient traditions', value: 'culture' },
        { icon: '🌿', label: 'Nature & Wildlife', desc: 'Forests, lakes, animals', value: 'nature' },
        { icon: '🏁', label: 'Achievement', desc: 'Summit a peak', value: 'climb' },
      ],
    },
    {
      key: 'budget',
      question: 'What\'s your budget per person?',
      options: [
        { icon: '💵', label: 'Under $1,000', desc: 'Budget-friendly', value: 'budget' },
        { icon: '💰', label: '$1,000 - $2,000', desc: 'Mid-range', value: 'mid' },
        { icon: '💎', label: '$2,000+', desc: 'Premium experience', value: 'premium' },
      ],
    },
  ];

  const calculateQuizResult = useCallback((answers: Record<string, string>) => {
    let filtered = [...TOURS];
    // Filter by difficulty
    if (answers.experience) {
      const diffMap: Record<string, string[]> = {
        easy: ['easy'], moderate: ['easy', 'moderate'],
        challenging: ['moderate', 'challenging'], strenuous: ['challenging', 'strenuous'],
      };
      const allowed = diffMap[answers.experience] || [];
      filtered = filtered.filter(t => allowed.includes(t.difficulty));
    }
    // Filter by duration
    if (answers.duration) {
      if (answers.duration === 'short') filtered = filtered.filter(t => t.days <= 7);
      else if (answers.duration === 'medium') filtered = filtered.filter(t => t.days >= 8 && t.days <= 14);
      else filtered = filtered.filter(t => t.days >= 15);
    }
    // Filter by budget
    if (answers.budget) {
      if (answers.budget === 'budget') filtered = filtered.filter(t => t.price < 1000);
      else if (answers.budget === 'mid') filtered = filtered.filter(t => t.price >= 1000 && t.price <= 2000);
      else filtered = filtered.filter(t => t.price > 2000);
    }
    // If nothing matches, reset filters
    if (filtered.length === 0) filtered = [...TOURS];
    // Take top 3
    setQuizResult(filtered.slice(0, 3));
  }, []);

  /* Submit custom package to API */
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
        setCustomResult('Something went wrong. Please try again or contact us directly.');
      }
    } catch {
      setCustomResult('Network error. Please check your connection and try again.');
    } finally {
      setCustomSubmitting(false);
    }
  }, [customDestinations, customTrip]);

  /* Tool states */
  const [budgetDest, setBudgetDest] = useState('nepal');
  const [budgetDuration, setBudgetDuration] = useState(10);
  const [budgetStyle, setBudgetStyle] = useState('mid');
  const [budgetTravelers, setBudgetTravelers] = useState(2);
  const [budgetResult, setBudgetResult] = useState<Record<string, number> | null>(null);

  const [altMax, setAltMax] = useState(5364);
  const [altStart, setAltStart] = useState(2800);
  const [altDays, setAltDays] = useState(10);
  const [altResult, setAltResult] = useState<{ risk: string; acclimDays: number; maxDailyGain: number; oxygenPct: number; symptoms: string[] } | null>(null);

  const [packedItems, setPackedItems] = useState<Record<string, boolean>>(() => {
    if (typeof window === 'undefined') return {};
    try {
      const saved = localStorage.getItem('himalaya-packing');
      if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return {};
  });

  const [diffDistance, setDiffDistance] = useState(65);
  const [diffAltitude, setDiffAltitude] = useState(5400);
  const [diffAscent, setDiffAscent] = useState(2500);
  const [diffTerrain, setDiffTerrain] = useState('rocky');
  const [diffFitness, setDiffFitness] = useState('intermediate');
  const [diffResult, setDiffResult] = useState<{ score: number; label: string; time: string; training: string } | null>(null);

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', trip: '', message: '' });

  /* Checkout states */
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'details' | 'confirmation'>('details');
  const [selectedTour, setSelectedTour] = useState<typeof TOURS[0] | null>(null);
  const [bookingForm, setBookingForm] = useState({
    fullName: '', email: '', whatsapp: '', nationality: '', currentLocation: '', message: '',
  });
  const [bookingResult, setBookingResult] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const checkoutRef = useRef<HTMLDivElement>(null);

  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  /* Countdown timer - 45 days from a fixed epoch */
  useEffect(() => {
    const targetDate = new Date('2026-09-15T06:00:00Z');
    const interval = setInterval(() => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  /* Scroll listener */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      setBackToTopVisible(window.scrollY > 500);
      setStickyCtaVisible(window.scrollY > 800 && window.scrollY < document.documentElement.scrollHeight - window.innerHeight - 600);
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalScroll > 0 ? (window.scrollY / totalScroll) * 100 : 0;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Custom cursor follower (spring-lagged ring) */
  useEffect(() => {
    let raf = 0;
    const dotTarget = { x: 0, y: 0 };
    const ringTarget = { x: 0, y: 0 };
    const onMove = (e: MouseEvent) => {
      dotTarget.x = e.clientX;
      dotTarget.y = e.clientY;
      ringTarget.x = e.clientX;
      ringTarget.y = e.clientY;
      setCursorPos({ x: e.clientX, y: e.clientY });
      const target = e.target as HTMLElement;
      const isInteractive = !!target.closest('a, button, [role="button"], input, select, textarea, .cursor-target');
      setCursorHovering(isInteractive);
    };
    const tick = () => {
      setRingPos((prev) => ({
        x: prev.x + (ringTarget.x - prev.x) * 0.18,
        y: prev.y + (ringTarget.y - prev.y) * 0.18,
      }));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  /* IntersectionObserver for reveal animations */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal, .reveal-scale, .reveal-fade-up, .reveal-fade-scale, .reveal-slide-left, .reveal-slide-right').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  /* Stats counter animation */
  useEffect(() => {
    if (!statsRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !statsAnimated) {
          setStatsAnimated(true);
          const targets = [5000, 50, 300, 11];
          const durations = 2000;
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / durations, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setStatsValues(targets.map((t) => Math.round(t * eased)));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, [statsAnimated]);

  /* Save packing state */
  useEffect(() => {
    try {
      localStorage.setItem('himalaya-packing', JSON.stringify(packedItems));
    } catch { /* ignore */ }
  }, [packedItems]);

  /* Budget calculator */
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
    const m = styleMult[budgetStyle] || 1;
    setBudgetResult({
      Flights: Math.round(d.flights * budgetTravelers * m),
      Accommodation: Math.round(d.accommodation * budgetDuration * budgetTravelers * m),
      Food: Math.round(d.food * budgetDuration * budgetTravelers * m),
      Activities: Math.round(d.activities * budgetDuration * m),
      Insurance: Math.round(d.insurance * budgetDuration * budgetTravelers),
      Visa: Math.round(d.visa * budgetTravelers),
    });
  }, [budgetDest, budgetDuration, budgetStyle, budgetTravelers]);

  /* Altitude calculator */
  const calculateAltitude = useCallback(() => {
    const gain = altMax - altStart;
    const acclimDays = altMax > 3500 ? Math.ceil((altMax - 3500) / 500) + 2 : 0;
    const maxDailyGain = altMax > 3000 ? 500 : 800;
    const oxygenPct = Math.round((Math.exp(-0.0001217 * altMax)) * 100 * 20.9) / 10;
    let risk = 'Low';
    if (altMax > 5500) risk = 'Extreme';
    else if (altMax > 4500) risk = 'High';
    else if (altMax > 3500) risk = 'Moderate';
    const symptoms: string[] = [];
    if (altMax > 2500) symptoms.push('Headache', 'Nausea');
    if (altMax > 3500) symptoms.push('Shortness of breath', 'Dizziness');
    if (altMax > 4500) symptoms.push('Confusion', 'Severe fatigue');
    if (altMax > 5500) symptoms.push('Cyanosis', 'Loss of coordination');
    setAltResult({ risk, acclimDays, maxDailyGain, oxygenPct, symptoms });
  }, [altMax, altStart, altDays]);

  /* Difficulty estimator */
  const calculateDifficulty = useCallback(() => {
    let score = 0;
    score += (diffDistance / 200) * 2.5;
    score += (diffAltitude / 8849) * 2.5;
    score += (diffAscent / 5000) * 2;
    const terrainMult: Record<string, number> = { trail: 0.7, rocky: 1, snow: 1.3, ice: 1.6, mixed: 1.4 };
    score *= terrainMult[diffTerrain] || 1;
    const fitnessMult: Record<string, number> = { beginner: 1.5, intermediate: 1.2, advanced: 0.9, elite: 0.7 };
    score *= fitnessMult[diffFitness] || 1;
    score = Math.min(10, Math.max(1, Math.round(score * 10) / 10));
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

  /* Hero mouse move */
  /* Open checkout for a tour */
  const openCheckout = useCallback((tour: typeof TOURS[0]) => {
    setSelectedTour(tour);
    setCheckoutOpen(true);
    setCheckoutStep('details');
    setBookingForm({
      fullName: '', email: '', whatsapp: '', nationality: '', currentLocation: '', message: '',
    });
    setBookingResult(null);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeCheckout = useCallback(() => {
    setCheckoutOpen(false);
    setSelectedTour(null);
    setCheckoutStep('details');
    setBookingResult(null);
    document.body.style.overflow = '';
  }, []);

  /* Submit booking — sends details to WhatsApp 9841023371 */
  const submitBooking = useCallback(() => {
    if (!selectedTour) return;
    setIsSubmitting(true);

    // Build the WhatsApp message with all booking details
    const msg = `🏔️ *NEW BOOKING REQUEST* 🏔️
━━━━━━━━━━━━━━━━━━━━

🥾 *Tour:* ${selectedTour.title}
📍 *Region:* ${selectedTour.region}
💰 *Price:* $${selectedTour.price.toLocaleString()}
📅 *Duration:* ${selectedTour.days} days
⛰️ *Max Altitude:* ${selectedTour.altitude}
⚡ *Difficulty:* ${selectedTour.difficulty}

👤 *CUSTOMER DETAILS*
━━━━━━━━━━━━━━━━━━━━
*Name:* ${bookingForm.fullName}
*Email:* ${bookingForm.email}
*WhatsApp:* ${bookingForm.whatsapp}
*Nationality:* ${bookingForm.nationality}
*Current Location:* ${bookingForm.currentLocation}
${bookingForm.message ? `\n💬 *Message:*\n${bookingForm.message}` : ''}

━━━━━━━━━━━━━━━━━━━━
_Sent from himalayanexploration.com_`;

    // Encode for WhatsApp URL
    const whatsappUrl = `https://wa.me/9779841023371?text=${encodeURIComponent(msg)}`;

    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');

    // Show confirmation
    setBookingResult(`Your booking details have been sent to WhatsApp! We'll confirm your reservation shortly.`);
    setCheckoutStep('confirmation');
    setIsSubmitting(false);
  }, [selectedTour, bookingForm]);

  const handleHeroMouseMove = useCallback((e: React.MouseEvent) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    setHeroMouse({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 20,
    });
  }, []);

  /* Packing progress */
  const totalItems = Object.values(PACKING_ITEMS).flat().length;
  const packedCount = Object.values(PACKING_ITEMS).flat().filter((item) => packedItems[item]).length;
  const packedPct = totalItems > 0 ? Math.round((packedCount / totalItems) * 100) : 0;

  /* Filtered FAQs */
  const filteredFaqs = faqCategory === 'All' ? FAQ_DATA : FAQ_DATA.filter((f) => f.cat === faqCategory);
  /* Filtered gallery */
  const filteredGallery = galleryFilter === 'All' ? GALLERY_ITEMS : GALLERY_ITEMS.filter((g) => g.location === galleryFilter);

  /* ──────────── RENDER ──────────── */
  return (
    <main className="min-h-screen bg-transparent text-[#f0f4f8] overflow-x-hidden relative z-0">
      {/* ═══════════ ENHANCEMENT: Scroll Progress Bar (rainbow) ═══════════ */}
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} aria-hidden />

      {/* ═══════════ ENHANCEMENT: Custom Magnetic Cursor ═══════════ */}
      <div className="cursor-dot" style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }} aria-hidden />
      <div
        className={`cursor-ring ${cursorHovering ? 'hover-active' : ''}`}
        style={{ left: `${ringPos.x}px`, top: `${ringPos.y}px` }}
        aria-hidden
      />

      {/* ═══════════ SCROLL PROGRESS BAR (golden cinematic) ═══════════ */}
      <div className="scroll-progress-cinematic" style={{ width: `${scrollProgress}%` }} aria-hidden />

      {/* ═══════════ 1. NAVIGATION — Premium Cinematic ═══════════ */}
      <nav className={`fixed top-0 left-0 right-0 z-50 nav-blur ${scrolled ? 'nav-scrolled' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
                <path d="M16 4L4 28h24L16 4z" fill="#d4a853" opacity="0.8"/>
                <path d="M16 4L22 16L16 14L10 16L16 4z" fill="#f0d68a" opacity="0.6"/>
                <path d="M12 28L18 18L24 28" fill="#a07830" opacity="0.3"/>
              </svg>
              <span className="font-cinematic text-lg font-bold tracking-tight">Himalayan <span className="text-golden-shimmer">Exploration</span></span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-7">
              {[
                { label: t('nav.experiences'), href: '/experiences' },
                { label: t('nav.trekking'), href: '/trekking' },
                { label: t('nav.about'), href: '/about' },
                { label: t('nav.stories'), href: '/stories' },
                { label: t('nav.contact'), href: '/contact' },
              ].map((link) => (
                <a key={link.href} href={link.href} className="nav-link-rainbow text-sm text-white/90 hover:text-white transition-colors font-display">{link.label}</a>
              ))}
            </div>

            {/* Right side */}
            <div className="hidden md:flex items-center gap-3">
              {/* Currency */}
              <div className="relative">
                <button onClick={() => { setShowCurrencyDropdown(!showCurrencyDropdown); setShowLanguageDropdown(false); }} className="lang-switcher !text-xs !py-1.5">
                  {currency} <svg className="w-3 h-3" viewBox="0 0 12 12"><path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>
                </button>
                {showCurrencyDropdown && (
                  <div className="absolute top-full right-0 mt-1 glass-card-static p-1 min-w-[80px] z-50">
                    {['USD','EUR','GBP','INR'].map((c) => (
                      <button key={c} onClick={() => { setCurrency(c); setShowCurrencyDropdown(false); }} className={`block w-full text-left px-3 py-1.5 text-xs rounded transition-colors ${currency === c ? 'text-himalaya-gold bg-himalaya-gold/10' : 'text-white/90 hover:text-white hover:bg-white/5'}`}>{c}</button>
                    ))}
                  </div>
                )}
              </div>
              {/* Language Switcher (uses i18n context) */}
              <div className="relative">
                <button onClick={() => setShowLanguageDropdown(!showLanguageDropdown)} className="lang-switcher">
                  <span>{LANGUAGES.find(l => l.code === lang)?.flag}</span>
                  <span>{lang}</span>
                  <svg className="w-3 h-3" viewBox="0 0 12 12"><path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>
                </button>
                {showLanguageDropdown && (
                  <div className="absolute top-full right-0 mt-1 glass-card-strong p-1 min-w-[140px] z-50">
                    {LANGUAGES.map((l) => (
                      <button key={l.code} onClick={() => { setLang(l.code); setShowLanguageDropdown(false); }} className={`flex items-center gap-2 w-full text-left px-3 py-2 text-xs rounded transition-colors ${lang === l.code ? 'text-himalaya-gold bg-himalaya-gold/10' : 'text-white/90 hover:text-white hover:bg-white/5'}`}>
                        <span>{l.flag}</span>
                        <span>{l.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* Wishlist */}
              <button className="relative p-2 text-white/90 hover:text-himalaya-gold transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                {wishlistCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-himalaya-gold text-red-600 text-[9px] font-bold rounded-full flex items-center justify-center">{wishlistCount}</span>}
              </button>
              {/* User */}
              <button className="p-2 text-white/90 hover:text-himalaya-gold transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 00-16 0"/></svg>
              </button>
              {/* CTA - cinematic */}
              <button className="btn-cinematic !text-xs !py-2 !px-4">{t('nav.book')}</button>
            </div>

            {/* Mobile hamburger */}
            <button className="md:hidden p-2 text-white/90" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                {mobileMenuOpen ? <path d="M6 6l12 12M6 18L18 6"/> : <><path d="M4 6h16M4 12h16M4 18h16"/></>}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-card-strong border-t border-white/5 p-4 space-y-3">
            {[
              { label: t('nav.experiences'), href: '/experiences' },
              { label: t('nav.trekking'), href: '/trekking' },
              { label: t('nav.about'), href: '/about' },
              { label: t('nav.stories'), href: '/stories' },
              { label: t('nav.contact'), href: '/contact' },
            ].map((link) => (
              <a key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className="block text-sm text-white/90 hover:text-himalaya-gold py-2 transition-colors">{link.label}</a>
            ))}
            <div className="flex gap-2 pt-2 border-t border-white/5 flex-wrap">
              {LANGUAGES.map((l) => (
                <button key={l.code} onClick={() => setLang(l.code)} className={`text-xs px-3 py-1.5 rounded ${lang === l.code ? 'bg-himalaya-gold/20 text-himalaya-gold' : 'text-white/85'}`}>{l.flag} {l.code}</button>
              ))}
            </div>
            <button className="btn-cinematic w-full !text-sm">{t('nav.book')}</button>
          </div>
        )}
      </nav>

      {/* ═══════════ 2. HERO SECTION — Premium Cinematic ═══════════ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Aurora glow orbs for cinematic depth (positioned, not animated to distraction) */}
        <div className="aurora-orb" style={{ top: '15%', left: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, #d4a853, transparent 70%)' }} />
        <div className="aurora-orb" style={{ bottom: '15%', right: '10%', width: '380px', height: '380px', background: 'radial-gradient(circle, #7c3aed, transparent 70%)', animationDelay: '4s' }} />
        <div className="aurora-orb" style={{ top: '40%', right: '30%', width: '320px', height: '320px', background: 'radial-gradient(circle, #2dd4bf, transparent 70%)', animationDelay: '8s' }} />

        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          {/* Cinematic eyebrow pill */}
          <div className="reveal-fade-up">
            <span className="pill-cinematic mb-8">{t('hero.pill')}</span>
          </div>

          {/* Hero headline with simple fade in/out effect */}
          <h1 className="reveal-fade-up font-cinematic text-5xl sm:text-7xl md:text-8xl font-bold leading-[1.05] mt-8 mb-8 text-readable-hero">
            <span className="block hero-line-1">{t('hero.title1')}</span>
            <span className="block hero-line-2 italic">{t('hero.title2')}</span>
          </h1>

          {/* Subtitle */}
          <p className="reveal-fade-up text-readable text-lg sm:text-xl text-white max-w-3xl mx-auto mb-10 leading-relaxed">
            {t('hero.subtitle')}
          </p>

          {/* Cinematic CTAs */}
          <div className="reveal-fade-up flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a href="/trekking" className="btn-cinematic magnetic">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              {t('hero.cta1')}
            </a>
            <button className="btn-outline-cinematic magnetic flex items-center justify-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polygon points="10,8 16,12 10,16" fill="currentColor"/></svg>
              {t('hero.cta2')}
            </button>
          </div>

          {/* Hero Search Overlay — region + difficulty + duration */}
          <div className="reveal-fade-up hero-search-overlay max-w-4xl mx-auto mb-8">
            <div className="hero-search-field">
              <label>Region</label>
              <select className="form-select w-full !py-2 !text-sm" defaultValue="">
                <option value="">All Regions</option>
                <option>Everest Region</option>
                <option>Annapurna Region</option>
                <option>Langtang Region</option>
                <option>Manaslu Region</option>
                <option>Mustang Region</option>
                <option>Dolpo Region</option>
                <option>Kanchenjunga Region</option>
              </select>
            </div>
            <div className="hero-search-field">
              <label>Difficulty</label>
              <select className="form-select w-full !py-2 !text-sm" defaultValue="">
                <option value="">Any Level</option>
                <option>Easy</option>
                <option>Moderate</option>
                <option>Challenging</option>
                <option>Strenuous</option>
              </select>
            </div>
            <div className="hero-search-field">
              <label>Duration</label>
              <select className="form-select w-full !py-2 !text-sm" defaultValue="">
                <option value="">Any Duration</option>
                <option>3-7 days</option>
                <option>8-14 days</option>
                <option>15+ days</option>
              </select>
            </div>
            <a href="/trekking" className="btn-cinematic !py-2.5 !px-6 whitespace-nowrap flex items-center justify-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              Search
            </a>
          </div>

          {/* Cinematic stat row with Playfair numbers — each stat a different vibrant color */}
          <div className="reveal-fade-up flex flex-wrap justify-center gap-8 sm:gap-16 pt-8 border-t border-white/10">
            {[
              { val: '8,849m', label: t('hero.stat.peak'), color: '#3b82f6' },      // Blue
              { val: '50+', label: t('hero.stat.dest'), color: '#10b981' },           // Green
              { val: '300+', label: t('hero.stat.tours'), color: '#ef4444' },         // Red
              { val: t('common.since'), label: t('hero.stat.exp'), color: '#f59e0b' }, // Gold/Amber
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div
                  className="font-cinematic text-2xl sm:text-3xl font-bold text-readable-strong"
                  style={{
                    color: stat.color,
                    WebkitTextFillColor: stat.color,
                    textShadow: `0 0 20px ${stat.color}80, 0 2px 8px rgba(0,0,0,0.7)`,
                  }}
                >
                  {stat.val}
                </div>
                <div className="eyebrow mt-2 text-white">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-gentle">
          <svg className="w-6 h-6 text-himalaya-gold/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
        </div>
      </section>

      {/* ═══════════ 3. SEARCH BAR SECTION ═══════════ */}
      <section className="relative z-10 -mt-8 px-4">
        <div className="max-w-5xl mx-auto glass-card-strong p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="text-xs text-white/80 mb-1 block">Destination</label>
              <select className="form-select w-full">
                <option>All Regions</option>
                <option>Everest Region</option>
                <option>Annapurna Region</option>
                <option>Langtang Region</option>
                <option>Manaslu Region</option>
                <option>Mustang Region</option>
                <option>Dolpo Region</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-white/80 mb-1 block">Dates</label>
              <input type="date" className="search-input w-full" />
            </div>
            <div>
              <label className="text-xs text-white/80 mb-1 block">Travelers</label>
              <select className="form-select w-full">
                {[1,2,3,4,5,6,7,8,9,'10+'].map((n) => <option key={String(n)}>{n} Traveler{n !== 1 ? 's' : ''}</option>)}
              </select>
            </div>
            <div className="flex items-end">
              <button className="btn-primary btn-neon-glow w-full flex items-center justify-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ ENHANCEMENT: Animated Marquee Strip ═══════════ */}
      <section className="py-8 sm:py-10 border-y border-white/5 bg-gradient-to-r from-himalaya-aurora/5 via-transparent to-himalaya-teal/5">
        <div className="marquee">
          <div className="marquee-track">
            {[
              'Everest Region', 'Annapurna Circuit', 'Upper Mustang', 'Langtang Valley',
              'Manaslu Circuit', 'Upper Dolpo', 'Kanchenjunga', 'Mera Peak',
              'Island Peak', 'Lobuche East', 'Gokyo Lakes', 'Helambu Trek',
              'Everest Region', 'Annapurna Circuit', 'Upper Mustang', 'Langtang Valley',
              'Manaslu Circuit', 'Upper Dolpo', 'Kanchenjunga', 'Mera Peak',
              'Island Peak', 'Lobuche East', 'Gokyo Lakes', 'Helambu Trek',
            ].map((name, i) => (
              <span key={i} className="marquee-item">
                <span className="marquee-star" />
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ ENHANCEMENT: Animated Wave Divider ═══════════ */}
      <div className="wave-divider" aria-hidden>
        <svg className="wave-1" viewBox="0 0 2880 60" preserveAspectRatio="none">
          <path d="M0,30 C360,55 720,5 1440,30 C2160,55 2520,5 2880,30 L2880,60 L0,60 Z" fill="url(#wave-grad-1)" />
          <defs>
            <linearGradient id="wave-grad-1" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(212,168,83,0.4)" />
              <stop offset="50%" stopColor="rgba(45,212,191,0.4)" />
              <stop offset="100%" stopColor="rgba(124,58,237,0.4)" />
            </linearGradient>
          </defs>
        </svg>
        <svg className="wave-2" viewBox="0 0 2880 60" preserveAspectRatio="none">
          <path d="M0,30 C480,5 960,55 1440,30 C1920,5 2400,55 2880,30 L2880,60 L0,60 Z" fill="url(#wave-grad-2)" />
          <defs>
            <linearGradient id="wave-grad-2" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(74,144,217,0.4)" />
              <stop offset="50%" stopColor="rgba(236,72,153,0.4)" />
              <stop offset="100%" stopColor="rgba(249,115,22,0.4)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* ═══════════ 4. STATS COUNTER ═══════════ */}
      <section ref={statsRef} className="py-16 sm:py-20 section-aurora-wash">
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <div className="glass-card-static gradient-border-cycling p-6 sm:p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { val: statsValues[0], suffix: '+', label: 'Happy Travelers', color: '#3b82f6' },  // Blue
                { val: statsValues[1], suffix: '+', label: 'Destinations', color: '#10b981' },       // Green
                { val: statsValues[2], suffix: '+', label: 'Tours', color: '#ef4444' },              // Red
                { val: statsValues[3], suffix: '', label: 'Years Experience', color: '#f59e0b' },    // Gold
              ].map((stat, i) => (
                <div key={stat.label} className="text-center">
                  <div
                    className="text-readable-strong text-2xl sm:text-3xl font-bold font-display"
                    style={{
                      color: stat.color,
                      WebkitTextFillColor: stat.color,
                      textShadow: `0 0 20px ${stat.color}80, 0 2px 8px rgba(0,0,0,0.7)`,
                    }}
                  >
                    {stat.val.toLocaleString()}{stat.suffix}
                  </div>
                  <div className="text-readable text-xs text-white mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ 5. POPULAR TOURS ═══════════ */}
      <section id="destinations" className="py-16 sm:py-20 section-aurora-wash">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12 reveal">
            <span className="pill-cinematic"><span className="glow-dot mr-2" />{t('section.trekking.pill')}</span>
            <h2 className="font-cinematic text-readable-strong text-4xl sm:text-5xl font-bold mt-6 mb-3">
              Featured <span className="text-golden-shimmer italic">Trekking Expeditions</span>
            </h2>
            <p className="text-readable text-white/90 mt-2 max-w-2xl mx-auto">A selection of our most popular Himalayan adventures. Visit the Trekking page to see all 16 packages.</p>
            <div className="divider-golden" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOURS.slice(0, 6).map((tour) => {
              const discount = Math.round(((tour.oldPrice - tour.price) / tour.oldPrice) * 100);
              return (
              <div key={tour.title} className="card-premium holo-sheen overflow-hidden reveal-fade-up group">
                {/* Image with overlay */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={tour.image}
                    alt={tour.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  {/* Discount badge */}
                  {discount > 0 && (
                    <span className="discount-badge">-{discount}%</span>
                  )}
                  {/* Country badge */}
                  <span className="absolute top-3 left-3 text-xs text-white bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full font-display">{tour.country}</span>
                  {/* Rating */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                    <svg className="w-3 h-3 text-himalaya-gold" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6 4.4 2.3 7.4-6.3-4.6-6.3 4.6L7.9 14 2 9.4h7.6z"/></svg>
                    <span className="text-xs text-white font-display">{tour.rating}.0</span>
                  </div>
                  {/* Title on image */}
                  <div className="absolute bottom-3 left-3 right-12">
                    <h3 className="text-readable-strong font-cinematic text-lg font-bold text-white leading-tight">{tour.title}</h3>
                    <p className="text-readable text-xs text-white/85 mt-0.5">{tour.region}</p>
                  </div>
                </div>

                <div className="p-5">
                  {/* Quick stats row */}
                  <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                    <div className="bg-white/5 rounded-lg py-2">
                      <div className="text-xs text-white/85">Days</div>
                      <div className="font-cinematic font-bold text-golden-shimmer text-lg">{tour.days}</div>
                    </div>
                    <div className="bg-white/5 rounded-lg py-2">
                      <div className="text-xs text-white/85">Altitude</div>
                      <div className="font-display font-bold text-white text-sm">{tour.altitude}</div>
                    </div>
                    <div className="bg-white/5 rounded-lg py-2">
                      <div className="text-xs text-white/85">Difficulty</div>
                      <div className={`font-display font-bold text-xs uppercase difficulty-${tour.difficulty}`}>{tour.difficulty}</div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-readable text-xs text-white/90 leading-relaxed mb-3 line-clamp-2">{tour.desc}</p>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {tour.highlights.slice(0, 2).map((h) => (
                      <span key={h} className="text-[10px] px-2 py-0.5 rounded-full bg-himalaya-gold/10 text-himalaya-gold/90 border border-himalaya-gold/20">{h}</span>
                    ))}
                    {tour.highlights.length > 2 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/90">+{tour.highlights.length - 2} more</span>
                    )}
                  </div>

                  {/* Season + Group size */}
                  <div className="flex items-center gap-3 text-xs text-white/90 mb-4">
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                      {tour.season}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
                      {tour.groupSize}
                    </span>
                  </div>

                  {/* Price + CTA */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <div>
                      <div className="text-xs text-white/85 line-through">${tour.oldPrice.toLocaleString()}</div>
                      <div className="font-cinematic text-2xl font-bold text-golden-shimmer">${tour.price.toLocaleString()}</div>
                    </div>
                    <button onClick={() => openCheckout(tour)} className="btn-cinematic !text-xs !py-2 !px-4">
                      {t('tour.bookNow')}
                    </button>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
          <div className="text-center mt-10 reveal">
            <a href="/trekking" className="btn-outline-cinematic inline-block">{t('section.trekking.viewAll')}</a>
          </div>
        </div>
      </section>

      {/* ═══════════ 18. NEWSLETTER ═══════════ */}
      <section className="py-16 sm:py-20 relative section-glow-top">
        <div className="pattern-overlay">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-himalaya-aurora/8 via-himalaya-rose/5 to-himalaya-orange/3 rounded-full blur-[120px] animate-aurora" />
        </div>
        <div className="max-w-3xl mx-auto px-4 relative z-10 reveal">
          <div className="glass-card-strong p-8 sm:p-10 relative overflow-hidden">
            {/* Gradient orbs */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-himalaya-gold/15 to-himalaya-rose/10 rounded-full blur-[80px]" />
            <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-gradient-to-br from-himalaya-aurora/10 to-himalaya-teal/10 rounded-full blur-[60px]" />
            <div className="relative z-10 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">Stay Inspired</h2>
              <p className="text-white/85 text-sm mb-1">Get exclusive deals, travel tips, and early access to new expeditions.</p>
              <p className="text-xs text-himalaya-gold mb-6">Join 15,000+ subscribers. Get 10% off your first booking.</p>
              {newsletterSubmitted ? (
                <div className="text-himalaya-gold text-sm font-semibold">✓ Welcome aboard! Check your inbox for your 10% discount code.</div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="form-input flex-1"
                  />
                  <button onClick={() => { if (newsletterEmail.includes('@')) setNewsletterSubmitted(true); }} className="btn-primary whitespace-nowrap">Subscribe</button>
                </div>
              )}
              <p className="text-[10px] text-white/85 mt-3">No spam. Unsubscribe anytime.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ 21. CTA ═══════════ */}
      <section className="py-16 sm:py-20 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-himalaya-gold/5 rounded-full blur-[100px]" />
          <svg className="absolute bottom-0 right-0 w-1/2 h-1/2 opacity-[0.03]" viewBox="0 0 400 400"><polygon points="0,400 200,100 400,400" fill="white"/></svg>
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center reveal">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Reach <span className="gradient-text-aurora">New Heights</span>?</h2>
          <p className="text-white/85 mb-8 max-w-lg mx-auto">Your trip with our team means a lot to us. Whether it&apos;s cultural exploration or extreme adventure such as trekking to Everest Base Camp, we can help create a great trip plan according to your requirements.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-cinematic" onClick={() => openCheckout(TOURS[0])}>Start Your Journey</button>
            <button className="btn-outline-cinematic">Talk to an Expert</button>
          </div>
        </div>
      </section>

      {/* ═══════════ FEATURED-IN LOGOS STRIP ═══════════ */}
      <section className="py-8 px-4 border-y border-white/5">
        <div className="max-w-5xl mx-auto text-center">
          <p className="eyebrow mb-4">As Featured In</p>
          <div className="featured-in-strip">
            <span className="featured-in-logo">Lonely Planet</span>
            <span className="featured-in-logo">TripAdvisor</span>
            <span className="featured-in-logo">National Geographic</span>
            <span className="featured-in-logo">BBC Travel</span>
            <span className="featured-in-logo">The Guardian</span>
            <span className="featured-in-logo">Forbes</span>
          </div>
        </div>
      </section>

      {/* ═══════════ REVIEW BADGE + STATS ═══════════ */}
      <section className="py-10 px-4">
        <div className="max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-4">
          <div className="review-badge">
            <span className="review-stars">★★★★★</span>
            <span className="text-white font-display font-semibold">4.9/5</span>
            <span className="text-white">· 1,247 reviews</span>
          </div>
          <div className="review-badge">
            <span className="text-2xl">🏆</span>
            <span className="text-white font-display font-semibold">TAAN Certified</span>
          </div>
          <div className="review-badge">
            <span className="text-2xl">🛡️</span>
            <span className="text-white font-display font-semibold">100% Safe Treks</span>
          </div>
        </div>
      </section>

      {/* ═══════════ TREKKING SEASONS GUIDE ═══════════ */}
      <section className="py-16 px-4 section-wash-gold">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 reveal">
            <span className="pill-cinematic mb-4">📅 Trekking Seasons</span>
            <h2 className="font-cinematic text-3xl sm:text-4xl font-bold mt-4 mb-2 text-readable-strong">
              Best Time to <span className="text-golden-shimmer italic">Visit Nepal</span>
            </h2>
            <p className="text-readable text-white text-sm max-w-xl mx-auto">
              Plan your trek during the optimal months for clear skies, comfortable temperatures, and stunning mountain views.
            </p>
            <div className="divider-golden" />
          </div>
          <div className="seasons-grid reveal">
            {[
              { month: 'Jan', rating: 'fair', note: 'Winter trekking' },
              { month: 'Feb', rating: 'fair', note: 'Cold but clear' },
              { month: 'Mar', rating: 'excellent', note: 'Spring begins' },
              { month: 'Apr', rating: 'excellent', note: 'Rhododendrons' },
              { month: 'May', rating: 'excellent', note: 'Warm & clear' },
              { month: 'Jun', rating: 'poor', note: 'Monsoon starts' },
              { month: 'Jul', rating: 'poor', note: 'Heavy rain' },
              { month: 'Aug', rating: 'poor', note: 'Rainy season' },
              { month: 'Sep', rating: 'excellent', note: 'Autumn begins' },
              { month: 'Oct', rating: 'excellent', note: 'Peak season' },
              { month: 'Nov', rating: 'excellent', note: 'Clear skies' },
              { month: 'Dec', rating: 'fair', note: 'Winter begins' },
            ].map((m) => (
              <div key={m.month} className={`season-month season-${m.rating}`}>
                <div className="text-base font-bold">{m.month}</div>
                <div className="text-[10px] opacity-80 mt-0.5">{m.note}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-6 text-xs">
            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-emerald-500/40"></span> Excellent</span>
            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-amber-500/30"></span> Good</span>
            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-orange-500/25"></span> Fair</span>
            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-red-500/15"></span> Not Recommended</span>
          </div>
        </div>
      </section>

      {/* ═══════════ PHOTO GALLERY (Masonry + Lightbox) ═══════════ */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 reveal">
            <span className="pill-cinematic mb-4">📸 Gallery</span>
            <h2 className="font-cinematic text-3xl sm:text-4xl font-bold mt-4 mb-2 text-readable-strong">
              Moments from the <span className="text-golden-shimmer italic">Himalayas</span>
            </h2>
            <p className="text-readable text-white text-sm">Real photos captured by our trekkers and guides</p>
            <div className="divider-golden" />
          </div>
          <div className="gallery-masonry reveal">
            {[
              { src: 'https://sfile.chatglm.cn/images-ppt/8f4b99205d53.jpg', title: 'Everest Sunrise', loc: 'Everest Region' },
              { src: 'https://sfile.chatglm.cn/images-ppt/51dae135f694.jpeg', title: 'Annapurna Trail', loc: 'Annapurna Region' },
              { src: 'https://sfile.chatglm.cn/images-ppt/a584ed1012a4.jpg', title: 'Prayer Flags', loc: 'Multiple Regions' },
              { src: 'https://sfile.chatglm.cn/images-ppt/fbbf0535de7f.jpg', title: 'Sherpa Village', loc: 'Everest Region' },
              { src: 'https://sfile.chatglm.cn/images-ppt/a2a5f7dbfe1a.jpg', title: 'Mountain Mist', loc: 'Annapurna' },
              { src: 'https://sfile.chatglm.cn/images-ppt/8acd3895ccb2.jpg', title: 'Tea House Lodge', loc: 'Everest Region' },
              { src: 'https://sfile.chatglm.cn/images-ppt/53a7a771425b.jpg', title: 'Suspension Bridge', loc: 'Multiple Regions' },
              { src: 'https://sfile.chatglm.cn/images-ppt/f6ac0d61e23a.jpg', title: 'Thorong La Pass', loc: 'Annapurna' },
              { src: 'https://sfile.chatglm.cn/images-ppt/c0f8f8a55b8e.jpg', title: 'Base Camp Tent', loc: 'Everest' },
              { src: 'https://sfile.chatglm.cn/images-ppt/51746f7caf03.jpg', title: 'Ancient Monastery', loc: 'Mustang' },
              { src: 'https://sfile.chatglm.cn/images-ppt/c3f423040db8.jpg', title: 'Yak Caravan', loc: 'Everest Region' },
              { src: 'https://sfile.chatglm.cn/images-ppt/b68ff7ecfce6.jpg', title: 'Rhododendron Forest', loc: 'Annapurna' },
            ].map((img, i) => (
              <div
                key={i}
                className="gallery-masonry-item"
                onClick={() => { setLightboxImage(img.src); setLightboxOpen(true); }}
              >
                <img src={img.src} alt={img.title} loading="lazy" />
                <div className="gallery-masonry-overlay">
                  <div className="text-sm font-display font-semibold text-white">{img.title}</div>
                  <div className="text-xs text-white/70">📍 {img.loc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ TREK COMPARISON TOOL ═══════════ */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 reveal">
            <span className="pill-cinematic mb-4">⚖️ Compare Treks</span>
            <h2 className="font-cinematic text-3xl sm:text-4xl font-bold mt-4 mb-2 text-readable-strong">
              Compare <span className="text-golden-shimmer italic">Side by Side</span>
            </h2>
            <p className="text-readable text-white text-sm">Select 2 or 3 treks to compare difficulty, price, duration, and altitude</p>
            <div className="divider-golden" />
          </div>

          <div className="card-premium p-6 reveal">
            {/* Trek selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              {[0, 1, 2].map((idx) => (
                <div key={idx}>
                  <label className="text-xs text-white font-display mb-1 block">Trek {idx + 1}</label>
                  <select
                    value={compareSelections[idx]}
                    onChange={(e) => {
                      const newSel = [...compareSelections];
                      newSel[idx] = e.target.value;
                      setCompareSelections(newSel);
                    }}
                    className="form-select w-full !py-2 !text-sm"
                  >
                    <option value="">— Select a trek —</option>
                    {TOURS.map((tour) => (
                      <option key={tour.title} value={tour.title}>{tour.title}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            {/* Comparison table */}
            {compareSelections.filter(s => s).length >= 2 && (
              <div className="overflow-x-auto">
                <table className="compare-table">
                  <thead>
                    <tr>
                      <th>Feature</th>
                      {compareSelections.filter(s => s).map((title) => {
                        const tour = TOURS.find(t => t.title === title);
                        return <th key={title}>{tour?.title.substring(0, 25)}{tour && tour.title.length > 25 ? '...' : ''}</th>;
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: 'Duration', key: 'days', suffix: ' days' },
                      { label: 'Max Altitude', key: 'altitude', suffix: '' },
                      { label: 'Difficulty', key: 'difficulty', suffix: '' },
                      { label: 'Price', key: 'price', prefix: '$', isPrice: true },
                      { label: 'Region', key: 'region', suffix: '' },
                      { label: 'Best Season', key: 'season', suffix: '' },
                      { label: 'Group Size', key: 'groupSize', suffix: '' },
                      { label: 'Rating', key: 'rating', suffix: ' ★' },
                    ].map((row) => (
                      <tr key={row.key}>
                        <td className="font-display font-semibold text-white">{row.label}</td>
                        {compareSelections.filter(s => s).map((title) => {
                          const tour = TOURS.find(t => t.title === title);
                          if (!tour) return <td key={title}>—</td>;
                          const val = (tour as Record<string, unknown>)[row.key];
                          const display = row.isPrice ? `$${Number(val).toLocaleString()}` : `${row.prefix || ''}${val}${row.suffix || ''}`;
                          return (
                            <td key={title}>
                              {row.key === 'difficulty' ? (
                                <span className={`text-xs px-2 py-0.5 rounded font-bold uppercase difficulty-${val}`}>{val}</span>
                              ) : row.key === 'price' ? (
                                <span className="font-cinematic font-bold text-golden-shimmer">{display}</span>
                              ) : (
                                display
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {compareSelections.filter(s => s).length < 2 && (
              <p className="text-center text-sm text-white/60 py-4">
                👆 Select at least 2 treks above to see the comparison
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════ TREK MATCH QUIZ ═══════════ */}
      <section className="py-16 px-4 section-wash-aurora">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6 reveal">
            <span className="pill-cinematic mb-4">🎯 Trek Match</span>
            <h2 className="font-cinematic text-3xl sm:text-4xl font-bold mt-4 mb-2 text-readable-strong">
              Find Your <span className="text-golden-shimmer italic">Perfect Trek</span>
            </h2>
            <p className="text-readable text-white text-sm">Answer 4 quick questions — we'll match you with the ideal Himalayan adventure</p>
            <div className="divider-golden" />
          </div>

          <div className="quiz-card reveal">
            {!quizResult ? (
              <>
                {/* Progress bar */}
                <div className="quiz-progress-bar mb-6">
                  <div className="quiz-progress-fill" style={{ width: `${((quizStep + 1) / 4) * 100}%` }} />
                </div>
                <p className="text-xs text-white mb-1 font-display">Question {quizStep + 1} of 4</p>
                <h3 className="font-cinematic text-xl font-bold text-white mb-4">
                  {QUIZ_QUESTIONS[quizStep].question}
                </h3>
                <div className="space-y-2">
                  {QUIZ_QUESTIONS[quizStep].options.map((opt) => (
                    <div
                      key={opt.value}
                      className={`quiz-option ${quizAnswers[QUIZ_QUESTIONS[quizStep].key] === opt.value ? 'selected' : ''}`}
                      onClick={() => {
                        const newAnswers = { ...quizAnswers, [QUIZ_QUESTIONS[quizStep].key]: opt.value };
                        setQuizAnswers(newAnswers);
                        setTimeout(() => {
                          if (quizStep < 3) setQuizStep(quizStep + 1);
                          else calculateQuizResult(newAnswers);
                        }, 300);
                      }}
                    >
                      <span className="quiz-option-icon">{opt.icon}</span>
                      <div>
                        <div className="text-sm font-display font-semibold text-white">{opt.label}</div>
                        <div className="text-xs text-white/60">{opt.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
                {quizStep > 0 && (
                  <button
                    onClick={() => setQuizStep(quizStep - 1)}
                    className="mt-4 text-xs text-white/60 hover:text-white transition-colors"
                  >
                    ← Back
                  </button>
                )}
              </>
            ) : (
              <div className="text-center py-4">
                <div className="text-5xl mb-4">🏔️</div>
                <h3 className="font-cinematic text-2xl font-bold text-golden-shimmer mb-2">Your Perfect Match!</h3>
                <p className="text-white mb-4">Based on your answers, we recommend:</p>
                {quizResult.map((tour) => (
                  <div key={tour.title} className="glass-card p-4 mb-3 text-left">
                    <div className="flex items-center gap-3">
                      <img src={tour.image} alt={tour.title} className="w-16 h-16 rounded-lg object-cover" />
                      <div className="flex-1">
                        <h4 className="font-cinematic font-bold text-white text-sm">{tour.title}</h4>
                        <p className="text-xs text-white/70">{tour.days} days · {tour.altitude} · {tour.difficulty}</p>
                        <p className="text-xs text-golden-shimmer font-bold mt-1">${tour.price.toLocaleString()}</p>
                      </div>
                      <button onClick={() => openCheckout(tour)} className="btn-cinematic !text-xs !py-1.5 !px-3">Book</button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => { setQuizStep(0); setQuizAnswers({}); setQuizResult(null); }}
                  className="mt-4 text-sm text-white/60 hover:text-white transition-colors"
                >
                  ↻ Retake Quiz
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════ STICKY CTA BAR ═══════════ */}
      <div className={`sticky-cta ${stickyCtaVisible ? 'visible' : ''}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 w-full">
          <div className="sticky-cta-info">
            <span className="sticky-cta-pulse"></span>
            <span className="hidden sm:inline">🏔️ Spring 2026 trekking season is open!</span>
            <span className="sm:hidden">🏔️ Book now!</span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://wa.me/9779841023371?text=Namaste! I'm interested in booking a trek."
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-display font-semibold text-white border border-white/20 rounded-full px-3 py-2 hover:bg-white/10 transition-colors"
            >
              💬 WhatsApp
            </a>
            <a href="/trekking" className="btn-cinematic !text-xs !py-2 !px-4">Browse Treks →</a>
          </div>
        </div>
      </div>

      {/* ═══════════ LIGHTBOX ═══════════ */}
      {lightboxOpen && lightboxImage && (
        <div className="lightbox" onClick={() => setLightboxOpen(false)}>
          <button className="lightbox-close" onClick={() => setLightboxOpen(false)}>✕</button>
          <img src={lightboxImage} alt="Gallery image" />
        </div>
      )}

      {/* ═══════════ 22. FOOTER ═══════════ */}
      <footer className="border-t border-white/5 pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 mb-10">
            {/* Brand */}
            <div className="col-span-2 sm:col-span-3 lg:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none">
                  <path d="M16 4L4 28h24L16 4z" fill="#d4a853" opacity="0.8"/>
                  <path d="M16 4L22 16L16 14L10 16L16 4z" fill="#f0d68a" opacity="0.6"/>
                </svg>
                <span className="font-bold">Himalayan Exploration</span>
              </div>
              <p className="text-xs text-white/80 leading-relaxed mb-4">Himalayan Exploration Treks — A small company based in Kathmandu providing adventure travel packages since 2013.</p>
              <div className="flex gap-2">
                {['F','X','In','YT'].map((s) => (
                  <button key={s} className="w-9 h-9 rounded-lg bg-white/10 text-white/90 hover:text-himalaya-gold hover:bg-himalaya-gold/15 transition-colors text-sm font-bold flex items-center justify-center border border-white/15">{s}</button>
                ))}
              </div>
            </div>
            {/* Expeditions */}
            <div>
              <h4 className="text-sm font-semibold mb-3">Trekking Regions</h4>
              <ul className="space-y-1.5">
                {['Everest Region','Annapurna Region','Langtang Region','Manaslu Region','Mustang Region','Dolpo Region'].map((l) => (
                  <li key={l}><a href="#" className="text-xs text-white/80 hover:text-himalaya-gold transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
            {/* Company */}
            <div>
              <h4 className="text-sm font-semibold mb-3">Company</h4>
              <ul className="space-y-1.5">
                {['About Us','Our Team','Blog','Contact','Terms & Conditions','Privacy Policy'].map((l) => (
                  <li key={l}><a href="#" className="text-xs text-white/80 hover:text-himalaya-gold transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
            {/* Support */}
            <div>
              <h4 className="text-sm font-semibold mb-3">Support</h4>
              <ul className="space-y-1.5">
                {['Safety','Travel Insurance','Visa Guide','Packing Lists','FAQ','Cookies'].map((l) => (
                  <li key={l}><a href="#" className="text-xs text-white/80 hover:text-himalaya-gold transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
            {/* Legal */}
            <div>
              <h4 className="text-sm font-semibold mb-3">Legal</h4>
              <ul className="space-y-1.5">
                {['Terms & Conditions','Privacy Policy','Cookies','Responsible Travel'].map((l) => (
                  <li key={l}><a href="#" className="text-xs text-white/80 hover:text-himalaya-gold transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          </div>
          {/* Payment methods */}
          <div className="border-t border-white/5 pt-6 mb-6">
            <div className="text-center text-xs text-white/85 mb-3">Pay Safely With Us — The payment is encrypted and transmitted securely with an SSL protocol</div>
            <div className="flex flex-wrap justify-center gap-2">
              {['Visa','Mastercard','PayPal','Apple Pay','Google Pay'].map((m) => (
                <span key={m} className="glass-card-static px-3 py-1.5 text-xs text-white font-medium">{m}</span>
              ))}
            </div>
          </div>
          {/* Bottom bar */}
          <div className="border-t border-white/5 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-white/90">© 2013 - {new Date().getFullYear()} Himalayan Exploration Travel. All Rights Reserved.</p>
            <div className="flex gap-4">
              {['Privacy','Terms','Cookies'].map((l) => (
                <a key={l} href="#" className="text-xs text-white/90 hover:text-himalaya-gold transition-colors font-medium">{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* ═══════════ 23. BACK TO TOP ═══════════ */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`back-to-top ${backToTopVisible ? 'visible' : ''}`}
        aria-label="Back to top"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
      </button>

      {/* ═══════════ 24. WHATSAPP CONTACT WIDGET ═══════════ */}
      <div className="chat-widget">
        {/* WhatsApp info panel - opens on hover/click */}
        {chatOpen && (
          <div className="chat-panel !w-[320px]">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5" style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Himalayan Exploration</div>
                  <div className="text-xs text-white/80 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
                    Typically replies in minutes
                  </div>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-white/90 hover:text-white transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            {/* Body */}
            <div className="p-4 space-y-3">
              <div className="glass-card-static !rounded-2xl !rounded-tl-sm p-3 max-w-[260px]">
                <p className="text-xs text-white/80 leading-relaxed">
                  Namaste! 🙏 Welcome to Himalayan Exploration Treks. We&apos;re here to help you plan your dream Himalayan adventure. Send us a WhatsApp message and our team will assist you personally.
                </p>
              </div>
              {/* Quick prompts */}
              <div className="flex flex-wrap gap-1.5">
                {['Trip Info', 'Pricing', 'Visa Help', 'Custom Package'].map((qr) => (
                  <a
                    key={qr}
                    href={`https://wa.me/9779841023371?text=${encodeURIComponent(`Hi! I'm interested in: ${qr}. Can you help me?`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] px-2.5 py-1 rounded-full border border-himalaya-gold/30 text-himalaya-gold hover:bg-himalaya-gold/10 transition-colors"
                  >
                    {qr}
                  </a>
                ))}
              </div>
            </div>
            {/* CTA */}
            <a
              href={`https://wa.me/9779841023371?text=${encodeURIComponent("Namaste! I'm interested in planning a Himalayan trek. Can you help me?")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 text-center font-semibold text-white transition-colors"
              style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Start Chat on WhatsApp
              </div>
              <div className="text-xs text-white/80 mt-1">+977 9841023371</div>
            </a>
          </div>
        )}
        {/* WhatsApp bubble - the icon itself */}
        <a
          href={`https://wa.me/9779841023371?text=${encodeURIComponent("Namaste! I'm interested in planning a Himalayan trek. Can you help me?")}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`chat-bubble ${!chatOpen ? 'animate-chat-pulse' : ''}`}
          onClick={(e) => { e.preventDefault(); setChatOpen(!chatOpen); }}
          title="Chat with us on WhatsApp: +977 9841023371"
          aria-label="Open WhatsApp chat"
          style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}
        >
          {chatOpen ? (
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          ) : (
            /* WhatsApp official logo */
            <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          )}
        </a>
      </div>

      {/* ═══════════ 25. BOOKING OVERLAY — Simplified, sends to WhatsApp ═══════════ */}
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
                    href={`https://wa.me/9779841023371?text=${encodeURIComponent(`🏔️ BOOKING REQUEST\n\nTour: ${selectedTour.title}\nName: ${bookingForm.fullName}\nEmail: ${bookingForm.email}\nWhatsApp: ${bookingForm.whatsapp}\nNationality: ${bookingForm.nationality}\nLocation: ${bookingForm.currentLocation}\n${bookingForm.message ? 'Message: ' + bookingForm.message : ''}`)}`}
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

    </main>
  );
}
