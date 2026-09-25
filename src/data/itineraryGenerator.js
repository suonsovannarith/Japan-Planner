import { CITIES, TRANSPORT_PASSES } from './destinations';

export function generateSmartItinerary({
  duration = 7,
  startingCity = 'tokyo',
  interests = ['culture', 'food', 'metropolis'],
  pace = 'balanced',
  budget = 'mid',
  travelers = 1
}) {
  const numDays = Math.max(3, Math.min(30, Number(duration)));
  const days = [];

  // Determine city distribution based on days and starting point
  let cityPlan = [];

  if (numDays <= 4) {
    if (startingCity === 'osaka' || startingCity === 'kyoto') {
      cityPlan = [
        { city: 'kyoto', days: 2 },
        { city: 'nara', days: 1 },
        { city: 'osaka', days: numDays - 3 }
      ];
    } else {
      cityPlan = [
        { city: 'tokyo', days: Math.max(2, numDays - 1) },
        { city: 'hakone', days: 1 }
      ];
    }
  } else if (numDays <= 7) {
    cityPlan = [
      { city: 'tokyo', days: 3 },
      { city: 'hakone', days: 1 },
      { city: 'kyoto', days: 2 },
      { city: 'osaka', days: numDays - 6 }
    ];
  } else if (numDays <= 10) {
    cityPlan = [
      { city: 'tokyo', days: 4 },
      { city: 'hakone', days: 1 },
      { city: 'kyoto', days: 3 },
      { city: 'nara', days: 1 },
      { city: 'osaka', days: numDays - 9 }
    ];
  } else if (numDays <= 14) {
    cityPlan = [
      { city: 'tokyo', days: 4 },
      { city: 'hakone', days: 1 },
      { city: 'takayama', days: 1 },
      { city: 'kanazawa', days: 1 },
      { city: 'kyoto', days: 3 },
      { city: 'nara', days: 1 },
      { city: 'hiroshima', days: 2 },
      { city: 'osaka', days: numDays - 13 }
    ];
  } else if (numDays <= 21) {
    cityPlan = [
      { city: 'tokyo', days: 5 },
      { city: 'hakone', days: 2 },
      { city: 'takayama', days: 2 },
      { city: 'kanazawa', days: 2 },
      { city: 'kyoto', days: 4 },
      { city: 'nara', days: 1 },
      { city: 'hiroshima', days: 2 },
      { city: 'fukuoka', days: 2 },
      { city: 'osaka', days: numDays - 20 }
    ];
  } else {
    // 22 to 30 days: Grand Epic Tour
    cityPlan = [
      { city: 'tokyo', days: 6 },
      { city: 'hakone', days: 2 },
      { city: 'takayama', days: 2 },
      { city: 'kanazawa', days: 2 },
      { city: 'kyoto', days: 4 },
      { city: 'nara', days: 1 },
      { city: 'hiroshima', days: 2 },
      { city: 'fukuoka', days: 3 },
      { city: 'hokkaido', days: 4 },
      { city: 'osaka', days: numDays - 26 }
    ];
  }

  // Flatten cityPlan to daily array
  const dayCityMap = [];
  cityPlan.forEach(plan => {
    for (let i = 0; i < plan.days; i++) {
      if (dayCityMap.length < numDays) {
        dayCityMap.push(plan.city);
      }
    }
  });

  // Fill up if remaining
  while (dayCityMap.length < numDays) {
    dayCityMap.push('tokyo');
  }

  // Pre-calculate transit connections
  let totalTransitCostJPY = 0;
  let totalHotelCostJPY = 0;
  let totalFoodCostJPY = 0;
  let totalActivitiesCostJPY = 0;

  const budgetMultipliers = {
    budget: { hotel: 0.8, food: 2800, activity: 0.7 },
    mid: { hotel: 1.0, food: 6500, activity: 1.0 },
    luxury: { hotel: 2.2, food: 18000, activity: 1.5 }
  };

  const currentMultiplier = budgetMultipliers[budget] || budgetMultipliers.mid;

  for (let d = 0; d < numDays; d++) {
    const dayNum = d + 1;
    const currentCityKey = dayCityMap[d];
    const prevCityKey = d > 0 ? dayCityMap[d - 1] : null;
    const city = CITIES[currentCityKey] || CITIES.tokyo;

    // Check if city changed -> intercity travel hop
    let transitHop = null;
    if (prevCityKey && prevCityKey !== currentCityKey) {
      transitHop = getTransitHop(prevCityKey, currentCityKey);
      totalTransitCostJPY += transitHop.priceJPY;
    } else {
      // Local metro & buses
      const localDailyTransit = 900;
      totalTransitCostJPY += localDailyTransit;
    }

    // Select curated activities matching interests and pace
    const cityHighlights = [...city.highlights];
    
    // Sort or filter by user interests
    cityHighlights.sort((a, b) => {
      const aMatch = interests.includes(a.category) ? 1 : 0;
      const bMatch = interests.includes(b.category) ? 1 : 0;
      return bMatch - aMatch;
    });

    const spotsCount = pace === 'relaxed' ? 2 : pace === 'packed' ? 4 : 3;
    const selectedActivities = cityHighlights.slice(0, spotsCount).map(act => {
      totalActivitiesCostJPY += act.cost;
      return act;
    });

    // Hotel estimation for the night
    const hotelCost = Math.round(city.avgHotelPerNight[budget] * currentMultiplier.hotel);
    totalHotelCostJPY += hotelCost;

    // Food estimation for the day
    const dailyFood = currentMultiplier.food;
    totalFoodCostJPY += dailyFood;

    days.push({
      dayNumber: dayNum,
      cityKey: currentCityKey,
      cityName: city.name,
      cityKanji: city.kanji,
      region: city.region,
      heroImage: city.heroImage,
      tagline: city.tagline,
      coordinates: city.coordinates,
      transitHop,
      activities: selectedActivities,
      estimatedDailyCost: {
        hotelJPY: hotelCost,
        foodJPY: dailyFood,
        transitJPY: transitHop ? transitHop.priceJPY : 900,
        activitiesJPY: selectedActivities.reduce((acc, a) => acc + a.cost, 0)
      },
      insiderTip: getDailyInsiderTip(currentCityKey, dayNum)
    });
  }

  // Calculate Transit Pass Recommendation
  const passRecommendation = evaluateTransitPasses({
    numDays,
    cityList: dayCityMap,
    totalTransitCostJPY
  });

  const grandTotalPerPersonJPY = totalHotelCostJPY + totalTransitCostJPY + totalFoodCostJPY + totalActivitiesCostJPY;
  const grandTotalPerPersonUSD = Math.round(grandTotalPerPersonJPY / 149);

  return {
    summary: {
      durationDays: numDays,
      startingCity,
      pace,
      budget,
      travelers,
      uniqueCities: [...new Set(dayCityMap)].map(key => CITIES[key].name),
      totalHotelCostJPY: totalHotelCostJPY * travelers,
      totalTransitCostJPY: totalTransitCostJPY * travelers,
      totalFoodCostJPY: totalFoodCostJPY * travelers,
      totalActivitiesCostJPY: totalActivitiesCostJPY * travelers,
      grandTotalJPY: grandTotalPerPersonJPY * travelers,
      grandTotalUSD: grandTotalPerPersonUSD * travelers,
      dailyAverageJPY: Math.round(grandTotalPerPersonJPY / numDays),
      dailyAverageUSD: Math.round(grandTotalPerPersonUSD / numDays),
      passRecommendation
    },
    days
  };
}

