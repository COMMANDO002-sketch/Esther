import React, { useState } from "react";
import audio from "../audio.js";
import ConfettiBurst from "./ConfettiBurst.jsx";
import SectionHeading from "./SectionHeading.jsx";

const CANDLES = [0, 1, 2];
const SPARKS = Array.from({ length: 10 }, (_, index) => index);

/**
 * Elegant pink & white three-tier cake with gold details and
 * glowing animated candles. "Make a Wish" blows the flames out,
 * releases confetti and reveals a birthday message.
 */
export default function BirthdayCake() {
  const [isBlown, setIsBlown] = useState(false);
  const [burst, setBurst] = useState(0);

  function makeWish() {
    if (isBlown) return;
    audio.playMagic();
    setIsBlown(true);
    setBurst((value) => value + 1);
  }

  function relight() {
    audio.playClick();
    setIsBlown(false);
  }

  return (
    <section className="cake-section section" id="cake" aria-labelledby="cake-title">
      <div className="container cake-section__inner">
        <SectionHeading
          eyebrow="Make a Wish"
          title="A Birthday Cake for Esther"
          lead="Make a wish, then blow out the candles."
          id="cake-title"
        />

        <div className="cake-stage" data-reveal>
          <span className="cake-stage__halo" aria-hidden="true" />

          <div className={`cake${isBlown ? " is-blown" : ""}`}>
            <span className="cake__age" aria-hidden="true">19</span>

            <div className="cake__candles" aria-hidden="true">
              {CANDLES.map((candle) => (
                <span
                  className="candle"
                  key={candle}
                  style={{ "--c": candle, "--flicker-duration": `${1.15 + candle * 0.16}s` }}
                >
                  <span className="candle__flame" />
                  <span className="candle__glow" />
                  <span className="candle__body" />
                  <span className="candle__wick" />
                </span>
              ))}
            </div>

            <div className="cake__tier cake__tier--top" aria-hidden="true">
              <span className="cake__drip" />
              <span className="cake__dots" />
            </div>
            <div className="cake__tier cake__tier--mid" aria-hidden="true">
              <span className="cake__drip" />
              <span className="cake__dots" />
            </div>
            <div className="cake__tier cake__tier--base" aria-hidden="true">
              <span className="cake__drip" />
              <span className="cake__dots" />
            </div>
            <div className="cake__plate" aria-hidden="true" />
          </div>

          <div className="cake__sparks" aria-hidden="true">
            {SPARKS.map((item) => (
              <span
                key={item}
                style={{
                  left: `${8 + ((item * 29) % 84)}%`,
                  animationDelay: `${(item % 5) * 0.4}s`,
                }}
              >
                ✦
              </span>
            ))}
          </div>

          <ConfettiBurst trigger={burst} count={44} />
        </div>

        <div className="cake-section__cta" data-reveal style={{ "--d": ".12s" }}>
          {!isBlown ? (
            <button className="btn btn--glow" type="button" onClick={makeWish}>
              Make a Wish
            </button>
          ) : (
            <div className="wish-reveal" role="status">
              <p className="wish-reveal__star" aria-hidden="true">✦</p>
              <h3>Wish granted, Esther!</h3>
              <p>
                Happy 19th Birthday! Wishing you joy all year long.
              </p>
              <button className="btn btn--ghost" type="button" onClick={relight}>
                Light the candles again
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
