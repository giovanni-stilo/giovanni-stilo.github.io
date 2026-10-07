# giovanni-stilo.github.io

Personal website built with Jekyll.

## Blog

The Blog index is at `/blog/`. Articles live in `_blog/` and use the
`blog-post` layout, with URLs such as `/blog/what-makes-an-ai-explanation-useful/`.
News announcements stay in `_posts/` and retain their existing URLs.

To write an article:

1. Copy `templates/blog-post.md` to `_blog/your-article-slug.md`.
2. Set the title, description, date (including timezone), author, and topic tags.
3. Write in Markdown; adapt or remove sections to suit the topic.
4. Keep `published: false` while drafting. Preview drafts locally with
   `bundle exec jekyll serve --unpublished`.
5. When the article is ready, update the date to its publication date and set
   `published: true`. It will appear in the Blog listing and sitemap on the next
   normal build.

An optional `last_modified_at` date records a later update and is displayed on
the article page. The author defaults to Giovanni Stilo.

The first article, **What Makes an AI Explanation Useful?**, is an unpublished
draft for editorial review. Normal builds show a Coming soon message until an
article is published. Draft previews show a review badge, carry a `noindex`
directive, and omit drafts from the sitemap. Preview drafts locally; do not
deploy a build made with `--unpublished`.

The `templates/` directory is excluded from the generated website.

## Local build

```sh
bundle install
bundle exec jekyll build
bundle exec jekyll serve
```
