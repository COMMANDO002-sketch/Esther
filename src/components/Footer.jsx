import React from "react";
import audio from "../audio.js";
import { scrollToSection } from "../hooks.js";

const QUICK_LINKS = [
  { id: "home", label: "Home" },
  { id: "gallery", label: "Gallery" },
  { id: "memories", label: "Memories" },
  { id: "wishes", label: "Wishes" },
  { id: "surprise", label: "Surprise" },
];

/** Elegant footer with a shimmering gold divider. */
export default function Footer() {
  function goTo(id) {
    audio.playClick();
    scrollToSection(id);
  }

  return (
    <footer className="footer">
      <div className="footer__glow" aria-hidden="true" />
      <div className="container footer__inner">
        <p className="footer__script" data-reveal>
          Celebrating Esther
        </p>

        <div className="footer__divider" data-reveal aria-hidden="true">
          <i />
          <span>✦</span>
          <i />
        </div>

        <p className="footer__main" data-reveal>
          Made with creativity by <span>COMMANDO</span>
        </p>
        <p className="footer__sub" data-reveal style={{ "--d": ".08s" }}>
          Celebrating Esther&rsquo;s 19th Birthday
        </p>

        <nav className="footer__links" aria-label="Footer navigation" data-reveal>
          {QUICK_LINKS.map((link) => (
            <button key={link.id} type="button" onClick={() => goTo(link.id)}>
              {link.label}
            </button>
          ))}
        </nav>

        <p className="footer__credit" data-reveal>
          ✦ Crafted by COMMANDO ✦
        </p>
      </div>
    </footer>
  );
}
