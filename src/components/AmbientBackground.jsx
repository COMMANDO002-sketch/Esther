import React, { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../motion.js";

const sparkles = Array.from({ length: 9 }, (_, index) => index);
const glitter = Array.from({ length: 5 }, (_, index) => index);
const stars = Array.from({ length: 4 }, (_, index) => index);
const petals = Array.from({ length: 5 }, (_, index) => index);
const butterflies = Array.from({ length: 2 }, (_, index) => index);
const bubbles = Array.from({ length: 3 }, (_, index) => index);

/**
 * Fixed ambient backdrop: soft pink/white gradient, champagne
 * glows, twinkling sparkles, delicate glitter and a few floating
 * stars. Purely decorative — pointer-events: none.
 */
export default function AmbientBackground() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion) return undefined;

    const glows = Array.from(root.querySelectorAll(".ambient__glow"));
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let pointerFrame = 0;
    let scrollFrame = 0;
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;

    const onPointerMove = (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (pointerFrame) return;
      pointerFrame = window.requestAnimationFrame(() => {
        pointerFrame = 0;
        const x = (pointerX / window.innerWidth - 0.5) * 2;
        const y = (pointerY / window.innerHeight - 0.5) * 2;
        glows.forEach((glow, index) => {
          const depth = (index + 1) * 5;
          glow.style.transform = `translate3d(${-x * depth}px, ${-y * depth}px, 0)`;
        });
      });
    };

    const onScroll = () => {
      if (scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(() => {
        scrollFrame = 0;
        root.style.setProperty(
          "--ambient-scroll",
          `${-Math.min(window.scrollY, 1800) * 0.018}px`,
        );
      });
    };

    if (finePointer) window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      if (finePointer) window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      if (pointerFrame) window.cancelAnimationFrame(pointerFrame);
      if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
    };
  }, []);

  return (
    <div className="ambient" aria-hidden="true" ref={rootRef}>
      <div className="ambient__gradient" />
      <div className="ambient__glow ambient__glow--1" />
      <div className="ambient__glow ambient__glow--2" />
      <div className="ambient__glow ambient__glow--3" />

      <div className="ambient__sparkles">
        {sparkles.map((sparkle) => (
          <span
            className={`ambient__sparkle${sparkle % 3 === 0 ? " is-gold" : ""}`}
            key={sparkle}
            style={{
              left: `${(sparkle * 37) % 98}%`,
              top: `${(sparkle * 53) % 94}%`,
              animationDelay: `${(sparkle % 7) * 0.5}s`,
              animationDuration: `${3 + (sparkle % 5) * 0.6}s`,
            }}
          >
            ✦
          </span>
        ))}
      </div>

      <div className="ambient__glitter">
        {glitter.map((piece) => (
          <span
            key={piece}
            style={{
              left: `${(piece * 47) % 96 + 2}%`,
              top: `${(piece * 31) % 90 + 4}%`,
              animationDelay: `${(piece % 6) * 0.8}s`,
              animationDuration: `${4 + (piece % 4) * 0.9}s`,
            }}
          />
        ))}
      </div>

      <div className="ambient__stars">
        {stars.map((star) => (
          <span
            className="ambient__star"
            key={star}
            style={{
              left: `${6 + ((star * 19) % 86)}%`,
              fontSize: `${13 + (star % 3) * 7}px`,
              animationDuration: `${15 + (star % 4) * 4}s`,
              animationDelay: `${star * -3}s`,
              "--drift": `${star % 2 === 0 ? 40 : -36}px`,
            }}
          >
            ✧
          </span>
        ))}
      </div>

      <div className="ambient__petals">
        {petals.map((petal) => (
          <span
            key={petal}
            style={{
              left: `${8 + ((petal * 29) % 86)}%`,
              animationDelay: `${petal * -1.7}s`,
              animationDuration: `${17 + (petal % 4) * 3}s`,
              "--drift-x": `${petal % 2 === 0 ? 34 : -28}px`,
            }}
          />
        ))}
      </div>

      <div className="ambient__butterflies">
        {butterflies.map((butterfly) => (
          <span
            key={butterfly}
            style={{
              left: `${14 + butterfly * 34}%`,
              top: `${22 + butterfly * 24}%`,
              animationDelay: `${butterfly * -5}s`,
              animationDuration: `${24 + butterfly * 4}s`,
            }}
          >
            <i />
          </span>
        ))}
      </div>

      <div className="ambient__bubbles">
        {bubbles.map((bubble) => (
          <span
            key={bubble}
            style={{
              left: `${12 + ((bubble * 31) % 80)}%`,
              top: `${20 + ((bubble * 23) % 62)}%`,
              animationDelay: `${bubble * -1.8}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
