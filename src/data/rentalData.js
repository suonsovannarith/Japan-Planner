// Tourist Car & Vehicle Rental Database for Japan Travel Planner

export const RENTAL_AGENCIES = [
  {
    id: 'toyota',
    name: 'Toyota Rent-a-Car',
    kanji: 'トヨタレンタカー',
    badge: 'Largest Fleet in Japan',
    coverage: '1,200+ Branches Nationwide (Every Airport & Shinkansen Hub)',
    popularModels: ['Yaris Hybrid', 'Corolla Touring', 'Prius', 'Alphard', 'Sienta'],
    perks: [
      'Bilingual English GPS / Apple CarPlay standard on 98% of fleet',
      'Instant ETC Card rental at pick-up counter',
      'One-way drop-off available across prefectures',
      'Free airport terminal shuttle transfers'
    ],
    website: 'https://rent.toyota.co.jp/en/',
    recommendedFor: 'Reliability, hybrid fuel economy & nationwide emergency roadside support'
  },
  {
    id: 'times',
    name: 'Times CAR RENTAL',
    kanji: 'タイムズカーレンタル',
    badge: 'Fast Digital Check-in',
    coverage: '450+ Locations near urban stations & regional hubs',
    popularModels: ['Mazda 2', 'Nissan Note e-POWER', 'Daihatsu Tanto (Kei)'],
    perks: [
      'Very affordable Kei-car and compact rates',
      'Express online departure service (skip desk queue)',
      'Free cancellation up to 7 days prior',
      'ETC card rental with toll cost calculation printout upon return'
    ],
    website: 'https://www.timescar-rental.com/en/',
    recommendedFor: 'Budget travelers, city station pickups, and compact city car parking'
  },
  {
    id: 'nippon',
    name: 'Nippon Rent-A-Car',
    kanji: 'ニッポンレンタカー',
    badge: '24/7 International Airport Counters',
    coverage: '800+ Locations including late-night airport desks',
    popularModels: ['Subaru Forester (AWD)', 'Honda Fit', 'Nissan Serena Minivan'],
    perks: [
      '24-hour English & multilingual phone assistance hotline',
      'Toll expressway discount pass option (Japan Expressway Pass / JEP)',
      'Winter snow tires / studless tire guarantee for Tohoku & Hokkaido',
      'Foreign driver friendly with clear bilingual handover'
    ],
    website: 'https://www.nrgroup-global.com/en/',
    recommendedFor: 'Winter ski trips, AWD mountain journeys, and foreign tourists requiring English hotline'
  },
  {
    id: 'orix',
    name: 'ORIX Rent-A-Car',
    kanji: 'オリックスレンタカー',
    badge: 'Diverse Van & SUV Lineup',
    coverage: '1,000+ Branches nationwide',
    popularModels: ['Honda Freed', 'Toyota RAV4', 'Nissan X-Trail', 'Daihatsu Move Canbus'],
    perks: [
      'Excellent group multi-seater vans (7-8 passengers)',
      'Competitive early-bird multi-day discount packages',
      'Free child safety seat installation upon request',
      'Extensive Okinawa, Hokkaido & Kyushu scenic rental centers'
    ],
    website: 'https://car.orix.co.jp/eng/',
    recommendedFor: 'Family vacations, Hokkaido lavender & national park loops, and group baggage capacity'
  }
];

export const VEHICLE_CLASSES = [
  {
    id: 'kei',
    name: 'Kei-Car (Compact 660cc)',
    badge: 'Best for Narrow Streets & High MPG',
    sampleModels: 'Daihatsu Tanto, Suzuki Hustler, Honda N-BOX',
    passengers: 4,
    luggage: '2 Medium Bags (or 3 with rear seats folded)',
    dailyPriceJPY: 6500,
    fuelEconomy: '22 - 27 km/L (55 - 63 mpg)',
    features: [
      'Ultra-compact yellow plate vehicle',
      'Automatic sliding doors',
      'Turns on a dime in ancient village alleys',
      'Discounted toll expressway rate (approx. 20% cheaper than regular cars)'
    ],
    idealFor: 'Solo travelers, couples, scenic coastal drives, and rural Kyoto/Nara backroads'
  },
  {
    id: 'compact',
    name: 'Standard Compact & Hatchback',
    badge: 'Most Popular Tourist Choice',
    sampleModels: 'Toyota Yaris Hybrid, Honda Fit, Nissan Note e-POWER',
    passengers: 5,
    luggage: '2 Large Suitcases + 2 Backpacks',
    dailyPriceJPY: 9000,
    fuelEconomy: '25 - 32 km/L (Hybrid)',
    features: [
      'Quiet hybrid electric powertrain',
      'Apple CarPlay & Android Auto enabled',
      'Toyota Safety Sense / lane assist cruise control',
      'Smooth acceleration on mountainous highway climbs'
    ],
    idealFor: 'Mt. Fuji Five Lakes, Hakone, Izu Peninsula, and 2-4 adults with luggage'
  },
  {
    id: 'sedan',
    name: 'Comfort Sedan & Touring Wagon',
    badge: 'Smooth Highway Cruising',
    sampleModels: 'Toyota Corolla Touring, Mazda 3, Subaru Impreza',
    passengers: 5,
    luggage: '3 Large Suitcases + Carry-ons',
    dailyPriceJPY: 12500,
    fuelEconomy: '18 - 24 km/L',
    features: [
      'Long wheelbase for plush long-distance stability',
      'Spacious enclosed trunk to conceal valuables from sight',
      'High-grade acoustic soundproofing',
      'Adaptive cruise control & speed sign recognition'
    ],
    idealFor: 'Inter-prefecture highway touring, romantic getaways, and extended luggage road trips'
  },
  {
    id: 'minivan-suv',
    name: 'Minivan / Full-Size SUV (AWD)',
    badge: 'Groups, Families & Snow Country',
    sampleModels: 'Toyota Alphard, Toyota RAV4 AWD, Nissan Serena',
    passengers: 7,
    luggage: '4-5 Large Suitcases',
    dailyPriceJPY: 17500,
    fuelEconomy: '14 - 18 km/L',
    features: [
      'Captain chairs with individual climate zones',
      'All-Wheel Drive (AWD) available with studless snow tires',
      'Panoramic 360-degree parking cameras',
      'Huge vertical headroom for easy entry and child seats'
    ],
    idealFor: 'Hokkaido powder snow road trips, Japanese Alps (Takayama/Shirakawa-go), and families of 4-7'
  }
];

