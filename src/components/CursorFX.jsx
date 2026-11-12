import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useMediaQuery } from "../hooks.js";
import { prefersReducedMotion } from "../motion.js";

/**
 * A rose-gold point, silk-soft aura and a capped pool of short-lived
 * sparkles. Mouse movement stays outside React's render cycle.
 */
export default function CursorFX() {
  const auraRef = useRef(null);
  const starRef = useRef(null);
  const sparkleRef = useRef(null);
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const enabled = finePointer && !prefersReducedMotion;

  useEffect(() => {
    if (!enabled) return undefined;

    const aura = auraRef.current;
    const star = starRef.current;
    const sparkle = sparkleRef.current;
    if (!aura || !star || !sparkle) return undefined;

    const particles = Array.from(sparkle.children);
    const quickX = gsap.quickTo(aura, "x", { duration: 0.34, ease: "power3.out" });
    const quickY = gsap.quickTo(aura, "y", { duration: 0.34, ease: "power3.out" });
    let activeMagnet = null;
    let particleIndex = 0;
    let cursorX = window.innerWidth / 2;
    let cursorY = window.innerHeight / 2;
    let lastParticleAt = 0;
    let lastParticleX = 0;
    let lastParticleY = 0;
    let visible = false;

    function clampPoint(x, y) {
      const width = document.documentElement.clientWidth || window.innerWidth;
      const height = window.innerHeight;
      return {
        x: Math.min(Math.max(x, 20), Math.max(20, width - 20)),
        y: Math.min(Math.max(y, 20), Math.max(20, height - 20)),
      };
    }

    function resetMagnet() {
      if (!activeMagnet) return;
      activeMagnet.style.setProperty("--mag-x", "0px");
      activeMagnet.style.setProperty("--mag-y", "0px");
      activeMagnet = null;
    }

    function emitSparkle(x, y) {
      const current = particles[particleIndex % particles.length];
      const direction = particleIndex;
      particleIndex += 1;
      current.getAnimations().forEach((animation) => animation.cancel());
      current.style.left = `${x}px`;
      current.style.top = `${y}px`;
      const driftX = direction % 2 === 0 ? 13 : -13;
      const driftY = direction % 3 === 0 ? -17 : 12;
      current.animate(
        [
          { opacity: 0, transform: "translate3d(-50%, -50%, 0) scale(0.25)" },
          { opacity: 0.9, offset: 0.24 },
          {
            opacity: 0,
            transform: `translate3d(calc(-50% + ${driftX}px), calc(-50% + ${driftY}px), 0) scale(0.8)`,
          },
        ],
        { duration: 560, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
      );
    }

    const onMove = (event) => {
      const point = clampPoint(event.clientX, event.clientY);
      cursorX = point.x;
      cursorY = point.y;
      if (!visible) {
        visible = true;
        document.body.classList.add("has-custom-cursor");
      }
      quickX(point.x);
      quickY(point.y);
      star.style.setProperty("--x", `${point.x}px`);
      star.style.setProperty("--y", `${point.y}px`);

      const target = event.target;
      const button =
        target && target.closest
          ? target.closest(
              ".btn, .gallery__item, .nav__link, .nav__brand, .player__fab, .player__mute-fab, .lightbox__btn, [data-magnetic]",
            )
          : null;
      if (activeMagnet !== button) {
        resetMagnet();
        activeMagnet = button;
      }
      if (button) {
        const bounds = button.getBoundingClientRect();
        const max = 5;
        const dx = Math.max(
          -max,
          Math.min(max, (event.clientX - bounds.left - bounds.width / 2) * 0.08),
        );
        const dy = Math.max(
          -max,
          Math.min(max, (event.clientY - bounds.top - bounds.height / 2) * 0.08),
        );
        button.style.setProperty("--mag-x", `${dx}px`);
        button.style.setProperty("--mag-y", `${dy}px`);
      }

      const photo =
        target && target.closest
          ? target.closest(
              ".gallery__item, .hero__portrait, .about__portrait, .timeline__media, .lightbox__figure",
            )
          : null;
      aura.classList.toggle("is-photo", Boolean(photo));
      aura.classList.toggle("is-button", Boolean(button));

      const now = performance.now();
      const distance = Math.hypot(point.x - lastParticleX, point.y - lastParticleY);
      if (now - lastParticleAt > 72 && distance > 12) {
        emitSparkle(point.x, point.y);
        lastParticleAt = now;
        lastParticleX = point.x;
        lastParticleY = point.y;
      }
    };

    const onResize = () => {
      if (!visible) return;
      const point = clampPoint(cursorX, cursorY);
      cursorX = point.x;
      cursorY = point.y;
      gsap.set(aura, { x: point.x, y: point.y });
      star.style.setProperty("--x", `${point.x}px`);
      star.style.setProperty("--y", `${point.y}px`);
    };
    const onLeave = (event) => {
      if (event.relatedTarget !== null) return;
      visible = false;
      resetMagnet();
      document.body.classList.remove("has-custom-cursor");
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("pointerout", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointerout", onLeave);
      resetMagnet();
      particles.forEach((particle) =>
        particle.getAnimations().forEach((animation) => animation.cancel()),
      );
      gsap.killTweensOf(aura);
      document.body.classList.remove("has-custom-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <span className="cursor-aura" ref={auraRef} aria-hidden="true" />
      <span className="cursor-spark" ref={starRef} aria-hidden="true" />
      <span className="cursor-particles" ref={sparkleRef} aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => (
          <i className={index % 2 === 0 ? "is-gold" : ""} key={index} />
        ))}
      </span>
    </>
  );
}
