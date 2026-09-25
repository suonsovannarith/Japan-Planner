import React, { useEffect, useRef } from 'react';
import sakuraBranchImg from '../assets/image_fd1a88.jpg';

/**
 * SakuraBackground Component
 * Renders the top-right "image_fd1a88.jpg" sakura branch with wind swaying animation,
 * dark-mode contrast boost/glow filter, and an ambient canvas particle system
 * of sakura petals originating from the top-right branch and drifting diagonally
 * downwards and to the left.
 */
export default function SakuraBackground({ theme = 'light' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check user motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let animationFrameId;
    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const setupCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    setupCanvas();

    const handleResize = () => {
      if (!canvas) return;
      setupCanvas();
    };

    window.addEventListener('resize', handleResize);

    // Number of petals - balanced for ambient beauty & silky 60fps performance
    const PETAL_COUNT = width < 768 ? 24 : 40;

    class Petal {
      constructor(isInitial = false) {
        this.reset(isInitial);
      }

      reset(isInitial = false) {
        if (isInitial) {
          // On initial load, spread diagonally across the viewport so the scene feels alive immediately
          this.x = Math.random() * (width + 120) - 40;
          this.y = Math.random() * height;
        } else {
          // Originating specifically from the top-right area near the branch
          if (Math.random() < 0.72) {
            // Spawning along the top edge near the top-right branch (50% to 105% of screen width)
            this.x = width * 0.52 + Math.random() * (width * 0.52);
            this.y = -20 - Math.random() * 50;
          } else {
            // Spawning along the upper-right vertical edge (0 to 35% of screen height)
            this.x = width + 5 + Math.random() * 35;
            this.y = Math.random() * (height * 0.35);
          }
        }

        // Petal dimensions
        this.size = 8 + Math.random() * 9;

        // Diagonal drift vector: Downwards (+Y) and to the Left (-X)
        this.speedY = 0.95 + Math.random() * 1.5;     // 0.95 to 2.45 px/frame downwards
        this.speedX = -(1.25 + Math.random() * 1.85);  // -1.25 to -3.1 px/frame to the left

        // Gentle atmospheric wind flutter (swaying oscillation)
        this.swaySpeed = 0.016 + Math.random() * 0.026;
        this.swayAngle = Math.random() * Math.PI * 2;
        this.swayDistance = 0.75 + Math.random() * 1.45;

        // 3D rotation and tumbling parameters
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.032;
        this.flip = Math.random() * Math.PI;
        this.flipSpeed = 0.018 + Math.random() * 0.032;

        // Visual properties: varied organic opacities and natural sakura tones
        this.opacity = 0.42 + Math.random() * 0.46;
        this.colorType = Math.random();
      }

      update() {
        this.swayAngle += this.swaySpeed;
        this.y += this.speedY;
        // Dominant diagonal drift towards the left combined with subtle wind flutter
        this.x += this.speedX + Math.sin(this.swayAngle) * this.swayDistance;

        this.rotation += this.rotationSpeed;
        this.flip += this.flipSpeed;

        // Respawn when petal drifts off-screen beyond bottom or left edge
        if (this.y > height + 30 || this.x < -40) {
          this.reset(false);
        }
      }

      draw(context) {
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.rotation);
        // Scale along X to simulate 3D tumbling/spinning petal
        context.scale(Math.cos(this.flip), 1);

        context.beginPath();
        // Organic sakura petal silhouette with soft curved contours and notched tip
        const s = this.size;
        context.moveTo(0, -s);
        context.bezierCurveTo(s * 0.65, -s * 0.7, s * 0.7, s * 0.35, 0, s);
        context.bezierCurveTo(-s * 0.7, s * 0.35, -s * 0.65, -s * 0.7, 0, -s);

        // Petal radial gradient
        const grad = context.createRadialGradient(0, 0, 1, 0, 0, s);
        if (this.colorType > 0.6) {
          grad.addColorStop(0, `rgba(255, 238, 242, ${this.opacity})`);
          grad.addColorStop(0.7, `rgba(255, 183, 197, ${this.opacity * 0.95})`);
          grad.addColorStop(1, `rgba(255, 143, 171, ${this.opacity * 0.8})`);
        } else if (this.colorType > 0.3) {
          grad.addColorStop(0, `rgba(255, 242, 246, ${this.opacity})`);
          grad.addColorStop(0.65, `rgba(255, 175, 190, ${this.opacity * 0.95})`);
          grad.addColorStop(1, `rgba(244, 63, 94, ${this.opacity * 0.75})`);
        } else {
          grad.addColorStop(0, `rgba(255, 248, 250, ${this.opacity})`);
          grad.addColorStop(0.6, `rgba(255, 192, 203, ${this.opacity * 0.9})`);
          grad.addColorStop(1, `rgba(251, 113, 133, ${this.opacity * 0.7})`);
        }

        context.fillStyle = grad;
        context.shadowColor = 'rgba(255, 183, 197, 0.4)';
        context.shadowBlur = 4;
        context.fill();
        context.restore();
      }
    }

    const petals = Array.from({ length: PETAL_COUNT }, () => new Petal(true));

    let isVisible = true;
    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const render = () => {
      if (isVisible) {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < petals.length; i++) {
          petals[i].update();
          petals[i].draw(ctx);
        }
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 1,
        overflow: 'hidden',
      }}
    >
      {/* ================================================================ */}
      {/* TOP-LEFT SAKURA BRANCH (Delicate SVG Corner Accent)              */}
      {/* ================================================================ */}
      <svg
        className="sakura-branch-left"
        viewBox="0 0 280 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: 'clamp(140px, 20vw, 260px)',
          height: 'auto',
          opacity: theme === 'light' ? 0.9 : 0.42,
          filter: theme === 'light'
            ? 'drop-shadow(0 4px 14px rgba(244, 114, 182, 0.25))'
            : 'drop-shadow(0 4px 14px rgba(244, 114, 182, 0.15))',
        }}
      >
        <defs>
          <linearGradient id="branchWoodGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4a2e2b" />
            <stop offset="70%" stopColor="#693b32" />
            <stop offset="100%" stopColor="#8d5b4c" />
          </linearGradient>

          <radialGradient id="flowerBlushLeft" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffe4e9" />
            <stop offset="55%" stopColor="#ffb3c1" />
            <stop offset="100%" stopColor="#ff758f" />
          </radialGradient>

          <radialGradient id="flowerDeepBlushLeft" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff0f3" />
            <stop offset="60%" stopColor="#ff8fa3" />
            <stop offset="100%" stopColor="#c9184a" />
          </radialGradient>
        </defs>

        {/* Main curved branch trunk */}
        <path
          d="M -15 -10 Q 60 15, 110 45 Q 165 78, 220 72 Q 255 68, 275 60"
          stroke="url(#branchWoodGradLeft)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* Secondary twigs */}
        <path
          d="M 85 30 Q 120 70, 155 105 Q 170 120, 195 130"
          stroke="url(#branchWoodGradLeft)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M 140 65 Q 170 45, 205 38"
          stroke="url(#branchWoodGradLeft)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M 115 80 Q 95 110, 80 145"
          stroke="url(#branchWoodGradLeft)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* Blossom 1 */}
        <g transform="translate(65, 18) scale(0.9)">
          <path d="M 0 0 C -6 -14, 6 -14, 0 0" fill="url(#flowerBlushLeft)" />
          <path d="M 0 0 C 14 -6, 14 6, 0 0" fill="url(#flowerBlushLeft)" />
          <path d="M 0 0 C 8 13, -8 13, 0 0" fill="url(#flowerBlushLeft)" />
          <path d="M 0 0 C -14 6, -14 -6, 0 0" fill="url(#flowerBlushLeft)" />
          <circle cx="0" cy="0" r="3" fill="#e63946" />
        </g>

        {/* Blossom 2 */}
        <g transform="translate(135, 62) scale(1.15)">
          <path d="M 0 0 C -8 -18, 8 -18, 0 0" fill="url(#flowerBlushLeft)" />
          <path d="M 0 0 C 18 -8, 18 8, 0 0" fill="url(#flowerBlushLeft)" />
          <path d="M 0 0 C 11 16, -11 16, 0 0" fill="url(#flowerBlushLeft)" />
          <path d="M 0 0 C -18 8, -18 -8, 0 0" fill="url(#flowerBlushLeft)" />
          <circle cx="0" cy="0" r="3.5" fill="#e63946" />
        </g>

        {/* Blossom 3 */}
        <g transform="translate(195, 125) scale(0.95)">
          <path d="M 0 0 C -7 -15, 7 -15, 0 0" fill="url(#flowerBlushLeft)" />
          <path d="M 0 0 C 15 -7, 15 7, 0 0" fill="url(#flowerBlushLeft)" />
          <path d="M 0 0 C 9 14, -9 14, 0 0" fill="url(#flowerBlushLeft)" />
          <circle cx="0" cy="0" r="2.8" fill="#e63946" />
        </g>

        {/* Buds */}
        <circle cx="95" cy="115" r="4.5" fill="url(#flowerDeepBlushLeft)" />
        <circle cx="82" cy="142" r="3.8" fill="url(#flowerBlushLeft)" />
        <circle cx="212" cy="35" r="4" fill="url(#flowerDeepBlushLeft)" />
      </svg>

      {/* ================================================================ */}
      {/* TOP-RIGHT SAKURA BRANCH ASSET ("image_fd1a88.jpg")               */}
      {/* Fixed, non-interactive, anchored top-right with continuous wind  */}
      {/* swaying animation and dynamic dark-theme visibility filters.    */}
      {/* ================================================================ */}
      <img
        src={sakuraBranchImg}
        alt="Sakura Cherry Blossom Branch"
        aria-hidden="true"
        className={`sakura-branch-asset ${theme === 'dark' ? 'theme-dark' : 'theme-light'}`}
        onError={(e) => {
          // Graceful fallback to public asset path if bundler path differs
          if (e.currentTarget.src !== window.location.origin + '/image_fd1a88.jpg') {
            e.currentTarget.src = '/image_fd1a88.jpg';
          }
        }}
      />

      {/* ================================================================ */}
      {/* 60FPS FALLING SAKURA PETALS CANVAS                               */}
      {/* Originates top-right, drifting diagonally downwards and to left  */}
      {/* ================================================================ */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
