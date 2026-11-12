import React from "react";
import estherCenter from "../../images/esther-center.jpg";
import SectionHeading from "./SectionHeading.jsx";

const chips = ["19 Years", "11 November", "A Day to Celebrate"];

/**
 * About Esther — a warm, respectful introduction with an
 * elegant framed portrait. No invented facts: only what has
 * been provided.
 */
export default function About() {
  return (
    <section className="about section" id="about" aria-labelledby="about-title">
      <div className="container about__inner">
        <div className="about__media" data-reveal="left">
          <span className="about__frame" aria-hidden="true" />
          <figure className="about__portrait">
            <img
              src={estherCenter}
              alt="Portrait of Esther"
              loading="lazy"
              decoding="async"
            />
          </figure>
          <span className="about__corner about__corner--tl" aria-hidden="true" />
          <span className="about__corner about__corner--br" aria-hidden="true" />

          <div className="about__caption">
            <span className="about__caption-star" aria-hidden="true">✦</span>
            <p>
              A friend worth celebrating
              <em>— simply being herself.</em>
            </p>
          </div>

          <span className="about__float about__float--one" aria-hidden="true">
            joy
          </span>
          <span className="about__float about__float--two" aria-hidden="true">
            shine
          </span>
        </div>

        <div className="about__copy">
          <SectionHeading
            eyebrow="About the Celebrant"
            title="Meet Esther"
            align="left"
            id="about-title"
          />

          <p className="about__lead" data-reveal style={{ "--d": ".1s" }}>
            Celebrating Esther, the memories we share, and all the good things
            waiting in the year ahead.
          </p>

          <ul className="about__chips" data-reveal style={{ "--d": ".26s" }}>
            {chips.map((chip) => (
              <li key={chip}>{chip}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
