import React, { useEffect, useRef, useState } from "react";
import audio from "../audio.js";
import { prefersReducedMotion } from "../motion.js";
import { useBodyLock } from "../hooks.js";
import ConfettiBurst from "./ConfettiBurst.jsx";

const AUTO_CLOSE_MS = 9000;
const GLOW_STARS = Array.from({ length: 26 }, (_, index) => index);

/* ------------------------------------------------------------
   Canvas fireworks — pink, white and gold. One animation loop,
   capped device-pixel-ratio and a hard particle budget so the
   browser never gets overwhelmed.
   ------------------------------------------------------------ */
function FireworksCanvas({ active }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return undefined;
    const canvas = canvasRef.current;
    if (!canvas || !canvas.getContext) return undefined;
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    const COLORS = ["#f79ac2", "#ffffff", "#f3d48c", "#e2649b", "#ffe9b8"];
    const MAX_PARTICLES = 420;
    let width = 0;
    let height = 0;
    let rafId = 0;
    let running = true;
    let lastLaunch = 0;
    const rockets = [];
    const particles = [];

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth || window.innerWidth;
      height = canvas.clientHeight || window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    function launch() {
      const x = width * (0.15 + Math.random() * 0.7);
      rockets.push({
        x,
        y: height + 10,
        vx: (Math.random() - 0.5) * 1.4,
        vy: -(Math.random() * 3.2 + 6.4),
        color: COLORS[(Math.random() * COLORS.length) | 0],
        life: 1,
      });
    }

    function burst(rocket) {
      const total = 34 + ((Math.random() * 16) | 0);
      for (let i = 0; i < total; i += 1) {
        if (particles.length >= MAX_PARTICLES) break;
        const angle = (i / total) * Math.PI * 2 + Math.random() * 0.2;
        const speed = Math.random() * 3.4 + 1.4;
        particles.push({
          x: rocket.x,
          y: rocket.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: Math.random() < 0.35 ? "#ffffff" : rocket.color,
          life: 1,
          decay: Math.random() * 0.012 + 0.011,
          size: Math.random() * 2 + 1.4,
        });
      }
    }

    function frame(now) {
      if (!running) return;
      rafId = window.requestAnimationFrame(frame);
      if (document.hidden) return;

      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      if (now - lastLaunch > 260) {
        lastLaunch = now;
        launch();
        if (Math.random() < 0.5) launch();
      }

      for (let i = rockets.length - 1; i >= 0; i -= 1) {
        const rocket = rockets[i];
        rocket.x += rocket.vx;
        rocket.y += rocket.vy;
        rocket.vy += 0.11;
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = rocket.color;
        ctx.beginPath();
        ctx.arc(rocket.x, rocket.y, 2.4, 0, Math.PI * 2);
        ctx.fill();
        if (rocket.vy >= -0.6 || rocket.y < height * 0.16) {
          burst(rocket);
          rockets.splice(i, 1);
        }
      }

      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const particle = particles[i];
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.045;
        particle.vx *= 0.985;
        particle.vy *= 0.985;
        particle.life -= particle.decay;
        if (particle.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = Math.max(particle.life, 0);
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
    }

    rafId = window.requestAnimationFrame(frame);

    return () => {
      running = false;
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      rockets.length = 0;
      particles.length = 0;
    };
  }, [active]);

  return <canvas className="fireworks__canvas" ref={canvasRef} aria-hidden="true" />;
}

/**
 * "LET'S CELEBRATE!" — opens a full-screen celebration with
 * canvas fireworks, pink/white/gold confetti, glowing stars and
 * the birthday headline. Auto-closes, and can be closed by hand.
 */
export default function Fireworks() {
  const [active, setActive] = useState(false);
  const [burst, setBurst] = useState(0);
  const closeRef = useRef(null);
  useBodyLock(active);

  function celebrate() {
    if (active) return;
    audio.playMagic();
    setBurst((value) => value + 1);
    setActive(true);
  }

  function close() {
    setActive(false);
    audio.playClick();
  }

  useEffect(() => {
    if (!active) return undefined;
    const auto = window.setTimeout(() => setActive(false), AUTO_CLOSE_MS);
    const onKey = (event) => {
      if (event.key === "Escape") setActive(false);
    };
    window.addEventListener("keydown", onKey);
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 80);
    return () => {
      window.clearTimeout(auto);
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKey);
    };
  }, [active]);

  return (
    <div className="celebrate">
      <button className="btn btn--glow celebrate__btn" type="button" onClick={celebrate}>
        Let&rsquo;s Celebrate!
      </button>
      <p className="celebrate__hint" aria-hidden="true">
        press for fireworks ✦
      </p>

      {active && (
        <div
          className={`fireworks${prefersReducedMotion ? " is-reduced" : ""}`}
          role="dialog"
          aria-label="Birthday fireworks celebration"
        >
          <FireworksCanvas active={active && !prefersReducedMotion} />

          <div className="fireworks__stars" aria-hidden="true">
            {GLOW_STARS.map((star) => (
              <span
                key={star}
                style={{
                  left: `${(star * 41) % 96 + 2}%`,
                  top: `${(star * 29) % 90 + 4}%`,
                  fontSize: `${12 + (star % 4) * 7}px`,
                  animationDelay: `${(star % 8) * 0.35}s`,
                }}
              >
                ✦
              </span>
            ))}
          </div>

          <ConfettiBurst trigger={burst} count={46} />

          <div className="fireworks__headline">
            <p className="fireworks__eyebrow">19 &amp; Shining</p>
            <h3>Happy 19th Birthday, Esther!</h3>
            <p className="fireworks__sub">
              Joy, laughter, and a bright year ahead ✦
            </p>
          </div>

          <button
            className="fireworks__close"
            type="button"
            ref={closeRef}
            onClick={close}
            aria-label="Close the celebration"
          >
            ✕ close
          </button>
        </div>
      )}
    </div>
  );
}