export const DRIVING_GUIDE_RULES = [
  {
    icon: 'ShieldCheck',
    title: 'International Driving Permit (IDP) Requirement',
    badge: 'Mandatory',
    color: '#e63946',
    desc: 'You MUST present a physical 1949 Geneva Convention booklet issued in your home country BEFORE arriving in Japan. Digital versions, photocopies, or international certificates not matching the 1949 format are strictly rejected by law at rental desks.'
  },
  {
    icon: 'CreditCard',
    title: 'ETC Card (Electronic Toll Collection)',
    badge: 'Top Money-Saver',
    color: '#2a9d8f',
    desc: 'Expressway tolls in Japan are frequent and pricey. Always rent an ETC card (typically ¥330 one-time fee) at your car rental desk. It plugs into your dashboard and lets you cruise through purple ETC toll gates without stopping, automatically saving 30-50% on late-night and weekend tolls.'
  },
  {
    icon: 'Compass',
    title: 'Drive on the Left Side',
    badge: 'Road Rule',
    color: '#3b82f6',
    desc: 'Japan drives on the LEFT, with the steering wheel on the RIGHT. Windshield wiper and turn signal stalks are often reversed. Right turns across oncoming traffic require waiting for green arrows.'
  },
  {
    icon: 'Navigation',
    title: 'MapCodes & English Navigation',
    badge: 'Bilingual GPS',
    color: '#f4a261',
    desc: 'Entering Japanese kanji addresses into a GPS is difficult. Japanese GPS units use unique 6-10 digit "MapCodes" or telephone numbers for instant navigation to any scenic overlook, shrine, or restaurant.'
  },
  {
    icon: 'Fuel',
    title: 'Gas Stations & Fuel Rules',
    badge: 'Return Full',
    color: '#e76f51',
    desc: 'Return the car with a full tank. Most rental cars take "Regular" unleaded gasoline (red nozzle pump labeled レギュラー / Regyura-). Keep the printed receipt from the gas station within 5 km of the return hub to show the rental clerk.'
  },
  {
    icon: 'AlertTriangle',
    title: 'Zero Tolerance for Alcohol (0.00% BAC)',
    badge: 'Strict Law',
    color: '#ef4444',
    desc: 'Japan has an absolute zero-tolerance policy (0.00% blood alcohol level). Even the morning after consuming alcohol, driving can result in heavy criminal penalties, immediate arrest, and deportation. Designate a driver or use daiko (chauffeured designated driver) services.'
  }
];

export const ROAD_TRIP_RECOMMENDATIONS = [
  {
    id: 'fuji-five-lakes',
    title: 'Mt. Fuji Five Lakes & Hakone Loop',
    region: 'Kanto / Chubu',
    duration: '2-3 Days',
    highlights: ['Lake Kawaguchiko Momiji Tunnel', 'Chureito Pagoda sunrise', 'Hakone Skyline Drive', 'Oshino Hakkai'],
    bestSeason: 'Spring (Cherry Blossoms) & Autumn (Crimson Foliage)',
    recommendedVehicle: 'Compact Hybrid (e.g. Yaris / Corolla)',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'hokkaido-scenic',
    title: 'Hokkaido Lavender & Volcano Expressway',
    region: 'Hokkaido',
    duration: '4-7 Days',
    highlights: ['Furano Lavender Fields', 'Biei Roller Coaster Road & Blue Pond', 'Daisetsuzan National Park', 'Otaru Canal'],
    bestSeason: 'Summer (July-August) or Winter (with AWD Minivan)',
    recommendedVehicle: 'AWD SUV or Minivan (e.g. RAV4 / Alphard)',
    image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'okinawa-coastal',
    title: 'Okinawa Emerald Coastline & Kouri Bridge',
    region: 'Okinawa',
    duration: '3-5 Days',
    highlights: ['Kouri Island Sea-Bridge', 'Churaumi Aquarium', 'Cape Manzamo cliffs', 'Bise Fukugi Tree Path'],
    bestSeason: 'April - October (Beach & Warm weather)',
    recommendedVehicle: 'Kei-Car or Open-Top Convertible',
    image: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&fit=crop&w=600&q=80'
  }
];
