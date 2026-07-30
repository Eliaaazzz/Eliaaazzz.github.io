# eliaaazzz.github.io

Personal site of Elia (Zhenyu) Liu — blog, software engineering, and research.

- **Live:** https://eliaaazzz.github.io/
- **Stack:** hand-written HTML + CSS + a little vanilla JS. No framework, no build step.
- **Type:** [Fraunces](https://fonts.google.com/specimen/Fraunces) (display) · [Inter](https://fonts.google.com/specimen/Inter) (text) · [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) (code)
- **Syntax highlighting:** vendored [highlight.js](https://highlightjs.org/) (`assets/vendor/`)

## Structure

```
index.html              home
blog/                   writing (each post is a folder with index.html)
sde/                    software engineering portfolio
research/               research projects
assets/css/main.css     the whole design system
assets/js/main.js       theme toggle · code copy · TOC scroll-spy
feed.xml                RSS
```

## Local preview

```bash
python -m http.server 8000
# open http://localhost:8000
```

Deployed via GitHub Pages from the `main` branch.
