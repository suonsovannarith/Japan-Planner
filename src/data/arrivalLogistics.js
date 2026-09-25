// Airport Ports of Entry, Arrival Logistics & Curated Airport Stays

export const AIRPORTS = [
  {
    id: 'HND',
    code: 'HND',
    name: 'Tokyo Haneda International Airport',
    kanji: '東京国際空港 (羽田)',
    city: 'Tokyo',
    cityKey: 'tokyo',
    terminals: 'Terminals 1, 2 & 3 (International)',
    transferTime: '15-25 min to Central Tokyo',
    transferSummary: 'Tokyo Monorail to Hamamatsucho or Keikyu Airport Line to Shinagawa',
    icCardPickup: 'JR East Travel Service Center (Terminal 3, 2F) / Welcome Suica Machine',
    pocketWifi: 'Terminal 2 & 3 Arrivals Hall counters',
    image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=600&q=80',
    hotels: [
      {
        id: 'hnd-royal-park',
        name: 'The Royal Park Hotel Tokyo Haneda',
        badge: 'Direct Terminal 3 Connection',
        type: 'Transit Hotel (Inside Terminal)',
        priceJPY: 22000,
        distance: 'Directly linked to Terminal 3 International Departures',
        features: ['Zero transit needed', '24h Front Desk', 'Soundproof Rooms', 'Shower Facilities'],
        tip: 'Perfect for late-night international flights; you step straight from customs into the hotel lobby without exiting outdoors.',
        bookingUrl: 'https://www.royalparkhotels.co.jp/the/tokyohaneda/'
      },
      {
        id: 'hnd-villa-fontaine',
        name: 'Hotel Villa Fontaine Grand Haneda Airport',
        badge: 'Natural Onsen Spa Included',
        type: 'Luxury Airport Complex (Haneda Airport Garden)',
        priceJPY: 19500,
        distance: 'Connected via covered pedestrian walkway to Terminal 3',
        features: ['Izumi Tenku no Yu 24h Rooftop Onsen with Mt. Fuji view', 'Massive Shopping Mall', 'Direct Bus Terminal'],
        tip: 'Soak in real hot spring mineral waters overlooking Haneda runway and Mt. Fuji after a grueling long flight.',
        bookingUrl: 'https://www.hvf.jp/hanedaairport-grand/'
      },
      {
        id: 'hnd-first-cabin',
        name: 'First Cabin Haneda Terminal 1',
        badge: 'Aviation-Themed Luxury Capsule',
        type: 'Compact First-Class Pod Hotel',
        priceJPY: 7500,
        distance: 'Inside Domestic Terminal 1 (Free airport shuttle from T3)',
        features: ['First-Class & Business-Class Cabins', 'Large Public Bath & Sauna', 'Ultra Budget Value'],
        tip: 'Individual locking pods styled after commercial airline suites. Solo traveler favorite.',
        bookingUrl: 'https://first-cabin.jp/hotels/15'
      }
    ]
  },
  {
    id: 'NRT',
    code: 'NRT',
    name: 'Tokyo Narita International Airport',
    kanji: '成田国際空港',
    city: 'Tokyo / Chiba',
    cityKey: 'tokyo',
    terminals: 'Terminals 1, 2 & 3',
    transferTime: '36-60 min to Central Tokyo',
    transferSummary: 'Keisei Skyliner (36 min to Ueno) or JR Narita Express N\'EX (55 min to Tokyo/Shinjuku)',
    icCardPickup: 'JR East Center & Keisei Ticket Counters in T1/T2 B1F',
    pocketWifi: 'Arrivals level terminal counters',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80',
    hotels: [
      {
        id: 'nrt-nine-hours',
        name: 'Nine Hours Narita Airport',
        badge: 'Minimalist Capsule in Terminal 2',
        type: 'Futuristic Capsule Hotel',
        priceJPY: 6800,
        distance: 'Terminal 2, Basement 1F (Direct access)',
        features: ['Futuristic Sleep Pods', 'Rain Shower Rooms', 'High-Speed WiFi', 'Luggage Lockers'],
        tip: 'Located right next to the train station gates inside Terminal 2. Check in in seconds after clearing customs.',
        bookingUrl: 'https://ninehours.co.jp/narita-airport'
      },
      {
        id: 'nrt-nikko',
        name: 'Hotel Nikko Narita',
        badge: 'Top-Rated Resort & Free Shuttle',
        type: 'Full-Service 4-Star Hotel',
        priceJPY: 12500,
        distance: '10 min via free continuous airport terminal shuttle',
        features: ['Free 24h Shuttle Buses', '24h Lawson Conbini in Lobby', 'Outdoor Pool & Gardens', 'Buffet Breakfast'],
        tip: 'Free shuttle departs every 15 minutes from Terminal 1 and Terminal 2. Outstanding western-style beds.',
        bookingUrl: 'https://www.nikko-narita.com/'
      },
      {
        id: 'nrt-resthouse',
        name: 'Narita Airport Rest House',
        badge: 'Closest On-Site Airport Hotel',
        type: 'On-Airport Grounds Hotel',
        priceJPY: 9800,
        distance: '5 min walk or 3 min free shuttle from Terminal 1',
        features: ['On Airport Grounds', 'Spacious Quiet Rooms', 'Early Bird Breakfast (06:00)'],
        tip: 'The only western hotel building within airport security perimeter. Perfect for 7 AM departures.',
        bookingUrl: 'https://www.apo-resthouse.com/'
      }
    ]
  },
  {
    id: 'KIX',
    code: 'KIX',
    name: 'Osaka Kansai International Airport',
    kanji: '関西国際空港',
    city: 'Osaka / Kansai',
    cityKey: 'osaka',
    terminals: 'Terminal 1 & Terminal 2 (LCC)',
    transferTime: '35-50 min to Osaka & 75 min to Kyoto',
    transferSummary: 'JR Haruka Express (direct to Shin-Osaka & Kyoto) or Nankai Rapi:t (to Namba)',
    icCardPickup: 'JR Kansai Airport Station Ticket Office (ICOCA cards)',
    pocketWifi: 'Aeroplaza & Terminal 1 1F Arrivals Hall',
    image: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&fit=crop&w=600&q=80',
    hotels: [
      {
        id: 'kix-nikko',
        name: 'Hotel Nikko Kansai Airport',
        badge: 'Direct Covered Walkway Connection',
        type: 'Premier 4-Star Transit Hotel',
        priceJPY: 19500,
        distance: 'Direct 3-minute covered walk from Terminal 1 & JR Station',
        features: ['Walk from gate to bed in 4 min', 'Spacious Soundproof Rooms', 'Luggage Delivery Desk'],
        tip: 'Cross the skybridge directly into the hotel lobby without going outside. Catch the early Haruka Express to Kyoto straight from the lobby level.',
        bookingUrl: 'https://www.hotelnikkokansai-airport.com/'
      },
      {
        id: 'kix-first-cabin',
        name: 'First Cabin Kansai Airport',
        badge: 'Aeroplaza Compact Capsule',
        type: 'First-Class Capsule Pods',
        priceJPY: 7200,
        distance: 'Inside Aeroplaza, 4-minute walk from Kansai Airport Station',
        features: ['Shared Public Onsen Bath', 'Lounge with Free Beverages', 'Private TV in Cabins'],
        tip: 'Super convenient budget stay right across the train platform. Includes hot sento bath.',
        bookingUrl: 'https://first-cabin.jp/hotels/25'
      },
      {
        id: 'kix-star-gate',
        name: 'Star Gate Hotel Kansai Airport',
        badge: 'Panoramic Ocean Views',
        type: 'Sky High-Rise Hotel',
        priceJPY: 13500,
        distance: '1 train stop across the Sky Gate Bridge (Rinku Town Station)',
        features: ['Rooftop Dining (54th Floor)', 'Rinku Premium Outlets Nearby', 'Direct Airport Shuttle'],
        tip: 'Spectacular views of Osaka Bay and Kansai Airport runway across the ocean.',
        bookingUrl: 'https://www.s-g-h.jp/'
      }
    ]
  },
  {
    id: 'FUK',
    code: 'FUK',
    name: 'Fukuoka Airport',
    kanji: '福岡空港',
    city: 'Fukuoka / Kyushu',
    cityKey: 'fukuoka',
    terminals: 'International & Domestic Terminals',
    transferTime: '5 min to Hakata Station (Fastest in Japan!)',
    transferSummary: 'Fukuoka City Subway Airport Line (Direct 2 stops to Hakata Station)',
    icCardPickup: 'Subway Station Ticket Machines (Hayakaken / Sugoca)',
    pocketWifi: 'International Terminal 1F Counter',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=600&q=80',
    hotels: [
      {
        id: 'fuk-miyako',
        name: 'Miyako Hotel Hakata',
        badge: 'Rooftop Hot Spring Pool',
        type: '5-Star Luxury Station Hotel',
        priceJPY: 24000,
        distance: '5 min subway ride from airport to Hakata Station (direct underground exit)',
        features: ['Rooftop Onsen Pool & Waterfall', 'Direct Underground Subway Concourse', 'Spacious Glass Suites'],
        tip: 'Fukuoka Airport is practically downtown! Take the 5-minute subway to Hakata and soak in Miyako\'s rooftop thermal pool.',
        bookingUrl: 'https://www.miyakohotels.ne.jp/hakata/'
      },
      {
        id: 'fuk-en-hotel',
        name: 'En Hotel Hakata',
        badge: 'Trendy Boutique Value',
        type: 'Modern Design Hotel',
        priceJPY: 9800,
        distance: '7 min walk from Hakata Station Chikushi Exit',
        features: ['Specialty Coffee Lounge', 'Curated Neighborhood Ramen Maps', 'Minimalist Aesthetics'],
        tip: 'Great value base right next to the station, ideal for exploring Fukuoka\'s famous Yatai food stalls.',
        bookingUrl: 'https://en-hotel.com/hakata/'
      }
    ]
  },
  {
    id: 'CTS',
    code: 'CTS',
    name: 'Sapporo New Chitose Airport',
    kanji: '新千歳空港',
    city: 'Sapporo / Hokkaido',
    cityKey: 'sapporo',
    terminals: 'Domestic & International Terminals',
    transferTime: '37 min to Central Sapporo Station',
    transferSummary: 'JR Rapid Airport Train (departs every 12 mins)',
    icCardPickup: 'JR Ticket Office in B1F (Kitaca cards)',
    pocketWifi: 'International & Domestic Arrivals Hall',
    image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=600&q=80',
    hotels: [
      {
        id: 'cts-air-terminal',
        name: 'Air Terminal Hotel',
        badge: 'Free Airport Onsen Access',
        type: 'In-Terminal Airport Hotel',
        priceJPY: 16500,
        distance: 'Located inside Domestic Terminal Building (3F)',
        features: ['Free entry to New Chitose Airport Onsen', 'Runway View Rooms', 'Buffet Breakfast Included'],
        tip: 'Includes complimentary unlimited access to the airport\'s natural hot spring complex with open-air baths and saunas.',
        bookingUrl: 'https://www.air-terminal-hotel.jp/'
      },
      {
        id: 'cts-portom',
        name: 'Portom International Hokkaido',
        badge: 'Premier Japanese Art Luxury',
        type: '5-Star Cultural Luxury',
        priceJPY: 31000,
        distance: 'Directly linked to International Terminal (4F-8F)',
        features: ['Museum-Grade Japanese Art Collection', 'Tea Ceremony Pavilion', 'Michelin-Caliber French & Kaiseki'],
        tip: 'One of the most artistic transit hotels in the world, filled with masterwork ukiyo-e woodblock prints and Edo ceramics.',
        bookingUrl: 'https://www.portom.jp/'
      }
    ]
  }
];

