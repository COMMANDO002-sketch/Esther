/* Shared motion preference — read once, safe in any browser. */
export const prefersReducedMotion =
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default prefersReducedMotion;
