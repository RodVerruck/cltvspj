export default function QuoteBand({ quote, author }) {
  return (
    <section className="band-breakout band-quote">
      <div className="band-inner band-quote-inner">
        <span className="quote-mark">&ldquo;</span>
        <blockquote className="quote-text">{quote}</blockquote>
        {author && <div className="quote-attribution">{author}</div>}
      </div>
    </section>
  );
}