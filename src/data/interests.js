// Interests, travel styles, and preference configurations

export const INTEREST_CATEGORIES = [
  {
    id: 'culture',
    title: 'Temples & Shrines',
    subtitle: 'Torii gates, ancient castles & Zen monasteries',
    kanji: '神社・寺院',
    icon: 'Landmark',
    color: '#e63946',
    popularTags: ['Fushimi Inari', 'Kinkaku-ji', 'Senso-ji', 'Himeji Castle']
  },
  {
    id: 'food',
    title: 'Foodie & Culinary',
    subtitle: 'Ramen quests, wagyu, sushi & yokocho alleyways',
    kanji: '美食・屋台',
    icon: 'Utensils',
    color: '#f4a261',
    popularTags: ['Tsukiji Fish', 'Dotonbori Takoyaki', 'Hakata Tonkotsu', 'Kaiseki']
  },
  {
    id: 'anime',
    title: 'Anime, Manga & Gaming',
    subtitle: 'Akihabara, Pokémon Centers & Nintendo World',
    kanji: 'アニメ・ゲーム',
    icon: 'Gamepad2',
    color: '#9d4edd',
    popularTags: ['Akihabara', 'Super Nintendo World', 'Ghibli', 'Odaiba Gundam']
  },
  {
    id: 'nature',
    title: 'Nature & Scenery',
    subtitle: 'Mt. Fuji panoramas, bamboo groves & alpine trails',
    kanji: '自然・富士山',
    icon: 'Mountain',
    color: '#2a9d8f',
    popularTags: ['Lake Ashi', 'Arashiyama', 'Shirakawa-go', 'Nara Deer']
  },
  {
    id: 'onsen',
    title: 'Onsen & Ryokan',
    subtitle: 'Volcanic hot springs, yukata robes & zen baths',
    kanji: '温泉・旅館',
    icon: 'Sparkles',
    color: '#e76f51',
    popularTags: ['Hakone Hot Springs', 'Kinosaki Onsen', 'Rotenburo Open Baths']
  },
  {
    id: 'metropolis',
    title: 'Neon & Cyberpunk City',
    subtitle: 'Shibuya Crossing, teamLab, rooftops & skyscrapers',
    kanji: '都会・夜景',
    icon: 'Building2',
    color: '#00b4d8',
    popularTags: ['Shibuya Sky', 'teamLab Planets', 'Shinjuku Neon', 'Roppongi']
  },
  {
    id: 'traditional',
    title: 'Traditional Arts & Crafts',
    subtitle: 'Tea ceremony, kimono, sword forging & pottery',
    kanji: '伝統工芸',
    icon: 'Brush',
    color: '#d4a373',
    popularTags: ['Matcha Whisking', 'Kimono Dressing', 'Kanazawa Gold Leaf']
  },
  {
    id: 'nightlife',
    title: 'Nightlife & Yokocho',
    subtitle: 'Izakaya hopping, craft beer & cocktail lounges',
    kanji: '夜の街・居酒屋',
    icon: 'Wine',
    color: '#e056fd',
    popularTags: ['Golden Gai', 'Nakasu Yatai', 'Ura-Namba', 'Craft Beer Bars']
  }
];

export const PACE_OPTIONS = [
  {
    id: 'relaxed',
    title: 'Relaxed & Mindful',
    subtitle: '1-2 major highlights/day, leisurely coffee, unhurried transit',
    badge: 'Zen Flow',
    spotsPerDay: '1 - 2 spots'
  },
  {
    id: 'balanced',
    title: 'Balanced Explorer',
    subtitle: '3-4 top sights daily, mix of structured highlights and free time',
    badge: 'Most Popular',
    spotsPerDay: '3 - 4 spots'
  },
  {
    id: 'packed',
    title: 'Action-Packed High Energy',
    subtitle: '5+ sights, early sunrise starts, maximize every waking hour',
    badge: 'Maximum Sightseeing',
    spotsPerDay: '5+ spots'
  }
];

export const BUDGET_TIERS = [
  {
    id: 'budget',
    title: 'Backpacker / Value',
    sub: 'Hostels, business hotels (APA/Sotetsu), IC card transit, ramen & conbini gems',
    dailyJPY: 8500,
    dailyUSD: 58,
    hotelBadge: 'Budget / Capsule (¥5,000 - ¥8,000/nt)'
  },
  {
    id: 'mid',
    title: 'Comfort / Mid-Range',
    sub: '3-4 star modern hotels, Shinkansen travel, diverse restaurants, guided workshops',
    dailyJPY: 22000,
    dailyUSD: 148,
    hotelBadge: 'Boutique Hotel (¥16,000 - ¥24,000/nt)'
  },
  {
    id: 'luxury',
    title: 'Luxury / Ryokan Indulgence',
    sub: '5-star premier hotels, private onsen ryokan with Kaiseki, Green Car Shinkansen',
    dailyJPY: 62000,
    dailyUSD: 415,
    hotelBadge: 'Luxury / Onsen Ryokan (¥50,000+/nt)'
  }
];

export const DURATION_PRESETS = [
  {
    id: 'weekend',
    days: 4,
    label: 'Quick Express',
    tag: '3 - 4 Days',
    desc: 'Tokyo Highlights + Kamakura or Hakone getaway'
  },
  {
    id: 'week',
    days: 7,
    label: 'Classic Golden Route',
    tag: '1 Week (7 Days)',
    desc: 'Tokyo, Kyoto, Nara, and Osaka bullet train adventure'
  },
  {
    id: 'two_weeks',
    days: 14,
    label: 'Japan Deep Dive',
    tag: '2 Weeks (14 Days)',
    desc: 'Golden Route + Hakone Onsen, Hiroshima, Miyajima & Takayama'
  },
  {
    id: 'month',
    days: 28,
    label: 'Grand Tour of Japan',
    tag: '1 Month (4 Weeks)',
    desc: 'The complete cross-country odyssey from Hokkaido to Kyushu'
  }
];
