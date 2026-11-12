import React, { useEffect, useRef, useState } from "react";
import estherCenter from "../../images/esther-center.jpg";
import audio from "../audio.js";
import { prefersReducedMotion } from "../motion.js";
import ConfettiBurst from "./ConfettiBurst.jsx";

const burstItems = Array.from({ length: 24 }, (_, index) => index);
const glowSparks = Array.from({ length: 12 }, (_, index) => index);

const GIFT_MESSAGE =
  "Wishing you joy, lovely memories, and a bright year ahead!";

/**
 * Interactive 3D gift box. Tap it: the box shakes, the lid
 * swings open, pink & gold confetti bursts out and a special
 * birthday message with a photograph is revealed.
 */
export default function SurpriseGift() {
  const [phase, setPhase] = useState("idle"); // idle | shaking | open
  const timers = useRef([]);

  function openGift() {
    if (phase !== "idle") return;
    audio.playClick();

    if (prefersReducedMotion) {
      audio.playMagic();
      setPhase("open");
      return;
    }

    setPhase("shaking");
    timers.current.push(
      window.setTimeout(() => {
        setPhase("open");
        audio.playMagic();
      }, 720),
    );
  }

  function resetGift() {
    audio.playClick();
    setPhase("idle");
  }

  /* clean up any pending timers */
  useEffect(
    () => () => {
      timers.current.forEach(window.clearTimeout);
      timers.current = [];
    },
    [],
  );

  const isOpen = phase === "open";

  return (
    <div className="gift-reveal">
      <div className={`gift-stage${isOpen ? " opened" : ""}`}>
        <div className="gift-float">
          <div className="gift-view">
            <button
              className={`gift${phase === "shaking" ? " shake" : ""}${isOpen ? " open" : ""}`}
              type="button"
              onClick={openGift}
              disabled={isOpen}
              aria-label={isOpen ? "Your surprise is open" : "Open your birthday gift"}
            >
              <span className="gift-box">
                <span className="box-face box-front"><span className="ribbon-v" /></span>
                <span className="box-face box-back"><span className="ribbon-v" /></span>
                <span className="box-face box-left"><span className="ribbon-v" /></span>
                <span className="box-face box-right"><span className="ribbon-v" /></span>
                <span className="box-face box-bottom" />
                <span className="box-lining lining-back" />
                <span className="box-lining lining-front" />
                <span className="box-lining lining-left" />
                <span className="box-lining lining-right" />
                <span className="box-lining lining-floor" />
                <span className="inner-glow" />
              </span>
              <span className="lid-hinge">
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
                <span className="lid-face lid-front"><span className="ribbon-lid-v" /></span>
                <span className="lid-face lid-back"><span className="ribbon-lid-v" /></span>
                <span className="lid-face lid-left"><span className="ribbon-lid-v" /></span>
                <span className="lid-face lid-right"><span className="ribbon-lid-v" /></span>
              </span>
            </button>

            {phase !== "idle" && (
              <span className="gift-burst" aria-hidden="true">
                {burstItems.map((item) => (
                  <span
                    className={`gift-burst__item${item % 3 === 0 ? " is-star" : ""}`}
                    key={item}
                    style={{
                      "--dx": `${(item - 11) * 26}px`,
                      "--rise": `${-40 - (item % 4) * 5}vh`,
                      animationDelay: `${(item % 8) * 0.06}s`,
                    }}
                  >
                    {item % 4 === 0 ? "✦" : ""}
                  </span>
                ))}
              </span>
            )}

            <ConfettiBurst trigger={isOpen ? 1 : 0} count={40} />
          </div>
        </div>

        <p className={`gift-hint${isOpen ? " hide" : ""}`}>
          ✦ tap the gift to open ✦
        </p>
      </div>

      <div className={`gift-message${isOpen ? " is-open" : ""}`}>
        <p className="gift-message__eyebrow">A message just for you</p>
        <h3>Happy Belated Birthday, Esther!</h3>
        <p className="gift-message__text">{GIFT_MESSAGE}</p>

        <figure className="gift-message__photo">
          <img
            src={estherCenter}
            alt="Esther, smiling"
            loading="lazy"
            decoding="async"
          />
          <figcaption>Keep shining ✦</figcaption>
        </figure>

        <div className="gift-message__sparks" aria-hidden="true">
          {glowSparks.map((spark) => (
            <span
              key={spark}
              style={{
                left: `${(spark * 43) % 96 + 2}%`,
                top: `${(spark * 27) % 90 + 5}%`,
                animationDelay: `${(spark % 6) * 0.5}s`,
              }}
            >
              ✦
            </span>
          ))}
        </div>

        <button className="btn btn--ghost gift-message__reset" type="button" onClick={resetGift}>
          Close the gift
        </button>
      </div>
    </div>
  );
}
