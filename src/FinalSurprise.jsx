import React, { useEffect, useRef, useState } from "react";
import audio from "./audio.js";
import { prefersReducedMotion } from "./motion.js";

const MESSAGE =
  "If I could give you one thing in life, it would be the ability to see yourself through my eyes — because then you would finally know how truly loved you are. Happy birthday, Essie. Today, tomorrow and always ❤";

const words = MESSAGE.split(" ");
const heartParticles = Array.from({ length: 12 }, (_, index) => index);
const lastSparkles = Array.from({ length: 20 }, (_, index) => index);

/**
 * The final, unexpected surprise: the screen dims, a glowing heart
 * begins to beat, particles drift around it and one last personal
 * message is revealed word by word.
 */
export default function FinalSurprise({ active, onReplay, onBack }) {
  const [phase, setPhase] = useState("dim"); // dim -> heart -> text -> finale
  const played = useRef({});

  useEffect(() => {
    if (prefersReducedMotion) {
      setPhase("finale");
      return undefined;
    }
    const timers = [
      window.setTimeout(() => setPhase("heart"), 900),
      window.setTimeout(() => setPhase("text"), 2500),
      window.setTimeout(() => setPhase("finale"), 6200),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, []);

  useEffect(() => {
    if (phase === "finale" && !played.current.beat) {
      played.current.beat = true;
      audio.playHeart();
    }
  }, [phase]);

  const showText = phase === "text" || phase === "finale";

  return (
    <section
      className={`screen screen--last${active ? " active" : ""}`}
      data-phase={phase}
      aria-label="One last thing"
    >
      <div className="dimmer" aria-hidden="true" />

      <div className="last-inner">
        <div className="last-heart-wrap" aria-hidden="true">
          <span className="last-heart">
            <span className="last-heart-core" />
          </span>
          <span className="heart-ring" />
          <span className="heart-ring heart-ring--2" />
          {heartParticles.map((particle) => (
            <span
              className="heart-particle"
              key={particle}
              style={{
                "--pa": `${particle * 30}deg`,
                "--pd": `${(particle % 4) * 0.35}s`,
                animationDelay: `${(particle % 4) * 0.35}s`,
              }}
            />
          ))}
        </div>

        <p className={`last-text${showText ? " show" : ""}`}>
          {words.map((word, index) => (
            <React.Fragment key={`${word}-${index}`}>
              <span className="w" style={{ "--wd": `${index * 0.055}s` }}>
                {word}
              </span>
              {index < words.length - 1 ? " " : ""}
            </React.Fragment>
          ))}
        </p>

        <div className={`last-cta${showText ? " is-visible" : ""}`}>
          <button
            className="btn btn--ghost"
            type="button"
            onClick={() => {
              audio.playClick();
              onBack();
            }}
          >
            ✕ &nbsp;CLOSE
          </button>
          <button
            className="btn"
            type="button"
            onClick={() => {
              audio.playClick();
              onReplay();
            }}
          >
            ↺ &nbsp;PLAY IT AGAIN
          </button>
        </div>
      </div>

      <span className="last-sparkles" aria-hidden="true">
        {lastSparkles.map((sparkle) => (
          <span
            className="last-spark"
            key={sparkle}
            style={{
              left: `${(sparkle * 53) % 100}%`,
              top: `${(sparkle * 31) % 100}%`,
              animationDelay: `${(sparkle % 7) * 0.3}s`,
            }}
          >
            ✦
          </span>
        ))}
      </span>
    </section>
  );
}
