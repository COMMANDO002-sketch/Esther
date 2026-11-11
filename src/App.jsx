import React, { useEffect, useRef, useState } from "react";
import estherCenter from "../images/esther-center.jpg";
import esther1 from "../images/esther1.jpg";
import audio from "./audio.js";
import EnvelopeLetter from "./EnvelopeLetter.jsx";
import FinalSurprise from "./FinalSurprise.jsx";
import { prefersReducedMotion as reducedMotion } from "./motion.js";

const photos = [
  { type: "photo", src: estherCenter, alt: "Esther in a beautiful red dress", caption: "Beautiful in red ❤️" },
  { type: "photo", src: esther1, alt: "Esther — a beautiful moment", caption: "Simply stunning ✨" },
  { type: "message", icon: "💖", message: "Your smile makes ordinary moments feel magical.", caption: "You make life sweeter ✨" },
  { type: "message", icon: "🌸", message: "You have the kindest heart and the loveliest soul.", caption: "A heart as beautiful as yours" },
  { type: "message", icon: "✨", message: "You deserve every beautiful thing life has to offer.", caption: "Only the sweetest things for you" },
];

const sparkles = Array.from({ length: 28 }, (_, index) => index);
const hearts = Array.from({ length: 7 }, (_, index) => index);
const glitter = Array.from({ length: 16 }, (_, index) => index);
const burstItems = Array.from({ length: 28 }, (_, index) => index);
const confetti = Array.from({ length: 36 }, (_, index) => index);
const balloons = Array.from({ length: 8 }, (_, index) => index);
const waveHearts = Array.from({ length: 14 }, (_, index) => index);
const themes = [
  { id: "rose", label: "Rose", swatch: "#f47aae" },
  { id: "lavender", label: "Lavender", swatch: "#aa85e8" },
  { id: "peach", label: "Peach", swatch: "#f29b83" },
  { id: "mint", label: "Mint", swatch: "#62b99a" },
  { id: "sky", label: "Sky blue", swatch: "#66a9d8" },
];

const wishCards = [
  ["🌸", "You deserve the whole world — and so much more."],
  ["✨", "May every dream in your heart find its way home."],
  ["💖", "Thank you for being endlessly, beautifully YOU."],
];

/* ------------------------------------------------------------
   Background: animated gradient, glows, sparkles, glitter, hearts
   ------------------------------------------------------------ */
