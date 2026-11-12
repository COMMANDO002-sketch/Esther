import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import estherCenter from "../../images/esther-center.jpg";
import audio from "../audio.js";
import { writeSession } from "../hooks.js";
import { prefersReducedMotion } from "../motion.js";

export const INTRO_SEEN_KEY = "esther:intro-seen";

const stars = Array.from({ length: 8 }, (_, index) => index);
const sparkles = Array.from({ length: 10 }, (_, index) => index);
const falls = Array.from({ length: 5 }, (_, index) => index);

/* The intro never occupies a visitor for more than five seconds:
   the fade-out begins at 4.3s and completes exactly at 5.0s. */
const AUTO_LEAVE_AT = 4300;
const FADE_MS = 700;

function SplitText({ as: Element = "span", text, className, sequence }) {
  return (
    <Element className={className} data-intro-sequence={sequence}>
      <span className="sr-only">{text}</span>
      <span className="intro__letters" aria-hidden="true">
        {Array.from(text).map((letter, index) => (
          <span
            className={`intro__letter${letter === " " ? " is-space" : ""}${
              letter === "&" ? " is-symbol" : ""
            }`}
            key={`${letter}-${index}`}
          >
            {letter === " " ? "\u00a0" : letter}
          </span>
        ))}
      </span>
    </Element>
  );
}

/**
 * Full-screen cinematic welcome. No navigation, no clutter —
 * just Esther's photograph, a soft pink wash, floating light
 * and the celebration message. Skippable at any moment.
 */
