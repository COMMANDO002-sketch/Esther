import React, { useEffect, useState } from "react";
import audio from "../audio.js";
import { prefersReducedMotion } from "../motion.js";

/** Smooth back-to-top button that fades in once you scroll. */
export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsVisible(window.scrollY > 640);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function toTop() {
    audio.playClick();
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }

  return (
    <button
      className={`back-to-top${isVisible ? " is-visible" : ""}`}
      type="button"
      onClick={toTop}
      tabIndex={isVisible ? 0 : -1}
      aria-label="Back to top"
      aria-hidden={!isVisible}
    >
      <span aria-hidden="true">↑</span>
      <i className="back-to-top__ring" aria-hidden="true" />
    </button>
  );
}
