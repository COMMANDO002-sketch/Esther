import React, { useEffect, useRef, useState } from "react";
import Intro, { INTRO_SEEN_KEY } from "./components/Intro.jsx";
import AmbientBackground from "./components/AmbientBackground.jsx";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import Gallery from "./components/Gallery.jsx";
import Memories from "./components/Memories.jsx";
import CelebrationTimer from "./components/CelebrationTimer.jsx";
import BirthdayCake from "./components/BirthdayCake.jsx";
import WishesWall from "./components/WishesWall.jsx";
import SurpriseGift from "./components/SurpriseGift.jsx";
import Fireworks from "./components/Fireworks.jsx";
import SectionHeading from "./components/SectionHeading.jsx";
import Footer from "./components/Footer.jsx";
import MusicPlayer from "./components/MusicPlayer.jsx";
import BackToTop from "./components/BackToTop.jsx";
import CursorFX from "./components/CursorFX.jsx";
import audio from "./audio.js";
import { readSession, useReveal } from "./hooks.js";

/* The cinematic intro plays once per browsing session — a page
   refresh (navigation type "reload") brings it back. */
function shouldShowIntro() {
  if (typeof window === "undefined") return true;
  try {
    const [entry] = performance.getEntriesByType("navigation");
    if (entry && entry.type === "reload") return true;
  } catch {
    /* performance API unavailable — fall through to the flag */
  }
  return readSession(INTRO_SEEN_KEY) !== "1";
}

function App() {
  const [introDone, setIntroDone] = useState(() => !shouldShowIntro());
  const rootRef = useRef(null);

  /* scroll reveals only start once the intro has cleared */
  useReveal(rootRef, introDone);

  /* the page stays still while the cinematic intro plays */
  useEffect(() => {
    if (introDone) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [introDone]);

  /* Attempt autoplay on entry; the player exposes a Play button if blocked. */
  useEffect(() => {
    if (!audio.isPaused) audio.start();
  }, []);

  return (
    <div className={`site${introDone ? " is-ready" : ""}`} ref={rootRef}>
      <AmbientBackground />
      <Navbar ready={introDone} />

      <main className="site__main">
        <Hero ready={introDone} />
        <About />
        <Gallery />
        <Memories />
        <CelebrationTimer />
        <BirthdayCake />
        <WishesWall />

        <section className="surprise section" id="surprise" aria-labelledby="surprise-title">
          <div className="container">
            <SectionHeading
              eyebrow="The Final Surprise"
              title="A Little Surprise for You!"
              lead="A birthday message and a little fireworks."
              id="surprise-title"
            />

            <div className="surprise__inner">
              <SurpriseGift />
              <div className="surprise__celebrate" data-reveal>
                <Fireworks />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <MusicPlayer />
      <BackToTop />
      <CursorFX />

      {!introDone && <Intro onDone={() => setIntroDone(true)} />}
    </div>
  );
}

export default App;
