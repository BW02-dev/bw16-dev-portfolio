# ModCut — portfolio site

A one-page portfolio site for **ModCut**, a video-editing app by **bw16-dev**.
It is plain HTML, CSS and JavaScript: no build step, no dependencies, ready for GitHub Pages.

```
.
├── index.html            ← all page text and the video slot
├── asset vid/            ← the demo video shown on the page (ModCut_EN_with_captions_v2.mp4)
├── assets/
│   ├── css/styles.css    ← design (colours, fonts, spacing at the top)
│   ├── js/main.js        ← video loader + subtle scroll animations
│   ├── video/            ← optional alternative place for videos/posters
│   └── favicon.svg       ← browser tab icon
├── .nojekyll             ← tells GitHub Pages to serve files as-is
└── README.md
```

---

## 1. The demo video

### Where it is now

The page plays **`asset vid/ModCut_EN_with_captions_v2.mp4`** (the folder `asset vid` in the
repository root). It is set on the `#app-video` element in `index.html`,
inside the block marked **`APP VIDEO — REPLACE THE PLACEHOLDER HERE`**:

```html
<div class="video-frame reveal"
     id="app-video"
     data-video-file="asset%20vid/ModCut_EN_with_captions_v2.mp4"
     data-video-embed=""
     data-video-poster=""
     data-video-title="ModCut app demo">
```

- The path is **relative**, so it works both locally and on GitHub Pages.
- The space in the folder name is written as **`%20`**. (Writing a plain
  space also works, because the script encodes it, but `%20` is safest.)
- The video has playback controls and scales to fit the 16:9 frame on any screen.

> ⚠️ **File size: please read before publishing.**
> `ModCut_EN_with_captions_v2.mp4` is currently about **525 MB**. GitHub **rejects any file over
> 100 MB**, so `git push` will fail while this file is committed, and GitHub
> Pages doesn't serve Git LFS files either. Before you publish, either:
>
> 1. **Compress it** to under ~50 MB (a 1–2 minute 1080p clip compresses well).
>    For example, in the free app **HandBrake**, choose the *Web → "Creator 1080p60"*
>    or *"Vimeo YouTube HQ 1080p"* preset with **Format: MP4** and **Web Optimized**
>    ticked, and lower the quality slider if the file is still too large. With ffmpeg:
>    ```bash
>    ffmpeg -i "asset vid/ModCut_EN_with_captions_v2.mp4" -c:v libx264 -crf 26 -preset slow -c:a aac -b:a 128k -movflags +faststart "asset vid/modcut-web.mp4"
>    ```
>    Then point `data-video-file` at the new file, or replace the original file with it.
> 2. **Or host it on YouTube/Vimeo** and use the embed option below. In that case
>    keep the large file out of Git (delete it or add `asset vid/` to a `.gitignore`).

### Replace the video with a different file

1. Export the video as **MP4 (H.264 video, AAC audio)**. This plays in all modern browsers.
2. Put it in the repository, e.g. overwrite `asset vid/ModCut_EN_with_captions_v2.mp4`, or add a new file
   such as `assets/video/modcut-demo.mp4`.
3. If the name or folder changed, update the attribute (spaces → `%20`):
   ```html
   data-video-file="assets/video/modcut-demo.mp4"
   ```
4. Optional: add a still frame (e.g. `poster.jpg`) and set
   `data-video-poster="asset%20vid/poster.jpg"`. It is shown before playback starts.

### Use YouTube, Vimeo or another embed link instead

Clear `data-video-file` (set it to `""`) and paste the link into `data-video-embed`:

```html
data-video-file=""
data-video-embed="https://www.youtube.com/watch?v=YOUR_VIDEO_ID"
```

Normal share links (`youtube.com/watch?v=…`, `youtu.be/…`, `youtube.com/shorts/…`,
`vimeo.com/123456`) are converted to embed links automatically. Any other URL
is used as-is, so for other hosts paste their **embed** URL (the `src` from
their `<iframe>` code). If both attributes are filled, the file is used.

If a video file can't be loaded, the frame shows an error message instead
of a blank box. Clear both attributes to show the original placeholder again.

---

## 2. Edit the text

All visible text is in `index.html`, split into clearly commented sections:
`NAVIGATION`, `HERO`, `SHOWCASE`, `KEY IDEAS`, `AI WORKFLOW`, `MY CONTRIBUTION`,
`STORY` ("How My Vibe Coding Journey Started"), `FINAL CTA` and `FOOTER`. Edit the text between the tags. You don't need to touch the CSS or JS.

Things you may want to change:

- **Tagline**: `hero__tagline` ("Bold edits. Without the busywork.")
- **Page title and share description**: `<title>`, `<meta name="description">` and the `og:` tags in `<head>`
- **Video caption**: `showcase__caption`
- **Your story**: the paragraphs and quote inside the `STORY` section. Keep the age and timeline up to date as time passes.
- **Microsoft Store link**: appears three times (nav, hero, final CTA). Search for `apps.microsoft.com` to find them.

Design tweaks such as the accent colour, fonts and spacing are the variables
at the top of `assets/css/styles.css` (`--accent`, `--font`, …). Dark-mode colours
are in the `@media (prefers-color-scheme: dark)` block right below.

### Add a profile link

In the `FOOTER` section of `index.html` there is a commented-out link:

```html
<!-- PROFILE LINK (optional): uncomment and add your URL, e.g. GitHub or LinkedIn
· <a href="https://github.com/your-username" target="_blank" rel="noopener">GitHub</a>
-->
```

Remove the `<!--` and `-->` lines, then replace the URL and label. You can add
several links separated by `·`. To put a link in the top bar too, add another
`<a href="…">` inside `<nav class="nav__links">`.

---

## 3. Preview locally

You can double-click `index.html` to open it. For the video and embeds to behave
exactly as they will online, use a small local server instead.

**Node.js**:

```bash
npx serve .
```

**Python** (if installed):

```bash
python -m http.server 8000
```

Then open the address `serve` prints, or <http://localhost:8000> for Python.
In VS Code, the *Live Server* extension also works.

---

## 4. Publish with GitHub Pages

1. Create a repository on GitHub and push this folder to it:
   ```bash
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
2. On GitHub, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Source: Deploy from a branch**,
   then **Branch: `main`** and folder **`/ (root)`**. Click **Save**.
4. After a minute or two the site is live at
   `https://<your-username>.github.io/<repo-name>/`.

All paths in the site are relative, so it works from a repository subpath.
If you name the repository `<your-username>.github.io`, it's served from the root domain instead.

---

## Notes

- Motion is subtle and is turned off automatically for visitors who have
  "reduce motion" enabled in their system settings.
- The site uses the Inter font from Google Fonts and falls back to the system font if it doesn't load.
- ModCut is an independent project and is not affiliated with Apple, Microsoft,
  CapCut or Adobe. The footer says this on the page.
