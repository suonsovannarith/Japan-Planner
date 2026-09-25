import React from 'react';
import { Compass, Train, Clock, Sparkles, MapPin, ArrowRight } from 'lucide-react';
import { DURATION_PRESETS } from '../data/interests';

export default function HeroSection({ onSelectPreset, onStartPlanning }) {
  return (
    <section style={{
      position: 'relative',
      padding: '4.5rem 0 3rem 0',
      overflow: 'hidden',
    }} className="hero-section">
      <div className="container">
        <div style={{ maxWidth: '850px', margin: '0 auto', textAlign: 'center' }}>
          
          {/* Subtle Top Pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(230, 57, 70, 0.12)',
            border: '1px solid rgba(230, 57, 70, 0.3)',
            color: 'var(--accent-sakura)',
            fontSize: '0.85rem',
            fontWeight: '600',
            marginBottom: '1.5rem',
          }}>
            <Sparkles size={15} style={{ color: 'var(--accent-crimson)' }} />
            <span>Smart Travel Logic • Shinkansen Optimized • 2026/2027 Transit Rates</span>
          </div>

          {/* Main Headline */}
          <h1 style={{
            fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
            fontWeight: '800',
            letterSpacing: '-0.03em',
            marginBottom: '1.25rem',
            lineHeight: 1.15,
          }}>
            Craft Your Dream Journey Across{' '}
            <span style={{
              background: 'linear-gradient(135deg, #ff4d6d 0%, #e63946 50%, #f4a261 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Japan
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            marginBottom: '2.5rem',
            fontWeight: '400',
          }}>
            Whether you have <strong>a few days</strong>, <strong>a week</strong>, or <strong>a whole month</strong>: 
            generate a realistic day-by-day itinerary with exact bullet train hops, 
            local insider food gems, and honest budget estimates.
          </p>

          {/* Quick Preset Buttons */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '0.85rem',
            marginBottom: '2.5rem',
          }}>
            {DURATION_PRESETS.map(preset => (
              <div
                key={preset.id}
                onClick={() => onSelectPreset(preset.days)}
                className="glass-card interactive-hover"
                style={{
                  padding: '1.1rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-surface)',
                  transition: 'all 0.25s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span className="badge badge-crimson">{preset.tag}</span>
                  <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} />
                </div>
                <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                  {preset.label}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {preset.desc}
                </div>
              </div>
            ))}
          </div>

          {/* CTA & Highlights */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={onStartPlanning}
              className="btn-primary"
              style={{ fontSize: '1.05rem', padding: '1rem 2.2rem' }}
            >
              <Compass size={20} />
              <span>Customize Your Japan Trip</span>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