// Transit Connections Helper
function getTransitHop(from, to) {
  const routes = {
    'tokyo-hakone': {
      mode: 'Odakyu Romancecar & Hakone Tozan Line',
      type: 'Scenic Express Train',
      duration: '1 hr 25 min',
      priceJPY: 2470,
      priceUSD: 17,
      icCardValid: true,
      tip: 'Book front-row observation deck seats on the GSE 70000 series Romancecar for panoramic mountain views.'
    },
    'hakone-tokyo': {
      mode: 'Hakone Tozan Railway & Shinkansen Kodama',
      type: 'Shinkansen Bullet Train',
      duration: '50 min from Odawara',
      priceJPY: 3500,
      priceUSD: 24,
      icCardValid: true,
      tip: 'Grab a Bento box at Odawara station before boarding.'
    },
    'hakone-kyoto': {
      mode: 'Hikari Shinkansen from Odawara to Kyoto',
      type: 'Shinkansen Bullet Train',
      duration: '2 hr 10 min',
      priceJPY: 12500,
      priceUSD: 84,
      icCardValid: false,
      tip: 'Sit on the RIGHT side (Seats D/E) leaving Odawara for a final glimpse of Mt. Fuji.'
    },
    'tokyo-kyoto': {
      mode: 'Tokaido Shinkansen (Nozomi / Hikari)',
      type: 'Shinkansen Bullet Train',
      duration: '2 hr 15 min',
      priceJPY: 14170,
      priceUSD: 95,
      icCardValid: false,
      tip: 'Reserve seats in Car 11 or 12 on the right-hand side (Seat E) for breathtaking views of Mount Fuji around Shin-Fuji station.'
    },
    'kyoto-nara': {
      mode: 'JR Miyakoji Rapid or Kintetsu Limited Express',
      type: 'Rapid Regional Train',
      duration: '45 min',
      priceJPY: 720,
      priceUSD: 5,
      icCardValid: true,
      tip: 'Kintetsu Nara Station is slightly closer to Nara Park and deer herds than JR Nara station.'
    },
    'nara-osaka': {
      mode: 'JR Yamatoji Rapid Line',
      type: 'Rapid Commuter Train',
      duration: '48 min to JR Namba',
      priceJPY: 570,
      priceUSD: 4,
      icCardValid: true,
      tip: 'Direct connection straight into Osaka nightlife districts without changing platforms.'
    },
    'kyoto-osaka': {
      mode: 'JR Special Rapid Service (Shin-Kaisoku)',
      type: 'High-speed commuter rail',
      duration: '29 min',
      priceJPY: 570,
      priceUSD: 4,
      icCardValid: true,
      tip: 'Runs every 15 minutes; no Shinkansen ticket needed for this short hop.'
    },
    'osaka-hiroshima': {
      mode: 'Sanyo Shinkansen (Nozomi / Sakura)',
      type: 'Shinkansen Bullet Train',
      duration: '1 hr 25 min',
      priceJPY: 10440,
      priceUSD: 70,
      icCardValid: false,
      tip: 'Catch the Hello Kitty Shinkansen (Kodama 849) if you love themed train cars!'
    },
    'hiroshima-osaka': {
      mode: 'Sanyo Shinkansen (Sakura / Nozomi)',
      type: 'Shinkansen Bullet Train',
      duration: '1 hr 25 min',
      priceJPY: 10440,
      priceUSD: 70,
      icCardValid: false,
      tip: 'Store large luggage in dedicated reservation spaces behind the last row of seats.'
    },
    'tokyo-takayama': {
      mode: 'Hokuriku Shinkansen to Toyama + JR Hida Wide View',
      type: 'Shinkansen & Scenic Alpine Express',
      duration: '4 hr 10 min',
      priceJPY: 15600,
      priceUSD: 105,
      icCardValid: false,
      tip: 'JR Hida train features panoramic floor-to-ceiling windows through deep mountain gorges.'
    },
    'takayama-kanazawa': {
      mode: 'Nohi Express Highway Bus via Shirakawa-go',
      type: 'Highway Scenic Bus',
      duration: '2 hr 15 min (with 3-hr stopover)',
      priceJPY: 3600,
      priceUSD: 24,
      icCardValid: false,
      tip: 'Store your luggage at Shirakawa-go bus terminal lockers while exploring the thatched village.'
    },
    'kanazawa-kyoto': {
      mode: 'Tsurugi Shinkansen to Tsuruga + Thunderbird Express',
      type: 'Shinkansen & Limited Express',
      duration: '2 hr 05 min',
      priceJPY: 8900,
      priceUSD: 60,
      icCardValid: false,
      tip: 'Smooth transfer at the brand-new Tsuruga Shinkansen elevated station.'
    },
    'hiroshima-fukuoka': {
      mode: 'Sanyo Shinkansen (Mizuho / Sakura)',
      type: 'Shinkansen Bullet Train',
      duration: '1 hr 05 min to Hakata',
      priceJPY: 9150,
      priceUSD: 61,
      icCardValid: false,
      tip: 'Sakura train cars have ultra-spacious 2x2 reserved seating comparable to Green Cars.'
    },
    'fukuoka-hokkaido': {
      mode: 'Domestic Flight (ANA / JAL Fukuoka to New Chitose)',
      type: 'Domestic Flight',
      duration: '2 hr 15 min',
      priceJPY: 9800,
      priceUSD: 66,
      icCardValid: false,
      tip: 'Much faster and cheaper than an 11-hour multi-train marathon.'
    },
    'hokkaido-tokyo': {
      mode: 'Domestic Flight (New Chitose to Haneda HND)',
      type: 'Domestic Flight',
      duration: '1 hr 35 min',
      priceJPY: 8500,
      priceUSD: 57,
      icCardValid: false,
      tip: 'Haneda Airport connects directly to central Tokyo via Tokyo Monorail or Keikyu Line in 15 minutes.'
    }
  };

  const key = `${from}-${to}`;
  if (routes[key]) {
    return { ...routes[key], from: CITIES[from].name, to: CITIES[to].name };
  }

  // Fallback generic Shinkansen / express
  return {
    mode: `JR Shinkansen / Limited Express (${CITIES[from]?.name} to ${CITIES[to]?.name})`,
    type: 'Intercity Rail',
    duration: '2 - 3 hrs',
    priceJPY: 11000,
    priceUSD: 74,
    icCardValid: false,
    tip: 'Book reserved seats online or via SmartEX / JR Midori-no-Madoguchi ticket machines.',
    from: CITIES[from]?.name || from,
    to: CITIES[to]?.name || to
  };
}

