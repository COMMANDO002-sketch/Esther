import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import estherCenter from "../../images/esther-center.jpg";
import esther1 from "../../images/esther1.jpg";
import esther2 from "../../images/esther2.jpg";
import esther3 from "../../images/esther3.jpg";
import esther4 from "../../images/esther4.jpg";
import esther5 from "../../images/esther5.png";
import audio from "../audio.js";
import { prefersReducedMotion } from "../motion.js";
import { useBodyLock, useMediaQuery } from "../hooks.js";
import SectionHeading from "./SectionHeading.jsx";

/* Every attached photograph, in its original proportions. */
const photos = [
  { src: estherCenter, alt: "Esther smiling softly for the camera", caption: "A friend worth celebrating" },
  { src: esther5, alt: "Esther in a flowing red dress", caption: "Beautiful in red" },
  { src: esther1, alt: "Soft pink and gold artwork reading golden hour glow", caption: "Golden hour glow" },
  { src: esther2, alt: "Soft pink artwork reading forever our favorite", caption: "Forever our favorite" },
  { src: esther3, alt: "Lilac artwork reading a moment to treasure", caption: "A moment to treasure" },
  { src: esther4, alt: "Pink artwork reading pure joy, captured", caption: "Pure joy, captured" },
];

/**
 * Masonry photo gallery with staggered reveals, hover zoom and
 * a full-screen lightbox (keyboard, swipe and button navigation).
 */