export default function Intro({ onDone }) {
  const [isLeaving, setIsLeaving] = useState(false);
  const finishedRef = useRef(false);
  const leaveTimerRef = useRef(null);
  const autoTimerRef = useRef(null);
  const onDoneRef = useRef(onDone);
  const introRef = useRef(null);
  onDoneRef.current = onDone;

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    window.clearTimeout(autoTimerRef.current);
    writeSession(INTRO_SEEN_KEY, "1");
    setIsLeaving(true);
    leaveTimerRef.current = window.setTimeout(() => {
      onDoneRef.current();
    }, FADE_MS);
  }, []);

  /* automatic transition after the five-second cinematic */
  useEffect(() => {
    autoTimerRef.current = window.setTimeout(finish, AUTO_LEAVE_AT);
    return () => {
      window.clearTimeout(autoTimerRef.current);
      window.clearTimeout(leaveTimerRef.current);
    };
  }, [finish]);

  useLayoutEffect(() => {
    const root = introRef.current;
    if (!root) return undefined;

    const context = gsap.context(() => {
      const photo = root.querySelector(".intro__photo");
      const sweep = root.querySelector(".intro__sweep");
      const text = root.querySelectorAll("[data-intro-sequence]");
      const letters = root.querySelectorAll(".intro__letter:not(.is-space)");
      const credit = root.querySelector(".intro__credit");

      if (prefersReducedMotion) {
        gsap.set([photo, sweep, ...text, credit].filter(Boolean), {
          clearProps: "all",
          opacity: 1,
          visibility: "visible",
        });
        gsap.set(letters, { clearProps: "all", opacity: 1, filter: "none" });
        return;
      }

      gsap.set(photo, { autoAlpha: 0, scale: 1.04, filter: "brightness(0.42) saturate(0.78)" });
      gsap.set(sweep, { xPercent: -125, autoAlpha: 0 });
      gsap.set(text, { autoAlpha: 0, y: 22, filter: "blur(7px)" });
      gsap.set(letters, { autoAlpha: 0, y: 20, rotateX: -22, filter: "blur(6px)" });
      gsap.set(credit, { autoAlpha: 0, y: 10 });

      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
      timeline
        .to(photo, {
          autoAlpha: 1,
          scale: 1.1,
          filter: "brightness(1) saturate(0.92)",
          duration: 1.25,
        }, 0)
        .to(sweep, {
          xPercent: 125,
          autoAlpha: 0.7,
          duration: 1.35,
          ease: "power2.inOut",
        }, 0.18)
        .to(sweep, { autoAlpha: 0, duration: 0.35 }, 1.02)
        .to(root.querySelector("[data-intro-sequence='eyebrow']"), {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.45,
        }, 1.02)
        .to(root.querySelectorAll("[data-intro-sequence='eyebrow'] .intro__letter"), {
          autoAlpha: 1,
          y: 0,
          rotateX: 0,
          filter: "blur(0px)",
          duration: 0.48,
          stagger: 0.018,
        }, 1.04)
        .to(root.querySelector("[data-intro-sequence='kicker']"), {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.42,
        }, 2.02)
        .to(root.querySelectorAll("[data-intro-sequence='name'] .intro__letter"), {
          autoAlpha: 1,
          y: 0,
          rotateX: 0,
          filter: "blur(0px)",
          duration: 0.7,
          stagger: 0.035,
          ease: "power4.out",
        }, 2.24)
        .to(root.querySelector("[data-intro-sequence='name']"), {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.35,
        }, 2.24)
        .to(root.querySelector("[data-intro-sequence='name']"), {
          backgroundPosition: "0% 50%",
          duration: 1.1,
          ease: "power1.inOut",
        }, 2.45)
        .to(root.querySelector("[data-intro-sequence='age']"), {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.55,
        }, 3.18)
        .to(root.querySelectorAll("[data-intro-sequence='age'] .intro__letter"), {
          autoAlpha: 1,
          y: 0,
          rotateX: 0,
          filter: "blur(0px)",
          duration: 0.5,
          stagger: 0.035,
        }, 3.18)
        .to(root.querySelector("[data-intro-sequence='cta']"), {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.55,
        }, 3.86)
        .to(credit, { autoAlpha: 0.78, y: 0, duration: 0.65 }, 3.7);
    }, root);

    return () => context.revert();
  }, []);

  /* Enter Celebration = a real user gesture → music is allowed */
  function handleEnter() {
    audio.unlock();
    audio.start();
    finish();
  }

  function handleSkip() {
    finish();
  }

  return (
    <div
      className={`intro${isLeaving ? " is-leaving" : ""}`}
      role="dialog"
      aria-label="Birthday introduction"
      aria-modal="true"
      ref={introRef}
    >
      <div
        className="intro__photo"
        style={{ backgroundImage: `url(${estherCenter})` }}
        aria-hidden="true"
      />
      <div className="intro__wash" aria-hidden="true" />
      <div className="intro__veil" aria-hidden="true" />
      <div className="intro__sweep" aria-hidden="true" />

      <div className="intro__light intro__light--1" aria-hidden="true" />
      <div className="intro__light intro__light--2" aria-hidden="true" />

      <div className="intro__stars" aria-hidden="true">
        {stars.map((star) => (
          <span
            key={star}
            style={{
              left: `${4 + ((star * 23) % 92)}%`,
              top: `${6 + ((star * 41) % 84)}%`,
              fontSize: `${12 + (star % 4) * 6}px`,
              animationDelay: `${(star % 6) * 0.6}s`,
              animationDuration: `${2.8 + (star % 5) * 0.7}s`,
            }}
          >
            ✦
          </span>
        ))}
      </div>

      <div className="intro__sparkles" aria-hidden="true">
        {sparkles.map((sparkle) => (
          <span
            key={sparkle}
            className={sparkle % 3 === 0 ? "is-gold" : ""}
            style={{
              left: `${(sparkle * 37) % 97 + 1}%`,
              top: `${(sparkle * 59) % 92 + 3}%`,
              animationDelay: `${(sparkle % 8) * 0.45}s`,
            }}
          />
        ))}
      </div>

      <div className="intro__falls" aria-hidden="true">
        {falls.map((fall) => (
          <span
            key={fall}
            style={{
              left: `${(fall * 67) % 98 + 1}%`,
              animationDelay: `${3 + (fall % 7) * 0.7}s`,
              animationDuration: `${4.2 + (fall % 4) * 1.1}s`,
            }}
          >
            ✧
          </span>
        ))}
      </div>

      <button className="intro__skip" type="button" onClick={handleSkip}>
        Skip &raquo;
      </button>

      <div className="intro__content">
        <SplitText
          as="p"
          className="intro__eyebrow"
          text="A Friend Worth Celebrating"
          sequence="eyebrow"
        />
        <SplitText
          as="p"
          className="intro__kicker"
          text="Happy Belated Birthday"
          sequence="kicker"
        />
        <SplitText
          as="h1"
          className="intro__name"
          text="Shittu Esther"
          sequence="name"
        />
        <SplitText
          as="p"
          className="intro__age"
          text="19 & Shining"
          sequence="age"
        />
        <div className="intro__cta" data-intro-sequence="cta">
          <button className="btn btn--glow intro__enter" type="button" onClick={handleEnter}>
            Enter Celebration
          </button>
        </div>
      </div>

      <p className="intro__credit" style={{ "--d": "3s" }}>
        Crafted by <span>COMMANDO</span>
      </p>
    </div>
  );
}
