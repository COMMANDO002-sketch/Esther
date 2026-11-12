import musicTrack from "./Tml Vibez - Where I'm From (Official Audio) ft. Seyi Vibez.mp3";

/* ============================================================
   AUDIO ENGINE — provided background music + sound effects
   ============================================================ */

const PREF_MUSIC = "essie:music"; // "on" | "off"
const PREF_MUTE = "essie:mute"; // "1" | "0"
const PREF_VOLUME = "essie:volume";

let ctx = null;
let master = null;
let sfxBus = null;
let playing = false;
let muted = readPref(PREF_MUTE) === "1";
let volume = readVolume();
let audioError = "";
let loading = false;
let musicElement = null;
let playAttempt = 0;
let playPending = false;

const listeners = new Set();

/* ---------- tiny persistence helpers (fail-safe) ---------- */
function readPref(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}
function writePref(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}
function readVolume() {
  const savedValue = readPref(PREF_VOLUME);
  if (savedValue === null) return 0.3;
  const saved = Number(savedValue);
  return Number.isFinite(saved) && saved >= 0 && saved <= 1 ? saved : 0.3;
}

function getState() {
  return {
    playing,
    muted,
    audioError,
    loading,
    volume,
  };
}
function notify() {
  const state = getState();
  listeners.forEach((listener) => listener(state));
}
function subscribe(listener) {
  listeners.add(listener);
  listener(getState());
  return () => listeners.delete(listener);
}

/* ---------- context ---------- */
function ensureContext() {
  if (ctx) return ctx;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) {
    audioError = "Audio playback is not supported by this browser.";
    notify();
    return null;
  }
  ctx = new AudioCtx();

  master = ctx.createGain();
  master.gain.value = muted ? 0 : 1;
  master.connect(ctx.destination);

  sfxBus = ctx.createGain();
  sfxBus.gain.value = 0.6;
  sfxBus.connect(master);

  return ctx;
}

function unlock() {
  const context = ensureContext();
  if (context && context.state === "suspended") {
    const resumed = context.resume();
    if (resumed && typeof resumed.catch === "function") resumed.catch(() => {});
  }
  return context;
}

/* Sound effects only ever play once a real user gesture has
   unlocked the context — no autoplay warnings, no console errors,
   no unhandled promise rejections. */
function canPlay() {
  return Boolean(ctx) && ctx.state === "running";
}

/* ---------- note helper ---------- */
function tone(freq, time, duration, peak, type, dest) {
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type || "triangle";
  osc.frequency.setValueAtTime(freq, time);
  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0002), time + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
  osc.connect(gain);
  gain.connect(dest);
  osc.start(time);
  osc.stop(time + duration + 0.08);
}

function chime(freqs, spacing, duration, peak, type) {
  if (!canPlay()) return;
  const start = ctx.currentTime + 0.02;
  freqs.forEach((freq, index) => {
    tone(freq, start + index * spacing, duration, peak, type || "sine", sfxBus);
  });
}

function shimmerNoise(duration) {
  if (!canPlay()) return;
  const context = ctx;
  const now = context.currentTime;
  const length = Math.floor(context.sampleRate * duration);
  const buffer = context.createBuffer(1, length, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / length);
  }
  const source = context.createBufferSource();
  source.buffer = buffer;
  const band = context.createBiquadFilter();
  band.type = "bandpass";
  band.Q.value = 1.3;
  band.frequency.setValueAtTime(700, now);
  band.frequency.exponentialRampToValueAtTime(7200, now + duration);
  const gain = context.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.1, now + 0.14);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  source.connect(band);
  band.connect(gain);
  gain.connect(sfxBus);
  source.start(now);
}

function getMusicElement() {
  if (!musicElement) {
    const track = new Audio();
    track.src = musicTrack;
    track.loop = true;
    track.preload = "metadata";
    track.volume = volume;
    track.muted = muted;
    track.addEventListener("loadstart", () => {
      loading = true;
      notify();
    });
    track.addEventListener("loadedmetadata", () => {
      loading = false;
      notify();
    });
    track.addEventListener("canplay", () => {
      loading = false;
      notify();
    });
    track.addEventListener("playing", () => {
      playing = true;
      loading = false;
      playPending = false;
      audioError = "";
      notify();
    });
    track.addEventListener("pause", () => {
      playing = false;
      notify();
    });
    track.addEventListener("error", () => {
      playPending = false;
      playing = false;
      loading = false;
      audioError =
        track.error && track.error.code === 4
          ? "This browser cannot play the music file."
          : "The music file could not be loaded.";
      notify();
    });
    track.load();
    musicElement = track;
  }
  return musicElement;
}

