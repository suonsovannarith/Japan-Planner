import { CITIES, TRANSPORT_PASSES } from './destinations.js';
import { JPY_PER_USD } from './currency.js';
import { AIRPORTS } from './arrivalLogistics.js';
import { CITY_TRANSIT_PROFILES, getIntercityTransitDetails } from './transitData.js';

const TIME_SLOT_ORDER = {
  morning: 1,
  afternoon: 2,
  evening: 3,
  night: 4,
  'full-day': 0
};

export function generateSmartItinerary({
  duration = 7,
  startingCity = 'tokyo',
  interests = ['culture', 'food', 'metropolis'],
  pace = 'balanced',
  budget = 'mid',
  travelers = 1,
  targetBudget = null, // Optional user target budget in JPY
  arrivalAirport = 'HND',
  arrivalTime = 'afternoon',
  needAirportHotel = false,
  selectedAirportHotel = null
}) {
  const numDays = Math.max(3, Math.min(30, Number(duration)));
  const days = [];

  // Determine city distribution based on days and the selected starting point
  let cityPlan = getDynamicCityPlan(numDays, startingCity);

  // Flatten cityPlan to daily array
  const dayCityMap = [];
  cityPlan.forEach(plan => {
    for (let i = 0; i < plan.days; i++) {
      if (dayCityMap.length < numDays) {
        dayCityMap.push(plan.city);
      }
    }
  });

  // Fill up if remaining with the starting city or logical hub
  while (dayCityMap.length < numDays) {
    dayCityMap.push(startingCity);
  }

  // Cost tracking
  let totalTransitCostJPY = 0;
  let totalHotelCostJPY = 0;
  let totalFoodCostJPY = 0;
  let totalActivitiesCostJPY = 0;

  const budgetMultipliers = {
    budget: { hotel: 0.8, food: 3200, activity: 0.7 },
    mid: { hotel: 1.0, food: 7200, activity: 1.0 },
    luxury: { hotel: 2.2, food: 19500, activity: 1.5 }
  };

  const currentMultiplier = budgetMultipliers[budget] || budgetMultipliers.mid;

  for (let d = 0; d < numDays; d++) {
    const dayNum = d + 1;
    const currentCityKey = dayCityMap[d];
    const prevCityKey = d > 0 ? dayCityMap[d - 1] : null;
    const city = CITIES[currentCityKey] || CITIES[startingCity] || CITIES.tokyo;

    // Check if city changed -> intercity travel hop
    let transitHop = null;
    if (prevCityKey && prevCityKey !== currentCityKey) {
      transitHop = getTransitHop(prevCityKey, currentCityKey);
      totalTransitCostJPY += transitHop.priceJPY;
    } else {
      // Local metro & buses
      const localDailyTransit = 950;
      totalTransitCostJPY += localDailyTransit;
    }

    let selectedActivities = [];

    // DAY 1 CALIBRATION: If arriving in Evening or Late Night
    const isLateArrival = (arrivalTime === 'evening' || arrivalTime === 'late-night');
    if (d === 0 && isLateArrival) {
      const airportObj = AIRPORTS.find(a => a.id === arrivalAirport) || AIRPORTS[0];
      const hotelStay = selectedAirportHotel || (airportObj.hotels && airportObj.hotels[0]);

      if (needAirportHotel) {
        selectedActivities = [
          {
            name: `Touchdown at ${airportObj.code} & Airport Customs`,
            kanji: '到着 / 入国審査',
            category: 'metropolis',
            timeSlot: 'afternoon',
            duration: '1.5 hrs',
            cost: 0,
            description: `Clear immigration at ${airportObj.name}. Pick up your physical Welcome Suica/Pasmo IC card and pocket WiFi router at the terminal arrivals hall counter.`,
            tip: 'Use the 7-Bank ATM in the terminal to withdraw yen with no foreign transaction fee.'
          },
          {
            name: `Check-in at ${hotelStay.name}`,
            kanji: '空港ホテル チェックイン',
            category: 'metropolis',
            timeSlot: 'evening',
            duration: '1 hr',
            cost: 0,
            description: `${hotelStay.type} (${hotelStay.badge}). Settle in, take a hot shower, and unwind with zero train commuting stress on night 1.`,
            tip: hotelStay.tip || 'Rest up early so you can catch the morning express train into central Japan.'
          },
          {
            name: 'Late-Night Japanese Conbini Run & Ramen',
            kanji: 'コンビニ探訪 & ラーメン',
            category: 'food',
            timeSlot: 'evening',
            duration: '1.5 hrs',
            cost: 1400,
            description: 'Experience your first Japanese convenience store (7-Eleven / Lawson / FamilyMart). Grab egg salad sandwiches, onigiri rice balls, hot fried chicken, and a steaming bowl of airport ramen.',
            tip: 'Try Pocari Sweat or chilled green tea to rehydrate after pressurized aircraft cabin air.'
          }
        ];
      } else {
        selectedActivities = [
          {
            name: `Arrival at ${airportObj.code} & Express Transit into ${city.name}`,
            kanji: '空港到着 & 特急アクセス',
            category: 'metropolis',
            timeSlot: 'afternoon',
            duration: '2 hrs',
            cost: 0,
            description: `Touch down at ${airportObj.name}. Clear customs, retrieve pocket WiFi / e-SIM, and board the ${airportObj.transferSummary} into ${city.name}.`,
            tip: `${airportObj.icCardPickup}. Pick up your IC card right outside the terminal gates.`
          },
          {
            name: `${city.name} Hotel Check-In & Luggage Drop`,
            kanji: 'ホテル チェックイン',
            category: 'metropolis',
            timeSlot: 'evening',
            duration: '1 hr',
            cost: 0,
            description: `Check into your accommodation in ${city.name}. Freshen up with a hot shower and drop your bags before heading out for a relaxing neighborhood stroll.`,
            tip: 'Most Japanese hotels provide fresh yukata / pajamas and slippers in the room.'
          },
          {
            name: 'Japanese Convenience Store Run & Welcome Dinner',
            kanji: 'コンビニ探訪 & 歓迎夕食',
            category: 'food',
            timeSlot: 'evening',
            duration: '2 hrs',
            cost: 2200,
            description: 'Explore a local Japanese convenience store for iconic snacks and drinks, followed by a cozy neighborhood ramen shop or casual yakitori izakaya near your hotel.',
            tip: 'Keep Day 1 light and relaxing to recover from jet lag so you can start Day 2 early and fully energized.'
          }
        ];
      }
    } else {
      // Standard selection: curated activities matching interests and pace
      const cityHighlights = [...city.highlights];
      
      // Sort or filter by user interests
      cityHighlights.sort((a, b) => {
        const aMatch = interests.includes(a.category) ? 1 : 0;
        const bMatch = interests.includes(b.category) ? 1 : 0;
        return bMatch - aMatch;
      });

      const spotsCount = pace === 'relaxed' ? 2 : pace === 'packed' ? 4 : 3;

      // Group city highlights by time slot to balance the day
      const morningPool = cityHighlights.filter(h => h.timeSlot === 'morning');
      const afternoonPool = cityHighlights.filter(h => h.timeSlot === 'afternoon');
      const eveningPool = cityHighlights.filter(h => h.timeSlot === 'evening');

      const picks = [];
      if (spotsCount === 2) {
        if (morningPool.length > 0) picks.push(morningPool[0]);
        else if (afternoonPool.length > 0) picks.push(afternoonPool[0]);
        if (eveningPool.length > 0) picks.push(eveningPool[0]);
        else if (afternoonPool.length > 1) picks.push(afternoonPool[1]);
      } else if (spotsCount === 3) {
        if (morningPool.length > 0) picks.push(morningPool[0]);
        if (afternoonPool.length > 0) picks.push(afternoonPool[0]);
        if (eveningPool.length > 0) picks.push(eveningPool[0]);
      } else {
        // 4 spots
        if (morningPool.length > 0) picks.push(morningPool[0]);
        if (afternoonPool.length > 0) picks.push(afternoonPool[0]);
        if (afternoonPool.length > 1) picks.push(afternoonPool[1]);
        if (eveningPool.length > 0) picks.push(eveningPool[0]);
      }

      // If any pool was empty, fill from remaining sorted highlights
      if (picks.length < spotsCount) {
        for (const h of cityHighlights) {
          if (!picks.some(p => p.name === h.name)) {
            picks.push(h);
            if (picks.length >= spotsCount) break;
          }
        }
      }

      selectedActivities = picks.slice(0, spotsCount);
    }

    // STRICT CHRONOLOGICAL ORDER ENFORCEMENT: Morning -> Afternoon -> Evening -> Night
    selectedActivities.sort((a, b) => {
      const orderA = TIME_SLOT_ORDER[a.timeSlot] || 2;
      const orderB = TIME_SLOT_ORDER[b.timeSlot] || 2;
      return orderA - orderB;
    });

    selectedActivities.forEach(act => {
      totalActivitiesCostJPY += act.cost;
    });

    // Hotel estimation for the night
    const hotelCost = Math.round(city.avgHotelPerNight[budget] * currentMultiplier.hotel);
    totalHotelCostJPY += hotelCost;

    // Food estimation for the day
    const dailyFood = currentMultiplier.food;
    totalFoodCostJPY += dailyFood;

    // Multi-modal transit details for this day
    const multimodalTransit = transitHop
      ? getIntercityTransitDetails(prevCityKey, currentCityKey)
      : (CITY_TRANSIT_PROFILES[currentCityKey] || CITY_TRANSIT_PROFILES.tokyo);

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
      multimodalTransit,
      isArrivalCalibrated: d === 0 && isLateArrival,
      arrivalAirport,
      arrivalTime,
      needAirportHotel,
      activities: selectedActivities,
      estimatedDailyCost: {
        hotelJPY: hotelCost,
        foodJPY: dailyFood,
        transitJPY: transitHop ? transitHop.priceJPY : 950,
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
  const grandTotalPerPersonUSD = Math.round(grandTotalPerPersonJPY / JPY_PER_USD);

  const grandTotalJPY = grandTotalPerPersonJPY * travelers;
  const grandTotalUSD = grandTotalPerPersonUSD * travelers;

  // Budget Variance Analysis (Target vs Calculated)
  let budgetAnalysis = null;
  if (targetBudget && targetBudget > 0) {
    const diffJPY = targetBudget - grandTotalJPY;
    const diffUSD = Math.round(diffJPY / JPY_PER_USD);
    const percentUsed = Math.round((grandTotalJPY / targetBudget) * 100);
    const status = diffJPY >= 0 ? 'under' : 'over';
    
    budgetAnalysis = {
      targetBudgetJPY: targetBudget,
      targetBudgetUSD: Math.round(targetBudget / JPY_PER_USD),
      calculatedJPY: grandTotalJPY,
      calculatedUSD: grandTotalUSD,
      diffJPY,
      diffUSD,
      percentUsed,
      status, // 'under' | 'over'
      bufferMessage: diffJPY >= 0
        ? `Within Budget: +¥${diffJPY.toLocaleString()} (~$${diffUSD.toLocaleString()} USD) safety buffer (${percentUsed}% used)`
        : `Over Target by ¥${Math.abs(diffJPY).toLocaleString()} (~$${Math.abs(diffUSD).toLocaleString()} USD) (${percentUsed}% of target)`
    };
  }

  return {
    summary: {
      durationDays: numDays,
      startingCity,
      startingCityName: CITIES[startingCity]?.name || 'Tokyo',
      pace,
      budget,
      travelers,
      uniqueCities: [...new Set(dayCityMap)].map(key => CITIES[key]?.name || key),
      totalHotelCostJPY: totalHotelCostJPY * travelers,
      totalTransitCostJPY: totalTransitCostJPY * travelers,
      totalFoodCostJPY: totalFoodCostJPY * travelers,
      totalActivitiesCostJPY: totalActivitiesCostJPY * travelers,
      grandTotalJPY,
      grandTotalUSD,
      dailyAverageJPY: Math.round(grandTotalPerPersonJPY / numDays),
      dailyAverageUSD: Math.round(grandTotalPerPersonUSD / numDays),
      passRecommendation,
      budgetAnalysis
    },
    days
  };
}

// Generate itinerary route specifically starting from the selected hub
function getDynamicCityPlan(numDays, startingCity) {
  if (startingCity === 'osaka') {
    if (numDays <= 4) {
      return [
        { city: 'osaka', days: Math.max(2, numDays - 2) },
        { city: 'kyoto', days: 1 },
        { city: 'nara', days: 1 }
      ];
    }
    if (numDays <= 7) {
      return [
        { city: 'osaka', days: 2 },
        { city: 'kyoto', days: 2 },
        { city: 'nara', days: 1 },
        { city: 'hiroshima', days: numDays - 5 }
      ];
    }
    if (numDays <= 10) {
      return [
        { city: 'osaka', days: 2 },
        { city: 'kyoto', days: 2 },
        { city: 'nara', days: 1 },
        { city: 'hiroshima', days: 2 },
        { city: 'tokyo', days: numDays - 7 }
      ];
    }
    if (numDays <= 14) {
      return [
        { city: 'osaka', days: 2 },
        { city: 'kyoto', days: 3 },
        { city: 'nara', days: 1 },
        { city: 'hiroshima', days: 2 },
        { city: 'kanazawa', days: 1 },
        { city: 'takayama', days: 1 },
        { city: 'tokyo', days: numDays - 10 }
      ];
    }
    return [
      { city: 'osaka', days: 3 },
      { city: 'kyoto', days: 4 },
      { city: 'nara', days: 1 },
      { city: 'hiroshima', days: 2 },
      { city: 'fukuoka', days: 2 },
      { city: 'kanazawa', days: 2 },
      { city: 'takayama', days: 2 },
      { city: 'hakone', days: 2 },
      { city: 'tokyo', days: numDays - 18 }
    ];
  }

  if (startingCity === 'kyoto') {
    if (numDays <= 4) {
      return [
        { city: 'kyoto', days: 2 },
        { city: 'nara', days: 1 },
        { city: 'osaka', days: numDays - 3 }
      ];
    }
    if (numDays <= 7) {
      return [
        { city: 'kyoto', days: 3 },
        { city: 'nara', days: 1 },
        { city: 'osaka', days: 2 },
        { city: 'hiroshima', days: numDays - 6 }
      ];
    }
    if (numDays <= 14) {
      return [
        { city: 'kyoto', days: 3 },
        { city: 'nara', days: 1 },
        { city: 'osaka', days: 2 },
        { city: 'hiroshima', days: 2 },
        { city: 'kanazawa', days: 1 },
        { city: 'takayama', days: 1 },
        { city: 'tokyo', days: numDays - 10 }
      ];
    }
    return [
      { city: 'kyoto', days: 4 },
      { city: 'nara', days: 1 },
      { city: 'osaka', days: 3 },
      { city: 'hiroshima', days: 2 },
      { city: 'fukuoka', days: 2 },
      { city: 'kanazawa', days: 2 },
      { city: 'takayama', days: 2 },
      { city: 'tokyo', days: numDays - 16 }
    ];
  }

  if (startingCity === 'fukuoka') {
    if (numDays <= 4) {
      return [
        { city: 'fukuoka', days: 2 },
        { city: 'hiroshima', days: numDays - 2 }
      ];
    }
    if (numDays <= 7) {
      return [
        { city: 'fukuoka', days: 2 },
        { city: 'hiroshima', days: 2 },
        { city: 'osaka', days: 2 },
        { city: 'kyoto', days: numDays - 6 }
      ];
    }
    if (numDays <= 14) {
      return [
        { city: 'fukuoka', days: 2 },
        { city: 'hiroshima', days: 2 },
        { city: 'osaka', days: 2 },
        { city: 'kyoto', days: 3 },
        { city: 'nara', days: 1 },
        { city: 'tokyo', days: numDays - 10 }
      ];
    }
    return [
      { city: 'fukuoka', days: 3 },
      { city: 'hiroshima', days: 2 },
      { city: 'osaka', days: 3 },
      { city: 'kyoto', days: 4 },
      { city: 'nara', days: 1 },
      { city: 'kanazawa', days: 2 },
      { city: 'tokyo', days: numDays - 15 }
    ];
  }

  if (startingCity === 'hokkaido') {
    if (numDays <= 4) {
      return [
        { city: 'hokkaido', days: 3 },
        { city: 'tokyo', days: numDays - 3 }
      ];
    }
    if (numDays <= 7) {
      return [
        { city: 'hokkaido', days: 3 },
        { city: 'tokyo', days: 3 },
        { city: 'hakone', days: numDays - 6 }
      ];
    }
    if (numDays <= 14) {
      return [
        { city: 'hokkaido', days: 3 },
        { city: 'tokyo', days: 4 },
        { city: 'hakone', days: 1 },
        { city: 'kyoto', days: 3 },
        { city: 'nara', days: 1 },
        { city: 'osaka', days: numDays - 12 }
      ];
    }
    return [
      { city: 'hokkaido', days: 4 },
      { city: 'tokyo', days: 5 },
      { city: 'hakone', days: 2 },
      { city: 'kanazawa', days: 2 },
      { city: 'kyoto', days: 4 },
      { city: 'nara', days: 1 },
      { city: 'osaka', days: numDays - 18 }
    ];
  }

  // Default: Tokyo Starting Point
  if (numDays <= 4) {
    return [
      { city: 'tokyo', days: Math.max(2, numDays - 1) },
      { city: 'hakone', days: 1 }
    ];
  }
  if (numDays <= 7) {
    return [
      { city: 'tokyo', days: 3 },
      { city: 'hakone', days: 1 },
      { city: 'kyoto', days: 2 },
      { city: 'osaka', days: numDays - 6 }
    ];
  }
  if (numDays <= 10) {
    return [
      { city: 'tokyo', days: 4 },
      { city: 'hakone', days: 1 },
      { city: 'kyoto', days: 3 },
      { city: 'nara', days: 1 },
      { city: 'osaka', days: numDays - 9 }
    ];
  }
  if (numDays <= 14) {
    return [
      { city: 'tokyo', days: 4 },
      { city: 'hakone', days: 1 },
      { city: 'takayama', days: 1 },
      { city: 'kanazawa', days: 1 },
      { city: 'kyoto', days: 3 },
      { city: 'nara', days: 1 },
      { city: 'hiroshima', days: 2 },
      { city: 'osaka', days: numDays - 13 }
    ];
  }
  if (numDays <= 21) {
    return [
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
  }

  // 22 to 30 days: Grand Epic Tour
  return [
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

// Transit Connections Helper with full bi-directional support
function getTransitHop(from, to) {
  const routes = {
    // Tokyo ↔ Hakone
    'tokyo-hakone': {
      mode: 'Odakyu Romancecar & Hakone Tozan Line',
      type: 'Scenic Express Train',
      duration: '1 hr 25 min',
      priceJPY: 2470,
      priceUSD: Math.round(2470 / JPY_PER_USD),
      icCardValid: true,
      tip: 'Book front-row observation deck seats on the GSE 70000 series Romancecar for panoramic mountain views.'
    },
    'hakone-tokyo': {
      mode: 'Hakone Tozan Railway & Shinkansen Kodama',
      type: 'Shinkansen Bullet Train',
      duration: '50 min from Odawara',
      priceJPY: 3500,
      priceUSD: Math.round(3500 / JPY_PER_USD),
      icCardValid: true,
      tip: 'Grab an ekiben bento box at Odawara station before boarding.'
    },

    // Tokyo ↔ Kyoto
    'tokyo-kyoto': {
      mode: 'Tokaido Shinkansen (Nozomi / Hikari)',
      type: 'Shinkansen Bullet Train',
      duration: '2 hr 15 min',
      priceJPY: 14170,
      priceUSD: Math.round(14170 / JPY_PER_USD),
      icCardValid: false,
      tip: 'Reserve Seat E on the right-hand side for breathtaking views of Mount Fuji around Shin-Fuji station.'
    },
    'kyoto-tokyo': {
      mode: 'Tokaido Shinkansen (Nozomi / Hikari)',
      type: 'Shinkansen Bullet Train',
      duration: '2 hr 15 min',
      priceJPY: 14170,
      priceUSD: Math.round(14170 / JPY_PER_USD),
      icCardValid: false,
      tip: 'Reserve Seat A on the left-hand side leaving Kyoto for Mount Fuji vistas.'
    },

    // Tokyo ↔ Osaka
    'tokyo-osaka': {
      mode: 'Tokaido Shinkansen (Nozomi)',
      type: 'Shinkansen Bullet Train',
      duration: '2 hr 25 min',
      priceJPY: 14720,
      priceUSD: Math.round(14720 / JPY_PER_USD),
      icCardValid: false,
      tip: 'Non-stop high speed connection directly into Shin-Osaka station.'
    },
    'osaka-tokyo': {
      mode: 'Tokaido Shinkansen (Nozomi)',
      type: 'Shinkansen Bullet Train',
      duration: '2 hr 25 min',
      priceJPY: 14720,
      priceUSD: Math.round(14720 / JPY_PER_USD),
      icCardValid: false,
      tip: 'Depart from Shin-Osaka station; arrives at Tokyo Station in the heart of Marunouchi.'
    },

    // Hakone ↔ Kyoto
    'hakone-kyoto': {
      mode: 'Hikari Shinkansen from Odawara to Kyoto',
      type: 'Shinkansen Bullet Train',
      duration: '2 hr 10 min',
      priceJPY: 12500,
      priceUSD: Math.round(12500 / JPY_PER_USD),
      icCardValid: false,
      tip: 'Sit on the RIGHT side (Seats D/E) leaving Odawara for a final glimpse of Mt. Fuji.'
    },

    // Kyoto ↔ Nara
    'kyoto-nara': {
      mode: 'JR Miyakoji Rapid or Kintetsu Limited Express',
      type: 'Rapid Regional Train',
      duration: '45 min',
      priceJPY: 720,
      priceUSD: Math.round(720 / JPY_PER_USD),
      icCardValid: true,
      tip: 'Kintetsu Nara Station is slightly closer to Nara Park and the bowing deer than JR Nara station.'
    },
    'nara-kyoto': {
      mode: 'JR Miyakoji Rapid Line',
      type: 'Rapid Regional Train',
      duration: '45 min',
      priceJPY: 720,
      priceUSD: Math.round(720 / JPY_PER_USD),
      icCardValid: true,
      tip: 'Frequent departures every 30 minutes; direct line into Kyoto Station central platforms.'
    },

    // Nara ↔ Osaka
    'nara-osaka': {
      mode: 'JR Yamatoji Rapid Line',
      type: 'Rapid Commuter Train',
      duration: '48 min to JR Namba',
      priceJPY: 570,
      priceUSD: Math.round(570 / JPY_PER_USD),
      icCardValid: true,
      tip: 'Direct connection straight into Osaka nightlife and street food districts without changing platforms.'
    },
    'osaka-nara': {
      mode: 'JR Yamatoji Rapid Line',
      type: 'Rapid Commuter Train',
      duration: '48 min from JR Namba',
      priceJPY: 570,
      priceUSD: Math.round(570 / JPY_PER_USD),
      icCardValid: true,
      tip: 'Board at JR Namba or Osaka Station for a smooth direct journey.'
    },

    // Kyoto ↔ Osaka
    'kyoto-osaka': {
      mode: 'JR Special Rapid Service (Shin-Kaisoku)',
      type: 'High-speed commuter rail',
      duration: '29 min',
      priceJPY: 570,
      priceUSD: Math.round(570 / JPY_PER_USD),
      icCardValid: true,
      tip: 'Runs every 15 minutes; no expensive Shinkansen ticket needed for this rapid commuter hop.'
    },
    'osaka-kyoto': {
      mode: 'JR Special Rapid Service (Shin-Kaisoku)',
      type: 'High-speed commuter rail',
      duration: '29 min',
      priceJPY: 570,
      priceUSD: Math.round(570 / JPY_PER_USD),
      icCardValid: true,
      tip: 'Board at Osaka Station Track 8 or 9; tap your IC card (Suica/Pasmo/Icoca) at the gate.'
    },

    // Osaka ↔ Hiroshima
    'osaka-hiroshima': {
      mode: 'Sanyo Shinkansen (Nozomi / Sakura)',
      type: 'Shinkansen Bullet Train',
      duration: '1 hr 25 min',
      priceJPY: 10440,
      priceUSD: Math.round(10440 / JPY_PER_USD),
      icCardValid: false,
      tip: 'Catch the Hello Kitty Shinkansen (Kodama 849) if you love themed anime train cars!'
    },
    'hiroshima-osaka': {
      mode: 'Sanyo Shinkansen (Sakura / Nozomi)',
      type: 'Shinkansen Bullet Train',
      duration: '1 hr 25 min',
      priceJPY: 10440,
      priceUSD: Math.round(10440 / JPY_PER_USD),
      icCardValid: false,
      tip: 'Sakura train cars have extra-wide 2x2 seats comparable to Green Cars.'
    },

    // Hiroshima ↔ Kyoto
    'hiroshima-kyoto': {
      mode: 'Sanyo & Tokaido Shinkansen (Nozomi)',
      type: 'Shinkansen Bullet Train',
      duration: '1 hr 40 min',
      priceJPY: 11500,
      priceUSD: Math.round(11500 / JPY_PER_USD),
      icCardValid: false,
      tip: 'Direct bullet train connecting Hiroshima Peace Park to Kyoto Station without transfers.'
    },
    'kyoto-hiroshima': {
      mode: 'Tokaido & Sanyo Shinkansen (Nozomi)',
      type: 'Shinkansen Bullet Train',
      duration: '1 hr 40 min',
      priceJPY: 11500,
      priceUSD: Math.round(11500 / JPY_PER_USD),
      icCardValid: false,
      tip: 'Board direct Nozomi trains departing westbound toward Hakata.'
    },

    // Hiroshima ↔ Fukuoka (Hakata)
    'hiroshima-fukuoka': {
      mode: 'Sanyo Shinkansen (Mizuho / Sakura)',
      type: 'Shinkansen Bullet Train',
      duration: '1 hr 05 min to Hakata',
      priceJPY: 9150,
      priceUSD: Math.round(9150 / JPY_PER_USD),
      icCardValid: false,
      tip: 'Arrives directly at Hakata Station in central Fukuoka, steps away from Nakasu Yatai food stalls.'
    },
    'fukuoka-hiroshima': {
      mode: 'Sanyo Shinkansen (Mizuho / Sakura)',
      type: 'Shinkansen Bullet Train',
      duration: '1 hr 05 min',
      priceJPY: 9150,
      priceUSD: Math.round(9150 / JPY_PER_USD),
      icCardValid: false,
      tip: 'High-speed 300 km/h sprint across the Kanmon undersea railway tunnel.'
    },

    // Fukuoka ↔ Osaka
    'fukuoka-osaka': {
      mode: 'Sanyo Shinkansen (Nozomi / Mizuho)',
      type: 'Shinkansen Bullet Train',
      duration: '2 hr 28 min',
      priceJPY: 15600,
      priceUSD: Math.round(15600 / JPY_PER_USD),
      icCardValid: false,
      tip: 'Rapid direct Shinkansen connecting Kyushu island to Osaka Kansai.'
    },

    // Japanese Alps connections
    'tokyo-takayama': {
      mode: 'Hokuriku Shinkansen to Toyama + JR Hida Wide View',
      type: 'Shinkansen & Scenic Alpine Express',
      duration: '4 hr 10 min',
      priceJPY: 15600,
      priceUSD: Math.round(15600 / JPY_PER_USD),
      icCardValid: false,
      tip: 'JR Hida train features panoramic floor-to-ceiling windows through deep mountain gorges.'
    },
    'takayama-kanazawa': {
      mode: 'Nohi Express Highway Bus via Shirakawa-go',
      type: 'Highway Scenic Bus',
      duration: '2 hr 15 min (with 3-hr stopover)',
      priceJPY: 3600,
      priceUSD: Math.round(3600 / JPY_PER_USD),
      icCardValid: false,
      tip: 'Store luggage at Shirakawa-go bus terminal lockers while touring the thatched village.'
    },
    'kanazawa-kyoto': {
      mode: 'Tsurugi Shinkansen to Tsuruga + Thunderbird Express',
      type: 'Shinkansen & Limited Express',
      duration: '2 hr 05 min',
      priceJPY: 8900,
      priceUSD: Math.round(8900 / JPY_PER_USD),
      icCardValid: false,
      tip: 'Smooth same-platform transfer at the elevated Tsuruga Shinkansen station.'
    },
    'kanazawa-tokyo': {
      mode: 'Hokuriku Shinkansen (Kagayaki)',
      type: 'Shinkansen Bullet Train',
      duration: '2 hr 28 min',
      priceJPY: 14380,
      priceUSD: Math.round(14380 / JPY_PER_USD),
      icCardValid: false,
      tip: 'The fastest Shinkansen from the Sea of Japan coast straight into Tokyo Station.'
    },

    // Hokkaido flights
    'tokyo-hokkaido': {
      mode: 'Domestic Flight (Haneda HND to New Chitose CTS)',
      type: 'Domestic Flight',
      duration: '1 hr 35 min',
      priceJPY: 8500,
      priceUSD: Math.round(8500 / JPY_PER_USD),
      icCardValid: false,
      tip: 'Domestic flights are 6 hours faster than the multi-train rail marathon to Sapporo.'
    },
    'hokkaido-tokyo': {
      mode: 'Domestic Flight (New Chitose CTS to Haneda HND)',
      type: 'Domestic Flight',
      duration: '1 hr 35 min',
      priceJPY: 8500,
      priceUSD: Math.round(8500 / JPY_PER_USD),
      icCardValid: false,
      tip: 'Haneda Airport connects directly to central Tokyo via Tokyo Monorail or Keikyu Line in 15 minutes.'
    },
    'fukuoka-hokkaido': {
      mode: 'Domestic Flight (Fukuoka to New Chitose)',
      type: 'Domestic Flight',
      duration: '2 hr 15 min',
      priceJPY: 9800,
      priceUSD: Math.round(9800 / JPY_PER_USD),
      icCardValid: false,
      tip: 'Direct flight across the entire length of Japan.'
    }
  };

  const key = `${from}-${to}`;
  if (routes[key]) {
    return { ...routes[key], from: CITIES[from]?.name || from, to: CITIES[to]?.name || to };
  }

  // Fallback generic Shinkansen / express
  return {
    mode: `JR Shinkansen / Limited Express (${CITIES[from]?.name || from} to ${CITIES[to]?.name || to})`,
    type: 'Intercity Rail',
    duration: '2 - 3 hrs',
    priceJPY: 11000,
    priceUSD: Math.round(11000 / JPY_PER_USD),
    icCardValid: false,
    tip: 'Book reserved seats online via SmartEX or JR Midori-no-Madoguchi ticket counters.',
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
      verdict: 'Buy the JR Kansai-Hiroshima Pass (Save ~¥12,000 / ~$77 USD)',
      explanation: 'Since your itinerary focuses on Kansai and Hiroshima without round-trips to Tokyo, the 5-Day JR Kansai-Hiroshima Area Pass (¥17,000) provides unlimited bullet train rides at nearly half the price of individual tickets!',
      type: 'regional'
    };
  }

  if (numDays >= 7 && totalTransitCostJPY > 58000) {
    return {
      recommended: TRANSPORT_PASSES.jrPass7,
      verdict: 'Nationwide JR 7-Day Pass is Borderline / Situational',
      explanation: 'With the post-2023 price increase to ¥50,000 (~$322 USD), calculating point-to-point tickets via SmartEX plus an IC Card (Suica/Pasmo) is often cheaper and allows riding the fastest Nozomi trains without paying supplemental fees.',
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
    'Tax-free shopping: Show your physical passport at stores displaying the Japan Tax-Free logo to save 10% on purchases over ¥5,000.',
    'Wi-Fi & Navigation: Google Maps provides pin-point train platform numbers and transfer carriage recommendations in Japan with remarkable accuracy.'
  ];
  return tips[(dayNum - 1) % tips.length];
}
