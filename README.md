# Esther's birthday surprise

This React app is built with Vite. Its shared design is in `css/style.css`,
React-specific layout overrides and screen polish live in `src/screens.css`, and
the cinematic animation upgrade (transitions, reveals, envelope scene, music dock)
is layered on in `css/upgrade.css`; the gallery photos are in `images/`.

The experience includes the animated gift opening, an interactive four-photo
gallery, the birthday letter, and an optional final surprise. Music and sound
effects are synthesized in-browser with the Web Audio API, so no external audio
track or extra animation library is required. Audio starts only after a visitor
uses the music control or opens the gift.

## Run locally

```sh
npm install
npm run dev
```

Create a production build with `npm run build`.
