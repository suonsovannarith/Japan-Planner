// Multi-modal transit hub data: Trains, Subways, City Buses & Taxis/Rideshares for Japan routes

export const CITY_TRANSIT_PROFILES = {
  tokyo: {
    recommendedMode: 'train',
    recommendedBadge: '⭐ Most Convenient: JR Yamanote Line & Tokyo Metro (15-25 min)',
    train: {
      lineName: 'JR Yamanote Line & Tokyo Metro Ginza/Marunouchi Lines',
      color: '#80c342', // Yamanote green
      code: 'JY / G / M',
      routeDesc: 'Loop line connecting Shinjuku [JY17], Shibuya [JY20], Tokyo [JY01], Ueno [JY05], and Akihabara [JY03]',
      platform: 'Tracks 1 & 2 (Outer / Inner loop every 2-3 mins)',
      direction: 'Outer loop: Shinjuku ➔ Shibuya ➔ Shinagawa; Inner loop: Tokyo ➔ Ueno ➔ Ikebukuro',
      transferStations: ['Shibuya (Transfer to Ginza & Hanzomon Lines)', 'Akihabara (Transfer to Hibiya Line)', 'Otemachi (Hub of 5 subway lines)'],
      fareJPY: 210,
      paymentMethod: 'IC Card (Suica / Pasmo / Welcome Suica) tap at automated ticket gates',
      speed: 'Fastest within urban core (train every 2 mins)'
    },
    bus: {
      lineName: 'Toei City Bus & Keio Highway Express',
      code: '都01 / 渋66',
      boardingStop: 'Shibuya Station West Exit Bus Terminal (Stop #3) or Shinjuku Expressway Bus Terminal (Busta Shinjuku)',
      paymentMethod: 'Flat fare ¥210. Board via FRONT DOOR, tap Suica/Pasmo or insert exact cash. Exit via rear door.',
      fareJPY: 210,
      duration: '30 - 45 min (subject to Tokyo traffic)',
      timetableLink: 'https://tobus.jp/blsys/navi',
      tip: 'Scenic elevated street views from Roppongi to Shinbashi, but slower than the subway during morning/evening rush hours.'
    },
    taxi: {
      provider: 'GO Taxi / Uber Japan / Nihon Kotsu',
      fareRangeJPY: [1800, 3200],
      duration: '15 - 25 min',
      appTip: 'Download GO Taxi app (Japan\'s #1 taxi hailing app with foreign credit card & English interface). Uber also calls certified licensed black cabs.',
      payment: 'Credit Card in app, Suica/Pasmo IC tap, or Cash',
      pros: 'Door-to-door comfort, ideal with heavy shopping bags in Ginza/Shibuya or late night after midnight trains stop.'
    }
  },
  kyoto: {
    recommendedMode: 'bus',
    recommendedBadge: '⭐ Most Popular: Kyoto City Bus #206 & Tozai Subway (25 min)',
    train: {
      lineName: 'Kyoto Municipal Subway (Karasuma & Tozai Lines) / Keihan Railway',
      color: '#008080', // Kyoto subway teal
      code: 'K / T / KH',
      routeDesc: 'Kyoto Station [K11] ➔ Karasuma-Oike [K08/T13] ➔ Higashiyama / Gion-Shijo [KH39]',
      platform: 'Platform 1 (Northbound to Karasuma Oike / International Conference Center)',
      direction: 'Northbound towards Karasuma Oike; transfer to Tozai line for Gion/Nanzenji',
      transferStations: ['Karasuma-Oike (Subway cross intersection)', 'Sanjo Keihan (Transfer to Fushimi Inari line)'],
      fareJPY: 260,
      paymentMethod: 'IC Card (ICOCA / Suica / Pasmo) or 1-Day Subway Pass (¥800)',
      speed: 'Reliable, avoids city surface traffic jams'
    },
    bus: {
      lineName: 'Kyoto City Bus (#206, #100, #205 Raku Bus loops)',
      code: '市バス #206',
      boardingStop: 'Kyoto Station Central Bus Terminal (Platform D2 for Kiyomizu-dera / Gion)',
      paymentMethod: 'Board via REAR DOOR. If paying cash, take small numbered paper ticket from dispenser. Pay driver at FRONT DOOR when exiting (Flat fee ¥230, IC card tap or exact cash).',
      fareJPY: 230,
      duration: '25 - 35 min',
      timetableLink: 'https://www.city.kyoto.lg.jp/kotsu/',
      tip: 'Lines #206 and #205 stop directly in front of major temple gates. Buses can be crowded during peak foliage/cherry blossom seasons.'
    },
    taxi: {
      provider: 'MK Taxi / Yasaka Taxi (Clover emblem) / GO Taxi',
      fareRangeJPY: [1500, 2600],
      duration: '12 - 20 min',
      appTip: 'MK Taxi Kyoto has fluent English-speaking drivers upon request. Yasaka Taxi has famous lucky four-leaf clover cars (only 4 exist in the entire fleet!).',
      payment: 'Credit Card, ICOCA / IC Card, Cash',
      pros: 'Crucial for navigating narrow historic Gion lanes and steep climbs to Kiyomizu-dera.'
    }
  },
  osaka: {
    recommendedMode: 'train',
    recommendedBadge: '⭐ Most Convenient: Osaka Metro Midosuji Line (12 min)',
    train: {
      lineName: 'Osaka Metro Midosuji Red Line & JR Osaka Loop Line',
      color: '#e60012', // Midosuji Red
      code: 'M / O',
      routeDesc: 'Shin-Osaka [M13] ➔ Umeda [M16] ➔ Shinsaibashi [M19] ➔ Namba [M20] ➔ Tennoji [M23]',
      platform: 'Platform 1 (Southbound to Namba / Nakamozu)',
      direction: 'Direct North-South spine of Osaka city connecting all nightlife & foodie hubs',
      transferStations: ['Umeda (Connecting JR Osaka, Hankyu, Hanshin)', 'Namba (Connecting Nankai airport express & Kintetsu Nara)'],
      fareJPY: 240,
      paymentMethod: 'IC Card (ICOCA / Suica) or Osaka 1-Day Enjoy Eco Card (¥820 weekdays, ¥620 weekends)',
      speed: 'Every 2-4 minutes, fast and direct'
    },
    bus: {
      lineName: 'Osaka City Bus & Nankai Express',
      code: '大阪シティバス #88',
      boardingStop: 'Osaka Station City South Bus Gate or Namba OCAT Terminal',
      paymentMethod: 'Flat fare ¥210. Board front, exit rear, IC card tap supported.',
      fareJPY: 210,
      duration: '25 - 40 min',
      timetableLink: 'https://bus.osakametro.co.jp/',
      tip: 'Great for reaching Osaka Bay area and Tempozan Ferris Wheel directly from Osaka Station.'
    },
    taxi: {
      provider: 'GO Taxi / Didi Osaka / Uber Japan',
      fareRangeJPY: [1400, 2400],
      duration: '10 - 18 min',
      appTip: 'Didi and GO have exceptional coverage throughout Dotonbori, Kitashinchi, and Umeda with rapid pick-ups.',
      payment: 'In-app digital pay, Credit Card, IC Card, Cash',
      pros: 'Very reasonably priced for short hops between Namba, Shinsaibashi, and Amerikamura when traveling in groups.'
    }
  },
  fukuoka: {
    recommendedMode: 'train',
    recommendedBadge: '⭐ Fastest in Japan: Fukuoka Airport Subway Line (5 min)',
    train: {
      lineName: 'Fukuoka City Subway Airport Line (Kuko Line)',
      color: '#f39800',
      code: 'K',
      routeDesc: 'Fukuoka Airport [K13] ➔ Hakata Station [K11] ➔ Nakasu-Kawabata [K09] ➔ Tenjin [K08]',
      platform: 'Platform 1 & 2',
      direction: 'Westbound to Meinohama / Karatsu; Eastbound to Fukuoka Airport',
      transferStations: ['Hakata (Shinkansen & JR Kyushu express trains)', 'Nakasu-Kawabata (Hakozaki Line)', 'Tenjin (Nishitetsu Omuta Line)'],
      fareJPY: 260,
      paymentMethod: 'Credit Card Tap-to-Pay (Visa/Mastercard directly at fare gates!) or IC Card (Hayakaken/Suica)',
      speed: 'World-famous convenience: 5 mins from airport runway to bullet train station'
    },
    bus: {
      lineName: 'Nishitetsu 100-Yen Bus Loop',
      code: '西鉄バス 100円循環',
      boardingStop: 'Hakata Station Hakata Exit Bus Center or Tenjin Bus Center',
      paymentMethod: 'Board rear door, exit front door. Flat fare ¥150 (IC card or cash in fare box).',
      fareJPY: 150,
      duration: '15 - 25 min',
      timetableLink: 'https://www.nishitetsu.jp/bus/',
      tip: 'Connects Hakata Station, Canal City Hakata, Nakasu Yatai food stalls, and Tenjin downtown continuously.'
    },
    taxi: {
      provider: 'GO Taxi / Fukuoka Kotsu / Uber',
      fareRangeJPY: [1200, 2000],
      duration: '8 - 15 min',
      appTip: 'Fukuoka is compact. A taxi from Tenjin to Hakata Station is under ¥1,500.',
      payment: 'Credit Card, IC Card, Cash',
      pros: 'Effortless hop after late-night yatai stall hopping and tonkotsu ramen.'
    }
  },
  sapporo: {
    recommendedMode: 'train',
    recommendedBadge: '⭐ Most Convenient: Sapporo Subway Namboku Line & JR Rapid (15 min)',
    train: {
      lineName: 'Sapporo Municipal Subway (Namboku & Tozai Lines)',
      color: '#008000',
      code: 'N / T',
      routeDesc: 'Sapporo Station [N06] ➔ Odori Park [N07] ➔ Susukino Nightlife [N08] ➔ Nakajima Koen [N09]',
      platform: 'Platform 1 (Southbound to Makomanai)',
      direction: 'Connects Sapporo JR Station, Odori Snow Festival park, and Susukino entertainment district',
      transferStations: ['Odori (Central junction for Namboku, Tozai, and Toho subway lines)'],
      fareJPY: 210,
      paymentMethod: 'IC Card (Kitaca / Suica / Pasmo) or 1-Day Subway Pass (Donichika ¥520 on weekends)',
      speed: 'Heated rubber-tired underground trains, completely immune to heavy Hokkaido snow'
    },
    bus: {
      lineName: 'Chuo Bus / Jotetsu Bus',
      code: '中央バス #7',
      boardingStop: 'Sapporo Station North Exit Bus Terminal',
      paymentMethod: 'Board rear door, take numbered ticket, pay fare displayed on electronic board at front when exiting.',
      fareJPY: 240,
      duration: '20 - 35 min',
      timetableLink: 'https://www.chuo-bus.co.jp/',
      tip: 'Direct bus connection to Jozankei Onsen hot spring valley and Hitsujigaoka Observation Hill.'
    },
    taxi: {
      provider: 'GO Taxi / Hokuto Kotsu / MK Taxi Sapporo',
      fareRangeJPY: [1300, 2200],
      duration: '10 - 18 min',
      appTip: 'All Sapporo cabs are equipped with specialized studless 4WD snow tires for safety during winter blizzards.',
      payment: 'Credit Card, Kitaca/IC Card, Cash',
      pros: 'Heated cabins keep you warm when temperatures drop below freezing.'
    }
  }
};

