import React from 'react';
import { DollarSign, PieChart, TrendingUp, Building, Train, Utensils, Ticket, Wifi, Sparkles } from 'lucide-react';

export default function CostBreakdown({ itinerary, currency, setCurrency }) {
  if (!itinerary || !itinerary.summary) {
    return null;
  }

  const { summary } = itinerary;
  const isUSD = currency === 'USD';
  const rate = 149; // 1 USD = 149 JPY

  const formatMoney = (jpy) => {
    if (isUSD) {
      return `$${Math.round(jpy / rate).toLocaleString()}`;
    }
    return `¥${Math.round(jpy).toLocaleString()}`;
  };

  // Additional estimate for Pocket WiFi / eSIM and Souvenir buffer
  const connectivityCostJPY = 3500 + (summary.durationDays * 400);
  const souvenirBufferJPY = 12000 * summary.travelers;

  const totalTripJPY = summary.grandTotalJPY + connectivityCostJPY + souvenirBufferJPY;
  const totalTripUSD = Math.round(totalTripJPY / rate);

  const categories = [
    {
      id: 'hotel',
      name: 'Accommodations & Hotels',
      jpy: summary.totalHotelCostJPY,
      icon: Building,
      color: '#3a86ff',
      desc: `${summary.durationDays - 1} nights across ${summary.uniqueCities.length} destinations`,
    },
    {
      id: 'transit',
      name: 'Bullet Trains & Local Transit',
      jpy: summary.totalTransitCostJPY,
      icon: Train,
      color: '#00b4d8',
      desc: 'Shinkansen hops, regional trains, and IC card metro fare',
    },
    {
      id: 'food',
      name: 'Food & Dining (Breakfast, Lunch & Dinner)',
      jpy: summary.totalFoodCostJPY,
      icon: Utensils,
      color: '#f4a261',
      desc: 'Ramen, sushi, izakaya dinners, street food & cafes',
    },
    {
      id: 'activities',
      name: 'Admissions & Experiences',
      jpy: summary.totalActivitiesCostJPY,
      icon: Ticket,
      color: '#e63946',
      desc: 'Temple entry, digital art museums, workshops & theme parks',
    },
    {
      id: 'connectivity',
      name: 'Connectivity & Miscellaneous Buffer',
      jpy: connectivityCostJPY + souvenirBufferJPY,
      icon: Wifi,
      color: '#2a9d8f',
      desc: 'Unlimited 5G eSIM / Pocket WiFi + souvenir shopping allowance',
    }
  ];

  return (
    <section id="budget-section" style={{ padding: '2rem 0 4rem 0' }}>
      <div className="container">

        {/* Section Heading */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2.5rem',
        }}>
          <div>
            <div className="badge badge-gold" style={{ marginBottom: '0.4rem' }}>
              Transparent Financial Planning
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', marginBottom: '0.3rem' }}>
              Estimated Trip Costs & Budget Breakdown
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Realistic cost breakdown based on <strong>{summary.durationDays} days</strong> for <strong>{summary.travelers} {summary.travelers === 1 ? 'traveler' : 'travelers'}</strong> in the <strong>{summary.budget.toUpperCase()}</strong> tier.
            </p>
          </div>

          {/* Currency Toggle */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'var(--bg-surface-elevated)',
            padding: '0.4rem',
            borderRadius: '10px',
            border: '1px solid var(--border-subtle)',
          }}>
            <button
              onClick={() => setCurrency('JPY')}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: currency === 'JPY' ? '700' : '500',
                backgroundColor: currency === 'JPY' ? 'var(--accent-crimson)' : 'transparent',
                color: currency === 'JPY' ? '#fff' : 'var(--text-secondary)',
              }}
            >
              ¥ JPY
            </button>
            <button
              onClick={() => setCurrency('USD')}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: currency === 'USD' ? '700' : '500',
                backgroundColor: currency === 'USD' ? 'var(--accent-crimson)' : 'transparent',
                color: currency === 'USD' ? '#fff' : 'var(--text-secondary)',
              }}
            >
              $ USD
            </button>
          </div>
        </div>

        {/* Top Summary Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem',
        }}>
          {/* Total Trip */}
          <div className="glass-card" style={{ padding: '1.5rem', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.3rem', fontWeight: '700' }}>
              Total Trip Budget ({summary.travelers} {summary.travelers === 1 ? 'Person' : 'People'})
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--accent-gold)', lineHeight: 1.1, marginBottom: '0.4rem' }}>
              {formatMoney(totalTripJPY)}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              All accommodation, transit, food, activities & connectivity
            </div>
          </div>

          {/* Daily Average Per Person */}
          <div className="glass-card" style={{ padding: '1.5rem', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.3rem', fontWeight: '700' }}>
              Average Cost / Person / Day
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1.1, marginBottom: '0.4rem' }}>
              {formatMoney(totalTripJPY / summary.travelers / summary.durationDays)}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Includes daily lodging share, 3 meals, subway and sightseeing
            </div>
          </div>

          {/* Total Transit */}
          <div className="glass-card" style={{ padding: '1.5rem', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.3rem', fontWeight: '700' }}>
              Total Transit Spend
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#60a5fa', lineHeight: 1.1, marginBottom: '0.4rem' }}>
              {formatMoney(summary.totalTransitCostJPY)}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Shinkansen bullet trains + IC card metro taps
            </div>
          </div>
        </div>

        {/* Visual Category Progress Bars */}
        <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '2.5rem', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>
              Budget Distribution by Category
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              1 USD ≈ {rate} JPY
            </span>
          </div>

          {/* Stacked Progress Bar */}
          <div style={{
            display: 'flex',
            height: '14px',
            borderRadius: '9999px',
            overflow: 'hidden',
            marginBottom: '1.75rem',
            backgroundColor: 'var(--bg-secondary)',
          }}>
            {categories.map(cat => {
              const pct = ((cat.jpy / totalTripJPY) * 100).toFixed(1);
              return (
                <div
                  key={cat.id}
                  style={{
                    width: `${pct}%`,
                    backgroundColor: cat.color,
                    transition: 'width 0.5s ease',
                  }}
                  title={`${cat.name}: ${pct}%`}
                />
              );
            })}
          </div>

          {/* Category List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {categories.map(cat => {
              const pct = Math.round((cat.jpy / totalTripJPY) * 100);
              const Icon = cat.icon;

              return (
                <div key={cat.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid var(--border-subtle)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      backgroundColor: `${cat.color}20`,
                      color: cat.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>
                        {cat.name}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {cat.desc}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                      {formatMoney(cat.jpy)}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {pct}% of trip total
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Money-Saving Insider Tips */}
        <div className="glass-card" style={{
          padding: '1.75rem',
          border: '1px solid rgba(42, 157, 143, 0.3)',
          background: 'linear-gradient(135deg, rgba(42, 157, 143, 0.08), rgba(0, 0, 0, 0))',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Sparkles size={20} style={{ color: 'var(--accent-matcha)' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>
              Smart Travel Money Secrets in Japan
            </h3>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
          }}>
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>🍱 The Evening Supermarket Discount ("Waribiki"):</strong>
              <p style={{ marginTop: '0.3rem', lineHeight: 1.5 }}>
                Department store basements (Depachika) and grocery stores place yellow discount stickers (20% to 50% off) on gourmet sashimi, sushi bento boxes, and wagyu after 7:30 PM.
              </p>
            </div>
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>🍜 Feast at Lunch, Casual at Dinner:</strong>
              <p style={{ marginTop: '0.3rem', lineHeight: 1.5 }}>
                Michelin-starred sushi, kaiseki, and teppanyaki restaurants frequently offer lunchtime set menus ("Teishoku") for ¥2,500 - ¥4,000 that cost over ¥18,000 at night!
              </p>
            </div>
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>🛍️ 10% Instant Tax-Free Shopping:</strong>
              <p style={{ marginTop: '0.3rem', lineHeight: 1.5 }}>
                Bring your physical passport! Any purchase exceeding ¥5,000 at Don Quijote, Bic Camera, Uniqlo, or souvenir stores receives an instant 10% consumption tax deduction at the cashier.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
