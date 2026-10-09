import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const cache = new Map<string, Date | undefined>();

/**
 * When a source file last really changed: its last git commit, falling back to
 * the file's mtime outside a git checkout. Used for sitemap <lastmod>,
 * schema.org dateModified and "Last updated" lines, so freshness signals stay
 * honest instead of moving on every build. (CI must check out full history.)
 */
function expand(rel: string): string[] {
  const abs = path.join(process.cwd(), rel);
  try {
    if (fs.statSync(abs).isDirectory()) {
      return fs.readdirSync(abs).flatMap((f) => expand(path.join(rel, f)));
    }
  } catch {
    /* missing path */
  }
  return [rel];
}

export function lastModified(...paths: string[]): Date | undefined {
  const dates = paths.flatMap(expand).map((rel) => {
    if (cache.has(rel)) return cache.get(rel);
    let d: Date | undefined;
    try {
      // --follow + --diff-filter=AM: track the file across renames and ignore
      // pure moves (the Jekyll -> Next.js migration moved every content file).
      const out = execFileSync("git", ["log", "-1", "--follow", "--diff-filter=AM", "--format=%cI", "--", rel], {
        cwd: process.cwd(),
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      }).trim();
      if (out) d = new Date(out);
    } catch {
      /* not a git checkout */
    }
    if (!d) {
      try {
        d = fs.statSync(path.join(process.cwd(), rel)).mtime;
      } catch {
        d = undefined;
      }
    }
    cache.set(rel, d);
    return d;
  });
  const valid = dates.filter((d): d is Date => !!d);
  return valid.length ? new Date(Math.max(...valid.map((d) => d.getTime()))) : undefined;
}
