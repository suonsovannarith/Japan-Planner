import React, { useState } from 'react';
import { DollarSign, PieChart, TrendingUp, Building, Train, Utensils, Ticket, Wifi, Sparkles, Info, Wallet } from 'lucide-react';
import { formatDualPrice, JPY_PER_USD } from '../data/currency';

export default function CostBreakdown({ itinerary, currency = 'JPY', setCurrency }) {
  const [showTooltip, setShowTooltip] = useState(false);

  if (!itinerary || !itinerary.summary) {
    return null;
  }

  const { summary } = itinerary;

  // Additional estimate for Pocket WiFi / eSIM and Souvenir buffer
  const connectivityCostJPY = 3500 + (summary.durationDays * 400);
  const souvenirBufferJPY = 12000 * summary.travelers;

  const totalTripJPY = summary.grandTotalJPY + connectivityCostJPY + souvenirBufferJPY;
  const totalTripDual = formatDualPrice(totalTripJPY, currency);
  const dailyAverageDual = formatDualPrice(totalTripJPY / summary.travelers / summary.durationDays, currency);
  const totalTransitDual = formatDualPrice(summary.totalTransitCostJPY, currency);

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
      desc: 'Shinkansen bullet trains, regional rails & IC card metro taps',
    },
    {
      id: 'food',
      name: 'Food & Dining (Breakfast, Lunch & Dinner)',
      jpy: summary.totalFoodCostJPY,
      icon: Utensils,
      color: '#f4a261',
      desc: 'Ramen quests, fresh sushi, wagyu, izakaya dinners & street food',
    },
    {
      id: 'activities',
      name: 'Admissions & Sightseeing',
      jpy: summary.totalActivitiesCostJPY,
      icon: Ticket,
      color: '#e63946',
      desc: 'Temple entry, digital art museums, tea ceremonies & workshops',
    },
    {
      id: 'connectivity',
      name: 'Connectivity & Souvenir Allowance',
      jpy: connectivityCostJPY + souvenirBufferJPY,
      icon: Wifi,
      color: '#2a9d8f',
      desc: 'Unlimited 5G eSIM / Pocket WiFi + shopping buffer',
    }
  ];

  return (
    <section id="budget-section" style={{ padding: '2rem 0 5rem 0' }}>
      <div className="container" style={{ maxWidth: '1080px' }}>

        {/* Section Heading */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '1.25rem',
          marginBottom: '2.5rem',
        }}>
          <div>
            <div className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>
              Dual Currency Transparency (JPY + USD)
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: '800', marginBottom: '0.4rem' }}>
              Estimated Trip Costs & Budget Breakdown
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem' }}>
              Realistic cost breakdown for <strong>{summary.durationDays} days</strong> and <strong>{summary.travelers} {summary.travelers === 1 ? 'traveler' : 'travelers'}</strong> in the <strong>{summary.budget.toUpperCase()}</strong> tier.
            </p>
          </div>

          {/* Currency Toggle & Exchange Rate Info */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: 'var(--bg-surface-elevated)',
              padding: '0.35rem',
              borderRadius: '12px',
              border: '1px solid var(--border-subtle)',
            }}>
              <button
                type="button"
                onClick={() => setCurrency('JPY')}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: '9px',
                  fontSize: '0.85rem',
                  fontWeight: currency === 'JPY' ? '800' : '600',
                  backgroundColor: currency === 'JPY' ? 'var(--accent-crimson)' : 'transparent',
                  color: currency === 'JPY' ? '#fff' : 'var(--text-secondary)',
                  transition: 'all 0.2s ease',
                }}
              >
                ¥ JPY Focus
              </button>
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: '9px',
                  fontSize: '0.85rem',
                  fontWeight: currency === 'USD' ? '800' : '600',
                  backgroundColor: currency === 'USD' ? 'var(--accent-crimson)' : 'transparent',
                  color: currency === 'USD' ? '#fff' : 'var(--text-secondary)',
                  transition: 'all 0.2s ease',
                }}
              >
                $ USD Focus
              </button>
            </div>

            <div 
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', color: 'var(--text-muted)', cursor: 'pointer' }}
              onClick={() => setShowTooltip(!showTooltip)}
            >
              <Info size={13} />
              <span>Standard Rate: 1 USD ≈ {JPY_PER_USD} JPY</span>
            </div>
          </div>
        </div>

        {/* Target Budget Alignment Card */}
        {summary.budgetAnalysis && (
          <div className="glass-card" style={{
            padding: '1.5rem 1.75rem',
            marginBottom: '2rem',
            borderRadius: '20px',
            backgroundColor: summary.budgetAnalysis.status === 'under' 
              ? 'rgba(42, 157, 143, 0.08)' 
              : 'rgba(230, 57, 70, 0.08)',
            border: `1px solid ${summary.budgetAnalysis.status === 'under' ? 'rgba(42, 157, 143, 0.35)' : 'rgba(230, 57, 70, 0.35)'}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Wallet size={20} style={{ color: summary.budgetAnalysis.status === 'under' ? 'var(--accent-matcha)' : 'var(--accent-crimson)' }} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0 }}>
                  Target Budget vs. Calculated Trip Spend
                </h3>
              </div>
              <span className={`badge ${summary.budgetAnalysis.status === 'under' ? 'badge-matcha' : 'badge-crimson'}`} style={{ fontWeight: '800', fontSize: '0.85rem' }}>
                {summary.budgetAnalysis.status === 'under'
                  ? `✓ Within Budget (${summary.budgetAnalysis.percentUsed}% Allocated)`
                  : `⚠ Exceeds Budget (${summary.budgetAnalysis.percentUsed}% of Target)`}
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.25rem',
              marginBottom: '1.25rem',
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                  Target Budget ({summary.travelers} {summary.travelers === 1 ? 'Traveler' : 'Travelers'})
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {formatDualPrice(summary.budgetAnalysis.targetBudgetJPY, currency).full}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                  Base Trip Cost (Calculated)
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--accent-gold)' }}>
                  {formatDualPrice(summary.budgetAnalysis.calculatedJPY, currency).full}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                  {summary.budgetAnalysis.status === 'under' ? 'Safety Buffer' : 'Estimated Overage'}
                </div>
                <div style={{
                  fontSize: '1.35rem',
                  fontWeight: '800',
                  color: summary.budgetAnalysis.status === 'under' ? 'var(--accent-matcha)' : 'var(--accent-crimson)'
                }}>
                  {summary.budgetAnalysis.status === 'under' ? '+' : '-'}
                  {formatDualPrice(Math.abs(summary.budgetAnalysis.diffJPY), currency).full}
                </div>
              </div>
            </div>

            {/* Progress Meter Bar */}
            <div style={{ position: 'relative', width: '100%', marginBottom: '0.65rem' }}>
              <div style={{
                height: '10px',
                borderRadius: '999px',
                backgroundColor: 'var(--bg-secondary)',
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  width: `${Math.min(100, summary.budgetAnalysis.percentUsed)}%`,
                  backgroundColor: summary.budgetAnalysis.status === 'under'
                    ? (summary.budgetAnalysis.percentUsed > 85 ? 'var(--accent-gold)' : 'var(--accent-matcha)')
                    : 'var(--accent-crimson)',
                  borderRadius: '999px',
                  transition: 'width 0.5s ease',
                }} />
              </div>
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span>{summary.budgetAnalysis.bufferMessage}</span>
              <span>Based on hotels, transit, dining, and admission estimates</span>
            </div>
          </div>
        )}

        {/* Top 3 Dual-Currency Summary Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem',
        }}>
          {/* Total Trip Budget */}
          <div className="glass-card" style={{ padding: '1.75rem', border: '1px solid var(--border-subtle)', position: 'relative' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem', fontWeight: '800', letterSpacing: '0.04em' }}>
              Total Trip Budget ({summary.travelers} {summary.travelers === 1 ? 'Person' : 'People'})
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--accent-gold)', lineHeight: 1.1, marginBottom: '0.35rem' }}>
              {totalTripDual.primary}
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              {totalTripDual.secondary}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Complete all-inclusive estimate (lodging, transit, meals & sights)
            </div>
          </div>

          {/* Daily Average / Person */}
          <div className="glass-card" style={{ padding: '1.75rem', border: '1px solid var(--border-subtle)', position: 'relative' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem', fontWeight: '800', letterSpacing: '0.04em' }}>
              Daily Average / Person
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1.1, marginBottom: '0.35rem' }}>
              {dailyAverageDual.primary}
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              {dailyAverageDual.secondary}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Hotel share + 3 meals + metro & temple admissions
            </div>
          </div>

          {/* Total Transit Spend */}
          <div className="glass-card" style={{ padding: '1.75rem', border: '1px solid var(--border-subtle)', position: 'relative' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem', fontWeight: '800', letterSpacing: '0.04em' }}>
              Total Transit Spend
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#60a5fa', lineHeight: 1.1, marginBottom: '0.35rem' }}>
              {totalTransitDual.primary}
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              {totalTransitDual.secondary}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Shinkansen bullet trains + IC card metro & city buses
            </div>
          </div>
        </div>

        {/* Category Stacked Progress & Detailed List */}
        <div className="glass-card" style={{ padding: '2rem', marginBottom: '2.5rem', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800' }}>
              Budget Allocation by Category
            </h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Both JPY (¥) and USD ($) estimated at 1:155
            </span>
          </div>

          {/* Stacked Visual Bar */}
          <div style={{
            display: 'flex',
            height: '14px',
            borderRadius: '9999px',
            overflow: 'hidden',
            marginBottom: '2rem',
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
                    transition: 'width 0.4s ease',
                  }}
                  title={`${cat.name}: ${pct}%`}
                />
              );
            })}
          </div>

          {/* Category Rows with Prominent Dual Currencies */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
            {categories.map(cat => {
              const pct = Math.round((cat.jpy / totalTripJPY) * 100);
              const Icon = cat.icon;
              const catDual = formatDualPrice(cat.jpy, currency);

              return (
                <div key={cat.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  paddingBottom: '1.25rem',
                  borderBottom: '1px solid var(--border-subtle)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      backgroundColor: `${cat.color}20`,
                      color: cat.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <Icon size={22} />
                    </div>
                    <div>
                      <div style={{ fontWeight: '800', fontSize: '1.05rem' }}>
                        {cat.name}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        {cat.desc}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                      {catDual.primary}
                      <span className="dual-currency-sub" style={{ fontSize: '0.9rem', color: 'var(--accent-gold)' }}>
                        ({catDual.secondary})
                      </span>
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

        {/* Money-Saving Secrets in Japan */}
        <div className="glass-card" style={{
          padding: '2rem',
          border: '1px solid rgba(42, 157, 143, 0.35)',
          background: 'linear-gradient(135deg, rgba(42, 157, 143, 0.08), rgba(15, 20, 34, 0.8))',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <Sparkles size={22} style={{ color: 'var(--accent-matcha)' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>
              How to Maximize Your Yen in Japan
            </h3>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            fontSize: '0.88rem',
            color: 'var(--text-secondary)',
          }}>
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>🍱 The Supermarket "Waribiki" Discount:</strong>
              <p style={{ marginTop: '0.35rem', lineHeight: 1.6 }}>
                Grocery stores and department store basements (Depachika) place yellow discount stickers (20% to 50% off) on fresh sushi, sashimi bento boxes, and wagyu beef cuts every evening after 7:30 PM.
              </p>
            </div>
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>🍜 Feast at Lunch (Teishoku Sets):</strong>
              <p style={{ marginTop: '0.35rem', lineHeight: 1.6 }}>
                Top kaiseki and teppanyaki restaurants offer daytime lunch sets for ¥2,000 - ¥3,500 (~$13 - $22 USD) that feature the identical premium wagyu and fish costing over ¥18,000 (~$116 USD) for dinner!
              </p>
            </div>
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>🛍️ 10% Instant Tax-Free Shopping:</strong>
              <p style={{ marginTop: '0.35rem', lineHeight: 1.6 }}>
                Always carry your physical passport. When purchasing goods over ¥5,000 (~$32 USD) at stores like Don Quijote, Bic Camera, or Uniqlo, show your passport for an immediate 10% consumption tax deduction.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
