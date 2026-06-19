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
  { name: 'Lama Tamang', role: 'Founder & Managing Director', initials: 'LT', bio: 'Born in Kabhre Palanchok, Lama started as a trekking porter and kitchen assistant before founding Himalayan Exploration Treks in 2013. A member of the indigenous Tamang community, he works with guides who love their country and try to make a difference by working in their villages and mountains.', gradient: 'from-himalaya-gold/40 to-himalaya-gold/15' },
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
  const [checkoutStep, setCheckoutStep] = useState<'details' | 'payment' | 'confirmation'>('details');
  const [selectedTour, setSelectedTour] = useState<typeof TOURS[0] | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'esewa' | 'bank' | 'arrival'>('esewa');
  const [bookingForm, setBookingForm] = useState({
    fullName: '', email: '', phone: '', nationality: '',
    startDate: '', travelers: 1,
    emergencyContact: '', emergencyPhone: '',
    dietaryNeeds: '', medicalConditions: '', specialRequests: '',
  });
  const [bookingResult, setBookingResult] = useState<{ bookingRef: string; amount: number } | null>(null);
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
      fullName: '', email: '', phone: '', nationality: '',
      startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], travelers: 1,
      emergencyContact: '', emergencyPhone: '',
      dietaryNeeds: '', medicalConditions: '', specialRequests: '',
    });
    setPaymentMethod('esewa');
    setBookingResult(null);
    setAgreeTerms(false);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeCheckout = useCallback(() => {
    setCheckoutOpen(false);
    setSelectedTour(null);
    setCheckoutStep('details');
    setBookingResult(null);
    document.body.style.overflow = '';
  }, []);

  /* Submit booking */
  const submitBooking = useCallback(async () => {
    if (!selectedTour || !agreeTerms) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tourName: selectedTour.title,
          tourDays: selectedTour.days,
          tourRegion: selectedTour.region,
          startDate: bookingForm.startDate,
          travelers: bookingForm.travelers,
          fullName: bookingForm.fullName,
          email: bookingForm.email,
          phone: bookingForm.phone,
          nationality: bookingForm.nationality,
          emergencyContact: bookingForm.emergencyContact,
          emergencyPhone: bookingForm.emergencyPhone,
          dietaryNeeds: bookingForm.dietaryNeeds,
          medicalConditions: bookingForm.medicalConditions,
          paymentMethod,
          amount: selectedTour.price * bookingForm.travelers,
          currency: 'USD',
          specialRequests: bookingForm.specialRequests,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setBookingResult({ bookingRef: data.booking.bookingRef, amount: data.booking.amount });
        setCheckoutStep('confirmation');
      } else {
        alert(data.error || 'Booking failed. Please try again.');
      }
    } catch {
      alert('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedTour, bookingForm, paymentMethod, agreeTerms]);

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
                { label: t('nav.experiences'), href: '#experiences' },
                { label: t('nav.trekking'), href: '#destinations' },
                { label: t('nav.about'), href: '#about' },
                { label: t('nav.stories'), href: '#stories' },
                { label: t('nav.contact'), href: '#contact' },
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
                {wishlistCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-himalaya-gold text-black text-[9px] font-bold rounded-full flex items-center justify-center">{wishlistCount}</span>}
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
              { label: t('nav.experiences'), href: '#experiences' },
              { label: t('nav.trekking'), href: '#destinations' },
              { label: t('nav.about'), href: '#about' },
              { label: t('nav.stories'), href: '#stories' },
              { label: t('nav.contact'), href: '#contact' },
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

          {/* Oversized cinematic headline with Playfair Display + golden shimmer */}
          <h1 className="reveal-fade-up font-cinematic text-5xl sm:text-7xl md:text-8xl font-bold leading-[1.05] mt-8 mb-8 text-readable-hero">
            <span className="block text-white">{t('hero.title1')}</span>
            <span className="block text-golden-shimmer italic">{t('hero.title2')}</span>
          </h1>

          {/* Subtitle */}
          <p className="reveal-fade-up text-readable text-lg sm:text-xl text-white max-w-3xl mx-auto mb-10 leading-relaxed">
            {t('hero.subtitle')}
          </p>

          {/* Cinematic CTAs */}
          <div className="reveal-fade-up flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <a href="#destinations" className="btn-cinematic magnetic">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              {t('hero.cta1')}
            </a>
            <button className="btn-outline-cinematic magnetic flex items-center justify-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polygon points="10,8 16,12 10,16" fill="currentColor"/></svg>
              {t('hero.cta2')}
            </button>
          </div>

          {/* Cinematic stat row with Playfair numbers */}
          <div className="reveal-fade-up flex flex-wrap justify-center gap-8 sm:gap-16 pt-8 border-t border-white/10">
            {[
              ['8,849m', t('hero.stat.peak')],
              ['50+', t('hero.stat.dest')],
              ['300+', t('hero.stat.tours')],
              [t('common.since'), t('hero.stat.exp')],
            ].map(([val, label]) => (
              <div key={label} className="text-center">
                <div className="stat-counter-cinematic text-readable-strong">{val}</div>
                <div className="eyebrow mt-2 text-white/90">{label}</div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
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
            <div>
              <label className="text-xs text-white/80 mb-1 block">Trip Type</label>
              <select className="form-select w-full">
                <option>Trekking Holiday</option>
                <option>Trekking Peak</option>
                <option>Family Holiday</option>
                <option>Cultural Holiday</option>
                <option>Safari Holiday</option>
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
                [statsValues[0], '+', 'Happy Travelers'],
                [statsValues[1], '+', 'Destinations'],
                [statsValues[2], '+', 'Tours'],
                [statsValues[3], '', 'Years Experience'],
              ].map(([val, suffix, label], i) => (
                <div key={label as string} className="text-center">
                  <div className="text-readable-strong text-2xl sm:text-3xl font-bold gradient-text-shimmer font-display">{(val as number).toLocaleString()}{suffix}</div>
                  <div className="text-readable text-xs text-white/90 mt-1">{label}</div>
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
              {t('section.trekking.title1')} <span className="text-golden-shimmer italic">{t('section.trekking.title2')}</span>
            </h2>
            <p className="text-readable text-white/90 mt-2 max-w-2xl mx-auto">{t('section.trekking.subtitle')}</p>
            <div className="divider-golden" />
          </div>

          {/* Filter tabs for regions */}
          <div className="flex flex-wrap justify-center gap-2 mb-10 reveal">
            {['All', 'Everest Region', 'Annapurna Region', 'Langtang Region', 'Manaslu Region', 'Mustang Region', 'Dolpo Region', 'Kanchenjunga Region', 'Far West Nepal', 'Kathmandu Valley'].map((region) => (
              <button
                key={region}
                onClick={() => setTourFilter(region)}
                className={`px-4 py-1.5 rounded-full text-xs font-display font-medium transition-all ${
                  tourFilter === region
                    ? 'bg-gradient-to-r from-himalaya-gold to-himalaya-orange text-black'
                    : 'glass-card-static text-white/90 hover:text-white'
                }`}
              >
                {region}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOURS.filter((tour) => tourFilter === 'All' || tour.region === tourFilter).map((tour) => {
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
            <button className="btn-outline-cinematic">{t('section.trekking.viewAll')}</button>
          </div>
        </div>
      </section>

      {/* ═══════════ CUSTOM PACKAGE BUILDER ═══════════ */}
      <section id="custom-package" className="py-20 section-wash-aurora relative overflow-hidden">
        <div className="aurora-orb" style={{ top: '10%', left: '15%', width: '450px', height: '450px', background: 'radial-gradient(circle, #d4a853, transparent 70%)' }} />
        <div className="aurora-orb" style={{ bottom: '10%', right: '15%', width: '420px', height: '420px', background: 'radial-gradient(circle, #7c3aed, transparent 70%)', animationDelay: '5s' }} />
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <div className="text-center mb-10 reveal-fade-up">
            <span className="pill-cinematic mb-6">✦ Custom Package</span>
            <h2 className="font-cinematic text-4xl sm:text-5xl font-bold mt-6 mb-3 text-readable-strong">
              Build Your <span className="text-golden-shimmer italic">Dream Adventure</span>
            </h2>
            <p className="text-readable text-white/90 max-w-2xl mx-auto">
              Can&apos;t find the perfect package? Create your own custom itinerary. Select the destinations you want to visit, tell us your preferences, and our team will craft a personalized trek just for you.
            </p>
            <div className="divider-golden" />
          </div>

          <div className="card-premium p-6 sm:p-8 reveal-fade-up">
            {/* Step 1: Select destinations */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-himalaya-gold to-himalaya-orange flex items-center justify-center font-cinematic font-bold text-black text-sm">1</div>
                <h3 className="font-cinematic text-xl font-bold text-white">Select Destinations You Want to Visit</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {TOURS.map((tour) => (
                  <label
                    key={tour.title}
                    className={`flex items-center gap-2 p-2.5 rounded-lg cursor-pointer transition-all border ${
                      customDestinations.includes(tour.title)
                        ? 'bg-himalaya-gold/15 border-himalaya-gold/50 text-white'
                        : 'bg-white/5 border-white/10 text-white/90 hover:bg-white/10'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={customDestinations.includes(tour.title)}
                      onChange={() => {
                        setCustomDestinations((prev) =>
                          prev.includes(tour.title)
                            ? prev.filter((d) => d !== tour.title)
                            : [...prev, tour.title]
                        );
                      }}
                      className="w-4 h-4 accent-himalaya-gold"
                    />
                    <span className="text-xs font-display leading-tight">{tour.title}</span>
                  </label>
                ))}
              </div>
              {customDestinations.length > 0 && (
                <p className="text-xs text-himalaya-gold mt-2 font-display">
                  ✓ {customDestinations.length} destination{customDestinations.length > 1 ? 's' : ''} selected
                </p>
              )}
            </div>

            {/* Step 2: Trip details */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-himalaya-gold to-himalaya-orange flex items-center justify-center font-cinematic font-bold text-black text-sm">2</div>
                <h3 className="font-cinematic text-xl font-bold text-white">Trip Details</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs text-white/90 mb-1 block font-display">Preferred Start Date</label>
                  <input
                    type="date"
                    value={customTrip.startDate}
                    onChange={(e) => setCustomTrip({...customTrip, startDate: e.target.value})}
                    className="input-cinematic !py-2 !text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/90 mb-1 block font-display">Duration (days)</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={customTrip.duration}
                    onChange={(e) => setCustomTrip({...customTrip, duration: Number(e.target.value)})}
                    className="input-cinematic !py-2 !text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/90 mb-1 block font-display">Travelers</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={customTrip.travelers}
                    onChange={(e) => setCustomTrip({...customTrip, travelers: Number(e.target.value)})}
                    className="input-cinematic !py-2 !text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/90 mb-1 block font-display">Budget per Person (USD)</label>
                  <select
                    value={customTrip.budget}
                    onChange={(e) => setCustomTrip({...customTrip, budget: e.target.value})}
                    className="input-cinematic !py-2 !text-sm"
                  >
                    <option value="500-1000">$500 - $1,000</option>
                    <option value="1000-2000">$1,000 - $2,000</option>
                    <option value="2000-3000">$2,000 - $3,000</option>
                    <option value="3000+">$3,000+</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 3: Contact info */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-himalaya-gold to-himalaya-orange flex items-center justify-center font-cinematic font-bold text-black text-sm">3</div>
                <h3 className="font-cinematic text-xl font-bold text-white">Your Contact Information</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={customTrip.name}
                  onChange={(e) => setCustomTrip({...customTrip, name: e.target.value})}
                  className="input-cinematic !py-2.5"
                />
                <input
                  type="email"
                  placeholder="Email Address *"
                  value={customTrip.email}
                  onChange={(e) => setCustomTrip({...customTrip, email: e.target.value})}
                  className="input-cinematic !py-2.5"
                />
                <input
                  type="tel"
                  placeholder="Phone Number (with country code)"
                  value={customTrip.phone}
                  onChange={(e) => setCustomTrip({...customTrip, phone: e.target.value})}
                  className="input-cinematic !py-2.5"
                />
                <input
                  type="text"
                  placeholder="Nationality"
                  value={customTrip.nationality}
                  onChange={(e) => setCustomTrip({...customTrip, nationality: e.target.value})}
                  className="input-cinematic !py-2.5"
                />
              </div>
            </div>

            {/* Step 4: Custom message */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-himalaya-gold to-himalaya-orange flex items-center justify-center font-cinematic font-bold text-black text-sm">4</div>
                <h3 className="font-cinematic text-xl font-bold text-white">Your Wishes & Special Requests</h3>
              </div>
              <textarea
                placeholder="Tell us what you want to experience, your fitness level, dietary needs, special interests (photography, culture, wildlife), accessibility requirements, or anything else you'd like us to know..."
                value={customTrip.message}
                onChange={(e) => setCustomTrip({...customTrip, message: e.target.value})}
                rows={5}
                className="input-cinematic !rounded-2xl resize-none"
              />
            </div>

            {/* Submit */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
              <p className="text-xs text-white/85 text-center sm:text-left">
                Our team will respond within 24 hours with a personalized itinerary and quote.
              </p>
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

      {/* ═══════════ 6. FEATURE GRID ═══════════ */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 reveal">
            <span className="category-pill">✨ Why Travel With Us</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4">Why Choose <span className="gradient-text">Himalayan Exploration Treks</span></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feat) => (
              <div key={feat.title} className="glass-card p-6 text-center reveal-scale">
                <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-xl bg-himalaya-gold/10">
                  <FeatureIcon type={feat.icon} />
                </div>
                <h3 className="font-semibold mb-2">{feat.title}</h3>
                <p className="text-xs text-white/85 leading-relaxed">{feat.desc}</p>
                <a href="#" className="text-xs text-himalaya-gold mt-3 inline-block hover:underline">Learn more →</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 7. PRODUCT SHOWCASE ═══════════ */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="reveal">
              <span className="category-pill">🏔️ Featured Expedition</span>
              <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-4">Everest Base Camp Trek</h2>
              <p className="text-white/85 mb-6 leading-relaxed">If you have ever dreamed of standing at the foot of the world&apos;s tallest mountain, the Everest Base Camp Trek is a seriously epic adventure far beyond easy hiking. Whether you&apos;ve never done a serious hike or you&apos;re already a seasoned mountain climber, this 14-day journey works for everyone — from total beginners to mountain veterans, older adults, and families who want their kids to experience what real adventure looks like.</p>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  ['⏱ Duration', '14 Days'],
                  ['🗻 Max Altitude', '5,545m'],
                  ['⚡ Difficulty', 'Strenuous'],
                  ['👥 Min Group', '1'],
                ].map(([label, val]) => (
                  <div key={label} className="glass-card-static p-3">
                    <div className="text-[10px] text-white/80">{label}</div>
                    <div className="text-sm font-semibold mt-0.5">{val}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button className="btn-primary" onClick={() => openCheckout(TOURS[0])}>Book This Trek</button>
                <button className="btn-outline">View Itinerary</button>
              </div>
            </div>
            <div className="reveal-scale">
              <div className="tilt-card glass-card-static p-4 relative">
                <div className="relative h-64 sm:h-80 bg-gradient-to-br from-emerald-700/40 via-teal-700/30 to-cyan-800/40 rounded-lg overflow-hidden flex items-end">
                  <MountainSVG className="absolute inset-0 w-full h-full opacity-40" />
                  <MountainSVG className="absolute bottom-0 left-0 w-3/4 h-1/2 opacity-20" color="rgba(212,168,83,0.1)" />
                  {/* Floating cards */}
                  <div className="absolute top-4 right-4 glass-card-static p-2 text-xs animate-float">
                    <span className="text-himalaya-gold">5,364m</span> altitude
                  </div>
                  <div className="absolute bottom-4 left-4 glass-card-static p-2 text-xs animate-float-delay-1">
                    ⭐ 4.9/5 rating
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ 8. DESTINATIONS GRID ═══════════ */}
      <section className="py-16 sm:py-20 relative section-glow-top">
        <div className="pattern-overlay">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-br from-himalaya-blue/5 via-himalaya-aurora/3 to-transparent rounded-full blur-[120px]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12 reveal">
            <span className="category-pill pill-blue">🌍 Trekking Regions</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4">Explore Trekking <span className="gradient-text-cool">Regions</span></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {DESTINATIONS.map((dest) => (
              <div key={dest.name} className="glass-card overflow-hidden reveal-scale">
                <div className={`relative h-40 bg-gradient-to-br ${dest.gradient} flex items-end p-4`}>
                  <MountainSVG className="absolute inset-0 w-full h-full opacity-30" />
                  <div>
                    <h3 className="font-bold text-lg">{dest.name}</h3>
                    <p className="text-xs text-white/90">{dest.tagline}</p>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div className="text-xs text-white/85">
                    <span className="text-himalaya-gold font-semibold">{dest.trips}</span> trips · From <span className="text-himalaya-gold font-semibold">${dest.priceFrom.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-himalaya-gold">
                    <svg className="w-3 h-3" viewBox="0 0 20 20" fill="#d4a853"><path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.33L10 13.27l-4.77 2.51.91-5.33L2.27 6.68l5.34-.78L10 1z"/></svg>
                    {dest.rating}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 9. INTERACTIVE TOOLS ═══════════ */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10 reveal">
            <span className="category-pill pill-teal">🛠️ Tools</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4">Plan Your <span className="gradient-text-forest">Adventure</span></h2>
          </div>
          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8 reveal">
            {[
              ['budget', '💰 Budget Calculator'],
              ['altitude', '🗻 Altitude Calculator'],
              ['packing', '🎒 Packing Checklist'],
              ['difficulty', '📊 Trek Difficulty'],
            ].map(([key, label]) => (
              <button key={key} onClick={() => setActiveToolTab(key as typeof activeToolTab)} className={`tab-btn ${activeToolTab === key ? 'active' : ''}`}>{label}</button>
            ))}
          </div>

          {/* BUDGET CALCULATOR */}
          {activeToolTab === 'budget' && (
            <div className="glass-card-static p-6 sm:p-8 reveal">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-white/80 mb-1 block">Destination</label>
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
                    <label className="text-xs text-white/80 mb-1 block">Duration: {budgetDuration} days</label>
                    <input type="range" min="1" max="30" value={budgetDuration} onChange={(e) => setBudgetDuration(Number(e.target.value))} className="w-full" />
                  </div>
                  <div>
                    <label className="text-xs text-white/80 mb-2 block">Travel Style</label>
                    <div className="flex gap-2">
                      {[['budget','Budget'],['mid','Mid-range'],['luxury','Luxury']].map(([val, label]) => (
                        <label key={val} className={`flex-1 text-center text-xs py-2 rounded cursor-pointer border transition-colors ${budgetStyle === val ? 'border-himalaya-gold/40 bg-himalaya-gold/10 text-himalaya-gold' : 'border-white/10 text-white/85 hover:border-white/20'}`}>
                          <input type="radio" name="style" value={val} checked={budgetStyle === val} onChange={() => setBudgetStyle(val)} className="sr-only" />
                          {label}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-white/80 mb-1 block">Travelers</label>
                    <select value={budgetTravelers} onChange={(e) => setBudgetTravelers(Number(e.target.value))} className="form-select w-full">
                      {[1,2,3,4,5,6,7,8,9,10].map((n) => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <button onClick={calculateBudget} className="btn-primary w-full mt-2">Calculate Budget</button>
                </div>
                <div>
                  {budgetResult ? (
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-white/90 mb-3">Estimated Breakdown</h4>
                      {Object.entries(budgetResult).map(([key, val]) => (
                        <div key={key} className="tool-card flex items-center justify-between !p-3">
                          <span className="text-xs text-white/85">{key}</span>
                          <span className="text-sm font-semibold text-himalaya-gold">${val.toLocaleString()}</span>
                        </div>
                      ))}
                      <div className="glass-card-strong p-4 flex items-center justify-between mt-4">
                        <span className="font-semibold">Estimated Total</span>
                        <span className="text-lg font-bold gradient-text">${Object.values(budgetResult).reduce((a, b) => a + b, 0).toLocaleString()}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-white/85 text-sm">
                      Configure your trip and click Calculate
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ALTITUDE CALCULATOR */}
          {activeToolTab === 'altitude' && (
            <div className="glass-card-static p-6 sm:p-8 reveal">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-white/80 mb-1 block">Max Altitude (m)</label>
                    <input type="number" value={altMax} onChange={(e) => setAltMax(Number(e.target.value))} className="form-input" placeholder="e.g. 5364" />
                  </div>
                  <div>
                    <label className="text-xs text-white/80 mb-1 block">Starting Altitude (m)</label>
                    <input type="number" value={altStart} onChange={(e) => setAltStart(Number(e.target.value))} className="form-input" placeholder="e.g. 2800" />
                  </div>
                  <div>
                    <label className="text-xs text-white/80 mb-1 block">Trekking Days</label>
                    <input type="number" value={altDays} onChange={(e) => setAltDays(Number(e.target.value))} className="form-input" placeholder="e.g. 10" />
                  </div>
                  <button onClick={calculateAltitude} className="btn-primary w-full mt-2">Analyze Altitude</button>
                </div>
                <div>
                  {altResult ? (
                    <div className="space-y-4">
                      <div className="tool-card !p-4">
                        <div className="text-xs text-white/80 mb-1">Risk Level</div>
                        <div className={`text-lg font-bold text-readable-strong ${altResult.risk === 'Low' ? 'text-green-400' : altResult.risk === 'Moderate' ? 'text-yellow-300' : altResult.risk === 'High' ? 'text-orange-400' : 'text-red-500'}`}>{altResult.risk}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="tool-card !p-3">
                          <div className="text-xs text-white/80">Acclimatization Days</div>
                          <div className="text-sm font-semibold mt-0.5">{altResult.acclimDays} days</div>
                        </div>
                        <div className="tool-card !p-3">
                          <div className="text-xs text-white/80">Max Daily Gain</div>
                          <div className="text-sm font-semibold mt-0.5">{altResult.maxDailyGain}m/day</div>
                        </div>
                        <div className="tool-card !p-3">
                          <div className="text-xs text-white/80">O₂ at Peak</div>
                          <div className="text-sm font-semibold mt-0.5">{altResult.oxygenPct}%</div>
                        </div>
                      </div>
                      {/* Altitude profile */}
                      <div className="tool-card !p-4">
                        <div className="text-xs text-white/80 mb-2">Altitude Zone Profile</div>
                        <div className="flex gap-1 items-end h-24">
                          {[
                            { label: 'Safe', h: Math.min(altStart, 3000), color: 'bg-green-500/40' },
                            { label: 'Caution', h: Math.min(Math.max(altMax - 3000, 0), 1500), color: 'bg-yellow-500/40' },
                            { label: 'Danger', h: Math.min(Math.max(altMax - 4500, 0), 1000), color: 'bg-orange-500/40' },
                            { label: 'Extreme', h: Math.max(altMax - 5500, 0), color: 'bg-red-500/40' },
                          ].map((zone) => (
                            <div key={zone.label} className="flex-1 flex flex-col items-center justify-end h-full">
                              <div className={`w-full ${zone.color} rounded-t`} style={{ height: `${Math.max((zone.h / altMax) * 100, zone.h > 0 ? 8 : 0)}%` }} />
                              <span className="text-[9px] text-white/80 mt-1">{zone.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      {altResult.symptoms.length > 0 && (
                        <div className="tool-card !p-3">
                          <div className="text-xs text-white/80 mb-1">Symptoms to Watch</div>
                          <div className="flex flex-wrap gap-1">
                            {altResult.symptoms.map((s) => (
                              <span key={s} className="text-[10px] px-2 py-0.5 rounded bg-red-500/30 text-red-300 font-bold text-readable">{s}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-white/85 text-sm">
                      Enter altitude details and click Analyze
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* PACKING CHECKLIST */}
          {activeToolTab === 'packing' && (
            <div className="glass-card-static p-6 sm:p-8 reveal">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white/85">Packing Progress</span>
                  <span className="text-sm font-semibold gradient-text">{packedPct}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${packedPct}%` }} />
                </div>
                <div className="text-xs text-white/85 mt-1">{packedCount} of {totalItems} items packed</div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(PACKING_ITEMS).map(([category, items]) => (
                  <div key={category} className="tool-card">
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-himalaya-gold" />
                      {category}
                    </h4>
                    <div className="space-y-2">
                      {items.map((item) => (
                        <label key={item} className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            className="custom-checkbox"
                            checked={!!packedItems[item]}
                            onChange={(e) => setPackedItems((prev) => ({ ...prev, [item]: e.target.checked }))}
                          />
                          <span className={`text-xs transition-colors ${packedItems[item] ? 'text-white/80 line-through' : 'text-white/90 group-hover:text-white/80'}`}>{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => { alert('Checklist downloaded!'); }} className="btn-primary text-sm">Download Checklist</button>
                <button onClick={() => { const url = `https://himalayanexplorer.com/packing?items=${Object.keys(packedItems).filter(k => packedItems[k]).join(',')}`; navigator.clipboard?.writeText(url); alert('Link copied!'); }} className="btn-outline text-sm">Share</button>
              </div>
            </div>
          )}

          {/* DIFFICULTY ESTIMATOR */}
          {activeToolTab === 'difficulty' && (
            <div className="glass-card-static p-6 sm:p-8 reveal">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-white/80 mb-1 block">Trek Distance: {diffDistance} km</label>
                    <input type="range" min="10" max="200" value={diffDistance} onChange={(e) => setDiffDistance(Number(e.target.value))} className="w-full" />
                  </div>
                  <div>
                    <label className="text-xs text-white/80 mb-1 block">Max Altitude: {diffAltitude.toLocaleString()} m</label>
                    <input type="range" min="1000" max="8849" step="100" value={diffAltitude} onChange={(e) => setDiffAltitude(Number(e.target.value))} className="w-full" />
                  </div>
                  <div>
                    <label className="text-xs text-white/80 mb-1 block">Total Ascent: {diffAscent.toLocaleString()} m</label>
                    <input type="range" min="500" max="5000" step="100" value={diffAscent} onChange={(e) => setDiffAscent(Number(e.target.value))} className="w-full" />
                  </div>
                  <div>
                    <label className="text-xs text-white/80 mb-1 block">Terrain Type</label>
                    <select value={diffTerrain} onChange={(e) => setDiffTerrain(e.target.value)} className="form-select w-full">
                      <option value="trail">Trail</option>
                      <option value="rocky">Rocky</option>
                      <option value="snow">Snow</option>
                      <option value="ice">Ice</option>
                      <option value="mixed">Mixed</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-white/80 mb-1 block">Fitness Level</label>
                    <select value={diffFitness} onChange={(e) => setDiffFitness(e.target.value)} className="form-select w-full">
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="elite">Elite</option>
                    </select>
                  </div>
                  <button onClick={calculateDifficulty} className="btn-primary w-full mt-2">Estimate Difficulty</button>
                </div>
                <div>
                  {diffResult ? (
                    <div className="space-y-4">
                      <div className="tool-card !p-4 text-center">
                        <div className="text-xs text-white/80 mb-1">Difficulty Score</div>
                        <div className="text-4xl font-bold gradient-text">{diffResult.score}/10</div>
                        <div className={`mt-1 text-sm font-semibold difficulty-${diffResult.label.toLowerCase()}`}>{diffResult.label}</div>
                      </div>
                      {/* Gauge bar */}
                      <div className="tool-card !p-4">
                        <div className="text-xs text-white/80 mb-2">Difficulty Gauge</div>
                        <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${diffResult.score <= 3 ? 'bg-green-500' : diffResult.score <= 5 ? 'bg-yellow-500' : diffResult.score <= 7 ? 'bg-orange-500' : 'bg-red-500'}`}
                            style={{ width: `${diffResult.score * 10}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[9px] text-white/85 mt-1">
                          <span>Easy</span><span>Moderate</span><span>Challenging</span><span>Strenuous</span>
                        </div>
                      </div>
                      <div className="tool-card !p-3">
                        <div className="text-xs text-white/80">Estimated Completion Time</div>
                        <div className="text-sm font-semibold mt-0.5">{diffResult.time}</div>
                      </div>
                      <div className="tool-card !p-3">
                        <div className="text-xs text-white/80">Training Recommendations</div>
                        <div className="text-sm text-white/90 mt-0.5 leading-relaxed">{diffResult.training}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-white/85 text-sm">
                      Enter trek details and click Estimate
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════ 10. ABOUT US ═══════════ */}
      <section className="py-16 sm:py-20 relative section-glow-top">
        <div className="pattern-overlay">
          <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-himalaya-gold/5 via-himalaya-emerald/3 to-transparent rounded-full blur-[120px]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-12">
            <div className="reveal-scale">
              <div className="relative glass-card-static p-4">
                <div className="h-64 sm:h-80 bg-gradient-to-br from-emerald-900/30 to-teal-900/30 rounded-lg overflow-hidden relative">
                  <MountainSVG className="absolute bottom-0 left-0 w-full h-2/3 opacity-30" />
                  {/* People silhouettes */}
                  <svg className="absolute bottom-8 left-1/2 -translate-x-1/2 w-32 h-16 opacity-40" viewBox="0 0 128 64">
                    <path d="M20 40 L24 20 L28 40 M24 20 L24 12 M50 40 L54 18 L58 40 M54 18 L54 10 M80 40 L84 22 L88 40 M84 22 L84 14 M108 40 L112 16 L116 40 M112 16 L112 8" stroke="#d4a853" strokeWidth="2" fill="none"/>
                    <circle cx="24" cy="8" r="3" fill="#d4a853" opacity="0.6"/>
                    <circle cx="54" cy="6" r="3" fill="#d4a853" opacity="0.6"/>
                    <circle cx="84" cy="10" r="3" fill="#d4a853" opacity="0.6"/>
                    <circle cx="112" cy="4" r="3" fill="#d4a853" opacity="0.6"/>
                  </svg>
                </div>
                {/* Floating stats */}
                <div className="absolute top-6 right-6 glass-card-static p-2 text-xs animate-float">
                  <span className="text-himalaya-gold font-bold">5,000+</span> happy travelers
                </div>
              </div>
            </div>
            <div className="reveal">
              <span className="category-pill">🏔️ Our Story</span>
              <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-4">About Himalayan Exploration Treks</h2>
              <p className="text-white/85 leading-relaxed mb-4">We&apos;re a small company based in Kathmandu, which provides adventure travel packages that deliver amazing adventures. Founded in 2013, Himalayan Exploration Treks was born from a deep passion for travel and an earnest desire to deliver unforgettable experiences to all our clients.</p>
              <p className="text-white/85 leading-relaxed mb-4">I am from the hill district of Kabhre Palanchok, a half-day road trip from Kathmandu. As a member of the Tamang family, one of the indigenous hill groups of Nepal, born to work in the mountains, I started my career as a trekking porter and kitchen assistant before founding this agency in 2013.</p>
              <p className="text-white/85 leading-relaxed mb-6">Your trip with our team means a lot to us. It&apos;s not just another trekking trip — it contributes to a group of local staff who care about their country, places, and fellow people. You are in good hands with us and will surely get a happy and lasting holiday!</p>
              <div className="flex gap-4 text-sm">
                <div className="glass-card-static p-3 flex-1 text-center">
                  <div className="text-himalaya-gold font-bold text-lg">2013</div>
                  <div className="text-white/80 text-xs">Founded</div>
                </div>
                <div className="glass-card-static p-3 flex-1 text-center">
                  <div className="text-himalaya-gold font-bold text-lg">6</div>
                  <div className="text-white/80 text-xs">Trekking Regions</div>
                </div>
                <div className="glass-card-static p-3 flex-1 text-center">
                  <div className="text-himalaya-gold font-bold text-lg">0</div>
                  <div className="text-white/80 text-xs">Major Incidents</div>
                </div>
              </div>
            </div>
          </div>

          {/* Core Values */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12 reveal">
            {[
              { title: 'Adventure', icon: '🏔️', desc: 'Pushing boundaries while respecting the mountains' },
              { title: 'Sustainability', icon: '🌱', desc: 'Minimizing impact, maximizing positive contribution' },
              { title: 'Safety', icon: '🛡️', desc: 'Every decision prioritized around your wellbeing' },
              { title: 'Authenticity', icon: '🙏', desc: 'Genuine cultural experiences with local communities' },
            ].map((v) => (
              <div key={v.title} className="glass-card p-4 text-center">
                <div className="text-2xl mb-2">{v.icon}</div>
                <h4 className="font-semibold text-sm mb-1">{v.title}</h4>
                <p className="text-[10px] text-white/80">{v.desc}</p>
              </div>
            ))}
          </div>

          {/* Team */}
          <div className="reveal">
            <h3 className="text-xl font-bold text-center mb-6">Meet Our Team</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {TEAM_MEMBERS.map((member) => (
                <div key={member.name} className="glass-card p-4 text-center">
                  <div className={`w-14 h-14 mx-auto mb-3 rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center text-lg font-bold text-himalaya-gold`}>
                    {member.initials}
                  </div>
                  <h4 className="font-semibold text-sm">{member.name}</h4>
                  <div className="text-xs text-himalaya-gold mb-2">{member.role}</div>
                  <p className="text-[10px] text-white/80 leading-relaxed">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ 11. TRAVEL GUIDES / RESOURCES ═══════════ */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 reveal">
            <span className="category-pill">📖 Resources</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4">Travel Guides & Resources</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {RESOURCES.map((res) => (
              <div key={res.title} className="glass-card p-6 reveal-scale">
                <div className="w-10 h-10 rounded-lg bg-himalaya-gold/10 flex items-center justify-center text-himalaya-gold mb-4">
                  <ResourceIcon type={res.icon} />
                </div>
                <h3 className="font-semibold mb-2">{res.title}</h3>
                <p className="text-xs text-white/85 leading-relaxed mb-4">{res.desc}</p>
                <button className="btn-ghost text-xs">{res.cta}</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 12. TRUST & SAFETY ═══════════ */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 reveal">
            <span className="category-pill">🛡️ Safety</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4">Your Safety, Our Priority</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {TRUST_ITEMS.map((item) => (
              <div key={item.title} className="glass-card p-5 flex gap-4 items-start reveal-scale">
                <div className="text-himalaya-gold flex-shrink-0"><TrustIcon type={item.icon} /></div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
                  <p className="text-xs text-white/85">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Emergency contacts */}
          <div className="glass-card-static p-6 mb-8 reveal">
            <h4 className="font-semibold mb-4">Emergency Contacts</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                ['Police', '100'],
                ['Ambulance', '102'],
                ['Fire', '101'],
                ['Emergency Line', '+977-1-911-HELP'],
                ['US Embassy', '+977-1-423-4120'],
                ['UK Embassy', '+977-1-441-0583'],
              ].map(([label, num]) => (
                <div key={label} className="text-center">
                  <div className="text-xs text-white/80">{label}</div>
                  <div className="text-sm font-semibold text-himalaya-gold">{num}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Partners */}
          <div className="reveal">
            <div className="text-center text-xs text-white/85 mb-3">Trusted Partners & Certifications</div>
            <div className="flex flex-wrap justify-center gap-2">
              {['ATTA', 'GSTC', 'Nepal Tourism Board', 'World Nomads', 'Allianz', 'SafetyWing'].map((p) => (
                <span key={p} className="glass-card-static px-4 py-1.5 text-xs text-white/85">{p}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ 13. GALLERY ═══════════ */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 reveal">
            <span className="category-pill pill-rose">📸 Gallery</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4">Captured <span className="gradient-text-sunset">Moments</span></h2>
          </div>
          {/* Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8 reveal">
            {['All', 'Nepal', 'Bhutan', 'Tibet', 'Mustang'].map((f) => (
              <button key={f} onClick={() => setGalleryFilter(f)} className={`tab-btn ${galleryFilter === f ? 'active' : ''}`}>{f}</button>
            ))}
          </div>
          <div className="gallery-grid reveal">
            {filteredGallery.map((item, i) => (
              <div key={item.title + i} className="gallery-item">
                <div className={`w-full h-full bg-gradient-to-br ${item.gradient} relative`}>
                  <MountainSVG className="absolute inset-0 w-full h-full opacity-30" />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-end p-3 group cursor-pointer">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="text-sm font-semibold">{item.title}</div>
                      <div className="text-xs text-white/90">{item.location}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8 reveal">
            <button className="btn-outline">View Full Gallery</button>
          </div>
        </div>
      </section>

      {/* ═══════════ 14. TESTIMONIALS ═══════════ */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 reveal">
            <span className="category-pill">💬 Reviews</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4">Voices from the <span className="gradient-text">Trail</span></h2>
            <div className="mt-3 flex items-center justify-center gap-2">
              <StarRating count={5} />
              <span className="text-sm font-semibold">4.9/5</span>
              <span className="text-xs text-white/80">based on 2,500+ verified reviews</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="glass-card p-6 reveal-scale">
                <StarRating count={5} />
                <p className="text-sm text-white/90 leading-relaxed mt-3 mb-4">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-himalaya-gold/30 to-himalaya-gold/10 flex items-center justify-center text-sm font-bold text-himalaya-gold">{t.initials}</div>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-white/80">{t.trip}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 15. BLOG / STORIES ═══════════ */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 reveal">
            <span className="category-pill pill-aurora">📝 Blog</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4">Stories & <span className="gradient-text-aurora">Insights</span></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BLOG_POSTS.map((post) => (
              <article key={post.title} className="glass-card overflow-hidden reveal-scale">
                <div className={`h-40 bg-gradient-to-br ${post.gradient} relative`}>
                  <MountainSVG className="absolute inset-0 w-full h-full opacity-30" />
                  <span className="absolute top-3 left-3 text-[10px] px-2 py-0.5 rounded bg-black/40 text-white/85">{post.category}</span>
                </div>
                <div className="p-4 sm:p-5">
                  <h3 className="font-semibold text-sm mb-2">{post.title}</h3>
                  <p className="text-xs text-white/85 leading-relaxed mb-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-white/85">{post.readTime} read</span>
                    <a href="#" className="text-xs text-himalaya-gold hover:underline">Read More →</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="text-center mt-8 reveal">
            <button className="btn-outline">View All Stories</button>
          </div>
        </div>
      </section>

      {/* ═══════════ 16. FAQ ═══════════ */}
      <section className="py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-10 reveal">
            <h2 className="text-3xl sm:text-4xl font-bold">Frequently Asked <span className="gradient-text-cool">Questions</span></h2>
          </div>
          {/* Category filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-6 reveal">
            {['All', 'Booking', 'Payment', 'Cancellation', 'Insurance', 'Health', 'Gear'].map((cat) => (
              <button key={cat} onClick={() => { setFaqCategory(cat); setFaqOpenIndex(null); }} className={`tab-btn ${faqCategory === cat ? 'active' : ''}`}>{cat}</button>
            ))}
          </div>
          <div className="space-y-2 reveal">
            {filteredFaqs.map((faq, i) => (
              <div key={i} className={`faq-item ${faqOpenIndex === i ? 'open' : ''}`}>
                <button onClick={() => setFaqOpenIndex(faqOpenIndex === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left">
                  <span className="text-sm font-medium pr-4">{faq.q}</span>
                  <svg className="faq-chevron w-4 h-4 flex-shrink-0 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                </button>
                <div className="faq-answer">
                  <div className="px-4 pb-4 text-sm text-white/85 leading-relaxed">{faq.a}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-6 reveal">
            <a href="#contact" className="text-sm text-himalaya-gold hover:underline">Still have questions? Contact us →</a>
          </div>
        </div>
      </section>

      {/* ═══════════ 17. PRICING ═══════════ */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 reveal">
            <span className="category-pill">💎 Pricing</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4">Choose Your <span className="gradient-text">Adventure</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PRICING_TIERS.map((tier) => (
              <div key={tier.name} className={`glass-card p-6 relative ${tier.highlighted ? 'border-himalaya-gold/40 !bg-gradient-to-b from-himalaya-gold/[0.06] to-transparent shadow-[0_0_60px_rgba(212,168,83,0.12)]' : ''} reveal-scale`}>
                {tier.highlighted && <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] bg-himalaya-gold text-black font-bold px-3 py-0.5 rounded-full">Most Popular</span>}
                <h3 className="font-bold text-lg mb-1">{tier.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-bold gradient-text">${tier.price.toLocaleString()}</span>
                  <span className="text-xs text-white/80">/person</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-white/90">
                      <svg className="w-4 h-4 text-himalaya-gold flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <button className={tier.highlighted ? 'btn-primary w-full' : 'btn-outline w-full'}>Get Started</button>
              </div>
            ))}
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

      {/* ═══════════ 19. CONTACT ═══════════ */}
      <section id="contact" className="py-16 sm:py-20 relative section-glow-top">
        <div className="pattern-overlay">
          <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-gradient-to-br from-himalaya-sky/5 via-himalaya-teal/3 to-transparent rounded-full blur-[120px]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Form */}
            <div className="reveal">
              <h2 className="text-2xl sm:text-3xl font-bold mb-6">We&apos;d Love to Hear from You</h2>
              <form onSubmit={(e) => { e.preventDefault(); alert('Message sent! We\'ll get back to you soon.'); }} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-white/80 mb-1 block">Name</label>
                    <input type="text" value={contactForm.name} onChange={(e) => setContactForm((p) => ({ ...p, name: e.target.value }))} className="form-input" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="text-xs text-white/80 mb-1 block">Email</label>
                    <input type="email" value={contactForm.email} onChange={(e) => setContactForm((p) => ({ ...p, email: e.target.value }))} className="form-input" placeholder="you@example.com" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-white/80 mb-1 block">Phone</label>
                    <input type="tel" value={contactForm.phone} onChange={(e) => setContactForm((p) => ({ ...p, phone: e.target.value }))} className="form-input" placeholder="+1 (555) 000-0000" />
                  </div>
                  <div>
                    <label className="text-xs text-white/80 mb-1 block">Trip Interest</label>
                    <select value={contactForm.trip} onChange={(e) => setContactForm((p) => ({ ...p, trip: e.target.value }))} className="form-select w-full">
                      <option value="">Select a trip</option>
                      <option>Everest Base Camp</option>
                      <option>Annapurna Circuit</option>
                      <option>Bhutan Dragon Trail</option>
                      <option>K2 Base Camp</option>
                      <option>Langtang Valley</option>
                      <option>Upper Mustang</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-white/80 mb-1 block">Message</label>
                  <textarea value={contactForm.message} onChange={(e) => setContactForm((p) => ({ ...p, message: e.target.value }))} className="form-input" rows={4} placeholder="Tell us about your dream expedition..." />
                </div>
                <button type="submit" className="btn-primary w-full sm:w-auto">Send Message</button>
              </form>
            </div>
            {/* Contact details */}
            <div className="reveal">
              <div className="space-y-4 mb-6">
                {[
                  ['📧 Email', 'lama@himalayanexploration.com'],
                  ['📞 Nepal Office', '+977-1-4388-913'],
                  ['🚨 Emergency', '+977-9851-188161'],
                  ['💬 WhatsApp', '+977-9841-023371'],
                  ['📍 Nepal Address', '21231 Khusibu-17, Kathmandu'],
                  ['🕐 Business Hours', '09:00 - 18:00 (Sun-Fri)'],
                ].map(([label, val]) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="text-sm">{label}</span>
                    <span className="text-sm text-white/90">{val}</span>
                  </div>
                ))}
              </div>
              {/* Social icons */}
              <div className="flex gap-3 mb-6">
                {['Facebook','X','Instagram','YouTube'].map((s) => (
                  <button key={s} className="w-9 h-9 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center text-white/85 hover:text-himalaya-gold hover:border-himalaya-gold/30 transition-colors text-xs">{s.charAt(0)}</button>
                ))}
              </div>
              {/* Australia Office */}
              <div className="glass-card-static p-3 mb-4">
                <h4 className="text-xs font-semibold text-himalaya-gold mb-2">Australia Office</h4>
                <div className="space-y-1 text-xs text-white/85">
                  <p>5th Avenue, Campsie, NSW 2194</p>
                  <p>+61 412 543 886</p>
                  <p>pushpa@himalayanexploration.com</p>
                </div>
              </div>
              {/* Map placeholder */}
              <div className="glass-card-static p-4 h-48 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 to-teal-900/20 flex items-center justify-center">
                  <svg className="w-16 h-16 text-himalaya-gold/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                    <circle cx="12" cy="9" r="2.5"/>
                  </svg>
                  <span className="absolute bottom-3 text-xs text-white/80">Kathmandu, Nepal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ 20. COUNTDOWN ═══════════ */}
      <section className="py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 reveal">
          <div className="glass-card-strong p-8 text-center">
            <span className="category-pill pill-aurora">⏰ Next Departure</span>
            <h2 className="text-2xl font-bold mt-4 mb-2">Everest Base Camp — Spring 2026</h2>
            <p className="text-sm text-white/80 mb-6">Limited spots remaining for our most popular expedition</p>
            <div className="flex justify-center gap-3 mb-6">
              {[
                ['Days', countdown.days],
                ['Hours', countdown.hours],
                ['Min', countdown.minutes],
                ['Sec', countdown.seconds],
              ].map(([label, val]) => (
                <div key={label} className="countdown-digit">
                  <div className="text-2xl font-bold gradient-text">{String(val).padStart(2, '0')}</div>
                  <div className="text-[10px] text-white/80 mt-0.5">{label}</div>
                </div>
              ))}
            </div>
            <button className="btn-primary" onClick={() => openCheckout(TOURS[0])}>Reserve Your Spot</button>
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

      {/* ═══════════ NEW 1: TRUST BADGES MARQUEE ═══════════ */}
      <section className="py-10 border-y border-white/5 section-wash-gold">
        <div className="max-w-7xl mx-auto px-4 text-center mb-6">
          <p className="eyebrow">{t('trust.title')}</p>
          <p className="text-readable text-xs text-white/85 mt-2">{t('trust.subtitle')}</p>
        </div>
        <div className="marquee-cinematic">
          <div className="marquee-cinematic-track">
            {[...Array(2)].map((_, dup) => (
              <div key={dup} className="flex items-center gap-16 px-8">
                {[
                  { name: 'Lonely Planet', sub: 'Featured' },
                  { name: 'TripAdvisor', sub: '5-Star Rated' },
                  { name: 'TAAN', sub: 'Member Since 2013' },
                  { name: 'NMA', sub: 'Certified' },
                  { name: 'TourRadar', sub: 'Top Operator' },
                  { name: 'Lonely Planet', sub: 'Recommended' },
                  { name: 'National Geographic', sub: 'Featured' },
                  { name: 'BBC Travel', sub: 'Featured' },
                ].map((badge, i) => (
                  <div key={`${dup}-${i}`} className="flex flex-col items-center gap-1 flex-shrink-0">
                    <div className="font-cinematic text-2xl font-bold text-golden-shimmer">{badge.name}</div>
                    <div className="eyebrow text-white/85 !text-[0.6rem]">{badge.sub}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ NEW 2: LIVE COUNTDOWN TO SPRING 2026 ═══════════ */}
      <section className="py-20 section-wash-aurora relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <div className="reveal-fade-up">
            <span className="pill-cinematic mb-6">{t('countdown.pill')}</span>
          </div>
          <h2 className="reveal-fade-up font-cinematic text-4xl sm:text-5xl font-bold mt-6 mb-3 text-readable-strong">
            {t('countdown.title1')} <span className="text-golden-shimmer italic">{t('countdown.title2')}</span>
          </h2>
          <p className="reveal-fade-up text-readable text-white/90 max-w-2xl mx-auto mb-12">{t('countdown.subtitle')}</p>
          <div className="reveal-fade-up flex flex-wrap justify-center gap-4">
            {([
              ['days', countdown.days],
              ['hours', countdown.hours],
              ['minutes', countdown.minutes],
              ['seconds', countdown.seconds],
            ] as const).map(([unit, val]) => (
              <div key={unit} className="countdown-digit-cinematic">
                <div className="countdown-digit-number">{String(val).padStart(2, '0')}</div>
                <div className="countdown-digit-label">{t(`countdown.${unit}`)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ NEW 3: TESTIMONIALS CAROUSEL ═══════════ */}
      <section id="stories" className="py-20 section-wash-gold relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12 reveal-fade-up">
            <span className="pill-cinematic mb-6">{t('testimonials.pill')}</span>
            <h2 className="font-cinematic text-4xl sm:text-5xl font-bold mt-6 mb-3 text-readable-strong">
              {t('testimonials.title1')} <span className="text-golden-shimmer italic">{t('testimonials.title2')}</span>
            </h2>
            <p className="text-readable text-white/90 max-w-2xl mx-auto">{t('testimonials.subtitle')}</p>
            <div className="divider-golden" />
          </div>
          <div className="reveal-fade-up grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.slice(0, 3).map((tm, i) => (
              <div key={tm.name} className="card-premium holo-sheen p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-himalaya-gold to-himalaya-orange flex items-center justify-center font-cinematic font-bold text-black">
                    {tm.initials}
                  </div>
                  <div>
                    <div className="font-display font-semibold text-white">{tm.name}</div>
                    <div className="text-xs text-white/85">{tm.trip}</div>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, s) => (
                    <svg key={s} className="w-4 h-4 text-himalaya-gold" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6 4.4 2.3 7.4-6.3-4.6-6.3 4.6L7.9 14 2 9.4h7.6z"/></svg>
                  ))}
                </div>
                <p className="text-readable text-sm text-white/85 leading-relaxed line-clamp-5">"{tm.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ NEW 4: INTERACTIVE NEPAL MAP ═══════════ */}
      <section className="py-20 section-wash-aurora relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12 reveal-fade-up">
            <span className="pill-cinematic mb-6">{t('map.pill')}</span>
            <h2 className="font-cinematic text-4xl sm:text-5xl font-bold mt-6 mb-3 text-readable-strong">
              {t('map.title1')} <span className="text-golden-shimmer italic">{t('map.title2')}</span>
            </h2>
            <p className="text-readable text-white/90 max-w-2xl mx-auto">{t('map.subtitle')}</p>
            <div className="divider-golden" />
          </div>
          <div className="reveal-fade-up grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Stylized Nepal map (SVG) */}
            <div className="relative card-premium p-6 aspect-[4/5]">
              <svg viewBox="0 0 400 500" className="w-full h-full" fill="none">
                <defs>
                  <linearGradient id="nepal-grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="rgba(212, 168, 83, 0.3)" />
                    <stop offset="100%" stopColor="rgba(124, 58, 237, 0.3)" />
                  </linearGradient>
                </defs>
                {/* Nepal stylized shape */}
                <path
                  d="M80 80 L120 60 L180 50 L240 70 L300 90 L340 130 L330 180 L300 220 L320 280 L300 340 L260 380 L240 430 L200 460 L160 440 L140 400 L100 380 L80 340 L90 280 L70 220 L80 160 Z"
                  fill="url(#nepal-grad)"
                  stroke="rgba(212, 168, 83, 0.6)"
                  strokeWidth="2"
                />
                {/* Region dots */}
                {[
                  { x: 200, y: 120, name: 'Everest', color: '#d4a853' },
                  { x: 160, y: 220, name: 'Annapurna', color: '#f97316' },
                  { x: 130, y: 160, name: 'Manaslu', color: '#f43f5e' },
                  { x: 240, y: 280, name: 'Mustang', color: '#7c3aed' },
                  { x: 100, y: 280, name: 'Langtang', color: '#2dd4bf' },
                  { x: 220, y: 380, name: 'Dolpo', color: '#4a90d9' },
                ].map((r) => (
                  <g key={r.name} className="map-region">
                    <circle cx={r.x} cy={r.y} r="10" fill={r.color} opacity="0.85" />
                    <circle cx={r.x} cy={r.y} r="18" fill="none" stroke={r.color} strokeWidth="1.5" opacity="0.5" />
                    <text x={r.x} y={r.y - 18} textAnchor="middle" className="font-display" fontSize="11" fill="#f0f4f8" fontWeight="600">{r.name}</text>
                  </g>
                ))}
              </svg>
            </div>
            {/* Region details */}
            <div className="space-y-3">
              {DESTINATIONS.slice(0, 6).map((dest, i) => (
                <div key={dest.name} className="card-premium p-4 flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="font-cinematic text-lg font-bold text-white">{dest.name}</div>
                    <div className="text-xs text-white/90">{dest.tagline}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-white/85">from</div>
                    <div className="font-cinematic text-xl font-bold text-golden-shimmer">${dest.priceFrom}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-white/85">trips</div>
                    <div className="font-display font-bold text-white">{dest.trips}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ NEW 5: INSTAGRAM GRID ═══════════ */}
      <section className="py-20 section-wash-gold relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12 reveal-fade-up">
            <span className="pill-cinematic mb-6">{t('instagram.pill')}</span>
            <h2 className="font-cinematic text-4xl sm:text-5xl font-bold mt-6 mb-3 text-readable-strong">
              {t('instagram.title1')} <span className="text-golden-shimmer italic">{t('instagram.title2')}</span>
            </h2>
            <p className="text-readable text-white/90 max-w-2xl mx-auto">{t('instagram.subtitle')}</p>
            <div className="divider-golden" />
          </div>
          <div className="reveal-fade-up grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { name: 'Everest Sunrise', likes: '2.4k', color: 'from-amber-500 to-orange-600' },
              { name: 'Annapurna Base Camp', likes: '3.1k', color: 'from-rose-500 to-pink-600' },
              { name: 'Monastery in Mustang', likes: '1.8k', color: 'from-purple-500 to-violet-600' },
              { name: 'Thorong La Pass', likes: '2.7k', color: 'from-cyan-500 to-blue-600' },
              { name: 'Sherpa Village', likes: '1.5k', color: 'from-emerald-500 to-teal-600' },
              { name: 'Prayer Flags', likes: '4.2k', color: 'from-yellow-500 to-amber-600' },
              { name: 'Gokyo Lakes', likes: '3.5k', color: 'from-blue-500 to-indigo-600' },
              { name: 'Langtang Valley', likes: '2.1k', color: 'from-green-500 to-emerald-600' },
              { name: 'Mera Peak Summit', likes: '2.9k', color: 'from-orange-500 to-red-600' },
              { name: 'Boudhanath Stupa', likes: '5.1k', color: 'from-fuchsia-500 to-purple-600' },
              { name: 'Phoksundo Lake', likes: '2.3k', color: 'from-teal-500 to-cyan-600' },
              { name: 'Himalayan Sunset', likes: '6.7k', color: 'from-pink-500 to-rose-600' },
            ].map((tile, i) => (
              <div key={i} className={`ig-tile bg-gradient-to-br ${tile.color}`}>
                <div className="ig-tile-overlay">
                  <div className="text-xs font-display text-white/80">{tile.name}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <svg className="w-3 h-3 text-rose-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    <span className="text-xs text-white/85">{tile.likes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <a href="#" className="btn-outline-cinematic magnetic inline-flex">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.31-1.46.72-2.13 1.38C1.35 2.68.94 3.35.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.31.79.72 1.46 1.38 2.13.67.66 1.34 1.07 2.13 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56.79-.31 1.46-.72 2.13-1.38.66-.67 1.07-1.34 1.38-2.13.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91-.31-.79-.72-1.46-1.38-2.13C21.32 1.35 20.65.94 19.86.63 19.1.33 18.22.13 16.95.07 15.67.01 15.26 0 12 0zm0 5.84c-3.4 0-6.16 2.76-6.16 6.16s2.76 6.16 6.16 6.16 6.16-2.76 6.16-6.16S15.4 5.84 12 5.84zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm6.41-10.85c-.8 0-1.44.65-1.44 1.44 0 .8.65 1.44 1.44 1.44.8 0 1.44-.65 1.44-1.44 0-.8-.65-1.44-1.44-1.44z"/></svg>
              {t('instagram.follow')}
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════ NEW 6: NEWSLETTER CTA ═══════════ */}
      <section className="py-20 relative overflow-hidden">
        <div className="aurora-orb" style={{ top: '20%', left: '20%', width: '500px', height: '500px', background: 'radial-gradient(circle, #d4a853, transparent 70%)' }} />
        <div className="aurora-orb" style={{ bottom: '20%', right: '20%', width: '450px', height: '450px', background: 'radial-gradient(circle, #7c3aed, transparent 70%)', animationDelay: '6s' }} />
        <div className="max-w-3xl mx-auto px-4 relative z-10 text-center">
          <div className="reveal-fade-up">
            <span className="discount-badge !relative !inline-block mb-6">10% OFF</span>
          </div>
          <h2 className="reveal-fade-up font-cinematic text-4xl sm:text-5xl font-bold mb-4 text-readable-strong">
            {t('newsletter.title')}
          </h2>
          <p className="reveal-fade-up text-readable text-white/65 mb-8 max-w-xl mx-auto">{t('newsletter.subtitle')}</p>
          <form className="reveal-fade-up flex flex-col sm:flex-row gap-3 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder={t('newsletter.placeholder')}
              className="input-cinematic flex-1"
              required
            />
            <button type="submit" className="btn-cinematic whitespace-nowrap">
              {t('newsletter.cta')}
            </button>
          </form>
          <p className="reveal-fade-up text-xs text-white/80 mt-4">{t('newsletter.disclaimer')}</p>
        </div>
      </section>

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

      {/* ═══════════ 25. CHECKOUT OVERLAY ═══════════ */}
      {checkoutOpen && selectedTour && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" ref={checkoutRef}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) closeCheckout(); }} />

          {/* Modal */}
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto glass-card-strong rounded-2xl">
            {/* Close button */}
            <button onClick={closeCheckout} className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/90 hover:text-white hover:bg-white/20 transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>

            {/* Header */}
            <div className="p-6 pb-0">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-himalaya-gold/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-himalaya-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 22h20L12 2z"/></svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold">Book Your Trek</h2>
                  <p className="text-xs text-white/85">Complete your booking in 3 easy steps</p>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="flex items-center gap-2 mb-6">
                {[
                  { key: 'details', label: '1. Traveler Details', num: 1 },
                  { key: 'payment', label: '2. Payment Method', num: 2 },
                  { key: 'confirmation', label: '3. Confirmation', num: 3 },
                ].map((step, i) => (
                  <div key={step.key} className="flex items-center gap-2 flex-1">
                    <div className={`flex items-center gap-2 flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      checkoutStep === step.key
                        ? 'bg-himalaya-gold/20 text-himalaya-gold border border-himalaya-gold/30'
                        : (checkoutStep === 'confirmation' && step.num < 3) || (checkoutStep === 'payment' && step.num === 1)
                          ? 'bg-himalaya-emerald/10 text-himalaya-emerald border border-himalaya-emerald/20'
                          : 'bg-white/5 text-white/80 border border-white/5'
                    }`}>
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold" style={{
                        backgroundColor: checkoutStep === step.key ? '#d4a853' : (checkoutStep === 'confirmation' && step.num < 3) || (checkoutStep === 'payment' && step.num === 1) ? '#10b981' : 'rgba(255,255,255,0.1)',
                        color: checkoutStep === step.key ? '#000' : (checkoutStep === 'confirmation' && step.num < 3) || (checkoutStep === 'payment' && step.num === 1) ? '#000' : 'rgba(255,255,255,0.3)',
                      }}>
                        {(checkoutStep === 'confirmation' && step.num < 3) || (checkoutStep === 'payment' && step.num === 1) ? '✓' : step.num}
                      </span>
                      <span className="hidden sm:inline">{step.label}</span>
                    </div>
                    {i < 2 && <div className="w-4 h-px bg-white/10 flex-shrink-0" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Tour Summary Bar */}
            <div className="mx-6 mb-4 glass-card-static p-4 rounded-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${selectedTour.gradient} flex items-center justify-center flex-shrink-0`}>
                    <svg className="w-6 h-6 text-white/85" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 22h20L12 2z"/></svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{selectedTour.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-white/85">
                      <span>{selectedTour.days} Days</span>
                      <span>·</span>
                      <span>{selectedTour.altitude}</span>
                      <span>·</span>
                      <span>{selectedTour.region}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right sm:text-right">
                  <div className="text-lg font-bold text-himalaya-gold">${selectedTour.price.toLocaleString()}</div>
                  <div className="text-[10px] text-white/80">per person</div>
                </div>
              </div>
            </div>

            <div className="px-6 pb-6">
              {/* ──── STEP 1: TRAVELER DETAILS ──── */}
              {checkoutStep === 'details' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-white/85 mb-2">Traveler Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-white/80 mb-1 block">Full Name *</label>
                      <input type="text" value={bookingForm.fullName} onChange={(e) => setBookingForm(p => ({ ...p, fullName: e.target.value }))} className="form-input w-full" placeholder="Your full name" />
                    </div>
                    <div>
                      <label className="text-xs text-white/80 mb-1 block">Email Address *</label>
                      <input type="email" value={bookingForm.email} onChange={(e) => setBookingForm(p => ({ ...p, email: e.target.value }))} className="form-input w-full" placeholder="you@example.com" />
                    </div>
                    <div>
                      <label className="text-xs text-white/80 mb-1 block">Phone Number *</label>
                      <input type="tel" value={bookingForm.phone} onChange={(e) => setBookingForm(p => ({ ...p, phone: e.target.value }))} className="form-input w-full" placeholder="+977 98XXXXXXXX" />
                    </div>
                    <div>
                      <label className="text-xs text-white/80 mb-1 block">Nationality *</label>
                      <input type="text" value={bookingForm.nationality} onChange={(e) => setBookingForm(p => ({ ...p, nationality: e.target.value }))} className="form-input w-full" placeholder="e.g., Nepali, American" />
                    </div>
                    <div>
                      <label className="text-xs text-white/80 mb-1 block">Preferred Start Date *</label>
                      <input type="date" value={bookingForm.startDate} onChange={(e) => setBookingForm(p => ({ ...p, startDate: e.target.value }))} className="form-input w-full" min={new Date().toISOString().split('T')[0]} />
                    </div>
                    <div>
                      <label className="text-xs text-white/80 mb-1 block">Number of Travelers *</label>
                      <select value={bookingForm.travelers} onChange={(e) => setBookingForm(p => ({ ...p, travelers: Number(e.target.value) }))} className="form-select w-full">
                        {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} Traveler{n > 1 ? 's' : ''}</option>)}
                      </select>
                    </div>
                  </div>

                  <h3 className="text-sm font-semibold text-white/85 mt-4 mb-2">Emergency & Health</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-white/80 mb-1 block">Emergency Contact Name</label>
                      <input type="text" value={bookingForm.emergencyContact} onChange={(e) => setBookingForm(p => ({ ...p, emergencyContact: e.target.value }))} className="form-input w-full" placeholder="Contact person name" />
                    </div>
                    <div>
                      <label className="text-xs text-white/80 mb-1 block">Emergency Contact Phone</label>
                      <input type="tel" value={bookingForm.emergencyPhone} onChange={(e) => setBookingForm(p => ({ ...p, emergencyPhone: e.target.value }))} className="form-input w-full" placeholder="+1 555 000 0000" />
                    </div>
                    <div>
                      <label className="text-xs text-white/80 mb-1 block">Dietary Requirements</label>
                      <input type="text" value={bookingForm.dietaryNeeds} onChange={(e) => setBookingForm(p => ({ ...p, dietaryNeeds: e.target.value }))} className="form-input w-full" placeholder="Vegetarian, vegan, allergies..." />
                    </div>
                    <div>
                      <label className="text-xs text-white/80 mb-1 block">Medical Conditions</label>
                      <input type="text" value={bookingForm.medicalConditions} onChange={(e) => setBookingForm(p => ({ ...p, medicalConditions: e.target.value }))} className="form-input w-full" placeholder="Any relevant medical conditions" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-white/80 mb-1 block">Special Requests</label>
                    <textarea value={bookingForm.specialRequests} onChange={(e) => setBookingForm(p => ({ ...p, specialRequests: e.target.value }))} className="form-input w-full" rows={2} placeholder="Anything else you'd like us to know..." />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => {
                        if (!bookingForm.fullName || !bookingForm.email || !bookingForm.phone || !bookingForm.nationality || !bookingForm.startDate) {
                          alert('Please fill in all required fields.');
                          return;
                        }
                        setCheckoutStep('payment');
                      }}
                      className="btn-primary"
                    >
                      Continue to Payment →
                    </button>
                  </div>
                </div>
              )}

              {/* ──── STEP 2: PAYMENT METHOD ──── */}
              {checkoutStep === 'payment' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-white/85 mb-3">Choose Payment Method</h3>

                  {/* eSewa */}
                  <div
                    onClick={() => setPaymentMethod('esewa')}
                    className={`relative p-4 rounded-xl cursor-pointer transition-all border ${
                      paymentMethod === 'esewa'
                        ? 'bg-[#60BB46]/10 border-[#60BB46]/40 ring-1 ring-[#60BB46]/30'
                        : 'bg-white/3 border-white/8 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#60BB46]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[#60BB46] font-bold text-xs">eS</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-sm">eSewa</h4>
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            paymentMethod === 'esewa' ? 'border-[#60BB46]' : 'border-white/20'
                          }`}>
                            {paymentMethod === 'esewa' && <div className="w-2 h-2 rounded-full bg-[#60BB46]" />}
                          </div>
                        </div>
                        <p className="text-xs text-white/85 mt-1">Nepal&apos;s most popular digital wallet. Pay instantly using your eSewa account. Secure and fast payment with real-time confirmation.</p>
                        {paymentMethod === 'esewa' && (
                          <div className="mt-3 glass-card-static p-3 rounded-lg space-y-2">
                            <p className="text-xs text-white/90">After clicking &quot;Pay Now&quot;, you&apos;ll be redirected to eSewa&apos;s secure payment page to complete your transaction.</p>
                            <div className="flex items-center gap-2 text-[10px] text-white/80">
                              <span className="px-1.5 py-0.5 bg-[#60BB46]/10 text-[#60BB46] rounded">Verified Merchant</span>
                              <span>SSL Encrypted</span>
                              <span>Instant Confirmation</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bank Transfer */}
                  <div
                    onClick={() => setPaymentMethod('bank')}
                    className={`relative p-4 rounded-xl cursor-pointer transition-all border ${
                      paymentMethod === 'bank'
                        ? 'bg-himalaya-blue/10 border-himalaya-blue/40 ring-1 ring-himalaya-blue/30'
                        : 'bg-white/3 border-white/8 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-himalaya-blue/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-5 h-5 text-himalaya-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="2" y="6" width="20" height="14" rx="2"/><path d="M2 10h20"/><path d="M6 14h4"/>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-sm">Bank Transfer</h4>
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            paymentMethod === 'bank' ? 'border-himalaya-blue' : 'border-white/20'
                          }`}>
                            {paymentMethod === 'bank' && <div className="w-2 h-2 rounded-full bg-himalaya-blue" />}
                          </div>
                        </div>
                        <p className="text-xs text-white/85 mt-1">Transfer directly to our bank account. Your booking will be confirmed once we verify the payment (usually within 24 hours).</p>
                        {paymentMethod === 'bank' && (
                          <div className="mt-3 glass-card-static p-3 rounded-lg space-y-2">
                            <h5 className="text-xs font-semibold text-himalaya-blue">Bank Account Details</h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-white/90">
                              <div><span className="text-white/80">Bank:</span> Nepal Investment Mega Bank</div>
                              <div><span className="text-white/80">Account Name:</span> Himalayan Exploration Treks</div>
                              <div><span className="text-white/80">Account No:</span> 012010502XXXXX</div>
                              <div><span className="text-white/80">SWIFT Code:</span> NIMBNPKA</div>
                              <div className="sm:col-span-2"><span className="text-white/80">Branch:</span> Khusibu-17, Kathmandu, Nepal</div>
                            </div>
                            <p className="text-[10px] text-himalaya-gold/60 mt-1">Please include your booking reference as the payment reference. Send a screenshot of the transfer to lama@himalayanexploration.com</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Pay on Arrival */}
                  <div
                    onClick={() => setPaymentMethod('arrival')}
                    className={`relative p-4 rounded-xl cursor-pointer transition-all border ${
                      paymentMethod === 'arrival'
                        ? 'bg-himalaya-orange/10 border-himalaya-orange/40 ring-1 ring-himalaya-orange/30'
                        : 'bg-white/3 border-white/8 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-himalaya-orange/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-5 h-5 text-himalaya-orange" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M12 2l8 4v6c0 5.25-3.5 9.74-8 11-4.5-1.26-8-5.75-8-11V6l8-4z"/><path d="M9 12l2 2 4-4"/>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-sm">Pay on Arrival</h4>
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            paymentMethod === 'arrival' ? 'border-himalaya-orange' : 'border-white/20'
                          }`}>
                            {paymentMethod === 'arrival' && <div className="w-2 h-2 rounded-full bg-himalaya-orange" />}
                          </div>
                        </div>
                        <p className="text-xs text-white/85 mt-1">Pay when you arrive in Kathmandu. A 30% deposit is required upon arrival, with the full balance due before the trek begins.</p>
                        {paymentMethod === 'arrival' && (
                          <div className="mt-3 glass-card-static p-3 rounded-lg space-y-2">
                            <div className="flex items-center gap-2 text-xs">
                              <span className="px-1.5 py-0.5 bg-himalaya-orange/10 text-himalaya-orange rounded text-[10px]">Popular Option</span>
                              <span className="text-white/85">No advance payment required</span>
                            </div>
                            <p className="text-[10px] text-white/80">• 30% deposit payable on arrival in Kathmandu</p>
                            <p className="text-[10px] text-white/80">• Remaining 70% before trek departure</p>
                            <p className="text-[10px] text-white/80">• Accepted: Cash (USD/NPR), Credit Card (+3.5% surcharge)</p>
                            <p className="text-[10px] text-himalaya-gold/60 mt-1">Your booking is confirmed immediately, subject to availability.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="glass-card-static p-4 rounded-xl mt-4">
                    <h4 className="text-sm font-semibold mb-3">Order Summary</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between text-white/90">
                        <span>{selectedTour.title} × {bookingForm.travelers} traveler{bookingForm.travelers > 1 ? 's' : ''}</span>
                        <span>${(selectedTour.price * bookingForm.travelers).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-white/90">
                        <span>TIMS & Conservation Permits</span>
                        <span className="text-himalaya-emerald">Included</span>
                      </div>
                      <div className="flex justify-between text-white/90">
                        <span>Guide & Porter Services</span>
                        <span className="text-himalaya-emerald">Included</span>
                      </div>
                      <div className="flex justify-between text-white/90">
                        <span>Emergency Evacuation Arrangement</span>
                        <span className="text-himalaya-emerald">Included</span>
                      </div>
                      {paymentMethod === 'bank' && (
                        <div className="flex justify-between text-white/90">
                          <span>Bank Transfer Fee</span>
                          <span className="text-himalaya-emerald">Free</span>
                        </div>
                      )}
                      {paymentMethod === 'arrival' && (
                        <div className="flex justify-between text-himalaya-orange/70">
                          <span>Deposit on Arrival (30%)</span>
                          <span>${Math.round(selectedTour.price * bookingForm.travelers * 0.3).toLocaleString()}</span>
                        </div>
                      )}
                      <div className="border-t border-white/10 pt-2 flex justify-between font-semibold text-sm">
                        <span>Total Amount</span>
                        <span className="text-himalaya-gold">${(selectedTour.price * bookingForm.travelers).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Terms */}
                  <label className="flex items-start gap-2 cursor-pointer mt-2">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="custom-checkbox mt-0.5"
                    />
                    <span className="text-xs text-white/85 leading-relaxed">
                      I agree to the <a href="#" className="text-himalaya-gold underline">Terms & Conditions</a> and <a href="#" className="text-himalaya-gold underline">Privacy Policy</a>. I understand that cancellation policies apply as outlined on the website.
                    </span>
                  </label>

                  <div className="flex justify-between pt-2">
                    <button onClick={() => setCheckoutStep('details')} className="btn-outline text-xs">← Back to Details</button>
                    <button
                      onClick={submitBooking}
                      disabled={!agreeTerms || isSubmitting}
                      className={`btn-primary flex items-center gap-2 ${(!agreeTerms || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4 31.4" strokeLinecap="round"/></svg>
                          Processing...
                        </>
                      ) : paymentMethod === 'esewa' ? (
                        <>
                          <span className="w-4 h-4 rounded bg-[#60BB46] flex items-center justify-center text-[8px] font-bold text-black">eS</span>
                          Pay with eSewa
                        </>
                      ) : paymentMethod === 'bank' ? (
                        'Confirm Bank Transfer'
                      ) : (
                        'Confirm Booking'
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* ──── STEP 3: CONFIRMATION ──── */}
              {checkoutStep === 'confirmation' && bookingResult && (
                <div className="text-center py-4">
                  {/* Success animation */}
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-himalaya-emerald/20 flex items-center justify-center animate-bounce-gentle">
                    <svg className="w-10 h-10 text-himalaya-emerald" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/>
                    </svg>
                  </div>

                  <h3 className="text-xl font-bold mb-2">Booking Confirmed!</h3>
                  <p className="text-sm text-white/90 mb-6">Your trek booking has been successfully submitted. A confirmation email has been sent to <span className="text-himalaya-gold">{bookingForm.email}</span></p>

                  {/* Booking Reference */}
                  <div className="glass-card-static p-5 rounded-xl mb-6 max-w-sm mx-auto">
                    <div className="text-[10px] text-white/80 uppercase tracking-widest mb-1">Booking Reference</div>
                    <div className="text-2xl font-bold text-himalaya-gold font-mono tracking-wider">{bookingResult.bookingRef}</div>
                    <div className="text-xs text-white/85 mt-2">Save this reference for future inquiries</div>
                  </div>

                  {/* Booking details */}
                  <div className="glass-card-static p-4 rounded-xl text-left mb-6 max-w-md mx-auto">
                    <h4 className="text-xs font-semibold text-white/90 mb-3 uppercase tracking-wider">Booking Details</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-white/85">Trek</span>
                        <span>{selectedTour.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/85">Date</span>
                        <span>{bookingForm.startDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/85">Travelers</span>
                        <span>{bookingForm.travelers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/85">Payment Method</span>
                        <span className="capitalize">{paymentMethod === 'esewa' ? 'eSewa' : paymentMethod === 'bank' ? 'Bank Transfer' : 'Pay on Arrival'}</span>
                      </div>
                      <div className="border-t border-white/10 pt-2 flex justify-between font-semibold text-sm">
                        <span>Total</span>
                        <span className="text-himalaya-gold">${bookingResult.amount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Next steps based on payment method */}
                  {paymentMethod === 'esewa' && (
                    <div className="glass-card-static p-4 rounded-xl text-left mb-6 max-w-md mx-auto border border-[#60BB46]/20">
                      <h4 className="text-xs font-semibold text-[#60BB46] mb-2">eSewa Payment Instructions</h4>
                      <div className="space-y-1 text-xs text-white/85">
                        <p>1. You will receive an email with a secure eSewa payment link</p>
                        <p>2. Click the link and log in to your eSewa account</p>
                        <p>3. Confirm the payment amount of <span className="text-himalaya-gold">${bookingResult.amount.toLocaleString()}</span></p>
                        <p>4. Your booking status will update to &quot;Paid&quot; automatically</p>
                      </div>
                    </div>
                  )}
                  {paymentMethod === 'bank' && (
                    <div className="glass-card-static p-4 rounded-xl text-left mb-6 max-w-md mx-auto border border-himalaya-blue/20">
                      <h4 className="text-xs font-semibold text-himalaya-blue mb-2">Bank Transfer Instructions</h4>
                      <div className="space-y-1 text-xs text-white/85">
                        <p>1. Transfer <span className="text-himalaya-gold">${bookingResult.amount.toLocaleString()}</span> to our bank account</p>
                        <p>2. Use reference: <span className="text-himalaya-gold font-mono">{bookingResult.bookingRef}</span></p>
                        <p>3. Email the transfer receipt to lama@himalayanexploration.com</p>
                        <p>4. Booking confirmed within 24 hours of verification</p>
                      </div>
                    </div>
                  )}
                  {paymentMethod === 'arrival' && (
                    <div className="glass-card-static p-4 rounded-xl text-left mb-6 max-w-md mx-auto border border-himalaya-orange/20">
                      <h4 className="text-xs font-semibold text-himalaya-orange mb-2">Pay on Arrival Information</h4>
                      <div className="space-y-1 text-xs text-white/85">
                        <p>1. Your booking is <span className="text-himalaya-emerald">confirmed</span> — no advance payment needed</p>
                        <p>2. Pay 30% deposit (${Math.round(bookingResult.amount * 0.3).toLocaleString()}) upon arrival in Kathmandu</p>
                        <p>3. Remaining 70% (${Math.round(bookingResult.amount * 0.7).toLocaleString()}) before trek departure</p>
                        <p>4. We accept Cash (USD/NPR) and Credit Cards</p>
                      </div>
                    </div>
                  )}

                  {/* Contact info */}
                  <div className="text-xs text-white/80 mb-6">
                    Questions? Contact us at <span className="text-himalaya-gold">lama@himalayanexploration.com</span> or <span className="text-himalaya-gold">+977-9851-188161</span>
                  </div>

                  <div className="flex justify-center gap-3">
                    <button onClick={closeCheckout} className="btn-outline">Close</button>
                    <button onClick={() => { navigator.clipboard.writeText(bookingResult.bookingRef); }} className="btn-primary text-xs">Copy Booking Ref</button>
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
