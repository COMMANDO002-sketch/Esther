import { useEffect, useState } from "react";
import { prefersReducedMotion } from "./motion.js";

/* ------------------------------------------------------------
   Session helpers (fail-safe wrappers around sessionStorage)
   ------------------------------------------------------------ */
export function readSession(key) {
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeSession(key, value) {
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    /* storage unavailable — the experience still works */
  }
}

export function readLocal(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeLocal(key, value) {
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------
   Smooth scroll to a section (respects reduced motion)
   ------------------------------------------------------------ */
export function scrollToSection(id) {
  const target = document.getElementById(id);
  if (!target) return;
  target.scrollIntoView({
    behavior: prefersReducedMotion ? "auto" : "smooth",
    block: "start",
  });
}

/* ------------------------------------------------------------
   Scroll reveal — observes [data-reveal] inside a root node.
   Adds .is-visible when the element enters the viewport.
   A MutationObserver picks up dynamically added nodes (wish
   cards, gallery items…) and a safety fallback reveals
   everything if the observer never reports.
   ------------------------------------------------------------ */
export function useReveal(rootRef, enabled = true) {
  useEffect(() => {
    const root = rootRef && rootRef.current;
    if (!root || !enabled) return undefined;

    const pending = () =>
      Array.from(root.querySelectorAll("[data-reveal]:not(.is-visible)"));

    if (prefersReducedMotion || typeof IntersectionObserver === "undefined") {
      pending().forEach((node) => node.classList.add("is-visible"));
      return undefined;
    }

    let reported = false;
    const observer = new IntersectionObserver(
      (entries) => {
        reported = true;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );

    const observeAll = () => pending().forEach((node) => observer.observe(node));
    observeAll();

    const mutationObserver = new MutationObserver(observeAll);
    mutationObserver.observe(root, { childList: true, subtree: true });

    const fallback = window.setTimeout(() => {
      if (!reported) pending().forEach((node) => node.classList.add("is-visible"));
    }, 3000);

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
      window.clearTimeout(fallback);
    };
  }, [rootRef, enabled]);
}

/* ------------------------------------------------------------
   Match media hook (pointer type, viewport size…)
   ------------------------------------------------------------ */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const list = window.matchMedia(query);
    const onChange = (event) => setMatches(event.matches);
    setMatches(list.matches);
    if (list.addEventListener) {
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    }
    list.addListener(onChange);
    return () => list.removeListener(onChange);
  }, [query]);

  return matches;
}

/* ------------------------------------------------------------
   Locks body scroll while an overlay (intro, menu, lightbox)
   is open. Restores the previous value on cleanup.
   ------------------------------------------------------------ */
export function useBodyLock(locked) {
  useEffect(() => {
    if (!locked) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [locked]);
}
