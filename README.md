# eliaaazzz.github.io

Personal site of Elia (Zhenyu) Liu — blog, software engineering, and research.

- **Live:** https://eliaaazzz.github.io/
- **Stack:** hand-written HTML + CSS + a little vanilla JS. No framework, no build step.
- **Design:** "Working Schematic" — graph-paper ground, drawing-sheet title block, FIG.-numbered
  sections, electric-chartreuse (#D2FF00) / deep-olive palette, manifesto typography with green
  serif keywords, and a live Watch-transform demo on the home page.
- **Type:** [Bricolage Grotesque](https://fonts.google.com/specimen/Bricolage+Grotesque) (display caps)
  · [Instrument Serif](https://fonts.google.com/specimen/Instrument+Serif) (green italics)
  · [IBM Plex Sans](https://fonts.google.com/specimen/IBM+Plex+Sans) (body)
  · [IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono) (data)
- **Syntax highlighting:** vendored [highlight.js](https://highlightjs.org/) (`assets/vendor/`)

## Structure

```
index.html              home (title block · ticker · live Watch demo · manifesto · figs)
blog/                   writing (each post is a folder with index.html)
sde/                    software engineering portfolio
research/               research projects
assets/css/main.css     the whole design system (light + dark themes)
assets/js/main.js       theme toggle · reveals · code copy · the Watch instrument
feed.xml                RSS
```

## Local preview

```bash
python -m http.server 8000
# open http://localhost:8000
```

Deployed via GitHub Pages from the `main` branch.
