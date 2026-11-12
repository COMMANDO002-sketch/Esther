import React, { useEffect, useRef } from "react";
import esther5 from "../../images/esther5.png";
import audio from "../audio.js";
import { prefersReducedMotion } from "../motion.js";
import { scrollToSection } from "../hooks.js";

const orbitStars = Array.from({ length: 7 }, (_, index) => index);

/**
 * Hero: the first section after the intro. Big cinematic photo
 * reveal, soft pink + gold gradients, floating particles and a
 * gentle parallax on the portrait.
 */
export default function Hero({ ready }) {
  const mediaRef = useRef(null);

  /* gentle parallax — disabled for reduced motion & touch devices */
  useEffect(() => {
    if (prefersReducedMotion) return undefined;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return undefined;
    }
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const node = mediaRef.current;
        if (!node) return;
        const offset = Math.min(window.scrollY, 700);
        node.style.setProperty("--parallax", `${offset * 0.06}px`);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  function explore() {
    audio.playClick();
    scrollToSection("about");
  }

  function openGallery() {
    audio.playClick();
    scrollToSection("gallery");
  }

  return (
    <section className="hero section" id="home" aria-labelledby="hero-title">
      <div className="hero__glow hero__glow--a" aria-hidden="true" />
      <div className="hero__glow hero__glow--b" aria-hidden="true" />

      <div className="hero__inner">
        <div className={`hero__copy${ready ? " is-in" : ""}`}>
          <p className="hero__eyebrow">
            <span aria-hidden="true">✦</span>
            Belated Birthday Celebration · 11 November
          </p>

          <h1 className="hero__title" id="hero-title">
            Celebrating 19 Years of{" "}
            <span className="hero__title-accent">Beautiful Moments</span>
          </h1>

          <p className="hero__script" aria-hidden="true">
            Happy Belated Birthday, Esther
          </p>

          <p className="hero__lead">
            A day for good memories, warm wishes, and everything ahead.
          </p>

          <div className="hero__actions">
            <button className="btn btn--glow" type="button" onClick={explore}>
              Explore the Celebration
            </button>
            <button className="btn btn--ghost" type="button" onClick={openGallery}>
              View the Gallery
            </button>
          </div>

          <ul className="hero__facts">
            <li>
              <strong>19</strong>
              <span>Years of light</span>
            </li>
            <li>
              <strong>11·11</strong>
              <span>Birthday date</span>
            </li>
            <li>
              <strong>∞</strong>
              <span>Reasons to smile</span>
            </li>
          </ul>
        </div>

        <div
          className={`hero__media${ready ? " is-in" : ""}`}
          ref={mediaRef}
          data-magnetic
        >
          <span className="hero__frame" aria-hidden="true" />
          <figure className="hero__portrait">
            <img
              src={esther5}
              alt="Esther looking radiant in a red dress"
              fetchPriority="high"
              decoding="async"
            />
            <span className="hero__sheen" aria-hidden="true" />
          </figure>

          <span className="hero__badge">
            <strong>19</strong>
            &amp; Shining
          </span>

          <span className="hero__chip hero__chip--top" aria-hidden="true">
            ✦ a friend worth celebrating
          </span>
          <span className="hero__chip hero__chip--bottom" aria-hidden="true">
            keep shining ✧
          </span>

          <div className="hero__orbit" aria-hidden="true">
            {orbitStars.map((star) => (
              <span
                key={star}
                style={{ "--a": `${(star / orbitStars.length) * 360}deg` }}
              >
                ✦
              </span>
            ))}
          </div>
        </div>
      </div>

      <button
        className="hero__scroll"
        type="button"
        onClick={explore}
        aria-label="Scroll to celebrate"
      >
        <span className="hero__scroll-line" aria-hidden="true" />
        scroll
      </button>
    </section>
  );
}