// Shinkansen & Intercity Transit detail helper
export function getIntercityTransitDetails(fromKey, toKey) {
  if ((fromKey === 'tokyo' && toKey === 'kyoto') || (fromKey === 'kyoto' && toKey === 'tokyo')) {
    return {
      recommendedMode: 'train',
      recommendedBadge: '⭐ Fastest & Most Scenic: JR Tokaido Shinkansen (Nozomi: 2h 15m)',
      train: {
        lineName: 'JR Tokaido Shinkansen (Nozomi / Hikari)',
        color: '#005bac', // Shinkansen blue
        code: '新幹線 N700S',
        routeDesc: 'Tokyo Station [TYO] / Shinagawa [SNA] ➔ Kyoto Station [KYO]',
        platform: 'Tokyo Station: Tracks 14-19; Kyoto Station: Tracks 13-14',
        direction: 'Westbound towards Shin-Osaka / Hakata',
        transferStations: ['Shinagawa (Smooth transfer if arriving from Haneda)', 'Nagoya'],
        fareJPY: 14170,
        paymentMethod: 'SmartEX App / JR Ticket Office / JR Pass (Hikari trains only)',
        speed: 'Cruises at 285 km/h. Reserve Right-Side seats (Row E) on Tokyo➔Kyoto for Mt. Fuji views!'
      },
      bus: {
        lineName: 'Willer Express Overnight Highway Bus',
        code: 'Willer Night Liner',
        boardingStop: 'Busta Shinjuku 4F Bus Terminal (Departures 22:30 - 23:45)',
        paymentMethod: 'Online reservation prior to trip at willerexpress.com',
        fareJPY: 4500,
        duration: '7 - 8 hrs (Overnight sleep)',
        timetableLink: 'https://willerexpress.com/en/',
        tip: 'Best budget option: saves a full night of hotel accommodation with cocoon canopy privacy shells and USB power outlets.'
      },
      taxi: {
        provider: 'Intercity Chauffeur / Private Van Transfer',
        fareRangeJPY: [85000, 120000],
        duration: '5 - 6 hrs via Tomei Expressway',
        appTip: 'Only recommended for VIPs, film crews, or excessive oversized cargo. Bullet train is 3x faster and significantly cheaper.',
        payment: 'Corporate invoice / Advance credit card',
        pros: 'Private cabin with direct hotel-to-hotel luggage delivery.'
      }
    };
  }

  if ((fromKey === 'kyoto' && toKey === 'osaka') || (fromKey === 'osaka' && toKey === 'kyoto')) {
    return {
      recommendedMode: 'train',
      recommendedBadge: '⭐ Most Convenient: JR Special Rapid Service (28 min)',
      train: {
        lineName: 'JR Kyoto Line (Special Rapid / Shin-Kaisoku)',
        color: '#0072bc',
        code: 'JR 新快速',
        routeDesc: 'Kyoto Station [A31] ➔ Takatsuki ➔ Shin-Osaka [A46] ➔ Osaka (Umeda) [A47]',
        platform: 'Kyoto Station: Track 4 & 5; Osaka Station: Track 8 & 9',
        direction: 'Southbound to Osaka / Sannomiya (Kobe)',
        transferStations: ['Shin-Osaka (Bullet train connection)', 'Osaka Umeda (Private Hankyu & Hanshin lines)'],
        fareJPY: 580,
        paymentMethod: 'IC Card (ICOCA / Suica) tap directly at gates. No reservation fee needed!',
        speed: 'Departs every 15 minutes, hits 130 km/h, only ¥580'
      },
      bus: {
        lineName: 'Keihan Express Bus / Kyoto-Osaka Highway Shuttle',
        code: '京阪直通バス',
        boardingStop: 'Kyoto Station Hachijo Exit',
        paymentMethod: 'IC Card or ticket vending machine',
        fareJPY: 900,
        duration: '55 min',
        timetableLink: 'https://www.keihanbus.jp/',
        tip: 'Scenic elevated view of the Yodo river, but train is twice as fast for less money.'
      },
      taxi: {
        provider: 'GO Taxi / MK Taxi Kyoto-Osaka Intercity',
        fareRangeJPY: [14000, 19000],
        duration: '45 - 60 min via Meishin Expressway',
        appTip: 'Fixed flat-rate highway service available through MK Taxi.',
        payment: 'Credit Card, ICOCA, Cash',
        pros: 'Convenient if traveling with 3-4 passengers and multiple large suitcases.'
      }
    };
  }

  // Fallback to city profile
  return CITY_TRANSIT_PROFILES[fromKey] || CITY_TRANSIT_PROFILES.tokyo;
}
