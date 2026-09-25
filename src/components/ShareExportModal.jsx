import React, { useState } from 'react';
import { X, Printer, Download, Share2, Check, FileText } from 'lucide-react';

export default function ShareExportModal({ isOpen, onClose, itinerary }) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);

  if (!isOpen || !itinerary) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    const params = new URLSearchParams({
      days: itinerary.summary.durationDays,
      city: itinerary.summary.startingCity,
      pace: itinerary.summary.pace,
      budget: itinerary.summary.budget,
      travelers: itinerary.summary.travelers
    });
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(itinerary, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `japan-itinerary-${itinerary.summary.durationDays}days.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopyMarkdown = () => {
    let md = `# Japan ${itinerary.summary.durationDays}-Day Trip Itinerary\n\n`;
    md += `**Route:** ${itinerary.summary.uniqueCities.join(' → ')}\n`;
    md += `**Pace:** ${itinerary.summary.pace} | **Budget Tier:** ${itinerary.summary.budget}\n`;
    md += `**Est. Total:** ¥${itinerary.summary.grandTotalJPY.toLocaleString()} (~$${itinerary.summary.grandTotalUSD.toLocaleString()} USD)\n\n`;
    
    itinerary.days.forEach(day => {
      md += `## Day ${day.dayNumber}: ${day.cityName} (${day.cityKanji})\n`;
      if (day.transitHop) {
        md += `*Transit:* ${day.transitHop.mode} (${day.transitHop.duration}, ¥${day.transitHop.priceJPY})\n`;
      }
      day.activities.forEach(act => {
        md += `- **[${act.timeSlot.toUpperCase()}] ${act.name}:** ${act.description} (Cost: ¥${act.cost})\n`;
      });
      md += `*Tip:* ${day.insiderTip}\n\n`;
    });

    navigator.clipboard.writeText(md);
    setCopiedMarkdown(true);
    setTimeout(() => setCopiedMarkdown(false), 2500);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem',
    }}>
      <div className="glass-card" style={{
        maxWidth: '520px',
        width: '100%',
        padding: '2rem',
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)',
        position: 'relative',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            color: 'var(--text-muted)',
            padding: '0.25rem',
          }}
        >
          <X size={20} />
        </button>

        <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '0.4rem' }}>
          Export & Share Itinerary
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Take your {itinerary.summary.durationDays}-day Japan itinerary with you on your phone or print a hard copy for customs.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {/* Print / PDF */}
          <button
            onClick={handlePrint}
            className="glass-card"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem',
              cursor: 'pointer',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-surface)',
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'rgba(230, 57, 70, 0.2)',
                color: 'var(--accent-crimson)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Printer size={18} />
              </div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '0.92rem' }}>Print / Save as PDF</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Clean, printer-friendly layout with all days</div>
              </div>
            </div>
          </button>

          {/* Share Link */}
          <button
            onClick={handleCopyLink}
            className="glass-card"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem',
              cursor: 'pointer',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-surface)',
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'rgba(58, 134, 255, 0.2)',
                color: 'var(--accent-indigo)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Share2 size={18} />
              </div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '0.92rem' }}>
                  {copiedLink ? 'Link Copied to Clipboard!' : 'Copy Shareable Link'}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Share with your travel companions</div>
              </div>
            </div>
            {copiedLink && <Check size={18} style={{ color: 'var(--accent-matcha)' }} />}
          </button>

          {/* Copy Markdown */}
          <button
            onClick={handleCopyMarkdown}
            className="glass-card"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem',
              cursor: 'pointer',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-surface)',
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'rgba(244, 162, 97, 0.2)',
                color: 'var(--accent-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <FileText size={18} />
              </div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '0.92rem' }}>
                  {copiedMarkdown ? 'Markdown Copied!' : 'Copy Formatted Markdown'}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Paste into Notion, Apple Notes, or Obsidian</div>
              </div>
            </div>
            {copiedMarkdown && <Check size={18} style={{ color: 'var(--accent-matcha)' }} />}
          </button>

          {/* Download JSON */}
          <button
            onClick={handleDownloadJSON}
            className="glass-card"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem',
              cursor: 'pointer',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-surface)',
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'rgba(42, 157, 143, 0.2)',
                color: 'var(--accent-matcha)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Download size={18} />
              </div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '0.92rem' }}>Download Raw Data (.json)</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Full structured dataset with coordinates and hops</div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
