import React, { useEffect, useRef, useState } from "react";
import audio from "./audio.js";
import { prefersReducedMotion } from "./motion.js";

const sparkleDust = Array.from({ length: 16 }, (_, index) => index);

/**
 * Cinematic love-letter sequence:
 * envelope scene -> flap opens -> letter slides out -> paper unfolds
 * -> the original birthday message is revealed line by line.
 * The message itself is preserved exactly as it always was.
 */
export default function EnvelopeLetter({ onPhase }) {
  const [phase, setPhase] = useState("envelope");
  const played = useRef({});

  useEffect(() => {
    if (prefersReducedMotion) {
      setPhase("read");
      return undefined;
    }
    const timers = [
      window.setTimeout(() => setPhase("open"), 1050),
      window.setTimeout(() => setPhase("slide"), 1950),
      window.setTimeout(() => setPhase("unfold"), 2950),
      window.setTimeout(() => setPhase("read"), 3600),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, []);

  useEffect(() => {
    if (onPhase) onPhase(phase);
    if (phase === "read" && !played.current.letter) {
      played.current.letter = true;
      audio.playSparkle();
    }
  }, [phase, onPhase]);

  function openNow() {
    if (phase === "envelope") setPhase("open");
  }

  return (
    <div className="letter-stage" data-phase={phase}>
      <div
        className={`env-scene${phase === "unfold" || phase === "read" ? " gone" : ""}`}
      >
        <button
          className="envelope"
          type="button"
          onClick={openNow}
          aria-label="Open your letter"
        >
          <span className="env-back" />
          <span className="env-glow" />
          <span className="env-letter">
            <span className="env-letter-line" />
            <span className="env-letter-line short" />
            <span className="env-letter-heart">❤</span>
          </span>
          <span className="env-front" />
          <span className="env-flap" />
          <span className="env-seal">❤</span>
        </button>
        <p className="env-hint">a letter written just for you ✉</p>
      </div>

      <div className="final-inner letter-card">
        <p className="ornament" style={{ "--d": "0.1s" }} aria-hidden="true">
          ❦ ❦ ❦
        </p>
        <h2 className="glow-text" id="final-title" style={{ "--d": "0.24s" }}>
          HAPPY BIRTHDAY,
          <br />
          MY DEAR ESSIE! ❤️
        </h2>

        <div className="heartfelt" style={{ "--d": "0.46s" }}>
          <p style={{ "--pd": "0.55s" }}>My dearest <em>Essie</em>,</p>
          <p style={{ "--pd": "0.85s" }}>
            Today the world celebrates <strong>YOU</strong> — the most beautiful, brilliant
            and breathtaking soul I know. May this new year of life be painted with endless
            joy, good health and long life. May success chase you in everything you do, may
            peace settle deep in your heart, and may love follow you wherever you go.
          </p>
          <p style={{ "--pd": "1.2s" }}>
            Thank you for being so effortlessly amazing. May your days be filled with more
            laughter, more wins, more love — and a lifetime of <strong>beautiful memories</strong>.
          </p>
        </div>

        <p className="signature" style={{ "--d": "0.72s" }}>
          With all the love in the world ❤️
        </p>

        <span className="finale-heart" aria-hidden="true">❤</span>
      </div>

      <span className="letter-dust" aria-hidden="true">
        {sparkleDust.map((dust) => (
          <span
            className="dust"
            key={dust}
            style={{
              left: `${(dust * 41) % 100}%`,
              top: `${(dust * 67) % 100}%`,
              animationDelay: `${(dust % 6) * 0.45}s`,
              animationDuration: `${2.6 + (dust % 4) * 0.6}s`,
            }}
          >
            {dust % 3 === 0 ? "✦" : "♥"}
          </span>
        ))}
      </span>
    </div>
  );
}