// Transit Pass Recommendation Logic
function evaluateTransitPasses({ numDays, cityList, totalTransitCostJPY }) {
  const hasHiroshima = cityList.includes('hiroshima');
  const hasKansai = cityList.includes('kyoto') || cityList.includes('osaka');
  const hasTokyo = cityList.includes('tokyo');

  if (hasKansai && hasHiroshima && !hasTokyo) {
    return {
      recommended: TRANSPORT_PASSES.regionalKansaiHiroshima,
      verdict: 'Buy the JR Kansai-Hiroshima Pass (Save ~¥12,000)',
      explanation: 'Since your itinerary focuses on Kansai and Hiroshima without round-trips to Tokyo, the 5-Day JR Kansai-Hiroshima Area Pass (¥17,000) provides unlimited bullet train rides at nearly half the price of individual tickets!',
      type: 'regional'
    };
  }

  if (numDays >= 7 && totalTransitCostJPY > 55000) {
    return {
      recommended: TRANSPORT_PASSES.jrPass7,
      verdict: 'Nationwide JR 7-Day Pass is Borderline / Situational',
      explanation: 'With the post-2023 price increase to ¥50,000, calculating point-to-point tickets via SmartEX plus an IC Card (Suica/Pasmo) is often cheaper and allows riding the fastest Nozomi trains without paying supplemental fees.',
      type: 'nationwide'
    };
  }

  return {
    recommended: TRANSPORT_PASSES.icCard,
    verdict: 'Best Strategy: Point-to-Point Shinkansen + Digital Suica/Pasmo',
    explanation: 'The most economical and flexible strategy for your route! Purchase individual Shinkansen tickets online via the SmartEX app (with early-bird discounts), and use a digital IC Card (Suica/Pasmo on Apple Wallet) for all local subways, buses, and konbini purchases.',
    type: 'ic_card'
  };
}

// Daily Insider Tips
function getDailyInsiderTip(cityKey, dayNum) {
  const tips = [
    'Always carry some physical cash (¥5,000 - ¥10,000); while major department stores take Visa/Mastercard, local ramen ticket machines and shrine donation boxes are cash only.',
    'Coin lockers are available at every major JR train station; use your IC card to lock and unlock them conveniently without carrying metal keys.',
    'Convenience store etiquette: 7-Eleven, Lawson, and FamilyMart offer hot food at the counter. Ask the clerk "Atatamemasu ka?" (Would you like it warmed up?).',
    'Escalator rule: Stand on the LEFT in Tokyo, but stand on the RIGHT in Osaka! Walk on the opposite side.',
    'Luggage forwarding (Takkyubin / Yamato Transport): Ship heavy suitcases between your hotels for ~¥2,200 each so you can travel hands-free on bullet trains.',
    'Tax-free shopping: Show your passport at stores displaying the Japan Tax-Free logo to save 10% on purchases over ¥5,000.',
    'Wi-Fi & Navigation: Google Maps provides pin-point train platform numbers and transfer carriage recommendations in Japan with remarkable accuracy.'
  ];
  return tips[(dayNum - 1) % tips.length];
}
