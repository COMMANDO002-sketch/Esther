import React, { useEffect, useMemo, useRef, useState } from "react";
import audio from "../audio.js";
import { readLocal, writeLocal } from "../hooks.js";
import ConfettiBurst from "./ConfettiBurst.jsx";
import SectionHeading from "./SectionHeading.jsx";

const STORAGE_KEY = "esther:wishes:v1";
const LAST_WISH_KEY = "esther:wishes:last";
const MAX_WISHES = 50;
const MIN_INTERVAL_MS = 12000; // gentle rate limit

/* One starter wish from the creator so the wall never opens empty. */
const seedWish = () => [
  {
    id: "seed-commando",
    name: "COMMANDO",
    message:
      "Happy birthday, Esther! Wishing you joy, laughter, and a wonderful year ahead.",
    ts: Date.now() - 86400000,
    seed: true,
  },
];

function loadWishes() {
  const raw = readLocal(STORAGE_KEY);
  if (!raw) return seedWish();
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return seedWish();
    return parsed.length ? parsed.slice(0, MAX_WISHES) : seedWish();
  } catch {
    return seedWish();
  }
}

function formatDate(ts) {
  try {
    return new Date(ts).toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

function initials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

/**
 * Birthday wishes wall: validated form + animated message cards.
 * Storage is browser-local (localStorage) — clearly labelled so
 * visitors understand wishes stay on their own device.
 */
export default function WishesWall() {
  const [wishes, setWishes] = useState(loadWishes);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [statusText, setStatusText] = useState("");
  const [burst, setBurst] = useState(0);
  const timerRef = useRef(null);

  useEffect(
    () => () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    },
    [],
  );

  const formattedCount = useMemo(() => wishes.length, [wishes]);

  function validate() {
    const next = {};
    const trimmedName = name.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName) next.name = "Please tell us your name.";
    else if (trimmedName.length < 2) next.name = "Your name is a little too short.";
    else if (trimmedName.length > 40) next.name = "Please keep your name under 40 characters.";

    if (!trimmedMessage) next.message = "Please write a birthday wish.";
    else if (trimmedMessage.length < 5) next.message = "The wish is a little too short.";
    else if (trimmedMessage.length > 300)
      next.message = "Please keep your wish under 300 characters.";

    if (honeypot) next.message = "Unable to submit right now."; // spam trap
    return next;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (status === "loading") return;

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setStatus("error");
      setStatusText("Please check the highlighted fields.");
      audio.playClick();
      return;
    }

    /* basic spam guard: one wish every few seconds */
    const last = Number(readLocal(LAST_WISH_KEY) || 0);
    if (Date.now() - last < MIN_INTERVAL_MS) {
      setStatus("error");
      setStatusText("One wish at a time — please wait a moment and try again.");
      return;
    }

    setStatus("loading");
    setStatusText("Sending your wish…");

    timerRef.current = window.setTimeout(() => {
      try {
        const trimmedName = name.trim();
        const trimmedMessage = message.trim();
        const duplicate = wishes.some(
          (wish) =>
            wish.name.toLowerCase() === trimmedName.toLowerCase() &&
            wish.message.toLowerCase() === trimmedMessage.toLowerCase(),
        );
        if (duplicate) {
          setStatus("error");
          setStatusText("That exact wish is already on the wall.");
          return;
        }

        const nextWish = {
          id: `wish-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          name: trimmedName,
          message: trimmedMessage,
          ts: Date.now(),
        };
        const nextList = [nextWish, ...wishes].slice(0, MAX_WISHES);
        const saved = writeLocal(STORAGE_KEY, JSON.stringify(nextList));
        if (!saved) {
          setStatus("error");
          setStatusText(
            "This browser blocked local storage, so the wish could not be saved.",
          );
          return;
        }
        writeLocal(LAST_WISH_KEY, String(Date.now()));

        setWishes(nextList);
        setName("");
        setMessage("");
        setErrors({});
        setStatus("success");
        setStatusText("Your wish is on the wall — thank you! ✦");
        setBurst((value) => value + 1);
        audio.playSparkle();
      } catch {
        setStatus("error");
        setStatusText("Something went wrong while saving. Please try again.");
      }
    }, 650);
  }

  return (
    <section className="wishes section" id="wishes" aria-labelledby="wishes-title">
      <div className="container">
        <SectionHeading
          eyebrow="Birthday Wishes Wall"
          title="Leave a Wish for Esther"
          lead="Write something kind, cheerful and encouraging — every message becomes a card on the wall."
          id="wishes-title"
        />

        <div className="wishes__layout">
          <form
            className={`wish-form${status === "success" ? " is-sent" : ""}`}
            onSubmit={handleSubmit}
            noValidate
            data-reveal="left"
          >
            <div className="wish-form__head">
              <span className="wish-form__star" aria-hidden="true">✦</span>
              <p>Sign the wall</p>
            </div>

            <div className="field">
              <label htmlFor="wish-name">Your name</label>
              <input
                id="wish-name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="e.g. A friend"
                value={name}
                maxLength={40}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "wish-name-error" : undefined}
                onChange={(event) => {
                  setName(event.target.value);
                  if (status === "success" || status === "error") {
                    setStatus("idle");
                    setStatusText("");
                  }
                  if (errors.name) setErrors((e) => ({ ...e, name: undefined }));
                }}
              />
              {errors.name && (
                <p className="field__error" id="wish-name-error">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="field">
              <label htmlFor="wish-message">Birthday message</label>
              <textarea
                id="wish-message"
                name="message"
                rows={4}
                placeholder="Wishing Esther joy, laughter, success…"
                value={message}
                maxLength={300}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? "wish-message-error" : "wish-message-count"}
                onChange={(event) => {
                  setMessage(event.target.value);
                  if (status === "success" || status === "error") {
                    setStatus("idle");
                    setStatusText("");
                  }
                  if (errors.message) setErrors((e) => ({ ...e, message: undefined }));
                }}
              />
              <span className="field__count" id="wish-message-count">
                {message.length}/300
              </span>
              {errors.message && (
                <p className="field__error" id="wish-message-error">
                  {errors.message}
                </p>
              )}
            </div>

            {/* spam trap — invisible to people, tempting to bots */}
            <label className="field__hp" aria-hidden="true">
              Website
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(event) => setHoneypot(event.target.value)}
              />
            </label>

            <button
              className="btn btn--glow wish-form__submit"
              type="submit"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Sending…" : "Send My Wish"}
            </button>

            <p
              className={`wish-form__status${status === "error" ? " is-error" : ""}${
                status === "success" ? " is-success" : ""
              }`}
              role="status"
              aria-live="polite"
            >
              {statusText}
            </p>

            <p className="wish-form__note">
              Wishes are saved in this browser only (local storage) — they stay
              on this device and are not sent to a server.
            </p>

            <ConfettiBurst trigger={burst} count={30} />
          </form>

          <div className="wishes__wall">
            <div className="wishes__meta" data-reveal>
              <span className="wishes__count">
                <strong>{formattedCount}</strong> wishes
              </span>
              <span className="wishes__hint">newest first</span>
            </div>

            <div className="wishes__cards">
              {wishes.map((wish, index) => (
                <article
                  className="wish-card"
                  key={wish.id}
                  data-reveal
                  style={{ "--d": `${Math.min(index, 5) * 0.07}s` }}
                >
                  <header className="wish-card__head">
                    <span className="wish-card__avatar" aria-hidden="true">
                      {initials(wish.name) || "✦"}
                    </span>
                    <div>
                      <p className="wish-card__name">{wish.name}</p>
                      <p className="wish-card__date">{formatDate(wish.ts)}</p>
                    </div>
                    {wish.seed && <span className="wish-card__tag">creator</span>}
                  </header>
                  <p className="wish-card__message">{wish.message}</p>
                  <span className="wish-card__shine" aria-hidden="true" />
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
