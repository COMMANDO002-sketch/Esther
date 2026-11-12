import React, { useEffect, useState } from "react";

const BIRTHDAY_MONTH = 11; // November (1-indexed)
const BIRTHDAY_DAY = 11;

/* Next 11 November from "now" — if today is the birthday the
   countdown lands on today's celebration instead. */
function getNextBirthday(now = new Date()) {
  let year = now.getFullYear();
  let next = new Date(year, BIRTHDAY_MONTH - 1, BIRTHDAY_DAY, 0, 0, 0, 0);
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0, 0, 0, 0,
  );
  if (next.getTime() <= today.getTime()) {
    year += 1;
    next = new Date(year, BIRTHDAY_MONTH - 1, BIRTHDAY_DAY, 0, 0, 0, 0);
  }
  return next;
}

function getParts(target) {
  const distance = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(distance / 86400000),
    hours: Math.floor((distance / 3600000) % 24),
    minutes: Math.floor((distance / 60000) % 60),
    seconds: Math.floor((distance / 1000) % 60),
  };
}

/**
 * Since 11 November has already passed, this band celebrates the
 * nineteen years already lived and counts down (automatically,
 * from the real date) to the next 11 November.
 */
export default function CelebrationTimer() {
  const [target] = useState(() => getNextBirthday());
  const [parts, setParts] = useState(() => getParts(getNextBirthday()));

  useEffect(() => {
    setParts(getParts(target));
    const timer = window.setInterval(() => setParts(getParts(target)), 1000);
    return () => window.clearInterval(timer);
  }, [target]);

  const units = [
    { value: parts.days, label: "Days" },
    { value: parts.hours, label: "Hours" },
    { value: parts.minutes, label: "Minutes" },
    { value: parts.seconds, label: "Seconds" },
  ];

  return (
    <section className="timer-band" aria-labelledby="timer-title">
      <div className="container timer-band__inner">
        <div className="timer-band__copy" data-reveal>
          <p className="timer-band__eyebrow">Celebration Timer</p>
          <h2 className="timer-band__title" id="timer-title">
            19 Years of <span>Wonderful Moments</span>
          </h2>
          <p className="timer-band__sub">
            Celebrating SHITTU ESTHER · born on 11th November
          </p>
        </div>

        <div className="timer-band__countdown" data-reveal style={{ "--d": ".14s" }}>
          <p className="timer-band__label">
            Counting down to the next birthday · 11 November {target.getFullYear()}
          </p>
          <div className="countdown" role="timer" aria-live="off">
            {units.map((unit) => (
              <div className="countdown__cell" key={unit.label}>
                <strong>{String(unit.value).padStart(2, "0")}</strong>
                <span>{unit.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
