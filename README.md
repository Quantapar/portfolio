# Manu Sharma's portfolio

My personal site: a short intro, the things I build and share, and where I have worked.

Live at [quantapar.com](https://www.quantapar.com).

## Stack

- [Vite](https://vite.dev) + [React 19](https://react.dev) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com)
- [Motion](https://motion.dev) (`framer-motion`) for animation
- [React Router](https://reactrouter.com) for pages, with the View Transitions API for the morph between them
- Deployed on [Vercel](https://vercel.com)

## Run it

You need [Node.js](https://nodejs.org) and [pnpm](https://pnpm.io).

```sh
pnpm install
pnpm dev        # start the dev server
pnpm build      # type-check and build into dist/
pnpm preview    # serve the built site locally
pnpm lint       # run ESLint
```

The build fetches my posts from X, so it needs network access.

## Pages

| Path | What it shows |
| --- | --- |
| `/` | Intro and contact chips, six pieces of work, experience |
| `/work` | Everything: experiments first, then projects |
| `/work/:slug` | One piece. Components rebuilt on this site run live and full screen; the rest get a write-up |

## Structure

```
plugins/
  tweets.ts            Build step: fetches the posts listed in src/data/tweets.ts
public/
  work/                Project images and videos
  work/experiments/    Videos and stills saved from posts
  previews/, logos/    Images for hover cards and experience rows
src/
  pages/               One file per route
  components/
    layout/            Page column, layout, footer
    sections/          The blocks of the home page
    experience/        Experience rows and their side image
    work/              Work grid, project page, live piece wrapper
    work/previews/     The live pieces, one file each, loaded on demand
    ui/                Shared parts: hover cards, chips, icons, signature
  data/                All content: site info, experience, projects, posts
  hooks/, context/, lib/
  index.css            Theme tokens and the few hand-written styles
```

## Adding work

**A post from X**

1. Paste its link into `tweetLinks` in `src/data/tweets.ts`, in the order it should appear.
2. Build. The text and media are fetched, and the video and a still frame are saved into `public/work/experiments/`. Files already there are never overwritten, so a hand-edited clip stays as it is.

The six posts on the home page are picked by id in `src/data/work.ts`.

**A project**

Add an entry to `projects` in `src/data/projects.ts` and put its image or video in `public/work/`.

**A live piece**

1. Add the component to `src/components/work/previews/`.
2. Register it in `src/components/work/previews/index.ts` under the project's slug.

A project with a registered piece opens it full screen instead of a write-up.

If a project has a `postUrl`, that post's thumbnail opens the project's page here instead of the post on X.

## Content

Name, email, links and the numbers on the hover cards live in `src/data/site.ts`. Experience lives in `src/data/experience.ts`.

## Environment

| Variable | Use |
| --- | --- |
| `VITE_SITE_URL` | Optional. The site address used for social preview links. Defaults to `https://www.quantapar.com`. See `.env.example` |

## Deploying

Pushing to `main` deploys on Vercel. `vercel.json` sends every path to `index.html` so the client-side routes work on a direct visit.

## Notes

- Light mode only for now. The theme toggle is commented out in `src/components/layout/SiteFooter.tsx`, not deleted.
