# Brian Wibowo | Portfolio Website

Personal portfolio for **Brian Wibowo (Apriansyah Wibowo)**, Full-Stack Developer based in South Jakarta, built as a modular early-2000s desktop environment using plain HTML, CSS, and native JavaScript ES Modules. Zero build step and ready for static hosting on Vercel or GitHub Pages.

## Modular Architecture

```
├── index.html                  Slim shell (~100 lines)
├── css/
│   ├── base.css                6 WCAG-verified skin tokens, window chrome, buttons, scrollbars
│   ├── desktop.css             Log-on screen, desktop shortcuts, taskbar, Start menu, Bit droid
│   └── windows.css             Per-app window layouts and responsive reflows
├── js/
│   ├── app.js                  Entry point: mounts registered apps and boots core services
│   ├── core/
│   │   ├── sound.js            Web Audio startup chime, beeps, and mute toggle
│   │   ├── skins.js            Display Properties skin switcher and adaptive SVG favicon
│   │   ├── taskbar.js          Start menu, live clock, and draggable desktop icons
│   │   ├── window-manager.js   Window stacking, drag, resize/pinch, Escape, and tab helper
│   │   ├── logon.js            Log-on screen, ASCII wolf, and decrypting display name
│   │   └── droid.js            Bit desktop robot
│   └── apps/
│       ├── index.js            Central app registry (APPS + EXTERNAL_LINKS)
│       ├── welcome.js          Welcome hero window and ASCII aura
│       ├── experience.js       Work History split-pane inspector
│       ├── projects.js         Projects case studies, archive table, and live filter
│       ├── education.js        Academic & Leadership tabbed System Properties dialog
│       ├── skills.js           Searchable skills.txt stack document
│       ├── contact.js          New Message composer (mailto + clipboard + optional Formspree)
│       └── lover.js            lover.exe (404 Not Found dialog)
└── assets/images/              Favicon and apple touch icon
```

## How to Add a New Feature / App

1. Create a new module file in `js/apps/` (for example `js/apps/music.js`):
   ```js
   export const musicApp = {
       id: 'music',
       label: 'music.exe',
       startLabel: 'Music Player',
       taskLabel: 'music.exe',
       icon: '<svg viewBox="0 0 48 48" aria-hidden="true">...</svg>',
       render() {
           return `<section id="music" class="section" hidden><article class="window" role="dialog" aria-labelledby="music-title">...</article></section>`;
       },
       init() {
           // Bind click/input handlers here
       },
   };
   ```
2. Import and add it to `APPS` inside `js/apps/index.js`. Desktop icon, Start menu entry, taskbar button, window drag/resize/minimize/maximize/close, and `Escape` dismissal work automatically.

## Running Locally

```bash
python3 -m http.server 8000
# or
npx serve .
```

Open `http://localhost:8000` (or `http://localhost:3000` with `npx serve`).