export default function Gallery() {
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const reduceMotion = useReducedMotion();
  const isCompact = useMediaQuery("(max-width: 720px)");
  const touchStart = useRef(null);
  const closeRef = useRef(null);
  const lastFocusedRef = useRef(null);

  const isOpen = lightboxIndex >= 0;
  useBodyLock(isOpen);

  const close = useCallback(() => setLightboxIndex(-1), []);
  const goNext = useCallback(
    () => setLightboxIndex((index) => (index + 1) % photos.length),
    [],
  );
  const goPrev = useCallback(
    () => setLightboxIndex((index) => (index - 1 + photos.length) % photos.length),
    [],
  );

  function open(index) {
    lastFocusedRef.current = document.activeElement;
    setLightboxIndex(index);
    audio.playClick();
  }

  /* keyboard navigation inside the lightbox */
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") close();
      else if (event.key === "ArrowRight") goNext();
      else if (event.key === "ArrowLeft") goPrev();
      else if (event.key === "Tab") {
        /* keep focus inside the lightbox controls */
        const dialog = document.getElementById("lightbox");
        if (!dialog) return;
        const focusables = dialog.querySelectorAll("button");
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 60);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(focusTimer);
      if (lastFocusedRef.current && lastFocusedRef.current.focus) {
        lastFocusedRef.current.focus();
      }
    };
  }, [isOpen, close, goNext, goPrev]);

  return (
    <>
      <section className="gallery section" id="gallery" aria-labelledby="gallery-title">
        <div className="container">
          <SectionHeading
            eyebrow="The Photo Collection"
            title="Gallery"
            lead="A few favorite moments. Tap a photo to see it full size."
            id="gallery-title"
          />

          <div className="gallery__grid">
            {photos.map((photo, index) => (
              <motion.button
                className="gallery__item"
                key={photo.src}
                type="button"
                initial={reduceMotion ? false : isCompact
                  ? { opacity: 0, y: 16 }
                  : {
                      opacity: 0,
                      y: 28,
                      rotateX: 3,
                      clipPath: "inset(0 0 72% 0 round 22px)",
                    }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  ...(isCompact ? {} : {
                    rotateX: 0,
                    clipPath: "inset(0 0 0% 0 round 22px)",
                  }),
                }}
                whileHover={reduceMotion ? undefined : {
                  scale: 1.015,
                  y: -3,
                  transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
                }}
                whileTap={reduceMotion ? undefined : { scale: 0.99 }}
                viewport={{ once: true, amount: 0.18 }}
                transition={{
                  duration: reduceMotion ? 0 : isCompact ? 0.62 : 0.85,
                  delay: reduceMotion ? 0 : (index % 3) * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                onClick={() => open(index)}
                aria-label={`Open photo ${index + 1}: ${photo.caption}`}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  decoding="async"
                />
                <span className="gallery__veil" aria-hidden="true" />
                <span className="gallery__caption">
                  <span className="gallery__caption-star" aria-hidden="true">✦</span>
                  {photo.caption}
                </span>
                <span className="gallery__zoom" aria-hidden="true">⤢</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {createPortal(
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              className="lightbox"
              id="lightbox"
              role="dialog"
              aria-modal="true"
              aria-label="Photo viewer"
              initial={reduceMotion ? false : isCompact
                ? { opacity: 0 }
                : { opacity: 0, backdropFilter: "blur(0px)" }}
              animate={isCompact ? { opacity: 1 } : { opacity: 1, backdropFilter: "blur(14px)" }}
              exit={reduceMotion || isCompact
                ? { opacity: 0 }
                : { opacity: 0, backdropFilter: "blur(0px)" }}
              transition={{ duration: reduceMotion ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}
              onClick={(event) => {
                if (event.target === event.currentTarget) close();
              }}
              onTouchStart={(event) => {
                touchStart.current = event.touches[0].clientX;
              }}
              onTouchEnd={(event) => {
                if (touchStart.current === null) return;
                const distance = event.changedTouches[0].clientX - touchStart.current;
                touchStart.current = null;
                if (Math.abs(distance) > 50) {
                  if (distance < 0) goNext();
                  else goPrev();
                }
              }}
            >
              <div className="lightbox__chrome">
                <button
                  className="lightbox__btn lightbox__close"
                  type="button"
                  ref={closeRef}
                  onClick={close}
                  aria-label="Close photo viewer"
                >
                  ✕
                </button>
                <p className="lightbox__count" aria-live="polite">
                  {lightboxIndex + 1} / {photos.length}
                </p>
              </div>

              <button
                className="lightbox__btn lightbox__nav lightbox__prev"
                type="button"
                onClick={goPrev}
                aria-label="Previous photo"
              >
                ‹
              </button>

              <AnimatePresence mode="wait" initial={false}>
                <motion.figure
                  className="lightbox__figure"
                  key={photos[lightboxIndex].src}
                  initial={reduceMotion ? false : isCompact
                    ? { opacity: 0, scale: 0.98 }
                    : { opacity: 0, scale: 0.96, filter: "blur(9px)", rotateY: -2 }}
                  animate={isCompact
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 1, scale: 1, filter: "blur(0px)", rotateY: 0 }}
                  exit={reduceMotion || isCompact
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 0.985, filter: "blur(7px)" }}
                  transition={{
                    duration: reduceMotion ? 0 : isCompact ? 0.28 : 0.42,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <img src={photos[lightboxIndex].src} alt={photos[lightboxIndex].alt} />
                  <figcaption>{photos[lightboxIndex].caption}</figcaption>
                </motion.figure>
              </AnimatePresence>

              <button
                className="lightbox__btn lightbox__nav lightbox__next"
                type="button"
                onClick={goNext}
                aria-label="Next photo"
              >
                ›
              </button>

              <div className="lightbox__dots" aria-label="Choose a photo">
                {photos.map((photo, index) => (
                  <button
                    key={photo.src}
                    type="button"
                    className={index === lightboxIndex ? "is-active" : ""}
                    onClick={() => setLightboxIndex(index)}
                    aria-label={`Show photo ${index + 1}`}
                    aria-pressed={index === lightboxIndex}
                  />
                ))}
              </div>

              {!prefersReducedMotion && (
                <p className="lightbox__hint" aria-hidden="true">
                  use ← → keys or swipe
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}
