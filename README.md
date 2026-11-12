# Shittu Esther — Premium Birthday Experience

A cinematic, friendship-themed birthday website for **SHITTU ESTHER (19 & Shining)**,
crafted by **COMMANDO**. Built with React + Vite.

## What's inside

- **Five-second cinematic intro** — full-screen photograph, soft pink overlay,
  floating stars/sparkles, skip button and an *Enter Celebration* button.
  Plays once per browsing session (refresh brings it back).
- **Sticky navigation** — Home, About Esther, Gallery, Memories, Birthday
  Wishes, Surprise, with smooth scrolling and an animated mobile menu.
- **Sections** — hero, *Meet Esther*, masonry gallery with lightbox, memories
  timeline, celebration timer (counts down to the next 11 November), birthday
  cake with a *Make a Wish* interaction, wishes wall, surprise gift box and a
  canvas fireworks celebration.
- **Music** — the existing track (`src/Tml Vibez - Where I'm From … mp3`) is
  attempted on entry at 30% volume, loops continuously through one persistent
  audio engine, and is controlled by the floating player. If autoplay is
  blocked, the player offers a *Play Music* button. Music, mute, and volume
  preferences persist across visits.
- **Visual details** — a flower cursor with a subtle sparkle trail on desktop,
  soft floating petals, butterflies, bubbles, and motion-aware reveals.
- **Wishes wall** — validated form with loading/success/error states, a
  honeypot + rate limit for basic spam control, and cards stored in
  `localStorage` (browser-local only — clearly labelled in the UI).

## Structure

```
index.html            page shell, fonts, metadata
css/style.css         the entire design system (pink · white · champagne gold)
images/               photographs of Esther
src/App.jsx           section composition + intro/session logic
src/audio.js          singleton music + sound-effect engine
src/hooks.js          reveal, locks, storage and scroll helpers
src/components/       one component per section / interaction
```

## Run locally

```sh
npm install
npm run dev
```

Create a production build with `npm run build` (output in `dist/`).
