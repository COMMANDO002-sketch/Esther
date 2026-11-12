import React, { useEffect, useState } from "react";
import audio from "../audio.js";
import { scrollToSection, useBodyLock } from "../hooks.js";

const LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About Esther" },
  { id: "gallery", label: "Gallery" },
  { id: "memories", label: "Memories" },
  { id: "wishes", label: "Birthday Wishes" },
  { id: "surprise", label: "Surprise" },
];

/**
 * Sticky glass navigation bar with an active-section indicator
 * and an animated hamburger menu on small screens.
 */
export default function Navbar({ ready }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeId, setActiveId] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useBodyLock(isMenuOpen);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* highlight the section currently in view */
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return undefined;
    const sections = LINKS.map((link) => document.getElementById(link.id)).filter(
      Boolean,
    );
    if (!sections.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-42% 0px -52% 0px", threshold: 0 },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [ready]);

  useEffect(() => {
    if (!isMenuOpen) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMenuOpen]);

  function goTo(id) {
    audio.playClick();
    setIsMenuOpen(false);
    scrollToSection(id);
  }

  return (
    <header
      className={`nav${isScrolled ? " is-scrolled" : ""}${ready ? " is-ready" : ""}`}
    >
      <div className="nav__inner">
        <button
          className="nav__brand"
          type="button"
          onClick={() => goTo("home")}
          aria-label="Back to the top — Celebrating Esther"
        >
          <span className="nav__brand-mark" aria-hidden="true">✦</span>
          <span className="nav__brand-text">
            Esther <em>19</em>
          </span>
        </button>

        <nav className="nav__links" aria-label="Main navigation">
          {LINKS.map((link) => (
            <button
              key={link.id}
              className={`nav__link${activeId === link.id ? " is-active" : ""}`}
              type="button"
              onClick={() => goTo(link.id)}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <button
          className={`nav__burger${isMenuOpen ? " is-open" : ""}`}
          type="button"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div
        className={`nav__mobile${isMenuOpen ? " is-open" : ""}`}
        aria-hidden={!isMenuOpen}
      >
        <p className="nav__mobile-eyebrow">Celebrate with us</p>
        {LINKS.map((link, index) => (
          <button
            key={link.id}
            className={`nav__mobile-link${activeId === link.id ? " is-active" : ""}`}
            type="button"
            tabIndex={isMenuOpen ? 0 : -1}
            style={{ "--i": index }}
            onClick={() => goTo(link.id)}
          >
            <span className="nav__mobile-index">0{index + 1}</span>
            {link.label}
          </button>
        ))}
        <p className="nav__mobile-credit">Crafted by COMMANDO</p>
      </div>
    </header>
  );
}
