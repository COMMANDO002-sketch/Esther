import React from "react";
import estherCenter from "../../images/esther-center.jpg";
import esther5 from "../../images/esther5.png";
import esther1 from "../../images/esther1.jpg";
import esther3 from "../../images/esther3.jpg";
import SectionHeading from "./SectionHeading.jsx";

/**
 * Only memories and dates that were actually provided are shown:
 * the birthday itself carries a date, the photo cards carry their
 * own captions, and a final open slot leaves room for more.
 */
const memories = [
  {
    id: "birthday",
    date: "11 November",
    tag: "The Celebration",
    title: "A Day Worth Celebrating",
    text: "Happy belated birthday, Esther. Wishing you a bright year ahead.",
    img: estherCenter,
    alt: "Esther, the birthday celebrant",
  },
  {
    id: "red",
    title: "Beautiful in Red",
    text: "A look made for the moment.",
    img: esther5,
    alt: "Esther in a red dress",
  },
  {
    id: "glow",
    title: "Golden Hour Glow",
    text: "A little golden-hour glow.",
    img: esther1,
    alt: "Artwork reading golden hour glow",
  },
  {
    id: "treasure",
    title: "A Moment to Treasure",
    text: "One to treasure.",
    img: esther3,
    alt: "Artwork reading a moment to treasure",
  },
];

/**
 * Elegant alternating timeline with photo cards, captions and
 * date slots — plus an open card inviting future memories.
 */
export default function Memories() {
  return (
    <section className="memories section" id="memories" aria-labelledby="memories-title">
      <div className="container">
        <SectionHeading
          eyebrow="A Few Favorites"
          title="Birthday Memories"
          lead="Little moments, lovely memories."
          id="memories-title"
        />

        <ol className="timeline">
          {memories.map((memory, index) => (
            <li
              className="timeline__item"
              key={memory.id}
              data-reveal={index % 2 === 0 ? "left" : "right"}
              style={{ "--d": `${(index % 2) * 0.08}s` }}
            >
              <span className="timeline__marker" aria-hidden="true">
                <i />
              </span>
              <article className="timeline__card">
                <figure className="timeline__media">
                  <img
                    src={memory.img}
                    alt={memory.alt}
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
                <div className="timeline__body">
                  {memory.date && (
                    <p className="timeline__date">
                      <span aria-hidden="true">✦</span> {memory.date}
                    </p>
                  )}
                  {memory.tag && <p className="timeline__tag">{memory.tag}</p>}
                  <h3 className="timeline__title">{memory.title}</h3>
                  <p className="timeline__text">{memory.text}</p>
                </div>
              </article>
            </li>
          ))}

          <li className="timeline__item timeline__item--open" data-reveal>
            <span className="timeline__marker timeline__marker--open" aria-hidden="true">
              <i />
            </span>
            <article className="timeline__card timeline__card--open">
              <p className="timeline__open-star" aria-hidden="true">✦</p>
              <h3 className="timeline__title">More memories to come</h3>
              <p className="timeline__text">
                More lovely moments ahead.
              </p>
              <span className="timeline__slot">More to come</span>
            </article>
          </li>
        </ol>
      </div>
    </section>
  );
}
