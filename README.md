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

## Event structured data

Event detail pages emit Google Event markup only when a valid date and a
verified physical venue are documented. Online events and archives without a
verified address keep their ordinary WebPage markup. The Events index lists
links to those pages. See [event data and sources](docs/event-structured-data.md)
for the fields, source records, and archive exceptions.

After building, run `npm run check:events` to check the exported markup and
shared validation rules. The deployment workflow also runs this check.

## Optional statistics and consent

The site does not load its Google Analytics tag until the visitor selects
**Accept statistics**. **Reject** leaves statistics off. The footer provides
**Cookie preferences** and a link to `/cookies/`, which describes the actual
service and storage even though the banner uses general wording.

`lib/statistics-consent.ts` stores only the choice, notice version and expiry
in browser local storage (`site-statistics-consent`). Both choices last six
calendar months. Invalid, expired or unreadable preferences fail closed.
Changing the processing requires a corresponding notice update and increment
of `CONSENT_VERSION` so old choices are not reused for a new purpose.

Revocation sets Google's opt-out flag, removes accessible first-party `_ga`
cookies and reloads any document that has loaded the tag. Storage changes also
notify other open tabs. Existing reports are not deleted by withdrawing consent.
The tag disables advertising/Google signals and caps its cookies at the remaining
consent period. This does not change the Analytics account's server-side data
retention: the owner confirmed **14 months** on 1 November 2026, as reflected
in the notice. Keep that notice in sync with future account changes.

Run `npm run check:consent` after building. It checks expiry, opt-in/opt-out,
legacy cookie cleanup, storage failures and exported pages for unconditional
analytics. Deployment runs it too. Browser validation must also cover real
tag execution, navigation, withdrawal, multiple tabs and keyboard/mobile use.

This change concerns statistics consent only. It does not change existing
font/CDN/image requests or complete a general privacy compliance review.

## Deployment

`.github/workflows/deploy.yml` builds the static export and publishes `out/`
to GitHub Pages on every push to `main`. In the repository settings, under
**Pages → Build and deployment → Source**, select **GitHub Actions**.
