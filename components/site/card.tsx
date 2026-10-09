export type CardData = {
  tag: string;
  label: string;
  title: string;
  text: string;
  meta?: string;
  href?: string;
  icon?: string;
  linkLabel?: string;
};

export function InfoCard({ tag, label, title, text, meta, href, icon, linkLabel }: CardData) {
  return (
    <div className="card">
      <span className={`card-tag ${tag}`}>{label}</span>
      <h3>{title}</h3>
      <p>{text}</p>
      {meta ? <p style={{ color: "var(--color-text-secondary)", fontSize: "0.85rem" }}>{meta}</p> : null}
      {href ? (
        <a href={href} target="_blank" rel="noopener" className="card-link">
          <i className={icon} /> {linkLabel}
        </a>
      ) : null}
    </div>
  );
}
