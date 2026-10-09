# giovanni-stilo.github.io

Personal website, built with Next.js (App Router, TypeScript), Tailwind CSS v4
and shadcn/ui, exported as a static site and served by GitHub Pages at
<https://giovannistilo.eu>.

## Local development

```sh
npm install
npm run dev        # http://localhost:3000
npm run build      # static export into out/
npm run preview    # serve out/ locally
npm run lint
```

## Where things live

| Path | What |
|------|------|
| `content/posts/` | News announcements (`YYYY-MM-DD-slug.md` → `/blog/YYYY/MM/DD/slug/`) |
| `content/blog/` | Long-form articles (`slug.md` → `/blog/slug/`) |
| `content/events/`, `content/projects/` | Event and project pages, ordered by `last-updated` |
| `content/pages/` | About (Markdown) and the Publications, Service and Teaching bodies (HTML) |
| `content/data/` | People (`people.yml`) and the static cards on Research and Events |
| `app/` | Routes, layouts, sitemap and Atom feed (`/feed.xml`) |
| `components/ui/` | shadcn/ui components (e.g. the `SchlierenRig` ASCII hero) |
| `components/site/`, `components/home/` | Site chrome and home-page sections |
| `styles/site.css` | The site's design system (imported into `app/globals.css`) |
| `public/` | Static files copied as-is: images, data downloads, CV, `CNAME`, `robots.txt` |

Markdown supports GitHub-flavored syntax plus raw HTML, including `<script>`
blocks (see the PRIN 2026 article). Kramdown-style `{:target="_blank"}` after a
link and Liquid `{{ '/path' | relative_url }}` are still understood.

## Blog

The Blog index is at `/blog/`. To write an article:

1. Copy `templates/blog-post.md` to `content/blog/your-article-slug.md`.
2. Set the title, description, date (including timezone), author, and topic tags.
3. Write in Markdown; adapt or remove sections to suit the topic.
4. Keep `published: false` while drafting. Preview drafts locally with
   `SHOW_DRAFTS=1 npm run dev`.
5. When the article is ready, update the date to its publication date and set
   `published: true`. It will appear in the Blog listing and sitemap on the next
   build.

An optional `last_modified_at` date records a later update and is displayed on
the article page. The author defaults to Giovanni Stilo. Draft previews show a
review badge, carry a `noindex` directive, and are omitted from the sitemap. Do
not deploy a build made with `SHOW_DRAFTS=1`. Future-dated posts are not
published until their date has passed and the site is rebuilt.

## Deployment

`.github/workflows/deploy.yml` builds the static export and publishes `out/`
to GitHub Pages on every push to `main`. In the repository settings, under
**Pages → Build and deployment → Source**, select **GitHub Actions**.
