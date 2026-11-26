# ModCut — portfolio site

A one-page portfolio site for **ModCut**, a video-editing app by **bw02-dev**.
Plain HTML, CSS and JavaScript: no build step, no dependencies, ready for GitHub Pages.

```
.
├── index.html            ← all page text, the versions and their video links
├── assets/
│   ├── css/styles.css    ← design (colours, fonts, spacing at the top)
│   ├── js/main.js        ← version panels, stops video on close, subtle scroll animations
│   └── favicon.svg       ← browser tab icon
├── .gitignore            ← blocks video files (.mp4, .mov, …) from being committed
├── .nojekyll             ← tells GitHub Pages to serve files as-is
└── README.md
```

The page has four parts: **Hero** (tagline + Microsoft Store button), **Versions**,
**About my process**, and a final **Microsoft Store** call to action.

> **No video files in this repository.** GitHub rejects files over 100 MB, and
> `.gitignore` blocks `.mp4`, `.mov`, `.webm` and other video files. Demo videos
> are embedded from YouTube.

---

## 1. Change a version's YouTube video

Each version panel in `index.html` has a YouTube iframe, marked
**`YOUTUBE VIDEO FOR 0.1.0`**:

```html
<div class="video-frame">
  <iframe
    src="https://www.youtube.com/embed/Z1vDA2LC-rA"
    title="ModCut 0.1.0 demo"
    loading="lazy"
    referrerpolicy="strict-origin-when-cross-origin"
    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen></iframe>
</div>
<p class="video-caption">
  <a href="https://youtu.be/Z1vDA2LC-rA" target="_blank" rel="noopener">Watch on YouTube</a>
</p>
```

To use another video, replace the video ID (`Z1vDA2LC-rA`) in **both** the iframe
`src` and the "Watch on YouTube" link. The video ID is the part after `youtu.be/`
or after `watch?v=` in a YouTube link.

Rules that keep the player working:

- The `src` must be the **embed** form: `https://www.youtube.com/embed/VIDEO_ID`.
  A normal `watch?v=` or `youtu.be/` link won't play inside an iframe.
- **Keep `referrerpolicy="strict-origin-when-cross-origin"`**. Never use `no-referrer`.
  The `<meta name="referrer">` tag in `<head>` sets the same policy for the whole page.
  YouTube needs to know which site embeds the video. Without a referrer it shows
  **"Error 153 – Video player configuration error"**.
- **No autoplay.** Don't add `?autoplay=1` to the `src` or `autoplay` to `allow`.
- The player stays 16:9 at every screen width (`.video-frame` in `styles.css`).
  Closing a version panel stops its video.
- The video owner must allow embedding (YouTube Studio → video → *Show more* →
  *Allow embedding*).
- **Brave browser:** Brave Shields can block or change YouTube embeds. If the
  player fails only in Brave, click the lion icon and turn Shields off for the
  site, or test in Edge, Chrome or Firefox.

### Option B: clickable thumbnail instead of the player

If the embedded player keeps failing, `index.html` also contains a ready-made
**clickable thumbnail** (marked `OPTION B`, commented out). It shows the video's
YouTube thumbnail with a play button and opens the video on YouTube in a new tab,
so it can never show Error 153. To switch, follow the instructions in the
comment: delete the `OPTION A START … OPTION A END` block and un-comment the
`OPTION B` block. Change the video ID in its `href` and `img src` if you change videos.

---

## 2. Versions

The **Versions** section has two parts in `index.html`:

1. A list of buttons (`<ul class="versions__list">`), one per version.
2. One detail panel (`<article class="version-panel">`) per version.

Each button's `aria-controls` must equal its panel's `id`, for example
`aria-controls="version-0-1-0"` ↔ `id="version-0-1-0"`. Clicking a button opens
its panel and closes any other. A link such as `…/#version-0-1-0` opens that
version directly.

### Edit the details of a version

Inside the panel, change:

- **Features**: the list under `<h4 … >What's included in 0.1.0</h4>` (one `<li>` per feature).
- **What I learned**: the paragraphs under `<h4 … >What I learned</h4>`.
- **Video**: the iframe `src` and the "Watch on YouTube" link (see section 1).

If you want to mark text as unfinished, give it `class="placeholder-text"`. It then gets a
dashed outline so you can spot it. Remove the class once the real text is in.

### Add a new version (e.g. 0.2.0)

1. In `.versions__list`, copy the `<li>…</li>` with the 0.1.0 button and put the
   copy **first** (newest first). Change the number and set
   `aria-controls="version-0-2-0"`.
2. Copy the whole `<article class="version-panel" id="version-0-1-0" …>…</article>`
   block, and paste it above the 0.1.0 panel.
3. In the copy, change `id="version-0-1-0"` → `id="version-0-2-0"`, the
   `aria-labelledby` / heading `id`s (they must be unique, e.g. `version-0-2-0-title`,
   `v020-new`, `v020-learned`), the version text, and the YouTube link.

No JavaScript changes are needed.

---

## 3. Edit the other text

All visible text is in `index.html`, split into commented sections:
`NAVIGATION`, `HERO`, `VERSIONS`, `ABOUT MY PROCESS`, `FINAL CTA` and `FOOTER`.

- **Tagline**: `hero__tagline` ("Bold edits. Without the busywork.")
- **Page title and share description**: `<title>`, `<meta name="description">` and the `og:` tags.
- **Story**: the "How it started" block inside About my process. Keep the age and
  timeline up to date as time passes.
- **Microsoft Store link**: appears three times (nav, hero, final CTA). Search for
  `apps.microsoft.com`.
- **GitHub link**: in the `FOOTER`.

Design tweaks such as the accent colour, fonts and spacing are the variables at the top of
`assets/css/styles.css` (`--accent`, `--font`, …). Dark-mode colours are in the
`@media (prefers-color-scheme: dark)` block right below.

---

## 4. Preview locally

**Don't double-click `index.html` to test the video.** A page opened as a file
(`file:///…`) has no web address, so it can't send a referrer, and YouTube shows
**Error 153**. Use a small local server instead. Run one of these in the project
folder:

```bash
npx serve .                    # Node.js, then open the address it prints
python -m http.server 8000     # Python, then open http://localhost:8000
```

In VS Code, the *Live Server* extension also works. Then open **Versions → 0.1.0**
and press Play.

---

## 5. GitHub Pages

The site is served from the `main` branch, root folder (**Settings → Pages →
Deploy from a branch → `main` / `(root)`**), at
`https://bw02-dev.github.io/bw02-dev-portfolio/`.

All paths are relative (`assets/…`), so the site works from this project
subpath without changes.

---

## Notes

- Motion is subtle and is turned off automatically for visitors who have
  "reduce motion" enabled. Without JavaScript, all version details are simply shown.
- The site uses the Inter font from Google Fonts and falls back to the system font.
- ModCut is an independent project and is not affiliated with Apple, Microsoft,
  CapCut or Adobe. The footer says this on the page.
