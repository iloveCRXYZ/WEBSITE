# CRXYZ — Profile Page

A guns.lol-style profile card built with plain HTML, CSS, and JavaScript — no frameworks, no build step. Glassmorphic panels for profile info, certificates/languages/tech stack, and a music player, plus fully clickable social links.

## Preview

![Profile section](assets\screenshots\main.png)
![Skills section](screenshots/skills-section.png)
![Music player](assets\screenshots\music.png)

## Folder structure

```
site/
├── index.html          # markup only — no inline CSS or JS
├── css/
│   └── styles.css      # all styling, incl. responsive PC layout
├── js/
│   └── script.js       # link config + click/keyboard wiring
├── screenshots/        # preview images used in this README
└── README.md
```

Everything is split by concern — the HTML has no `<style>` or `<script>` tags, so `index.html`, `css/styles.css`, and `js/script.js` all need to stay in the same relative layout for the page to render correctly.

## Features

- **Glass panels** — three separate frosted-glass cards: profile info, certificates/languages/tech stack, and the music player
- **Hover tooltips** — languages and the Cisco certificate status show a small popup on hover (proficiency level / "studying for it right now")
- **Working buttons** — the Discord card and every social icon are real links, wired through a single config object (see below)
- **Responsive** — under ~520px it behaves like a phone screen; above that it becomes a centered card suited to desktop

## Editing your links

All outbound links live in one place, `js/script.js`:

```js
const LINKS = {
  discord:       "https://discord.com/users/REPLACE_WITH_YOUR_ID",
  youtubeMusic1: "https://music.youtube.com/channel/REPLACE_ME",
  youtubeMusic2: "https://music.youtube.com/channel/REPLACE_ME",
  youtube:       "https://youtube.com/@REPLACE_ME",
  github:        "https://github.com/REPLACE_ME",
  twitch:        "https://twitch.tv/REPLACE_ME",
  steam:         "https://steamcommunity.com/id/REPLACE_ME"
};
```

Swap the placeholder URLs for your real ones — nothing else needs to change.

## How the buttons are wired

Any element in `index.html` with a `data-link="key"` attribute gets picked up automatically and pointed at `LINKS[key]`:

```html
<!-- index.html -->
<a class="info-card" data-link="discord" aria-label="Open Discord profile">
  ...
</a>
```

```js
// js/script.js
document.querySelectorAll("[data-link]").forEach((el) => {
  const key = el.getAttribute("data-link");
  const url = LINKS[key];
  if (!url) return;

  const open = () => window.open(url, "_blank", "noopener");
  el.addEventListener("click", open);
  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open();
    }
  });
});
```

Adding a new social icon later is just: give it a `data-link="yourKey"` attribute in the HTML, and add `yourKey: "https://..."` to the `LINKS` object.

## Hover tooltip pattern

Languages and the certificate status both use the same lightweight CSS-only tooltip — no JS involved:

```css
  content:attr(data-level);
  position:absolute;
  bottom:calc(100% + 10px);
  opacity:0;
  transition:opacity .15s ease, transform .15s ease;
}
.lang-chip:hover::after{ opacity:1; }
```

```html
<span class="lang-chip" data-level="Fluent">English</span>
```

To add a new language or change a proficiency level, just edit the `data-level` value.

## Running locally

No build tools needed — just open `index.html` in a browser, or serve the folder:

```bash
cd Website
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploying to GitHub Pages

1. Push this folder to a GitHub repo
2. Repo **Settings → Pages** → set source to the branch/folder containing `index.html`
3. Your page will be live at `https://<username>.github.io/<repo-name>/`