// Display Properties skin picker and skin-adaptive SVG wolf favicon.
export const SKINS = [
    { id: 'noir',   name: 'Night LCD',    family: 'dark',  swatch: ['#0d0f12', '#1d2025', '#a6ff4d'] },
    { id: 'olive',  name: 'Olive Drab',   family: 'dark',  swatch: ['#2c3326', '#424d3b', '#e0d16c'] },
    { id: 'luna',   name: 'Luna Blue',    family: 'light', swatch: ['#3a6fd8', '#ece9d8', '#2e822e'] },
    { id: 'silver', name: 'Silver Metal', family: 'light', swatch: ['#7d879c', '#eceef3', '#3558ab'] },
    { id: 'aero',   name: 'Aero Glass',   family: 'light', swatch: ['#2488cc', '#f2fbff', '#6fc22e'] },
    { id: 'cyber',  name: 'Y2K Cyber',    family: 'dark',  swatch: ['#1b1236', '#3a2a72', '#ff7ad9'] },
];

export function initSkins() {
    const root = document.documentElement;
    const skinBtn = document.getElementById('skin-btn');
    const skinMenu = document.getElementById('skin-menu');
    const skinList = document.getElementById('skin-list');
    const faviconLink = document.querySelector('link[rel="icon"]');
    let faviconSvg = null;

    const hexRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
    const rgbHex = (c) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
    const mix = (a, b, t) => rgbHex(hexRgb(a).map((v, i) => v + (hexRgb(b)[i] - v) * t));
    const luma = (h) => {
        const [r, g, b] = hexRgb(h).map((v) => {
            const s = v / 255;
            return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    function updateFavicon(skin) {
        const [desktop, , accent] = skin.swatch;
        const tile = mix(desktop, '#000000', 0.7);
        let wolf = accent;
        for (let t = 0.15; luma(wolf) < 0.32 && t <= 0.9; t += 0.15) wolf = mix(accent, '#ffffff', t);
        const eyes = mix(wolf, '#ffffff', 0.8);
        root.style.setProperty('--lg-accent', accent);
        root.style.setProperty('--lg-glow', `rgba(${hexRgb(accent).join(', ')}, 0.3)`);
        if (!faviconLink) return;
        const paint = (svg) => {
            const out = svg.replace(/#14171c/g, tile).replace(/#a6ff4d/g, wolf).replace(/#efffd9/g, eyes);
            faviconLink.href = 'data:image/svg+xml,' + encodeURIComponent(out);
        };
        if (faviconSvg) { paint(faviconSvg); return; }
        fetch('assets/images/favicon.svg')
            .then((r) => (r.ok ? r.text() : Promise.reject()))
            .then((svg) => { faviconSvg = svg; paint(svg); })
            .catch(() => {});
    }

    function applySkin(id) {
        const skin = SKINS.find((s) => s.id === id) || SKINS[0];
        root.dataset.skin = skin.id;
        root.dataset.theme = skin.family;
        try { localStorage.setItem('skin', skin.id); } catch (e) { /* storage unavailable */ }
        skinList?.querySelectorAll('.skin-option').forEach((btn) => {
            btn.setAttribute('aria-pressed', String(btn.dataset.skinId === skin.id));
        });
        updateFavicon(skin);
    }

    updateFavicon(SKINS.find((s) => s.id === root.dataset.skin) || SKINS[0]);

    if (skinList) {
        SKINS.forEach((skin) => {
            const li = document.createElement('li');
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'skin-option';
            btn.dataset.skinId = skin.id;
            btn.setAttribute('aria-pressed', String(root.dataset.skin === skin.id));

            const swatch = document.createElement('span');
            swatch.className = 'skin-swatch';
            swatch.setAttribute('aria-hidden', 'true');
            skin.swatch.forEach((colour) => {
                const chip = document.createElement('span');
                chip.style.background = colour;
                swatch.append(chip);
            });

            const label = document.createElement('span');
            label.textContent = skin.name;
            const family = document.createElement('span');
            family.className = 'skin-family';
            family.textContent = skin.family === 'dark' ? 'Classic' : 'Glossy';

            btn.append(swatch, label, family);
            btn.addEventListener('click', () => applySkin(skin.id));
            li.append(btn);
            skinList.append(li);
        });
    }

    function setSkinMenu(open) {
        if (!skinMenu || !skinBtn) return;
        skinMenu.hidden = !open;
        skinBtn.setAttribute('aria-expanded', String(open));
    }

    skinBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        setSkinMenu(skinMenu.hidden);
    });
    document.addEventListener('click', (e) => {
        if (skinMenu && !skinMenu.hidden && !e.target.closest('.tray-wrap')) setSkinMenu(false);
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && skinMenu && !skinMenu.hidden) {
            setSkinMenu(false);
            skinBtn.focus();
        }
    });
}