function Background() {
  return (
    <div className="bg" aria-hidden="true">
      <div className="bg-gradient" />
      <div className="bg-glow bg-glow--1" />
      <div className="bg-glow bg-glow--2" />
      <div className="bg-glow bg-glow--3" />
      <div className="sparkles">
        {sparkles.map((sparkle) => (
          <span
            className={`sparkle${sparkle % 4 === 0 ? " gold" : ""}`}
            key={sparkle}
            style={{
              left: `${(sparkle * 37) % 100}%`,
              top: `${(sparkle * 61) % 100}%`,
              animationDelay: `${(sparkle % 8) * 0.4}s`,
            }}
          >
            ✦
          </span>
        ))}
      </div>
      <div className="glitter">
        {glitter.map((piece) => (
          <span
            key={piece}
            style={{
              left: `${(piece * 53) % 97 + 2}%`,
              top: `${(piece * 29) % 88 + 6}%`,
              animationDelay: `${(piece % 6) * 0.7}s`,
              animationDuration: `${4.5 + (piece % 5) * 0.8}s`,
            }}
          />
        ))}
      </div>
      <div className="hearts-layer">
        {hearts.map((heart) => (
          <span
            className="float-heart"
            key={heart}
            style={{
              left: `${8 + ((heart * 17) % 88)}%`,
              fontSize: `${14 + (heart % 3) * 8}px`,
              animationDuration: `${14 + (heart % 4) * 3}s`,
              animationDelay: `${heart * -2}s`,
              "--drift": `${heart % 2 === 0 ? 34 : -28}px`,
              color: heart % 2 === 0 ? "#ff8fc2" : "#b68aff",
            }}
          >
            ♥
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------
   3D gift box (+ ribbon loosening, glints and confetti burst)
   ------------------------------------------------------------ */
function Gift({ isOpening, isShaking, isOpen, showBurst, onOpen }) {
  return (
    <div className={`gift-stage${isOpen ? " opened" : ""}`} id="giftStage">
      <div className="gift-float">
        <div className="gift-view">
          <button
            className={`gift${isShaking ? " shake untying" : ""}${isOpen ? " open" : ""}`}
            id="gift"
            type="button"
            onClick={onOpen}
            disabled={isOpening}
            aria-label="Open your birthday gift"
            aria-disabled={isOpening}
          >
            <span className="gift-box">
              <span className="box-face box-front">
                <span className="ribbon-v" />
              </span>
              <span className="box-face box-back">
                <span className="ribbon-v" />
              </span>
              <span className="box-face box-left">
                <span className="ribbon-v" />
              </span>
              <span className="box-face box-right">
                <span className="ribbon-v" />
              </span>
              <span className="box-face box-bottom" />
              <span className="box-lining lining-back" />
              <span className="box-lining lining-front" />
              <span className="box-lining lining-left" />
              <span className="box-lining lining-right" />
              <span className="box-lining lining-floor" />
              <span className="inner-glow" />
            </span>
            <span className="lid-hinge" id="lidHinge">
              <span className="lid-top">
                <span className="ribbon-lid-h" />
                <span className="ribbon-lid-v" />
                <span className="bow">
                  <span className="bow-loop bow-loop--l" />
                  <span className="bow-loop bow-loop--r" />
                  <span className="bow-knot" />
                  <span className="bow-tail bow-tail--l" />
                  <span className="bow-tail bow-tail--r" />
                </span>
              </span>
              <span className="lid-face lid-front">
                <span className="ribbon-lid-v" />
              </span>
              <span className="lid-face lid-back">
                <span className="ribbon-lid-v" />
              </span>
              <span className="lid-face lid-left">
                <span className="ribbon-lid-v" />
              </span>
              <span className="lid-face lid-right">
                <span className="ribbon-lid-v" />
              </span>
            </span>
          </button>

          {showBurst && (
            <span className="burst" id="burst" aria-hidden="true">
              {burstItems.map((item) => {
                if (item < 5) {
                  return (
                    <span
                      className="burst-item balloon"
                      key={item}
                      style={{
                        "--dx": `${(item - 7) * 22}px`,
                        "--rise": `${-36 - (item % 4) * 4}vh`,
                        animationDelay: `${item * 0.07}s, ${item * 0.07 + 2.3}s`,
                      }}
                    >
                      <span className="balloon-body" />
                      <span className="balloon-string" />
                    </span>
                  );
                }
                if (item < 16) {
                  return (
                    <span
                      className="burst-item burst-heart"
                      key={item}
                      style={{
                        "--dx": `${(item - 10) * 22}px`,
                        "--rise": `${-36 - (item % 4) * 4}vh`,
                        animationDelay: `${item * 0.07}s, ${item * 0.07 + 2.3}s, ${item * 0.07}s`,
                      }}
                    >
                      {item % 2 === 0 ? "♥" : "✦"}
                    </span>
                  );
                }
                const angle = (item / burstItems.length) * Math.PI * 2;
                const reach = 140 + (item % 5) * 46;
                const style = {
                  "--gx": `${Math.round(Math.cos(angle) * reach)}px`,
                  "--gy": `${Math.round(Math.sin(angle) * reach) - 90}px`,
                  animationDelay: `${(item - 16) * 0.05}s`,
                };
                if (item < 22) {
                  return (
                    <span className="burst-item burst-glint" key={item} style={style}>
                      ✦
                    </span>
                  );
                }
                return (
                  <span
                    className="burst-item burst-confetti"
                    key={item}
                    style={{
                      ...style,
                      backgroundColor: `hsl(${(item * 47) % 360}, 85%, 76%)`,
                    }}
                  />
                );
              })}
            </span>
          )}
        </div>
      </div>
      <p className={`gift-hint${isOpen ? " hide" : ""}`} id="giftHint">
        ✨ tap the gift to open ✨
      </p>
    </div>
  );
}

function splitTitle(text, lineIndex) {
  return Array.from(text).map((character, index) => (
    <span
      className="ch"
      key={`${lineIndex}-${index}`}
      style={{ "--cd": `${0.3 + lineIndex * 0.34 + index * 0.04}s` }}
    >
      {character === " " ? "\u00a0" : character}
    </span>
  ));
}

/* ------------------------------------------------------------
   Landing screen
   ------------------------------------------------------------ */
function Landing({
  active,
  isOpening,
  isShaking,
  isOpen,
  showBurst,
  isContentVisible,
  isCinematic,
  onOpen,
}) {
  return (
    <section
      className={`screen screen--landing intro${active ? " active" : ""}${isCinematic ? " cinematic" : ""}`}
      id="screenLanding"
      aria-label="Birthday landing"
    >
      <span className="brand-chip">✦ COMMANDO</span>

      <div className={`landing-content${isContentVisible ? "" : " gone"}`} id="landingContent">
        <p className="eyebrow">A Special Surprise For Someone Special ❤️</p>
        <h1 className="title" id="landingTitle">
          <span className="line" data-split>{splitTitle("HAPPY BIRTHDAY,", 0)}</span>
          <span className="line line--name" data-split>{splitTitle("ESTHER!", 1)}</span>
        </h1>
        <div className="essie">
          <span className="essie-heart" aria-hidden="true">❤</span>
          <span className="essie-text">Essie</span>
          <span className="essie-heart" aria-hidden="true">❤</span>
        </div>
      </div>

      <Gift
        isOpening={isOpening}
        isShaking={isShaking}
        isOpen={isOpen}
        showBurst={showBurst}
        onOpen={onOpen}
      />

      <button
        className="btn"
        id="openBtn"
        type="button"
        onClick={onOpen}
        disabled={isOpening}
      >
        {isOpening ? "Opening your surprise…" : "OPEN YOUR SURPRISE 🎁"}
      </button>
    </section>
  );
}

/* ------------------------------------------------------------
   Intersection Observer scroll reveals (with safety fallback)
   ------------------------------------------------------------ */
function useScrollReveal(active) {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const nodes = Array.from(root.querySelectorAll("[data-io]"));
    if (!nodes.length) return undefined;

    const revealAll = () => nodes.forEach((node) => node.classList.add("io-in"));

    if (reducedMotion || typeof IntersectionObserver === "undefined") {
      revealAll();
      return undefined;
    }

    // safety net: if the observer never reports at all, reveal everything
    // (a working IntersectionObserver always delivers its first batch)
    let reported = false;
    const observer = new IntersectionObserver(
      (entries) => {
        reported = true;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("io-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -5% 0px" },
    );
    nodes.forEach((node) => observer.observe(node));

    const fallback = window.setTimeout(() => {
      if (!reported) revealAll();
    }, 2800);
    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, [active]);

  return rootRef;
}

/* ------------------------------------------------------------
   Surprise screen (wishes + photo gallery)
   ------------------------------------------------------------ */
function Surprise({ active, onContinue }) {
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [isGalleryPaused, setIsGalleryPaused] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [selectedCard, setSelectedCard] = useState(-1);
  const [showFirstDelay, setShowFirstDelay] = useState(true);
  const touchStart = useRef(null);
  const frameRef = useRef(null);
  const rootRef = useScrollReveal(active);
  const typeLine = "Today is all about celebrating YOU!";

  useEffect(() => {
    if (reducedMotion) {
      setTypedText(typeLine);
      return undefined;
    }
    let position = 0;
    const timer = window.setInterval(() => {
      position += 1;
      setTypedText(typeLine.slice(0, position));
      if (position >= typeLine.length) window.clearInterval(timer);
    }, 55);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowFirstDelay(false), 2600);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (reducedMotion || isGalleryPaused) return undefined;
    const timer = window.setInterval(() => {
      setGalleryIndex((index) => (index + 1) % photos.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [isGalleryPaused]);

  useEffect(() => {
    function handleArrowKeys(event) {
      if (event.key === "ArrowRight") {
        setGalleryIndex((index) => (index + 1) % photos.length);
      } else if (event.key === "ArrowLeft") {
        setGalleryIndex((index) => (index - 1 + photos.length) % photos.length);
      }
    }
    window.addEventListener("keydown", handleArrowKeys);
    return () => window.removeEventListener("keydown", handleArrowKeys);
  }, []);

  /* subtle 3D tilt of the photo frame (pointer devices only) */
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || reducedMotion) return undefined;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return undefined;

    function handleMove(event) {
      const rect = frame.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      const rx = `${(-py * 9).toFixed(2)}deg`;
      const ry = `${(px * 11).toFixed(2)}deg`;
      frame.style.setProperty("--frx", rx);
      frame.style.setProperty("--fry", ry);
      frame.style.setProperty("--photo-tilt-x", rx);
      frame.style.setProperty("--photo-tilt-y", ry);
    }
    function handleLeave() {
      frame.style.setProperty("--frx", "0deg");
      frame.style.setProperty("--fry", "0deg");
      frame.style.setProperty("--photo-tilt-x", "0deg");
      frame.style.setProperty("--photo-tilt-y", "0deg");
    }
    frame.addEventListener("pointermove", handleMove);
    frame.addEventListener("pointerleave", handleLeave);
    return () => {
      frame.removeEventListener("pointermove", handleMove);
      frame.removeEventListener("pointerleave", handleLeave);
    };
  }, []);

  function showPhoto(index) {
    setGalleryIndex((current) => (index + photos.length) % photos.length);
  }

  function handleTouchEnd(event) {
    if (touchStart.current === null) return;
    const distance = event.changedTouches[0].clientX - touchStart.current;
    touchStart.current = null;
    if (Math.abs(distance) > 45) {
      showPhoto(galleryIndex + (distance < 0 ? 1 : -1));
    }
  }

  return (
    <section
      className={`screen screen--surprise${active ? " active" : ""}`}
      id="screenSurprise"
      aria-label="Birthday surprise"
      ref={rootRef}
    >
      <div className="surprise-inner">
        <header className="surprise-head">
          <p className="ornament io-reveal" data-io style={{ "--d": ".05s" }} aria-hidden="true">❦ ❦ ❦</p>
          <h2 className="hey io-reveal" data-io id="surprise-title" style={{ "--d": ".12s" }}>HEY ESSIE! ❤️</h2>
          <p className="lead io-reveal" data-io style={{ "--d": ".22s" }} id="typeLine">
            {typedText}
            {typedText.length < typeLine.length && <span className="caret" aria-hidden="true" />}
          </p>
          <p className="sub io-reveal" data-io style={{ "--d": ".32s" }}>
            Every smile, every dream, every beautiful part of you — today we celebrate it all.
          </p>
        </header>

        <div className="msg-cards">
          {wishCards.map(([icon, message], index) => (
            <article
              className={`msg-card io-reveal${selectedCard === index ? " is-selected" : ""}`}
              data-io
              key={message}
              style={{ "--d": `${0.4 + index * 0.12}s` }}
              tabIndex={0}
              role="button"
              aria-pressed={selectedCard === index}
              aria-label={message}
              onClick={() => {
                audio.playClick();
                setSelectedCard((current) => (current === index ? -1 : index));
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setSelectedCard((current) => (current === index ? -1 : index));
                }
              }}
            >
              <span className="msg-card-body">
                <span className="msg-ico">{icon}</span>
                <p>{message}</p>
              </span>
            </article>
          ))}
        </div>

        <div className="gallery io-reveal" data-io style={{ "--d": ".72s" }}>
          <div
            className="gallery-frame"
            id="galleryFrame"
            ref={frameRef}
            onMouseEnter={() => setIsGalleryPaused(true)}
            onMouseLeave={() => setIsGalleryPaused(false)}
          >
            <div
              className="gallery-stage"
              id="galleryStage"
              style={showFirstDelay ? { "--pd": "0.55s" } : undefined}
              onTouchStart={(event) => {
                touchStart.current = event.touches[0].clientX;
              }}
              onTouchEnd={handleTouchEnd}
            >
              {photos.map((photo, index) => (
                <figure
                  className={`slide${index === galleryIndex ? " is-active" : ""}`}
                  key={photo.src || photo.message}
                  data-caption={photo.caption}
                >
                  {photo.type === "photo" ? (
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      draggable="false"
                      onError={(event) => event.currentTarget.parentElement.classList.add("no-img")}
                    />
                  ) : (
                    <div className="slide-message">
                      <span className="slide-message-icon" aria-hidden="true">{photo.icon}</span>
                      <p>{photo.message}</p>
                      <span className="slide-message-flourish" aria-hidden="true">✦　♡　✦</span>
                    </div>
                  )}
                </figure>
              ))}
            </div>
            <span className="frame-hearts" aria-hidden="true">
              <span className="frame-heart">♥</span>
              <span className="frame-heart">♥</span>
              <span className="frame-heart">✦</span>
              <span className="frame-heart">♥</span>
              <span className="frame-heart">♥</span>
            </span>
            <button
              className="gal-nav gal-prev"
              type="button"
              aria-label="Previous photo"
              onClick={() => showPhoto(galleryIndex - 1)}
            >
              ‹
            </button>
            <button
              className="gal-nav gal-next"
              type="button"
              aria-label="Next photo"
              onClick={() => showPhoto(galleryIndex + 1)}
            >
              ›
            </button>
          </div>

          <div className="gallery-meta">
            <p className="gal-caption" id="galCaption" key={galleryIndex}>{photos[galleryIndex].caption}</p>
            <div className="gal-dots" id="galDots" aria-label="Choose a photo">
              {photos.map((photo, index) => (
                <button
                  className={`gal-dot${index === galleryIndex ? " is-active" : ""}`}
                  key={photo.src}
                  type="button"
                  aria-label={`Show photo ${index + 1}`}
                  aria-pressed={index === galleryIndex}
                  onClick={() => showPhoto(index)}
                />
              ))}
            </div>
            <p className="gal-count" id="galCount">{galleryIndex + 1} / {photos.length}</p>
          </div>
        </div>

        <div className="final-cta io-reveal" data-io style={{ "--d": ".82s" }}>
          <button
            className="btn"
            id="toFinalBtn"
            type="button"
            onClick={() => {
              audio.playClick();
              onContinue();
            }}
          >
            READ YOUR FINAL MESSAGE ❤️
          </button>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------
   Final screen: envelope scene + the original birthday letter
   ------------------------------------------------------------ */
function FinalMessage({ active, onReplay, onOneLast }) {
  const [phase, setPhase] = useState("envelope");

  return (
    <section
      className={`screen screen--final${active ? " active" : ""}`}
      id="screenFinal"
      aria-label="Final birthday message"
    >
      <div className="confetti" aria-hidden="true">
        {confetti.map((piece) => (
          <span
            key={piece}
            style={{
              left: `${(piece * 47) % 100}%`,
              animationDelay: `-${((piece * 17) % 30) / 5}s`,
              animationDuration: `${3 + (piece % 5) * 0.6}s`,
              backgroundColor: `hsl(${piece * 37}, 80%, 75%)`,
            }}
          />
        ))}
      </div>
      <div className="final-balloons" id="finalBalloons" aria-hidden="true">
        {balloons.map((balloon) => (
          <span
            className="balloon"
            key={balloon}
            style={{
              left: `${4 + ((balloon * 17) % 88)}%`,
              "--bs": `${0.75 + (balloon % 4) * 0.1}`,
              "--sway": `${balloon % 2 === 0 ? 36 : -36}px`,
              animationDuration: `${11 + (balloon % 5) * 2}s`,
              animationDelay: `${balloon * -1.7}s`,
            }}
          >
            <span className="balloon-body" />
            <span className="balloon-string" />
          </span>
        ))}
      </div>

      <EnvelopeLetter onPhase={setPhase} />

      <div className={`letter-cta${phase === "read" ? " is-visible" : ""}`}>
        <button
          className="btn btn--ghost"
          id="replayBtn"
          type="button"
          onClick={() => {
            audio.playClick();
            onReplay();
          }}
        >
          ↺ &nbsp;PLAY IT AGAIN
        </button>
        <button
          className="btn"
          id="oneLastBtn"
          type="button"
          onClick={() => {
            audio.playClick();
            onOneLast();
          }}
        >
          ONE LAST THING… ✦
        </button>
      </div>

      <footer className={`final-brand${phase === "read" ? " io-reveal io-in" : " io-reveal"}`}>
        DESIGNED WITH ❤️ BY <span>COMMANDO</span>
      </footer>
    </section>
  );
}

/* ------------------------------------------------------------
   Music dock + transition effects
   ------------------------------------------------------------ */
function MusicToggle({ theme, onThemeChange }) {
  const [state, setState] = useState(() => audio.getState());
  const [isThemePickerOpen, setIsThemePickerOpen] = useState(false);

  useEffect(() => audio.subscribe(setState), []);

  return (
    <div className="music-dock" role="group" aria-label="Background music controls">
      <button
        className="music-btn music-btn--mute"
        type="button"
        onClick={() => audio.toggleMute()}
        aria-pressed={state.muted}
        aria-label={state.muted ? "Unmute" : "Mute"}
      >
        {state.muted ? "🔇" : "🔊"}
      </button>
      <div className="theme-picker-wrap">
        <button
          className="music-btn theme-picker-toggle"
          type="button"
          aria-label="Choose site colors"
          aria-expanded={isThemePickerOpen}
          onClick={() => setIsThemePickerOpen((open) => !open)}
        >
          🎨
        </button>
        {isThemePickerOpen && (
          <div className="theme-picker" role="group" aria-label="Choose a site color theme">
            <p>Pick your colors</p>
            {themes.map((option) => (
              <button
                className={`theme-option${theme === option.id ? " is-selected" : ""}`}
                key={option.id}
                type="button"
                aria-pressed={theme === option.id}
                onClick={() => onThemeChange(option.id)}
              >
                <span className="theme-swatch" style={{ "--swatch": option.swatch }} />
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
      {state.audioError && (
        <span className="music-error" role="status">{state.audioError}</span>
      )}
    </div>
  );
}

function TransitionLayer({ flashKey, waveKey }) {
  if (reducedMotion) return null;
  return (
    <>
      {flashKey > 0 && <span className="light-flash" key={`flash-${flashKey}`} aria-hidden="true" />}
      {waveKey > 0 && (
        <span className="heart-wave" key={`wave-${waveKey}`} aria-hidden="true">
          {waveHearts.map((heart) => (
            <span
              className={`wave-heart${heart % 3 === 0 ? " gold" : heart % 3 === 1 ? " lilac" : ""}`}
              key={heart}
              style={{
                left: `${4 + ((heart * 13) % 92)}%`,
                fontSize: `${13 + (heart % 3) * 7}px`,
                "--wd": `${heart % 2 === 0 ? 40 : -36}px`,
                animationDelay: `${(heart % 7) * 0.09}s`,
              }}
            >
              ♥
            </span>
          ))}
        </span>
      )}
    </>
  );
}

/* ------------------------------------------------------------
   App
   ------------------------------------------------------------ */
function App() {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = window.localStorage.getItem("essie:theme");
      return themes.some((option) => option.id === saved) ? saved : "rose";
    } catch {
      return "rose";
    }
  });
  const [isThemeShaking, setIsThemeShaking] = useState(false);
  const [screen, setScreen] = useState("landing");
  const [stack, setStack] = useState(["landing"]);
  const [isOpening, setIsOpening] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [isGiftOpen, setIsGiftOpen] = useState(false);
  const [showBurst, setShowBurst] = useState(false);
  const [isLandingTextVisible, setIsLandingTextVisible] = useState(true);
  const [isCinematic, setIsCinematic] = useState(false);
  const [isPreloaderVisible, setIsPreloaderVisible] = useState(true);
  const [flashKey, setFlashKey] = useState(0);
  const [waveKey, setWaveKey] = useState(0);
  const openingRef = useRef(false);
  const timers = useRef([]);
  const themeShakeTimer = useRef(null);

  /* preloader + timer cleanup */
  useEffect(() => {
    const preloaderTimer = window.setTimeout(() => setIsPreloaderVisible(false), 900);
    return () => {
      window.clearTimeout(preloaderTimer);
      timers.current.forEach(window.clearTimeout);
      timers.current = [];
      if (themeShakeTimer.current) window.clearTimeout(themeShakeTimer.current);
    };
  }, []);

  /* Try autoplay, then retry after the first gesture if the browser blocks it. */
  useEffect(() => {
    audio.autoStart();
    function handleGesture() {
      audio.unlock();
      audio.autoStart();
      window.removeEventListener("pointerdown", handleGesture);
      window.removeEventListener("keydown", handleGesture);
    }
    window.addEventListener("pointerdown", handleGesture);
    window.addEventListener("keydown", handleGesture);
    return () => {
      window.removeEventListener("pointerdown", handleGesture);
      window.removeEventListener("keydown", handleGesture);
    };
  }, []);

  /* keep only the current screen mounted (plus its parent) */
  useEffect(() => {
    if (stack.length <= 1) return undefined;
    const keep =
      screen === "heart" && stack.includes("final") ? ["final", "heart"] : [screen];
    const timer = window.setTimeout(() => {
      setStack((current) => {
        const unchanged =
          current.length === keep.length &&
          keep.every((name, index) => current[index] === name);
        // return the same reference so React bails out (no render loop)
        return unchanged ? current : keep;
      });
    }, 1100);
    return () => window.clearTimeout(timer);
  }, [stack, screen]);

  function schedule(callback, delay) {
    timers.current.push(window.setTimeout(callback, delay));
  }

  function clearTimers() {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
  }

  function triggerTransition() {
    setFlashKey((key) => key + 1);
    setWaveKey((key) => key + 1);
  }

  function changeTheme(nextTheme) {
    setTheme(nextTheme);
    try {
      window.localStorage.setItem("essie:theme", nextTheme);
    } catch {
      // The selected palette still applies for this visit.
    }
    if (themeShakeTimer.current) window.clearTimeout(themeShakeTimer.current);
    setIsThemeShaking(false);
    window.requestAnimationFrame(() => setIsThemeShaking(true));
    themeShakeTimer.current = window.setTimeout(() => setIsThemeShaking(false), 560);
  }

  function goTo(next) {
    if (next === screen) return;
    setScreen(next);
    setStack((current) => [...current.filter((name) => name !== next), next]);
    triggerTransition();
  }

  function openSurprise() {
    if (openingRef.current || screen !== "landing") return;
    openingRef.current = true;
    audio.unlock(); // real user gesture → audio is allowed from here on
    setIsOpening(true);
    schedule(() => audio.playMagic(), 120);

    if (reducedMotion) {
      schedule(() => {
        setIsGiftOpen(true);
        setShowBurst(true);
      }, 120);
      schedule(() => setIsLandingTextVisible(false), 500);
      schedule(() => {
        goTo("surprise");
        openingRef.current = false;
      }, 950);
      return;
    }

    setIsShaking(true);
    schedule(() => {
      setIsShaking(false);
      setIsGiftOpen(true);
      setShowBurst(true);
      setFlashKey((key) => key + 1);
    }, 700);
    schedule(() => setIsCinematic(true), 1450);
    schedule(() => setIsLandingTextVisible(false), 1850);
    schedule(() => {
      goTo("surprise");
      openingRef.current = false;
    }, 3100);
  }

  function replay() {
    clearTimers();
    openingRef.current = false;
    setIsOpening(false);
    setIsShaking(false);
    setIsGiftOpen(false);
    setShowBurst(false);
    setIsLandingTextVisible(true);
    setIsCinematic(false);
    goTo("landing");
  }

  return (
    <div
      className={`app-shell app-shell--${screen}${isThemeShaking ? " theme-shake" : ""}`}
      data-theme={theme}
    >
      <Background />
      <main className="screens">
        {stack.includes("landing") && (
          <Landing
            active={screen === "landing"}
            isOpening={isOpening}
            isShaking={isShaking}
            isOpen={isGiftOpen}
            showBurst={showBurst}
            isContentVisible={isLandingTextVisible}
            isCinematic={isCinematic}
            onOpen={openSurprise}
          />
        )}
        {stack.includes("surprise") && (
          <Surprise active={screen === "surprise"} onContinue={() => goTo("final")} />
        )}
        {stack.includes("final") && (
          <FinalMessage
            active={screen === "final"}
            onReplay={replay}
            onOneLast={() => goTo("heart")}
          />
        )}
        {stack.includes("heart") && (
          <FinalSurprise
            active={screen === "heart"}
            onReplay={replay}
            onBack={() => goTo("final")}
          />
        )}
      </main>
      <TransitionLayer flashKey={flashKey} waveKey={waveKey} />
      <MusicToggle theme={theme} onThemeChange={changeTheme} />
      <div className="site-brand" aria-hidden="true">
        DESIGNED WITH ❤️ BY <span>COMMANDO</span>
      </div>
      <div
        className={`preloader${isPreloaderVisible ? "" : " hide"}`}
        id="preloader"
        aria-hidden={!isPreloaderVisible}
      >
        <div className="preloader-heart" />
        <p className="preloader-text">something beautiful is loading…</p>
      </div>
    </div>
  );
}

export default App;
/* named exports (used by tooling / smoke tests) */
export { Landing, Surprise, FinalMessage, MusicToggle };