function start() {
  const track = getMusicElement();
  if (playing && !track.paused) return true;
  if (playPending) return true;

  const attempt = ++playAttempt;
  audioError = "";
  loading = true;
  playPending = true;
  writePref(PREF_MUSIC, "on");
  notify();
  let playback;
  try {
    playback = track.play();
  } catch (error) {
    playback = Promise.reject(error);
  }
  Promise.resolve(playback).then(() => {
    if (attempt !== playAttempt) return;
    playPending = false;
    playing = !track.paused;
    loading = false;
    if (playing) audioError = "";
    notify();
  }).catch((error) => {
    if (attempt !== playAttempt) return;
    playPending = false;
    playing = false;
    loading = false;
    audioError =
      error && error.name === "NotAllowedError"
        ? "Press Play to allow music in this browser."
        : error && error.name === "AbortError"
          ? ""
          : `Music could not start${error && error.message ? `: ${error.message}` : "."}`;
    notify();
  });
  return true;
}

function pause() {
  playAttempt += 1;
  playPending = false;
  loading = false;
  if (musicElement) musicElement.pause();
  playing = false;
  writePref(PREF_MUSIC, "off");
  notify();
}

function toggle() {
  if (playing || playPending) pause();
  else start();
}

function setVolume(nextVolume) {
  volume = Math.max(0, Math.min(1, Number(nextVolume)));
  if (!Number.isFinite(volume)) volume = 0.3;
  writePref(PREF_VOLUME, String(volume));
  if (musicElement) musicElement.volume = volume;
  notify();
}

function setMuted(nextMuted) {
  muted = nextMuted;
  writePref(PREF_MUTE, nextMuted ? "1" : "0");
  if (musicElement) musicElement.muted = nextMuted;
  const context = ctx;
  if (!context || !master) {
    notify();
    return;
  }
  const now = context.currentTime;
  master.gain.cancelScheduledValues(now);
  master.gain.setValueAtTime(master.gain.value, now);
  master.gain.linearRampToValueAtTime(nextMuted ? 0 : 1, now + 0.25);
  notify();
}

function toggleMute() {
  setMuted(!muted);
}

/* ---------- sound effects ---------- */
/* Runs `fn` once audio is actually allowed: never creates a
   context before a gesture, and resumes one that is suspended. */
function ready(fn) {
  if (!ctx) return;
  if (ctx.state === "running") {
    fn();
    return;
  }
  const resumed = ctx.resume();
  if (resumed && typeof resumed.then === "function") {
    resumed
      .then(() => {
        audioError = "";
        notify();
        fn();
      })
      .catch(() => {
        /* still blocked — the music dock already explains it */
      });
  }
}

function playMagic() {
  // gentle magical chime when the gift box opens
  ready(() => {
    chime([523.25, 659.25, 783.99, 1046.5, 1318.5], 0.09, 1.2, 0.2, "sine");
    chime([1046.5, 1318.5, 1567.98], 0.17, 0.8, 0.06, "triangle");
    shimmerNoise(0.7);
  });
}

function playSparkle() {
  // tiny twinkles when the final letter appears
  ready(() => chime([1567.98, 1975.53, 2637.02, 3135.96], 0.07, 0.5, 0.08, "sine"));
}

function playClick() {
  ready(() => chime([880], 0, 0.16, 0.05, "sine"));
}

const audio = {
  getState,
  subscribe,
  unlock,
  start,
  pause,
  toggle,
  setVolume,
  setMuted,
  toggleMute,
  playMagic,
  playSparkle,
  playClick,
  get isMuted() {
    return readPref(PREF_MUTE) === "1";
  },
  get isPaused() {
    return readPref(PREF_MUSIC) === "off";
  },
};

export default audio;
