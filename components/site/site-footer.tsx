import Link from "next/link";

const explore = [
  { href: "/research/", label: "Research Projects" },
  { href: "/publications/", label: "Publications" },
  { href: "/teaching/", label: "Teaching" },
  { href: "/people/", label: "People" },
  { href: "/events/", label: "Events & Workshops" },
  { href: "/blog/", label: "Blog" },
];

export function SiteFooter() {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <h3>Prof. Giovanni Stilo</h3>
            <p>
              Professor of Computer Science
              <br />
              Luiss University of Rome
            </p>
            <p style={{ marginTop: "0.5rem" }}>
              Founder of the{" "}
              <a href="https://aiimlab.org" target="_blank" rel="noopener">
                AIIM Research Collective
              </a>
            </p>
          </div>
          <div className="footer-col">
            <h3>Explore</h3>
            <ul>
              {explore.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h3>Connect</h3>
            <div className="social-links">
              <a href="https://scholar.google.com/citations?hl=en&user=uTyaicMAAAAJ" target="_blank" rel="noopener" aria-label="Google Scholar">
                <i className="fas fa-graduation-cap" /> Google Scholar
              </a>
              <a href="https://github.com/aiim-research" target="_blank" rel="noopener" aria-label="GitHub">
                <i className="fab fa-github" /> GitHub
              </a>
              <a href="https://www.linkedin.com/in/giovanni-stilo-7986b816/" target="_blank" rel="noopener" aria-label="LinkedIn">
                <i className="fab fa-linkedin" /> LinkedIn
              </a>
              <a href="mailto:gstilo@luiss.it" aria-label="Email">
                <i className="fas fa-envelope" /> gstilo@luiss.it
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Giovanni Stilo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
