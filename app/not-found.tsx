import Link from "next/link";

export const metadata = { title: "Page Not Found | Prof. Giovanni Stilo" };

export default function NotFound() {
  return (
    <div className="container" style={{ textAlign: "center", padding: "4rem 1rem" }}>
      <h1 style={{ fontSize: "4rem", color: "var(--color-primary)" }}>404</h1>
      <h2>Page Not Found</h2>
      <p style={{ color: "var(--color-text-secondary)", marginBottom: "2rem" }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/" className="view-all">
        Back to Home <i className="fas fa-arrow-right" />
      </Link>
    </div>
  );
}
