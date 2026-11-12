import React from "react";

/**
 * Shared section heading: gold eyebrow, Playfair title,
 * optional lead paragraph and a delicate divider.
 */
export default function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "center",
  id,
}) {
  return (
    <header className={`section-heading section-heading--${align}`} data-reveal>
      {eyebrow && <p className="section-heading__eyebrow">{eyebrow}</p>}
      <h2 className="section-heading__title" id={id}>
        {title}
      </h2>
      <span className="section-heading__divider" aria-hidden="true">
        <i />
        <b>✦</b>
        <i />
      </span>
      {lead && <p className="section-heading__lead">{lead}</p>}
    </header>
  );
}
