import React, { useState } from 'react';
import { Train, Bus, Car, Clock, DollarSign, Compass, ExternalLink, ShieldCheck, Sparkles, ArrowRight, Info, CheckCircle2 } from 'lucide-react';
import { formatDualPrice } from '../data/currency';

export default function DailyTransitAssistant({ day, currency = 'JPY' }) {
  const transitData = day?.multimodalTransit;
  const initialMode = transitData?.recommendedMode || 'train';
  const [activeMode, setActiveMode] = useState(initialMode);

  if (!transitData) return null;

  const trainData = transitData.train;
  const busData = transitData.bus;
  const taxiData = transitData.taxi;

  const trainDualPrice = trainData ? formatDualPrice(trainData.fareJPY, currency) : null;
  const busDualPrice = busData ? formatDualPrice(busData.fareJPY, currency) : null;
  const taxiDualLow = taxiData ? formatDualPrice(taxiData.fareRangeJPY[0], currency) : null;
  const taxiDualHigh = taxiData ? formatDualPrice(taxiData.fareRangeJPY[1], currency) : null;

  return (
    <div style={{
      marginTop: '1.25rem',
      borderRadius: '16px',
      border: '1px solid var(--border-subtle)',
      backgroundColor: 'var(--bg-surface-elevated)',
      overflow: 'hidden',
      transition: 'all 0.25s ease',
    }}>
      {/* Top Banner: Mode Selection & Recommendation */}
      <div style={{
        padding: '0.85rem 1.25rem',
        backgroundColor: 'rgba(15, 23, 42, 0.45)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.2rem 0.6rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            color: '#38bdf8',
            fontSize: '0.72rem',
            fontWeight: '800',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}>
            <Compass size={12} />
            <span>Daily Transit Hub</span>
          </div>

          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {transitData.recommendedBadge}
          </span>
        </div>

        {/* Transportation Mode Selector Tabs */}
        <div style={{
          display: 'flex',
          backgroundColor: 'rgba(0, 0, 0, 0.25)',
          padding: '3px',
          borderRadius: '10px',
          border: '1px solid var(--border-subtle)',
          gap: '2px',
        }}>
          <button
            type="button"
            onClick={() => setActiveMode('train')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.35rem 0.65rem',
              borderRadius: '7px',
              fontSize: '0.78rem',
              fontWeight: activeMode === 'train' ? '700' : '500',
              backgroundColor: activeMode === 'train' ? 'var(--accent-crimson)' : 'transparent',
              color: activeMode === 'train' ? '#ffffff' : 'var(--text-secondary)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <Train size={14} />
            <span>Train / Subway</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('bus')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.35rem 0.65rem',
              borderRadius: '7px',
              fontSize: '0.78rem',
              fontWeight: activeMode === 'bus' ? '700' : '500',
              backgroundColor: activeMode === 'bus' ? 'var(--accent-crimson)' : 'transparent',
              color: activeMode === 'bus' ? '#ffffff' : 'var(--text-secondary)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <Bus size={14} />
            <span>City Bus</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('taxi')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.35rem 0.65rem',
              borderRadius: '7px',
              fontSize: '0.78rem',
              fontWeight: activeMode === 'taxi' ? '700' : '500',
              backgroundColor: activeMode === 'taxi' ? 'var(--accent-crimson)' : 'transparent',
              color: activeMode === 'taxi' ? '#ffffff' : 'var(--text-secondary)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <Car size={14} />
            <span>Taxi / Rideshare</span>
          </button>
        </div>
      </div>

      {/* Mode Body Content */}
      <div style={{ padding: '1.25rem' }}>
        
        {/* ================================================================ */}
        {/* TRAIN & SUBWAY VIEW                                             */}
        {/* ================================================================ */}
        {activeMode === 'train' && trainData && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                  {/* Line Color Indicator Pill */}
                  <span style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: trainData.color || '#3b82f6',
                    display: 'inline-block',
                    boxShadow: `0 0 8px ${trainData.color || '#3b82f6'}`,
                  }} />
                  <span style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                    {trainData.lineName}
                  </span>
                  <span style={{
                    padding: '0.15rem 0.5rem',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    fontSize: '0.72rem',
                    fontWeight: '800',
                    color: 'var(--text-secondary)',
                  }}>
                    {trainData.code}
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {trainData.routeDesc}
                </div>
              </div>

              {/* Fare Badge */}
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>
                  IC Card Fare
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--accent-gold)' }}>
                  {trainDualPrice?.full}
                </div>
              </div>
            </div>

            {/* Train Specs Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '0.75rem',
              padding: '0.85rem',
              borderRadius: '12px',
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              fontSize: '0.82rem',
            }}>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem', fontWeight: '700' }}>
                  DIRECTION & ROUTE
                </span>
                <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>
                  {trainData.direction}
                </span>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem', fontWeight: '700' }}>
                  PLATFORM & TRACK
                </span>
                <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>
                  {trainData.platform}
                </span>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem', fontWeight: '700' }}>
                  PAYMENT & GATES
                </span>
                <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>
                  {trainData.paymentMethod}
                </span>
              </div>
            </div>

            {/* Transfer Stations */}
            {trainData.transferStations && trainData.transferStations.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: '700' }}>Key Transfer Hubs:</span>
                {trainData.transferStations.map((station, sIdx) => (
                  <span key={sIdx} style={{
                    padding: '0.2rem 0.55rem',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(148, 163, 184, 0.12)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.78rem',
                  }}>
                    {station}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================================================================ */}
        {/* HIGHWAY / CITY BUS VIEW                                         */}
        {/* ================================================================ */}
        {activeMode === 'bus' && busData && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                    {busData.lineName}
                  </span>
                  <span style={{
                    padding: '0.15rem 0.5rem',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(230, 57, 70, 0.15)',
                    color: 'var(--accent-crimson)',
                    fontSize: '0.75rem',
                    fontWeight: '800',
                  }}>
                    {busData.code}
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <strong>Boarding Stop:</strong> {busData.boardingStop}
                </div>
              </div>

              {/* Fare & Duration */}
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>
                  Flat Bus Fare
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--accent-gold)' }}>
                  {busDualPrice?.full}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Approx. {busData.duration}
                </div>
              </div>
            </div>

            {/* Boarding & Door Rules Banner */}
            <div style={{
              padding: '0.85rem 1rem',
              borderRadius: '12px',
              backgroundColor: 'rgba(244, 162, 97, 0.08)',
              border: '1px solid rgba(244, 162, 97, 0.25)',
              fontSize: '0.82rem',
              lineHeight: 1.5,
              color: 'var(--text-primary)',
            }}>
              🚌 <strong>Bus Boarding & Fare Payment Rules:</strong> {busData.paymentMethod}
            </div>

            {/* Tip & Timetable */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.82rem' }}>
              <div style={{ color: 'var(--text-secondary)', flex: 1 }}>
                💡 <em>{busData.tip}</em>
              </div>

              {busData.timetableLink && (
                <a
                  href={busData.timetableLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(56, 189, 248, 0.12)',
                    color: '#38bdf8',
                    textDecoration: 'none',
                    fontWeight: '700',
                    fontSize: '0.78rem',
                  }}
                >
                  <span>Live Timetable & Routes</span>
                  <ExternalLink size={13} />
                </a>
              )}
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAXI & RIDESHARE VIEW                                           */}
        {/* ================================================================ */}
        {activeMode === 'taxi' && taxiData && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                  <span style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                    Japan Taxi & On-Demand Rideshare
                  </span>
                  <span className="badge badge-matcha" style={{ fontSize: '0.7rem' }}>
                    Door-to-Door
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <strong>Service Fleet:</strong> {taxiData.provider}
                </div>
              </div>

              {/* Estimated Fare Range */}
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>
                  Est. Ride Meter Fare
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--accent-gold)' }}>
                  {taxiDualLow?.primary} – {taxiDualHigh?.primary}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  (~{taxiDualLow?.secondary} – {taxiDualHigh?.secondary})
                </div>
              </div>
            </div>

            {/* App recommendation card */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '0.85rem',
            }}>
              <div style={{
                padding: '0.85rem',
                borderRadius: '12px',
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                fontSize: '0.82rem',
              }}>
                <span style={{ color: 'var(--accent-gold)', display: 'block', fontSize: '0.75rem', fontWeight: '800', marginBottom: '0.3rem' }}>
                  📱 RECOMMENDED TAXI APPS
                </span>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  {taxiData.appTip}
                </p>
              </div>

              <div style={{
                padding: '0.85rem',
                borderRadius: '12px',
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                fontSize: '0.82rem',
              }}>
                <span style={{ color: 'var(--accent-matcha)', display: 'block', fontSize: '0.75rem', fontWeight: '800', marginBottom: '0.3rem' }}>
                  💳 ACCEPTED PAYMENTS & PERKS
                </span>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  {taxiData.payment}. {taxiData.pros}
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
