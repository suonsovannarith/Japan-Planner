import React, { useState } from 'react';
import { Train, Plane, Car, CreditCard, AlertTriangle, CheckCircle2, HelpCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { TRANSPORT_PASSES } from '../data/destinations';
import { formatDualPrice } from '../data/currency';

export default function TransportGuide({ itinerary, currency }) {
  const [activeCategory, setActiveCategory] = useState('trains');

  const categories = [
    { id: 'trains', label: 'Trains & Shinkansen', icon: Train, badge: 'Most Essential' },
    { id: 'planes', label: 'Domestic Flights', icon: Plane, badge: 'Long Distance' },
    { id: 'automobiles', label: 'Automobiles & Car Rental', icon: Car, badge: 'Scenic Alps/Rural' },
    { id: 'iccards', label: 'IC Cards & Transit Apps', icon: CreditCard, badge: 'Everyday Travel' },
  ];

  const formatPrice = (jpy) => {
    return formatDualPrice(jpy, currency).full;
  };


  const passVerdict = itinerary?.summary?.passRecommendation;

  return (
    <section id="transport-section" style={{ padding: '2rem 0 4rem 0' }}>
      <div className="container">

        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div className="badge badge-crimson" style={{ marginBottom: '0.5rem' }}>
            Trains, Planes & Automobiles
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', marginBottom: '0.5rem' }}>
            Japan Transit Master Guide
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '650px', margin: '0 auto', fontSize: '0.95rem' }}>
            Everything you need to navigate Japan seamlessly: bullet trains, scenic drives, domestic flights, and honest pass calculations.
          </p>
        </div>

        {/* Dynamic JR Pass Advice Banner for Current Itinerary */}
        {passVerdict && (
          <div className="glass-card" style={{
            padding: '1.5rem',
            marginBottom: '2rem',
            background: 'linear-gradient(135deg, rgba(230, 57, 70, 0.12), rgba(244, 162, 97, 0.08))',
            border: '1px solid rgba(230, 57, 70, 0.35)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem',
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: 'rgba(230, 57, 70, 0.25)',
              color: '#ff4d6d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Train size={22} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.3rem' }}>
                <span className="badge badge-gold">Smart Pass Verdict</span>
                <h4 style={{ fontSize: '1.15rem', fontWeight: '800' }}>
                  {passVerdict.verdict}
                </h4>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                {passVerdict.explanation}
              </p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                fontSize: '0.82rem',
                color: 'var(--text-primary)',
                flexWrap: 'wrap',
              }}>
                <span>Recommended: <strong>{passVerdict.recommended.name}</strong></span>
                <span>Cost: <strong style={{ color: 'var(--accent-gold)' }}>{formatPrice(passVerdict.recommended.priceJPY)}</strong></span>
              </div>
            </div>
          </div>
        )}

        {/* Category Filter Tabs */}
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem',
          marginBottom: '2rem',
        }}>
          {categories.map(cat => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="glass-card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '12px',
                  border: '1px solid',
                  borderColor: isActive ? 'var(--accent-crimson)' : 'var(--border-subtle)',
                  backgroundColor: isActive ? 'rgba(230, 57, 70, 0.15)' : 'var(--bg-surface-elevated)',
                  color: isActive ? '#fff' : 'var(--text-secondary)',
                  whiteSpace: 'nowrap',
                  fontWeight: isActive ? '700' : '500',
                  fontSize: '0.9rem',
                }}
              >
                <Icon size={18} style={{ color: isActive ? 'var(--accent-crimson)' : 'inherit' }} />
                <span>{cat.label}</span>
                <span className="badge badge-matcha" style={{ fontSize: '0.65rem' }}>{cat.badge}</span>
              </button>
            );
          })}
        </div>

        {/* Category Content */}
        {activeCategory === 'trains' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            
            {/* Shinkansen Bullet Train Breakdown */}
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                <Train size={22} style={{ color: 'var(--accent-crimson)' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>The Shinkansen (Bullet Train)</h3>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
                Reaching speeds over 320 km/h (200 mph), the Shinkansen is Japan's crown transit jewel. Clean, punctual to the second, and equipped with power outlets at every seat.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ background: 'var(--bg-surface-elevated)', padding: '0.75rem', borderRadius: '8px' }}>
                  <div style={{ fontWeight: '700', fontSize: '0.88rem', color: '#60a5fa' }}>Nozomi & Mizuho (Fastest)</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Stops only at major cities. Tokyo to Kyoto in 2h 15m. (Note: Nationwide JR Pass requires an additional upgrade fee).</div>
                </div>
                <div style={{ background: 'var(--bg-surface-elevated)', padding: '0.75rem', borderRadius: '8px' }}>
                  <div style={{ fontWeight: '700', fontSize: '0.88rem', color: '#34d399' }}>Hikari & Sakura (Standard Express)</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Fully included on JR Passes! Tokyo to Kyoto in 2h 40m. Exceptional speed and spacious seating.</div>
                </div>
                <div style={{ background: 'var(--bg-surface-elevated)', padding: '0.75rem', borderRadius: '8px' }}>
                  <div style={{ fontWeight: '700', fontSize: '0.88rem', color: '#fbbf24' }}>Kodama (All-Station Local)</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Stops at every station. Ideal for reaching Hakone (Odawara) or Shizuoka tea fields.</div>
                </div>
              </div>

              <div style={{
                background: 'rgba(230, 57, 70, 0.08)',
                border: '1px solid rgba(230, 57, 70, 0.2)',
                borderRadius: '8px',
                padding: '0.75rem',
                fontSize: '0.8rem',
                color: 'var(--accent-sakura)',
              }}>
                ⚠️ <strong>Oversized Luggage Rule:</strong> Suitcases where length + width + height total between 161cm and 250cm (about 28"+ check-in bags) REQUIRE a seat with reserved luggage area at the rear of the car!
              </div>
            </div>

            {/* SmartEX & Booking Advice */}
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                <ShieldCheck size={22} style={{ color: 'var(--accent-matcha)' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>SmartEX App: How to Book</h3>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
                Download the official <strong>SmartEX</strong> app (or use the English web portal) to book Tokaido/Sanyo/Kyushu Shinkansen tickets in advance with any international Visa or Mastercard.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--accent-matcha)' }} />
                  <span>Choose your exact seat (Pick Seat E for Mt. Fuji view!)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--accent-matcha)' }} />
                  <span>Link your ticket directly to your digital Suica/Pasmo IC card</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--accent-matcha)' }} />
                  <span>Hayatoku Early-Bird Discounts save up to ¥4,000 per ticket</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--accent-matcha)' }} />
                  <span>Change train times freely without cancellation fees before departure</span>
                </div>
              </div>

              <div style={{
                background: 'var(--bg-surface-elevated)',
                padding: '0.85rem',
                borderRadius: '8px',
                fontSize: '0.82rem',
                color: 'var(--text-secondary)',
              }}>
                🚄 <strong>Typical Prices (One-Way):</strong>
                <ul style={{ paddingLeft: '1.2rem', marginTop: '0.4rem', lineHeight: 1.6 }}>
                  <li>Tokyo ↔ Kyoto: ~¥14,170 (~$91 USD)</li>
                  <li>Tokyo ↔ Shin-Osaka: ~¥14,720 (~$95 USD)</li>
                  <li>Shin-Osaka ↔ Hiroshima: ~¥10,440 (~$67 USD)</li>
                </ul>
              </div>
            </div>

          </div>
        )}

        {activeCategory === 'planes' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                <Plane size={22} style={{ color: 'var(--accent-gold)' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>When Domestic Flights Win</h3>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                While the Shinkansen dominates the Golden Route (Tokyo-Kyoto-Osaka), domestic aviation is vastly superior for long-haul hops:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ background: 'var(--bg-surface-elevated)', padding: '0.85rem', borderRadius: '8px' }}>
                  <div style={{ fontWeight: '700', fontSize: '0.88rem', color: 'var(--text-primary)' }}>Tokyo (HND) ↔ Sapporo (CTS)</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Flight: 1 hr 35 min (~¥8,500) vs Train: 8 hrs with 2 transfers (~¥28,000). Flight wins unequivocally!</div>
                </div>
                <div style={{ background: 'var(--bg-surface-elevated)', padding: '0.85rem', borderRadius: '8px' }}>
                  <div style={{ fontWeight: '700', fontSize: '0.88rem', color: 'var(--text-primary)' }}>Tokyo (HND) ↔ Fukuoka (FUK)</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Flight: 2 hrs (~¥9,000) vs Shinkansen: 5 hrs (~¥23,000).</div>
                </div>
                <div style={{ background: 'var(--bg-surface-elevated)', padding: '0.85rem', borderRadius: '8px' }}>
                  <div style={{ fontWeight: '700', fontSize: '0.88rem', color: 'var(--text-primary)' }}>Honshu ↔ Okinawa (OKA)</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>No train exists! Flights take 2.5 - 3 hours.</div>
                </div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                <CreditCard size={22} style={{ color: 'var(--accent-indigo)' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Foreign Tourist Air Fares</h3>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Japan's premier airlines offer steep discounts exclusively to foreign passport holders entering on temporary visitor visas:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ border: '1px solid var(--border-subtle)', padding: '0.75rem', borderRadius: '8px' }}>
                  <div style={{ fontWeight: '700', fontSize: '0.88rem', color: 'var(--accent-gold)' }}>ANA Discover Japan Fare</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Includes 2 free 23kg checked bags, complimentary in-flight Wi-Fi, and priority boarding. From ¥5,500 - ¥11,000.</div>
                </div>
                <div style={{ border: '1px solid var(--border-subtle)', padding: '0.75rem', borderRadius: '8px' }}>
                  <div style={{ fontWeight: '700', fontSize: '0.88rem', color: 'var(--accent-crimson)' }}>JAL Japan Explorer Pass</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Flat rates starting at ¥7,700 for major regional connections throughout Tohoku and Kyushu.</div>
                </div>
              </div>

              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                ✈️ <strong>Low-Cost Carriers (LCCs):</strong> Peach Aviation and Jetstar Japan operate out of Tokyo Narita (NRT) Terminal 3 and Kansai (KIX) Terminal 2 with rock-bottom ¥4,000 base fares.
              </div>
            </div>

          </div>
        )}

        {activeCategory === 'automobiles' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                <Car size={22} style={{ color: 'var(--accent-matcha)' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Car Rental: Where & When</h3>
              </div>
              
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontWeight: '700', color: 'var(--accent-matcha)', marginBottom: '0.3rem', fontSize: '0.9rem' }}>
                  ✅ RENT A CAR FOR:
                </div>
                <ul style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  <li><strong>Mt. Fuji Five Lakes (Kawaguchiko):</strong> Freedom to chase Fuji viewpoints and lakeside sunrise spots without waiting for crowded tour buses.</li>
                  <li><strong>Hokkaido:</strong> Expansive distances, rolling lavender fields of Furano, and Cape Kamui coastal roads.</li>
                  <li><strong>The Japanese Alps:</strong> Driving between Takayama, Shirakawa-go, and Matsumoto castle.</li>
                </ul>
              </div>

              <div>
                <div style={{ fontWeight: '700', color: 'var(--accent-crimson)', marginBottom: '0.3rem', fontSize: '0.9rem' }}>
                  ❌ NEVER RENT A CAR IN:
                </div>
                <ul style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  <li><strong>Central Tokyo, Kyoto, Osaka:</strong> Severe gridlock, labyrinthine one-way alleys, and exorbitant parking fees (up to ¥3,000/hr). The metro is 10x faster.</li>
                </ul>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                <AlertTriangle size={22} style={{ color: 'var(--accent-crimson)' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Crucial Rules & Requirements</h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <div style={{ background: 'rgba(230, 57, 70, 0.08)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(230, 57, 70, 0.2)' }}>
                  <strong style={{ color: '#ff4d6d' }}>1. Physical IDP Booklet Required:</strong>
                  <div>You MUST obtain a 1949 Geneva Convention International Driving Permit (e.g. from AAA in USA) before flying. Digital PDFs or home licenses are strictly rejected by law.</div>
                </div>

                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>2. Drive on the LEFT:</strong>
                  <div>The steering wheel is on the right side of the car, and traffic flows on the left. The turn signal lever is on the right of the steering wheel!</div>
                </div>

                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>3. Zero Tolerance for Alcohol (0.00% BAC):</strong>
                  <div>Japan has a strict zero-tolerance drunk driving law. Even a single sip of beer will result in heavy criminal fines and deportation.</div>
                </div>

                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>4. ETC Toll Pass:</strong>
                  <div>Ask the rental car agency for an ETC card (Electronic Toll Collection) to drive through highway toll booths automatically.</div>
                </div>
              </div>
            </div>

          </div>
        )}

        {activeCategory === 'iccards' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                <CreditCard size={22} style={{ color: '#38bdf8' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>The Magical IC Card (Suica / Pasmo)</h3>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Your IC card (Suica, Pasmo, Icoca) is the Swiss Army knife of Japanese travel. One card works interchangeably across subways, JR trains, city buses, ferries, coin lockers, vending machines, and all convenience stores!
              </p>

              <div style={{
                background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.1), rgba(14, 165, 233, 0.05))',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '10px',
                padding: '1rem',
                marginBottom: '1rem',
              }}>
                <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#38bdf8', marginBottom: '0.4rem' }}>
                  📱 iPhone / Apple Wallet Setup (Instant):
                </div>
                <ol style={{ paddingLeft: '1.2rem', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  <li>Open the Apple Wallet app on your iPhone.</li>
                  <li>Tap the <strong>"+"</strong> button → Select <strong>Transit Card</strong>.</li>
                  <li>Search for <strong>"Suica"</strong> or <strong>"PASMO"</strong>.</li>
                  <li>Load ¥2,000 using your Apple Pay credit card (Mastercard/Amex work best).</li>
                  <li>Done! Tap your phone at the ticket gates with Express Transit enabled—no FaceID unlock required!</li>
                </ol>
              </div>

              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                🤖 <strong>Android Travelers:</strong> Non-Japanese Android phones cannot install Mobile Suica due to FeliCa chip restrictions. Purchase a physical <strong>Welcome Suica</strong> or <strong>PASMO PASSPORT</strong> at Narita or Haneda airports upon landing.
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                <HelpCircle size={22} style={{ color: 'var(--accent-gold)' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Taxis & Essential Travel Apps</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.25rem' }}>
                <div style={{ background: 'var(--bg-surface-elevated)', padding: '0.85rem', borderRadius: '8px' }}>
                  <div style={{ fontWeight: '700', fontSize: '0.88rem', color: 'var(--accent-gold)' }}>GO Taxi App</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>The most popular rideshare/taxi hailing app in Japan. Supports foreign phone numbers, English interface, and credit card payments.</div>
                </div>
                <div style={{ background: 'var(--bg-surface-elevated)', padding: '0.85rem', borderRadius: '8px' }}>
                  <div style={{ fontWeight: '700', fontSize: '0.88rem', color: 'var(--accent-matcha)' }}>Japan Travel by NAVITIME</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>The best route planner for filtering trains specifically covered by JR Passes and pinpointing elevator/luggage-friendly station exits.</div>
                </div>
                <div style={{ background: 'var(--bg-surface-elevated)', padding: '0.85rem', borderRadius: '8px' }}>
                  <div style={{ fontWeight: '700', fontSize: '0.88rem', color: '#a78bfa' }}>Google Translate (Camera Mode)</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Point your camera at Japanese menus, street signs, and laundry machine instructions for instant English translation.</div>
                </div>
              </div>

              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                🚕 <strong>Taxi Etiquette:</strong> Japanese taxi rear doors open and close automatically by the driver's pneumatic switch. Never pull or push the door yourself!
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
