import React, { useMemo } from "react";

const PALETTES = {
  pinkGold: ["#f79ac2", "#ffe9b8", "#ffffff", "#e2649b", "#f3d48c"],
  gold: ["#f3d48c", "#ffffff", "#e6c46a"],
};

/**
 * Lightweight confetti burst made of animated DOM spans.
 * `trigger` (a number) re-arms the animation — bump it to fire again.
 * Everything is cleaned up by React on unmount, so no timers leak.
 */
export default function ConfettiBurst({
  trigger = 0,
  count = 34,
  palette = "pinkGold",
  className = "",
}) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => {
        const colors = PALETTES[palette] || PALETTES.pinkGold;
        const angle = (index / count) * Math.PI * 2 + (index % 3) * 0.35;
        const reach = 90 + ((index * 37) % 130);
        return {
          key: index,
          color: colors[index % colors.length],
          x: Math.cos(angle) * reach,
          y: Math.sin(angle) * reach - 70,
          delay: (index % 9) * 0.03,
          size: 6 + ((index * 7) % 7),
          round: index % 3 !== 0,
          spin: (index % 2 === 0 ? 1 : -1) * (360 + (index % 4) * 150),
          duration: 1.65 + (index % 5) * 0.16,
        };
      }),
    [count, palette],
  );

  if (!trigger) return null;

  return (
    <span className={`confetti-burst ${className}`} key={trigger} aria-hidden="true">
      {pieces.map((piece) => (
        <span
          key={piece.key}
          style={{
            background: piece.color,
            width: `${piece.size}px`,
            height: `${piece.round ? piece.size : piece.size * 1.7}px`,
            borderRadius: piece.round ? "50%" : "2px",
            "--cx": `${piece.x}px`,
            "--cy": `${piece.y}px`,
            "--cx1": `${piece.x * 0.36}px`,
            "--cy1": `${piece.y * 0.3}px`,
            "--cx2": `${piece.x * 0.76}px`,
            "--cy2": `${piece.y * 0.76 + 52}px`,
            "--cspin": `${piece.spin}deg`,
            "--c-duration": `${piece.duration}s`,
            animationDelay: `${piece.delay}s`,
          }}
        />
      ))}
    </span>
  );
}
