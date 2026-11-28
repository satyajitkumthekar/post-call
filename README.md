# Superhuman Lab homepage

The page at superhumanlab.fit: the video people watch after booking a call, then client stories, the program, and client messages.

It is a single page. There is no database and no login: everything on the page is in this repository, and the videos stream from Bunny.

## Where things live

- `src/data/mainVideo.ts`: the main video at the top (its Bunny video ID).
- `src/data/stories.ts`: the client stories, with names, headlines, worries, carousel images and Bunny video IDs.
- `src/data/messages.ts`: the client message screenshots, best first. The images are in `public/messages/`.
- `public/stories/<name>/`: each client's carousel images and video poster.
- `src/components/site/`: the sections of the page.

## Running it on a computer

```bash
npm install
npm run dev
```

## Publishing

The site is set up for Netlify, which runs `npm run build` and publishes the `dist` folder. The settings are in `netlify.toml`.
