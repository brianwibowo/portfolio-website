# Brian Wibowo | Portfolio Website

Personal portfolio for **Brian Wibowo (Apriansyah Wibowo)**, Full-Stack Developer based in South Jakarta, built as an interactive early-2000s desktop environment with plain HTML, CSS, and JavaScript. No frameworks, no build step, and ready for static hosting on Vercel or GitHub Pages.

## Desktop Windows

- **Welcome (`welcome.exe`):** executive summary, key delivery metrics, and direct shortcuts.
- **Work History (`experience.exe`):** split-pane inspector covering full-stack engineering roles at **PT Indonesian Cloud**, **Vuriko Studio**, and **Bapak Pucung Studio**.
- **Projects (`Projects`):** featured case study for **SIP-Hapus**, recruitment and learning systems, and a searchable archive of studio and cloud platforms with tech-stack filters.
- **Education & Leadership (`education.exe`):** tabbed record for **Universitas Negeri Semarang (UNNES)** (GPA 3.88/4.00), **Bangkit Academy** (93.10/100), **Google Student Ambassador**, **BSO MAWAPRES FT UNNES**, and **HIMPROTE FT UNNES**.
- **Technical Skills (`skills.txt`):** searchable stack reference spanning 7 engineering, cloud, and AI categories.
- **New Message (`Contact`):** validated message composer with pre-filled `mailto:` fallback, one-click email copy (`sultanapri86@gmail.com`), and optional Formspree webhook support (`FORM_ENDPOINT` in `js/contact.js`).

## Theme & Accessibility Features

- **Six switchable skins:** Night LCD (default), Olive Drab, Luna Blue, Silver Metal, Aero Glass, and Y2K Cyber via **Display Properties** in the system tray, all verified against WCAG AA contrast ratios.
- **Keyboard & mobile support:** full keyboard navigation (`Tab`, arrow keys on tabs, `Escape` to dismiss menus/windows), resizable/draggable/maximizable windows on desktop, and responsive stacked layouts on phones and tablets.
- **Desktop droid (`Bit`):** interactive jet-boot maintenance robot (`js/droid.js`) with Web Audio system chimes (`js/sound.js`) and `prefers-reduced-motion` support.

## Running Locally

```bash
python3 -m http.server 8000
# or
npx serve .
```

Open `http://localhost:8000` (or `http://localhost:3000` with `npx serve`).

## Project Structure

```
├── assets/
│   └── images/            favicon and apple touch icon
├── css/
│   └── style.css          skin tokens, window layouts, responsive rules
├── js/
│   ├── main.js            log-on screen, skins, windows, tabs, filters
│   ├── sound.js           Web Audio startup chime and mute toggle
│   ├── droid.js           Bit desktop robot
│   └── contact.js         form validation, clipboard copy, mailto/Formspree
├── index.html
└── README.md
```
