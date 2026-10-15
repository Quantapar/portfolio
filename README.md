# Manu Sharma

Source for [quantapar.com](https://www.quantapar.com), my portfolio as a design engineer. It has who I am, where I've worked, and a set of small interactive pieces I've built.

![Preview](public/og-image.png)

## Running locally

```bash
pnpm install
pnpm dev
```

| Command        | What it does                         |
| -------------- | ------------------------------------ |
| `pnpm dev`     | Start the dev server                 |
| `pnpm build`   | Type-check and build to `dist/`      |
| `pnpm preview` | Serve the production build locally   |
| `pnpm lint`    | Run ESLint                           |

Copy `.env.example` to `.env` if you want to change the site URL used in the Open Graph tags. Everything else works without it.

## Project structure

```
.
├── plugins/
│   └── tweets.ts            Vite plugin that fetches posts and their media at build time
├── public/                  Static files served as-is (favicons, resume, images, video)
│   ├── audio/
│   ├── logos/               Company logos for the experience section
│   ├── previews/            Images used in the contact hover cards
│   └── work/                Thumbnails for the work grid
│       └── experiments/     Media pulled in by the tweets plugin
└── src/
    ├── components/
    │   ├── experience/      Experience list items
    │   ├── layout/          Page shell, layout and footer
    │   ├── sections/        Home page sections
    │   ├── ui/              Small shared components
    │   └── work/
    │       └── previews/    One folder per live piece, each with its own styles and assets
    ├── context/             Theme provider
    ├── data/                Site info, experience, projects and posts
    ├── hooks/
    ├── lib/
    ├── pages/               Home, work index, project page and 404
    ├── App.tsx              Routes
    └── main.tsx
```

### Adding a live piece

1. Create a folder in `src/components/work/previews/` with the component and its CSS.
2. Register it in `src/components/work/previews/index.ts` under its slug.
3. Add the project entry in `src/data/projects.ts`.

## Credits

The isometric drawings in `previews/anatomy-kit` are based on an MIT-licensed kit. Its license is kept next to the code.

## Contact

[x.com/quantapar](https://x.com/quantapar) · [linkedin.com/in/quantapar](https://linkedin.com/in/quantapar) · quantapar@gmail.com
