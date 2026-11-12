import React, { useEffect, useRef, useState } from "react";
import audio from "../audio.js";

const BARS = [0, 1, 2, 3, 4];

/**
 * Compact floating music player (bottom-right). Rotating disc,
 * play/pause, mute/unmute, volume slider and a small animated
 * visualizer — one singleton audio engine behind it, so music
 * never restarts while moving between sections.
 */
export default function MusicPlayer() {
  const [state, setState] = useState(() => audio.getState());
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => audio.subscribe(setState), []);

  /* close on outside click or Escape */
  useEffect(() => {
    if (!isOpen) return undefined;
    const onPointer = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const onKey = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  const isPlaying = state.playing || state.loading;
  /* the play badge appears when music is neither playing nor
     deliberately paused — e.g. blocked by autoplay policies */
  const needsAttention = !state.playing && !state.loading && !audio.isPaused;

  return (
    <div className={`player${isOpen ? " is-open" : ""}`} ref={rootRef}>
      <div className={`player__panel${isOpen ? " is-open" : ""}`} aria-hidden={!isOpen}>
        <div className="player__head">
          <span className={`player__disc${isPlaying ? " is-spinning" : ""}`} aria-hidden="true">
            <i />
          </span>
          <div className="player__track">
            <p className="player__eyebrow">Birthday soundtrack</p>
            <p className="player__title">Where I&rsquo;m From</p>
            <p className="player__artist">Tml Vibez ft. Seyi Vibez</p>
          </div>
          <div className={`player__bars${isPlaying ? " is-playing" : ""}`} aria-hidden="true">
            {BARS.map((bar) => (
              <span key={bar} style={{ "--bar": bar }} />
            ))}
          </div>
        </div>

        <div className="player__controls">
          <button
            className="player__btn player__btn--play"
            type="button"
            onClick={() => audio.toggle()}
            aria-label={isPlaying ? "Pause music" : "Play music"}
            aria-pressed={state.playing}
            tabIndex={isOpen ? 0 : -1}
          >
            {isPlaying ? (
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5h3v14H8zm5 0h3v14h-3z" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
            )}
          </button>

          <button
            className="player__btn player__btn--ghost"
            type="button"
            onClick={() => audio.toggleMute()}
            aria-label={state.muted ? "Unmute music" : "Mute music"}
            aria-pressed={state.muted}
            tabIndex={isOpen ? 0 : -1}
          >
            {state.muted || state.volume === 0 ? (
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4zm12.5 3 4 4m0-4-4 4" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4zm11.5-.5a5 5 0 0 1 0 7m2.5-9.5a8.5 8.5 0 0 1 0 12" /></svg>
            )}
          </button>

          <label className="sr-only" htmlFor="player-volume">Music volume</label>
          <input
            id="player-volume"
            className="player__volume"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={state.volume}
            tabIndex={isOpen ? 0 : -1}
            onChange={(event) => audio.setVolume(event.target.value)}
            aria-valuetext={`${Math.round(state.volume * 100)}%`}
          />
          <span className="player__volume-value">
            {Math.round(state.volume * 100)}%
          </span>
        </div>

        <p
          className={`player__status${state.audioError ? " has-error" : ""}`}
          role="status"
          aria-live="polite"
        >
          {state.audioError ||
            (state.loading
              ? "Loading your song…"
              : state.playing
                ? "Now playing — enjoy the celebration"
                : "Press play to start the music")}
        </p>
      </div>

      <div className="player__dock">
        <button
          className="player__mute-fab"
          type="button"
          onClick={() => audio.toggleMute()}
          aria-label={state.muted ? "Unmute music" : "Mute music"}
          aria-pressed={state.muted}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            {state.muted || state.volume === 0 ? (
              <path d="M4 9v6h4l5 4V5L8 9H4zm12.5 3 4 4m0-4-4 4" />
            ) : (
              <path d="M4 9v6h4l5 4V5L8 9H4zm11.5-.5a5 5 0 0 1 0 7m2.5-9.5a8.5 8.5 0 0 1 0 12" />
            )}
          </svg>
        </button>
        <button
          className={`player__fab${isPlaying ? " is-playing" : ""}${
            needsAttention ? " needs-attention" : ""
          }`}
          type="button"
          aria-label={
            needsAttention ? "Play music" : isOpen ? "Close music player" : "Open music player"
          }
          aria-expanded={isOpen}
          onClick={() => {
            if (needsAttention) audio.start();
            else setIsOpen((open) => !open);
          }}
        >
          <span className="player__fab-disc" aria-hidden="true">
            <i />
          </span>
          {!isPlaying && <span className="player__fab-play" aria-hidden="true">▶</span>}
          {needsAttention && <span className="player__fab-badge" aria-hidden="true">♪</span>}
        </button>
      </div>
    </div>
  );
}
