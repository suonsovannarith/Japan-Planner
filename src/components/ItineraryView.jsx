import React, { useState } from 'react';
import { 
  Calendar, Train, Clock, MapPin, DollarSign, Lightbulb, 
  CheckCircle, Bookmark, ExternalLink, ChevronDown, ChevronUp, Sparkles, 
  ArrowRight, Share2, Copy, Check, RotateCcw, Compass, Sun, Sunset, Moon, Ticket, Wallet
} from 'lucide-react';
import { formatDualPrice, JPY_PER_USD } from '../data/currency';

export default function ItineraryView({ 
  itinerary, 
  currency = 'JPY', 
  setCurrency,
  onViewCityOnMap, 
  onRestartCustomizer,
  onOpenExport 
}) {
  const [selectedDayFilter, setSelectedDayFilter] = useState('all');
  const [expandedDays, setExpandedDays] = useState({});
  const [completedActivities, setCompletedActivities] = useState({});
  const [copiedSummary, setCopiedSummary] = useState(false);

  if (!itinerary || !itinerary.days || itinerary.days.length === 0) {
    return null;
  }

  const toggleDayExpand = (dayNum) => {
    setExpandedDays(prev => ({
      ...prev,
      [dayNum]: prev[dayNum] === undefined ? false : !prev[dayNum]
    }));
  };

  const handleExpandAll = () => {
    const allExpanded = {};
    itinerary.days.forEach(d => { allExpanded[d.dayNumber] = true; });
    setExpandedDays(allExpanded);
  };

  const handleCollapseAll = () => {
    const allCollapsed = {};
    itinerary.days.forEach(d => { allCollapsed[d.dayNumber] = false; });
    setExpandedDays(allCollapsed);
  };

  const toggleActivityComplete = (actKey) => {
    setCompletedActivities(prev => ({
      ...prev,
      [actKey]: !prev[actKey]
    }));
  };

  const handleCopySummary = () => {
    let text = `🗾 ${itinerary.summary.durationDays}-Day Japan Itinerary (${itinerary.summary.uniqueCities.join(' → ')})\n`;
    text += `💰 Estimated Total: ${formatDualPrice(itinerary.summary.grandTotalJPY, currency).full}\n`;
    text += `⚡ Travel Pace: ${itinerary.summary.pace.toUpperCase()} | Budget: ${itinerary.summary.budget.toUpperCase()}\n\n`;

    itinerary.days.forEach(day => {
      text += `📅 DAY ${day.dayNumber}: ${day.cityName} (${day.cityKanji})\n`;
      if (day.transitHop) {
        text += `   🚄 Transit Hop: ${day.transitHop.mode} (${day.transitHop.duration}, ${formatDualPrice(day.transitHop.priceJPY, currency).full})\n`;
      }
      day.activities.forEach(act => {
        text += `   • [${act.timeSlot.toUpperCase()}] ${act.name}: ${act.description}\n`;
      });
      text += `   💡 Tip: ${day.insiderTip}\n\n`;
    });

    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  const filteredDays = selectedDayFilter === 'all' 
    ? itinerary.days 
    : itinerary.days.filter(d => d.dayNumber === Number(selectedDayFilter));

  const totalDual = formatDualPrice(itinerary.summary.grandTotalJPY, currency);
  const dailyDual = formatDualPrice(itinerary.summary.dailyAverageJPY, currency);

  // Time Slot Configuration with visual icons
  const slotConfig = {
    morning: { label: 'Morning', icon: Sun, color: '#f4a261', time: '09:00 - 12:30' },
    afternoon: { label: 'Afternoon', icon: Sunset, color: '#ff4d6d', time: '13:30 - 17:00' },
    evening: { label: 'Evening', icon: Moon, color: '#a78bfa', time: '18:00 - 21:30' },
    'full-day': { label: 'Full Day', icon: Sparkles, color: '#00b4d8', time: 'All Day Event' }
  };

  return (
    <section id="itinerary-section" style={{ padding: '2rem 0 5rem 0' }}>
      <div className="container" style={{ maxWidth: '1080px' }}>
        
        {/* ============================================================== */}
        {/* RESULTS OVERVIEW HEADER                                        */}
        {/* ============================================================== */}
        <div className="glass-card" style={{
          padding: 'clamp(1.5rem, 4vw, 2.5rem)',
          marginBottom: '2.5rem',
          border: '1px solid var(--border-subtle)',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, rgba(18, 24, 38, 0.95), rgba(25, 33, 52, 0.8))',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
        }}>
          {/* Top Tag & Route Flow */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <span className="badge badge-crimson" style={{ fontWeight: '800', letterSpacing: '0.05em' }}>
                Trip Route Tracker
              </span>
              <span className="badge badge-matcha" style={{ textTransform: 'capitalize' }}>
                {itinerary.summary.pace} Pace
              </span>
              <span className="badge badge-gold" style={{ textTransform: 'capitalize' }}>
                {itinerary.summary.budget} Tier
              </span>
            </div>

            {/* Currency Preference Indicator */}
            {setCurrency && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span>Primary Currency:</span>
                <button
                  onClick={() => setCurrency(currency === 'JPY' ? 'USD' : 'JPY')}
                  style={{
                    padding: '0.25rem 0.65rem',
                    borderRadius: '6px',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--accent-gold)',
                    fontWeight: '700',
                    cursor: 'pointer',
                  }}
                  title="Toggle primary currency display"
                >
                  {currency === 'JPY' ? '¥ JPY (Primary)' : '$ USD (Primary)'}
                </button>
              </div>
            )}
          </div>

          {/* Main Title & Route Traversal */}
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '0.6rem' }}>
            {itinerary.summary.durationDays}-Day Japan Expedition
          </h2>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            flexWrap: 'wrap',
            fontSize: '1rem',
            color: 'var(--text-primary)',
            fontWeight: '600',
            marginBottom: '1.75rem',
          }}>
            <MapPin size={18} style={{ color: 'var(--accent-crimson)', flexShrink: 0 }} />
            <span>Route:</span>
            {itinerary.summary.uniqueCities.map((city, idx) => (
              <React.Fragment key={city}>
                <span style={{ color: '#ff4d6d', fontWeight: '700' }}>{city}</span>
                {idx < itinerary.summary.uniqueCities.length - 1 && (
                  <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Summary Financial & Logistics Pills */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            padding: '1.25rem',
            borderRadius: '16px',
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '1.75rem',
          }}>
            <div>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '0.2rem' }}>
                Total Trip Budget ({itinerary.summary.travelers} {itinerary.summary.travelers === 1 ? 'Person' : 'People'})
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: '800', color: 'var(--accent-gold)' }}>
                {totalDual.primary}
                <span className="dual-currency-sub" style={{ color: 'var(--text-secondary)' }}>
                  {totalDual.secondary}
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                1 USD ≈ {JPY_PER_USD} JPY (All-inclusive estimate)
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '0.2rem' }}>
                Est. Daily Spend / Person
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                {dailyDual.primary}
                <span className="dual-currency-sub">
                  {dailyDual.secondary}
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Lodging share + 3 meals + transit + admissions
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '0.2rem' }}>
                Transit Strategy
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: '700', color: '#60a5fa', marginBottom: '0.15rem' }}>
                {itinerary.summary.passRecommendation.type === 'regional' ? 'Regional JR Pass' : 'Shinkansen + IC Card'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {itinerary.summary.passRecommendation.verdict}
              </div>
            </div>
          </div>

          {/* Target Budget Alignment Meter */}
          {itinerary.summary.budgetAnalysis && (
            <div style={{
              padding: '1.25rem 1.5rem',
              borderRadius: '16px',
              backgroundColor: itinerary.summary.budgetAnalysis.status === 'under' 
                ? 'rgba(42, 157, 143, 0.08)' 
                : 'rgba(230, 57, 70, 0.08)',
              border: `1px solid ${itinerary.summary.budgetAnalysis.status === 'under' ? 'rgba(42, 157, 143, 0.35)' : 'rgba(230, 57, 70, 0.35)'}`,
              marginBottom: '1.75rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.9rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Wallet size={19} style={{ color: itinerary.summary.budgetAnalysis.status === 'under' ? 'var(--accent-matcha)' : 'var(--accent-crimson)' }} />
                  <span style={{ fontWeight: '800', fontSize: '0.98rem' }}>
                    Target Budget Alignment
                  </span>
                </div>
                <span className={`badge ${itinerary.summary.budgetAnalysis.status === 'under' ? 'badge-matcha' : 'badge-crimson'}`} style={{ fontWeight: '800' }}>
                  {itinerary.summary.budgetAnalysis.status === 'under'
                    ? `✓ Within Budget (${itinerary.summary.budgetAnalysis.percentUsed}% Allocated)`
                    : `⚠ Exceeds Target (${itinerary.summary.budgetAnalysis.percentUsed}% of Target)`}
                </span>
              </div>

              {/* Comparison Stats Row */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '1rem',
                marginBottom: '1rem',
              }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
                    Target Budget
                  </div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                    {formatDualPrice(itinerary.summary.budgetAnalysis.targetBudgetJPY, currency).full}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
                    Calculated Estimate
                  </div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--accent-gold)' }}>
                    {formatDualPrice(itinerary.summary.budgetAnalysis.calculatedJPY, currency).full}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
                    {itinerary.summary.budgetAnalysis.status === 'under' ? 'Remaining Buffer' : 'Variance Over Target'}
                  </div>
                  <div style={{
                    fontSize: '1.2rem',
                    fontWeight: '800',
                    color: itinerary.summary.budgetAnalysis.status === 'under' ? 'var(--accent-matcha)' : 'var(--accent-crimson)'
                  }}>
                    {itinerary.summary.budgetAnalysis.status === 'under' ? '+' : '-'}
                    {formatDualPrice(Math.abs(itinerary.summary.budgetAnalysis.diffJPY), currency).full}
                  </div>
                </div>
              </div>

              {/* Visual Progress Bar Meter */}
              <div style={{ position: 'relative', width: '100%', marginBottom: '0.5rem' }}>
                <div style={{
                  height: '10px',
                  borderRadius: '999px',
                  backgroundColor: 'var(--bg-secondary)',
                  overflow: 'hidden',
                  position: 'relative',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.min(100, itinerary.summary.budgetAnalysis.percentUsed)}%`,
                    backgroundColor: itinerary.summary.budgetAnalysis.status === 'under'
                      ? (itinerary.summary.budgetAnalysis.percentUsed > 85 ? 'var(--accent-gold)' : 'var(--accent-matcha)')
                      : 'var(--accent-crimson)',
                    borderRadius: '999px',
                    transition: 'width 0.5s ease',
                  }} />
                </div>
              </div>

              {/* Explanatory Note */}
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span>{itinerary.summary.budgetAnalysis.bufferMessage}</span>
                <span>Covers lodging, 3 daily meals, intercity Shinkansen & curated attractions for all {itinerary.summary.travelers} {itinerary.summary.travelers === 1 ? 'traveler' : 'travelers'}</span>
              </div>
            </div>
          )}

          {/* Action Bar (Export, Copy, Restart, View on Map) */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-subtle)',
          }}>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              {/* Copy Summary Button */}
              <button
                type="button"
                onClick={handleCopySummary}
                className="btn-secondary"
                style={{ padding: '0.55rem 1rem', fontSize: '0.85rem', gap: '0.4rem' }}
              >
                {copiedSummary ? <Check size={15} style={{ color: 'var(--accent-matcha)' }} /> : <Copy size={15} />}
                <span>{copiedSummary ? 'Copied Summary!' : 'Copy Summary'}</span>
              </button>

              {/* Export / Print Button */}
              {onOpenExport && (
                <button
                  type="button"
                  onClick={onOpenExport}
                  className="btn-secondary"
                  style={{ padding: '0.55rem 1rem', fontSize: '0.85rem', gap: '0.4rem' }}
                >
                  <Share2 size={15} />
                  <span>Export / PDF</span>
                </button>
              )}

              {/* View on Map Button */}
              <button
                type="button"
                onClick={() => onViewCityOnMap(itinerary.days[0].cityKey)}
                className="btn-secondary"
                style={{ padding: '0.55rem 1rem', fontSize: '0.85rem', gap: '0.4rem' }}
              >
                <Compass size={15} style={{ color: 'var(--accent-indigo)' }} />
                <span>View Full Map</span>
              </button>
            </div>

            {/* Restart Customizer Button */}
            {onRestartCustomizer && (
              <button
                type="button"
                onClick={onRestartCustomizer}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '0.4rem 0.75rem',
                  borderRadius: '8px',
                  transition: 'color 0.2s ease',
                }}
                className="interactive-nav-btn"
              >
                <RotateCcw size={14} />
                <span>Tweak Preferences</span>
              </button>
            )}
          </div>
        </div>

        {/* Day Filter Pills & Expand/Collapse Master Controls */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2.5rem',
        }}>
          {/* Scrollable Day Pills */}
          <div style={{
            display: 'flex',
            overflowX: 'auto',
            gap: '0.45rem',
            paddingBottom: '0.35rem',
            maxWidth: '100%',
          }}>
            <button
              onClick={() => setSelectedDayFilter('all')}
              style={{
                padding: '0.45rem 0.95rem',
                borderRadius: '9999px',
                fontSize: '0.82rem',
                fontWeight: selectedDayFilter === 'all' ? '800' : '500',
                border: '1px solid',
                borderColor: selectedDayFilter === 'all' ? 'var(--accent-crimson)' : 'var(--border-subtle)',
                backgroundColor: selectedDayFilter === 'all' ? 'var(--accent-crimson)' : 'var(--bg-surface-elevated)',
                color: selectedDayFilter === 'all' ? '#fff' : 'var(--text-secondary)',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
              }}
            >
              All Days ({itinerary.days.length})
            </button>
            
            {itinerary.days.map(d => (
              <button
                key={d.dayNumber}
                onClick={() => setSelectedDayFilter(String(d.dayNumber))}
                style={{
                  padding: '0.45rem 0.95rem',
                  borderRadius: '9999px',
                  fontSize: '0.82rem',
                  fontWeight: selectedDayFilter === String(d.dayNumber) ? '800' : '500',
                  border: '1px solid',
                  borderColor: selectedDayFilter === String(d.dayNumber) ? 'var(--accent-crimson)' : 'var(--border-subtle)',
                  backgroundColor: selectedDayFilter === String(d.dayNumber) ? 'var(--accent-crimson)' : 'var(--bg-surface-elevated)',
                  color: selectedDayFilter === String(d.dayNumber) ? '#fff' : 'var(--text-secondary)',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                }}
              >
                Day {d.dayNumber}: {d.cityName}
              </button>
            ))}
          </div>

          {/* Master Expand/Collapse */}
          <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
            <button
              onClick={handleExpandAll}
              style={{
                fontSize: '0.78rem',
                color: 'var(--text-secondary)',
                padding: '0.3rem 0.65rem',
                borderRadius: '6px',
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              Expand All
            </button>
            <button
              onClick={handleCollapseAll}
              style={{
                fontSize: '0.78rem',
                color: 'var(--text-secondary)',
                padding: '0.3rem 0.65rem',
                borderRadius: '6px',
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* VERTICAL TIMELINE TRACKER ROUTE VIEW                           */}
        {/* ============================================================== */}
        <div className="timeline-track-container">
          
          {/* Continuous Glowing Gradient Track Rail */}
          <div className="timeline-track-rail" />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {filteredDays.map((day, idx) => {
              const isCollapsed = expandedDays[day.dayNumber] === false;
              const dailySpendDual = formatDualPrice(
                day.estimatedDailyCost.hotelJPY + 
                day.estimatedDailyCost.foodJPY + 
                day.estimatedDailyCost.transitJPY + 
                day.estimatedDailyCost.activitiesJPY,
                currency
              );

              return (
                <React.Fragment key={day.dayNumber}>
                  
                  {/* ==================================================== */}
                  {/* CITY TRANSITION MILESTONE DIVIDER (IF NEW CITY)     */}
                  {/* ==================================================== */}
                  {day.transitHop && (
                    <div style={{
                      position: 'relative',
                      margin: '0.5rem 0 1rem 0',
                    }}>
                      <div className="glass-card" style={{
                        padding: '1.25rem 1.5rem',
                        borderRadius: '16px',
                        border: '1px solid rgba(0, 180, 216, 0.45)',
                        background: 'linear-gradient(135deg, rgba(0, 119, 182, 0.18), rgba(18, 24, 38, 0.95))',
                        boxShadow: '0 8px 30px rgba(0, 119, 182, 0.25)',
                      }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '0.75rem',
                          marginBottom: '0.5rem',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '10px',
                              backgroundColor: 'rgba(0, 180, 216, 0.25)',
                              color: '#38bdf8',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0 0 12px rgba(0, 180, 216, 0.4)',
                            }}>
                              <Train size={20} />
                            </div>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
                                  Intercity Milestone
                                </span>
                                <span style={{ fontWeight: '800', fontSize: '1.1rem', color: '#60a5fa' }}>
                                  {day.transitHop.from} ➔ {day.transitHop.to}
                                </span>
                              </div>
                              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                                {day.transitHop.mode} ({day.transitHop.type})
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                              <Clock size={14} /> {day.transitHop.duration}
                            </span>
                            <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--accent-gold)' }}>
                              {formatDualPrice(day.transitHop.priceJPY, currency).full}
                            </span>
                          </div>
                        </div>

                        {/* Transit Tip */}
                        <div style={{
                          fontSize: '0.83rem',
                          color: 'var(--text-secondary)',
                          paddingLeft: '3.1rem',
                          lineHeight: 1.5,
                        }}>
                          💡 <strong>Scenic Route & Seating Tip:</strong> {day.transitHop.tip}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ==================================================== */}
                  {/* DAY NODE CARD                                        */}
                  {/* ==================================================== */}
                  <div style={{ position: 'relative' }}>
                    
                    {/* Glowing Timeline Marker Pin */}
                    <div className="timeline-node-pin">
                      {day.dayNumber}
                    </div>

                    {/* Day Content Card */}
                    <div className="glass-card" style={{
                      padding: 0,
                      overflow: 'hidden',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '20px',
                    }}>
                      
                      {/* Day Header Banner */}
                      <div style={{
                        padding: '1.5rem',
                        borderBottom: '1px solid var(--border-subtle)',
                        background: 'linear-gradient(to right, rgba(22, 29, 44, 0.95), rgba(30, 39, 58, 0.7))',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '1rem',
                      }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.2rem' }}>
                            <span className="badge badge-crimson" style={{ fontWeight: '800' }}>
                              DAY {day.dayNumber}
                            </span>
                            <h3 style={{ fontSize: '1.45rem', fontWeight: '800' }}>
                              {day.cityName}: {day.activities[0]?.name ? `${day.activities[0].name.split('&')[0]} & Highlights` : day.cityName}
                            </h3>
                            <span className="kanji-text" style={{ fontSize: '1.1rem', color: 'var(--accent-gold)', opacity: 0.9 }}>
                              {day.cityKanji}
                            </span>
                            <span className="badge badge-matcha" style={{ fontSize: '0.68rem' }}>
                              {day.region}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            {day.tagline}
                          </div>
                        </div>

                        {/* Top Logistics & Expand Button */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                          <button
                            type="button"
                            onClick={() => onViewCityOnMap(day.cityKey)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              fontSize: '0.8rem',
                              padding: '0.4rem 0.85rem',
                              borderRadius: '8px',
                              backgroundColor: 'var(--bg-surface-elevated)',
                              color: 'var(--accent-indigo)',
                              border: '1px solid var(--border-subtle)',
                            }}
                          >
                            <MapPin size={14} />
                            <span>City Map</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleDayExpand(day.dayNumber)}
                            style={{
                              padding: '0.45rem',
                              borderRadius: '8px',
                              backgroundColor: 'var(--bg-surface-elevated)',
                              color: 'var(--text-secondary)',
                            }}
                            title={isCollapsed ? 'Expand Day' : 'Collapse Day'}
                          >
                            {isCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                          </button>
                        </div>
                      </div>

                      {/* Day Logistics Quick-Strip */}
                      <div style={{
                        padding: '0.85rem 1.5rem',
                        backgroundColor: 'rgba(10, 13, 20, 0.65)',
                        borderBottom: '1px solid var(--border-subtle)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '1rem',
                        fontSize: '0.82rem',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                          <Train size={15} style={{ color: '#60a5fa' }} />
                          <span>
                            <strong>Local Transit:</strong> JR Yamanote / Subway / City Bus (IC Card: Suica/Pasmo)
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
                          <DollarSign size={15} style={{ color: 'var(--accent-gold)' }} />
                          <span>
                            <strong>Est. Day Spend:</strong>{' '}
                            <span style={{ color: 'var(--accent-gold)', fontWeight: '800' }}>
                              {dailySpendDual.primary}
                            </span>{' '}
                            <span style={{ color: 'var(--text-muted)' }}>
                              ({dailySpendDual.secondary})
                            </span>
                          </span>
                        </div>
                      </div>

                      {/* Day Activities Time-Slots (Visible when expanded) */}
                      {!isCollapsed && (
                        <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                          
                          {day.activities.map((act, actIdx) => {
                            const actKey = `${day.dayNumber}-${actIdx}`;
                            const isDone = completedActivities[actKey];
                            const slot = slotConfig[act.timeSlot] || slotConfig.morning;
                            const SlotIcon = slot.icon;
                            const actPriceDual = formatDualPrice(act.cost, currency);

                            return (
                              <div
                                key={actIdx}
                                style={{
                                  padding: '1.25rem',
                                  borderRadius: '14px',
                                  backgroundColor: isDone ? 'rgba(42, 157, 143, 0.08)' : 'var(--bg-surface-elevated)',
                                  border: '1px solid',
                                  borderColor: isDone ? 'rgba(42, 157, 143, 0.35)' : 'var(--border-subtle)',
                                  transition: 'all 0.25s ease',
                                  display: 'flex',
                                  gap: '1rem',
                                }}
                              >
                                {/* Activity Checkbox Tracker */}
                                <button
                                  type="button"
                                  onClick={() => toggleActivityComplete(actKey)}
                                  style={{
                                    color: isDone ? 'var(--accent-matcha)' : 'var(--text-muted)',
                                    marginTop: '0.15rem',
                                    flexShrink: 0,
                                  }}
                                  title={isDone ? 'Mark as pending' : 'Mark activity as completed'}
                                >
                                  <CheckCircle size={22} fill={isDone ? 'var(--accent-matcha)' : 'none'} color={isDone ? '#fff' : 'currentColor'} />
                                </button>

                                <div style={{ flex: 1 }}>
                                  {/* Activity Top Details */}
                                  <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    flexWrap: 'wrap',
                                    gap: '0.5rem',
                                    marginBottom: '0.4rem',
                                  }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                      {/* Time-Slot Tag */}
                                      <div style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.35rem',
                                        padding: '0.25rem 0.65rem',
                                        borderRadius: '9999px',
                                        backgroundColor: `${slot.color}20`,
                                        color: slot.color,
                                        fontSize: '0.72rem',
                                        fontWeight: '800',
                                        textTransform: 'uppercase',
                                      }}>
                                        <SlotIcon size={12} />
                                        <span>{slot.label} ({slot.time})</span>
                                      </div>

                                      <h4 style={{
                                        fontSize: '1.15rem',
                                        fontWeight: '800',
                                        textDecoration: isDone ? 'line-through' : 'none',
                                        color: isDone ? 'var(--text-muted)' : 'var(--text-primary)',
                                      }}>
                                        {act.name}
                                      </h4>

                                      <span className="kanji-text" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                        {act.kanji}
                                      </span>
                                    </div>

                                    {/* Cost & Duration */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                                      <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                        <Clock size={13} /> {act.duration}
                                      </span>
                                      <span style={{
                                        fontSize: '0.9rem',
                                        fontWeight: '800',
                                        color: act.cost === 0 ? 'var(--accent-matcha)' : 'var(--accent-gold)',
                                      }}>
                                        {act.cost === 0 ? 'FREE' : actPriceDual.full}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Description */}
                                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '0.65rem' }}>
                                    {act.description}
                                  </p>

                                  {/* Tip */}
                                  {act.tip && (
                                    <div style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '0.45rem',
                                      fontSize: '0.82rem',
                                      color: 'var(--accent-gold)',
                                      backgroundColor: 'rgba(244, 162, 97, 0.08)',
                                      padding: '0.45rem 0.85rem',
                                      borderRadius: '8px',
                                      width: 'fit-content',
                                    }}>
                                      <Lightbulb size={14} style={{ flexShrink: 0 }} />
                                      <span>{act.tip}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}

                          {/* Day Footer with Insider Cultural Tip & Category Costs */}
                          <div style={{
                            marginTop: '0.75rem',
                            paddingTop: '1.25rem',
                            borderTop: '1px solid var(--border-subtle)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '1rem',
                            fontSize: '0.82rem',
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                              <Sparkles size={14} style={{ color: 'var(--accent-crimson)', flexShrink: 0 }} />
                              <span><strong>Daily Etiquette Tip:</strong> {day.insiderTip}</span>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)' }}>
                              <span>Hotel: <strong>{formatDualPrice(day.estimatedDailyCost.hotelJPY, currency).primary}</strong></span>
                              <span>Food: <strong>{formatDualPrice(day.estimatedDailyCost.foodJPY, currency).primary}</strong></span>
                              <span>Transit: <strong>{formatDualPrice(day.estimatedDailyCost.transitJPY, currency).primary}</strong></span>
                            </div>
                          </div>

                        </div>
                      )}

                    </div>
                  </div>

                </React.Fragment>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