export const ARRIVAL_TIME_SLOTS = [
  {
    id: 'morning',
    label: 'Morning (06:00 – 12:00)',
    timeRange: '06:00 - 12:00',
    icon: 'Sun',
    desc: 'Full day ahead. Drop luggage at hotel or coin lockers and begin sightseeing immediately.',
    impact: 'Full itinerary on Day 1'
  },
  {
    id: 'afternoon',
    label: 'Afternoon (12:00 – 17:00)',
    timeRange: '12:00 - 17:00',
    icon: 'Sunset',
    desc: 'Standard arrival window. Smooth hotel check-in at 15:00, sunset stroll, and dinner.',
    impact: 'Afternoon & evening activities on Day 1'
  },
  {
    id: 'evening',
    label: 'Evening (17:00 – 21:00)',
    timeRange: '17:00 - 21:00',
    icon: 'Moon',
    desc: 'Late arrival. Skip daytime sights. Focus on airport transfer, check-in, conbini run, and casual ramen dinner.',
    impact: 'Calibrated: Light evening relaxation on Day 1'
  },
  {
    id: 'late-night',
    label: 'Late Night (21:00+)',
    timeRange: '21:00 - 02:00+',
    icon: 'Plane',
    desc: 'Red-eye or delayed flight. High recommendation for an airport hotel or terminal stay before starting Day 2 fresh.',
    impact: 'Calibrated: Airport check-in & rest, full adventure starts Day 2'
  }
];
