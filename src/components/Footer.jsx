import React from 'react';
import { Heart, Sparkles, Shield, Compass, BookOpen } from 'lucide-react';

export default function Footer() {
  const etiquetteTips = [
    { title: 'No Tipping Anywhere', desc: 'Good service is standard. Leaving cash on tables causes staff to run down the street to return your forgotten money.' },
    { title: 'Quiet on Trains', desc: 'Set smartphones to "Manner Mode" (silent). Avoid phone conversations and keep headphones at low volume on trains.' },
    { title: 'Shoe Etiquette', desc: 'Remove shoes whenever you step onto elevated tatami mats, ryokan entrances, fitting rooms, and traditional dining rooms.' },
    { title: 'Carry Your Trash', desc: 'Public trash cans were phased out in the 1990s. Keep a small bag in your daypack to hold trash until you reach a hotel or conbini.' },
    { title: 'Onsen Bathing Rules', desc: 'Wash thoroughly at the sit-down shower stalls before stepping into the hot spring. Tie up long hair and never put towels in the water.' },
    { title: 'Escalator Custom', desc: 'Stand on the LEFT in Tokyo / Kanto. Stand on the RIGHT in Osaka / Kansai. Keep the other side clear for walkers.' }
  ];

  return (
    <footer style={{
      borderTop: '1px solid var(--border-subtle)',
      backgroundColor: 'var(--bg-secondary)',
      padding: '4rem 0 2.5rem 0',
      position: 'relative',
      zIndex: 2,
    }} className="footer">
      <div className="container">
        
        {/* Cultural Etiquette Quick Reference */}
        <div style={{ marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <BookOpen size={20} style={{ color: 'var(--accent-crimson)' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>
              Golden Rules of Japanese Travel Etiquette (おもてなし)
            </h3>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1rem',
          }}>
            {etiquetteTips.map((tip, i) => (
              <div key={i} className="glass-card" style={{ padding: '1rem 1.25rem', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--accent-gold)', marginBottom: '0.25rem' }}>
                  {i + 1}. {tip.title}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {tip.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Bottom Strip */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          paddingTop: '2rem',
          borderTop: '1px solid var(--border-subtle)',
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontWeight: '800', color: 'var(--text-primary)', fontSize: '1.05rem' }}>
              Komorebi <span style={{ color: 'var(--accent-crimson)' }}>Japan</span>
            </span>
            <span>•</span>
            <span className="kanji-text" style={{ color: 'var(--accent-gold)' }}>一期一会 (Treasure Every Encounter)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span>Built with precision for travelers worldwide</span>
            <Heart size={14} style={{ color: 'var(--accent-crimson)', fill: 'var(--accent-crimson)' }} />
          </div>
        </div>

      </div>
    </footer>
  );
}
