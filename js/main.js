// Desktop behaviour: skin switcher, taskbar, window manager, tabs, and live filters.
document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
    const root = document.documentElement;

    const SKINS = [
        { id: 'noir',   name: 'Night LCD',    family: 'dark',  swatch: ['#0d0f12', '#1d2025', '#a6ff4d'] },
        { id: 'olive',  name: 'Olive Drab',   family: 'dark',  swatch: ['#2c3326', '#424d3b', '#e0d16c'] },
        { id: 'luna',   name: 'Luna Blue',    family: 'light', swatch: ['#3a6fd8', '#ece9d8', '#2e822e'] },
        { id: 'silver', name: 'Silver Metal', family: 'light', swatch: ['#7d879c', '#eceef3', '#3558ab'] },
        { id: 'aero',   name: 'Aero Glass',   family: 'light', swatch: ['#2488cc', '#f2fbff', '#6fc22e'] },
        { id: 'cyber',  name: 'Y2K Cyber',    family: 'dark',  swatch: ['#1b1236', '#3a2a72', '#ff7ad9'] },
    ];

    const skinBtn = document.getElementById('skin-btn');
    const skinMenu = document.getElementById('skin-menu');
    const skinList = document.getElementById('skin-list');

    function applySkin(id) {
        const skin = SKINS.find((s) => s.id === id) || SKINS[0];
        root.dataset.skin = skin.id;
        root.dataset.theme = skin.family;
        try {
            localStorage.setItem('skin', skin.id);
        } catch (e) { /* localStorage unavailable */ }
        skinList?.querySelectorAll('.skin-option').forEach((btn) => {
            btn.setAttribute('aria-pressed', String(btn.dataset.skinId === skin.id));
        });
        updateFavicon(skin);
    }

    // Recolour the SVG wolf tab icon to match the active skin's desktop and accent.
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

    // Greeting, copyright year, and taskbar clock.
    const greeting = document.getElementById('greeting');
    if (greeting) {
        const hour = new Date().getHours();
        greeting.textContent = hour < 12 ? 'Good morning.' : hour < 18 ? 'Good afternoon.' : 'Good evening.';
    }

    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();

    const clock = document.getElementById('clock');
    function tick() {
        const now = new Date();
        clock.textContent = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
        clock.dateTime = now.toISOString();
    }
    if (clock) {
        tick();
        setInterval(tick, 15000);
    }

    // Start menu toggle and keyboard dismissal.
    const startBtn = document.getElementById('start-btn');
    const startMenu = document.getElementById('start-menu');

    function setStart(open) {
        startMenu.hidden = !open;
        startBtn.setAttribute('aria-expanded', String(open));
    }

    startBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        setStart(startMenu.hidden);
    });
    startMenu?.addEventListener('click', (e) => {
        if (e.target.closest('a')) setStart(false);
    });
    document.addEventListener('click', (e) => {
        if (startMenu && !startMenu.hidden && !e.target.closest('.start-wrap')) setStart(false);
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && startMenu && !startMenu.hidden) {
            setStart(false);
            startBtn.focus();
        }
    });

    // Front-to-back window stacking, capped below the taskbar z-index (100).
    const LAYER_BASE = 50;
    const stack = [];
    const layerOf = (win) => win.closest('.section.popup') || win;

    function raise(win) {
        const el = layerOf(win);
        const i = stack.indexOf(el);
        if (i === stack.length - 1 && i !== -1) return;
        if (i !== -1) stack.splice(i, 1);
        stack.push(el);
        stack.forEach((layer, k) => { layer.style.zIndex = String(LAYER_BASE + k); });
        document.dispatchEvent(new CustomEvent('layers'));
    }
    window.desktopLayers = { layerOf, raise };

    function makeWindow({ win, hideEl = win, task, focusFirst = false }) {
        const taskLink = task?.querySelector('a');
        const isOpen = () => !hideEl.hidden;

        function open() {
            const wasOpen = isOpen();
            hideEl.hidden = false;
            if (task) task.hidden = false;
            taskLink?.classList.add('active');
            if (!wasOpen) {
                win.classList.remove('opening');
                void win.offsetWidth;
                win.classList.add('opening');
            }
            raise(win);
            if (focusFirst) {
                win.querySelector('input:not([type="hidden"]):not([tabindex="-1"])')?.focus({ preventScroll: true });
            }
            win.dispatchEvent(new CustomEvent('winopen'));
        }

        function minimize() {
            hideEl.hidden = true;
            taskLink?.classList.remove('active');
        }

        function close() {
            minimize();
            if (task) task.hidden = true;
            win.style.transform = '';
            win.dataset.x = win.dataset.y = '0';
            setMaximized(false);
            win.dispatchEvent(new CustomEvent('winclose'));
        }

        const maxBtn = win.querySelector('[data-win="maximize"]');
        function setMaximized(on) {
            win.classList.toggle('maximized', on);
            maxBtn?.setAttribute('aria-label', on ? 'Restore' : 'Maximize');
        }
        maxBtn?.addEventListener('click', () => setMaximized(!win.classList.contains('maximized')));
        win.querySelector('.titlebar')?.addEventListener('dblclick', (e) => {
            if (!e.target.closest('button') && maxBtn && getComputedStyle(maxBtn).display !== 'none') {
                setMaximized(!win.classList.contains('maximized'));
            }
        });

        win.querySelector('[data-win="close"]')?.addEventListener('click', close);
        win.querySelector('[data-win="minimize"]')?.addEventListener('click', minimize);

        return { win, taskLink, isOpen, open, minimize, close };
    }

    const windows = {};

    const welcomeWin = document.getElementById('welcome');
    if (welcomeWin) {
        windows['#welcome'] = makeWindow({ win: welcomeWin, task: document.getElementById('task-welcome') });
        welcomeWin.hidden = true;
    }

    const popups = [
        { id: 'experience' },
        { id: 'projects' },
        { id: 'education' },
        { id: 'readme' },
        { id: 'contact', focusFirst: true },
    ];

    const taskbarH = () => document.querySelector('.taskbar')?.offsetHeight || 44;

    popups.forEach(({ id, focusFirst = false }) => {
        const section = document.getElementById(id);
        const win = section?.querySelector('.window');
        if (!section || !win) return;
        section.classList.add('popup');
        section.hidden = true;
        windows[`#${id}`] = makeWindow({ win, hideEl: section, task: document.getElementById(`task-${id}`), focusFirst });
        makeDraggable(win);
    });

    Object.values(windows).forEach(({ win }) => {
        win.addEventListener('pointerdown', () => raise(win), true);
    });

    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        const w = link && windows[link.getAttribute('href')];
        if (!w || e.defaultPrevented) return;
        e.preventDefault();
        if (link === w.taskLink && w.isOpen()) w.minimize();
        else if (w === windows['#welcome'] && w.taskLink?.parentElement.hidden) openWelcome();
        else w.open();
    });

    // Escape closes the top-most open pop-up window when no menu is open.
    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        if ((startMenu && !startMenu.hidden) || (skinMenu && !skinMenu.hidden)) return;
        for (let i = stack.length - 1; i >= 0; i--) {
            const layer = stack[i];
            if (!layer.classList.contains('popup') || layer.hidden) continue;
            const w = windows[`#${layer.id}`];
            if (w?.isOpen()) {
                w.close();
                break;
            }
        }
    });

    if (windows[location.hash]) history.replaceState(null, '', location.pathname + location.search);

    function makeDraggable(win) {
        const bar = win.querySelector('.titlebar');
        let move = null;
        bar?.addEventListener('pointerdown', (e) => {
            if (e.button !== 0 || e.pointerType === 'touch' || e.target.closest('button') || win.classList.contains('maximized')) return;
            e.preventDefault();
            bar.setPointerCapture(e.pointerId);
            move = {
                startX: e.clientX,
                startY: e.clientY,
                baseX: Number(win.dataset.x || 0),
                baseY: Number(win.dataset.y || 0),
                rect: win.getBoundingClientRect(),
            };
        });
        bar?.addEventListener('pointermove', (e) => {
            if (!move) return;
            const r = move.rect;
            const dx = Math.min(Math.max(e.clientX - move.startX, 80 - r.right), window.innerWidth - 80 - r.left);
            const dy = Math.min(Math.max(e.clientY - move.startY, -r.top), window.innerHeight - taskbarH() - 32 - r.top);
            win.dataset.x = move.baseX + dx;
            win.dataset.y = move.baseY + dy;
            win.style.transform = `translate(${move.baseX + dx}px, ${move.baseY + dy}px)`;
        });
        const stopMove = () => { move = null; };
        bar?.addEventListener('pointerup', stopMove);
        bar?.addEventListener('pointercancel', stopMove);
    }

    // Edge/corner resize with pointer and two-finger pinch on touch devices.
    const MIN_W = 280;
    const MIN_H = 180;
    const RZ_DIRS = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];
    const desk = () => ({ w: window.innerWidth, h: window.innerHeight - taskbarH() });

    function detach(win) {
        const r = win.getBoundingClientRect();
        setRect(win, r.left, r.top, r.width, r.height);
        win.classList.add('resized');
        return { left: r.left, top: r.top, width: r.width, height: r.height };
    }

    function setRect(win, left, top, width, height) {
        const d = desk();
        width = Math.min(Math.max(width, Math.min(MIN_W, d.w)), d.w);
        height = Math.min(Math.max(height, Math.min(MIN_H, d.h)), d.h);
        left = Math.min(Math.max(left, 0), d.w - width);
        top = Math.min(Math.max(top, 0), d.h - height);
        win.style.transform = '';
        win.dataset.x = win.dataset.y = '0';
        win.style.setProperty('--win-l', `${left}px`);
        win.style.setProperty('--win-t', `${top}px`);
        win.style.setProperty('--win-w', `${width}px`);
        win.style.setProperty('--win-h', `${height}px`);
    }

    function unsize(win) {
        win.classList.remove('resized');
        ['--win-l', '--win-t', '--win-w', '--win-h'].forEach((p) => win.style.removeProperty(p));
    }

    function makeResizable(win) {
        RZ_DIRS.forEach((dir) => {
            const h = document.createElement('div');
            h.className = `rz rz-${dir}`;
            h.dataset.dir = dir;
            h.setAttribute('aria-hidden', 'true');
            win.append(h);
        });

        let rs = null;
        win.addEventListener('pointerdown', (e) => {
            const h = e.target.closest('.rz');
            if (!h || h.parentElement !== win || e.button !== 0 || win.classList.contains('maximized')) return;
            e.preventDefault();
            e.stopPropagation();
            h.setPointerCapture(e.pointerId);
            rs = { dir: h.dataset.dir, x: e.clientX, y: e.clientY, r: detach(win) };
            win.classList.add('resizing');
        });
        win.addEventListener('pointermove', (e) => {
            if (!rs) return;
            const { dir, r } = rs;
            const d = desk();
            const dx = Math.min(Math.max(e.clientX, 0), d.w) - rs.x;
            const dy = Math.min(Math.max(e.clientY, 0), d.h) - rs.y;
            let { left, top, width, height } = r;
            if (dir.includes('e')) width = r.width + dx;
            if (dir.includes('s')) height = r.height + dy;
            if (dir.includes('w')) {
                width = Math.max(r.width - dx, Math.min(MIN_W, d.w));
                left = r.left + r.width - width;
            }
            if (dir.includes('n')) {
                height = Math.max(r.height - dy, Math.min(MIN_H, d.h));
                top = r.top + r.height - height;
            }
            setRect(win, left, top, width, height);
        });
        const stop = () => {
            if (!rs) return;
            rs = null;
            win.classList.remove('resizing');
        };
        win.addEventListener('pointerup', stop);
        win.addEventListener('pointercancel', stop);
        win.addEventListener('lostpointercapture', stop);

        let pinch = null;
        const span = (t) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
        const mid = (t) => ({ x: (t[0].clientX + t[1].clientX) / 2, y: (t[0].clientY + t[1].clientY) / 2 });
        win.addEventListener('touchstart', (e) => {
            if (e.targetTouches.length !== 2 || win.classList.contains('maximized')) return;
            e.preventDefault();
            raise(win);
            pinch = { d0: span(e.targetTouches) || 1, m0: mid(e.targetTouches), r: detach(win) };
            win.classList.add('resizing');
        }, { passive: false });
        win.addEventListener('touchmove', (e) => {
            if (!pinch || e.targetTouches.length !== 2) return;
            e.preventDefault();
            const { r, m0 } = pinch;
            const k = span(e.targetTouches) / pinch.d0;
            const m = mid(e.targetTouches);
            const d = desk();
            const width = Math.min(Math.max(r.width * k, Math.min(MIN_W, d.w)), d.w);
            const height = Math.min(Math.max(r.height * k, Math.min(MIN_H, d.h)), d.h);
            const left = m.x - (m0.x - r.left) * (width / r.width);
            const top = m.y - (m0.y - r.top) * (height / r.height);
            setRect(win, left, top, width, height);
        }, { passive: false });
        const endPinch = (e) => {
            if (!pinch || e.targetTouches.length >= 2) return;
            pinch = null;
            win.classList.remove('resizing');
        };
        win.addEventListener('touchend', endPinch);
        win.addEventListener('touchcancel', endPinch);
        win.addEventListener('gesturestart', (e) => e.preventDefault());
        win.addEventListener('winclose', () => unsize(win));
    }

    Object.values(windows).forEach(({ win }) => makeResizable(win));

    window.addEventListener('resize', () => {
        document.querySelectorAll('.window.resized').forEach((win) => {
            const s = win.style;
            setRect(win,
                parseFloat(s.getPropertyValue('--win-l')) + Number(win.dataset.x || 0),
                parseFloat(s.getPropertyValue('--win-t')) + Number(win.dataset.y || 0),
                parseFloat(s.getPropertyValue('--win-w')),
                parseFloat(s.getPropertyValue('--win-h')));
        });
    });

    // Accessible tablist helper for experience.exe and education.exe.
    function initTabs(tablistSelector, onSwitch) {
        const list = document.querySelector(tablistSelector);
        if (!list) return;
        const tabs = [...list.querySelectorAll('[role="tab"]')];

        function activate(tab, moveFocus = false) {
            tabs.forEach((t) => {
                const active = t === tab;
                t.setAttribute('aria-selected', String(active));
                t.tabIndex = active ? 0 : -1;
                const panel = document.getElementById(t.getAttribute('aria-controls'));
                if (panel) panel.hidden = !active;
            });
            if (moveFocus) tab.focus();
            onSwitch?.(tab);
        }

        tabs.forEach((tab, idx) => {
            tab.addEventListener('click', () => activate(tab));
            tab.addEventListener('keydown', (e) => {
                let next = -1;
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (idx + 1) % tabs.length;
                else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (idx - 1 + tabs.length) % tabs.length;
                else if (e.key === 'Home') next = 0;
                else if (e.key === 'End') next = tabs.length - 1;
                if (next !== -1) {
                    e.preventDefault();
                    activate(tabs[next], true);
                }
            });
        });
    }

    const expStatus = document.getElementById('exp-status');
    initTabs('#experience [role="tablist"]', (tab) => {
        if (expStatus && tab.dataset.expStatus) expStatus.textContent = tab.dataset.expStatus;
    });

    const eduStatus = document.getElementById('edu-status');
    initTabs('#education [role="tablist"]', (tab) => {
        if (!eduStatus) return;
        eduStatus.textContent = tab.id === 'tab-edu-leadership'
            ? 'Leadership Record | 3 campus & national roles'
            : 'Academic Record | GPA 3.88 / 4.00';
    });

    // Live filter and search for Projects window, including empty state.
    const projChips = [...document.querySelectorAll('[data-proj-filter]')];
    const projSearch = document.getElementById('proj-search');
    const projCards = [...document.querySelectorAll('#project-key-grid .project-card')];
    const projRows = [...document.querySelectorAll('#shipped-archive tbody tr')];
    const projGrid = document.getElementById('project-key-grid');
    const projArchive = document.getElementById('shipped-archive');
    const projEmpty = document.getElementById('proj-empty');
    const projEmptyMsg = document.getElementById('proj-empty-msg');
    const projReset = document.getElementById('proj-reset');
    const projStatus = document.getElementById('proj-status');
    let activeStack = 'all';

    function filterProjects() {
        const q = (projSearch?.value || '').trim().toLowerCase();
        const total = projCards.length + projRows.length;
        let visibleCards = 0;
        let visibleRows = 0;

        const matches = (el) => {
            const stacks = (el.dataset.stack || '').split(/\s+/);
            const hay = `${el.dataset.search || ''} ${el.textContent}`.toLowerCase();
            const stackOk = activeStack === 'all' || stacks.includes(activeStack);
            const queryOk = !q || hay.includes(q);
            return stackOk && queryOk;
        };

        projCards.forEach((card) => {
            const ok = matches(card);
            card.hidden = !ok;
            if (ok) visibleCards++;
        });
        projRows.forEach((row) => {
            const ok = matches(row);
            row.hidden = !ok;
            if (ok) visibleRows++;
        });

        const shown = visibleCards + visibleRows;
        if (projGrid) projGrid.hidden = visibleCards === 0;
        if (projArchive) projArchive.hidden = visibleRows === 0;
        if (projEmpty) {
            projEmpty.hidden = shown > 0;
            if (shown === 0 && projEmptyMsg) {
                projEmptyMsg.textContent = q
                    ? `No shipped systems match "${projSearch.value.trim()}". Reset the filter to browse all ${total} systems.`
                    : 'No systems match the selected category.';
            }
        }
        if (projStatus) {
            projStatus.textContent = `Showing ${shown} of ${total} featured & studio systems (60+ total delivered)`;
        }
    }

    projChips.forEach((chip) => {
        chip.addEventListener('click', () => {
            activeStack = chip.dataset.projFilter || 'all';
            projChips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
            filterProjects();
        });
    });
    projSearch?.addEventListener('input', filterProjects);
    projReset?.addEventListener('click', () => {
        activeStack = 'all';
        if (projSearch) projSearch.value = '';
        projChips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.projFilter === 'all')));
        filterProjects();
        projSearch?.focus();
    });

    // Live search and empty state for skills.txt window.
    const skillSearch = document.getElementById('skill-search');
    const skillClear = document.getElementById('skill-clear');
    const skillReset = document.getElementById('skill-reset');
    const skillGroups = [...document.querySelectorAll('.skill-group')];
    const skillEmpty = document.getElementById('skill-empty');
    const skillEmptyMsg = document.getElementById('skill-empty-msg');
    const skillStatus = document.getElementById('skill-status');

    function filterSkills() {
        const raw = (skillSearch?.value || '').trim();
        const q = raw.toLowerCase();
        if (skillClear) skillClear.hidden = !raw;
        let shown = 0;

        skillGroups.forEach((grp) => {
            const hay = `${grp.dataset.skillText || ''} ${grp.textContent}`.toLowerCase();
            const ok = !q || hay.includes(q);
            grp.hidden = !ok;
            if (ok) shown++;
        });

        if (skillEmpty) {
            skillEmpty.hidden = shown > 0;
            if (shown === 0 && skillEmptyMsg) {
                skillEmptyMsg.textContent = `No skill category matches "${raw}". Clear the search to view all ${skillGroups.length} categories.`;
            }
        }
        if (skillStatus) {
            skillStatus.textContent = q
                ? `Showing ${shown} of ${skillGroups.length} skill categories`
                : `${skillGroups.length} skill categories loaded`;
        }
    }

    const resetSkills = () => {
        if (skillSearch) skillSearch.value = '';
        filterSkills();
        skillSearch?.focus();
    };
    skillSearch?.addEventListener('input', filterSkills);
    skillClear?.addEventListener('click', resetSkills);
    skillReset?.addEventListener('click', resetSkills);

    // Launch Welcome window with zoom animation from its desktop shortcut.
    const welcomeIcon = document.querySelector('.desk-icon[href="#welcome"]');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function openWelcome() {
        const w = windows['#welcome'];
        if (!w) return;
        w.open();
        if (reduceMotion || !welcomeIcon) return;
        const from = welcomeIcon.getBoundingClientRect();
        const to = welcomeWin.getBoundingClientRect();
        welcomeWin.style.setProperty('--zoom-x', `${from.left + from.width / 2 - (to.left + to.width / 2)}px`);
        welcomeWin.style.setProperty('--zoom-y', `${from.top + from.height / 2 - (to.top + to.height / 2)}px`);
        welcomeWin.classList.remove('opening', 'zooming');
        void welcomeWin.offsetWidth;
        welcomeWin.classList.add('zooming');
    }
    welcomeWin?.addEventListener('animationend', (e) => {
        if (e.animationName === 'win-zoom') welcomeWin.classList.remove('zooming');
    });
    welcomeWin?.classList.remove('pending');

    // Log-on screen with ASCII wolf and decrypting display name; stops once logged on.
    const logon = document.getElementById('logon');
    const logonUser = document.getElementById('logon-user');
    const wolfEl = document.getElementById('logon-wolf');
    let wolfTimer = 0;

    if (wolfEl) {
        const COLS = 60;
        const ROWS = 50;
        const RAMP = ' .\'`,:;-~=+*o#%@';
        const HEAD = [
            [-0.62, -0.96], [-0.27, -0.46], [0.27, -0.46], [0.62, -0.96],
            [0.74, -0.30], [0.93, 0.02], [0.64, 0.30], [0.26, 0.64],
            [0.12, 0.98], [-0.12, 0.98], [-0.26, 0.64], [-0.64, 0.30],
            [-0.93, 0.02], [-0.74, -0.30],
        ];
        const EAR_L = [[-0.60, -0.84], [-0.36, -0.50], [-0.64, -0.40]];
        const EAR_R = [[0.60, -0.84], [0.36, -0.50], [0.64, -0.40]];

        function inside(poly, x, y) {
            let hit = false;
            for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
                const [xi, yi] = poly[i];
                const [xj, yj] = poly[j];
                if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
            }
            return hit;
        }

        function edgeDist(poly, x, y) {
            let best = Infinity;
            for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
                const [ax, ay] = poly[j];
                const [bx, by] = poly[i];
                const dx = bx - ax;
                const dy = by - ay;
                const t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy)));
                best = Math.min(best, Math.hypot(x - ax - t * dx, y - ay - t * dy));
            }
            return best;
        }

        const ellipse = (x, y, cx, cy, rx, ry) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2;

        let frame = 0;
        function drawWolf() {
            frame++;
            const t = frame * 0.12;
            const blink = frame % 22 === 0 || frame % 22 === 1;
            const twitch = frame % 37 < 2;
            const head = HEAD.map((p) => p.slice());
            const earL = EAR_L.map((p) => p.slice());
            if (twitch) { head[0][0] -= 0.08; head[0][1] += 0.06; earL[0][0] -= 0.07; earL[0][1] += 0.05; }

            let out = '';
            for (let r = 0; r < ROWS; r++) {
                const y = ((r / (ROWS - 1)) * 2 - 1 - 0.03) / 0.86;
                for (let c = 0; c < COLS; c++) {
                    const x = ((c / (COLS - 1)) * 2 - 1) / 0.86;
                    const ang = Math.atan2(y - 0.1, x);
                    const fringe = 0.035 * Math.sin(ang * 26 + t) + 0.02 * Math.sin(ang * 61 - t * 1.3);
                    const isIn = inside(head, x, y);
                    const d = edgeDist(head, x, y);
                    if (!(isIn ? true : d < fringe)) { out += ' '; continue; }

                    let v = 0.52 - 0.16 * x - 0.10 * y;
                    v += 0.10 * Math.sin(ang * 14 + Math.hypot(x, y) * 9 - t);
                    if (isIn && d < 0.05) v -= 0.18;
                    v += 0.22 * Math.exp(-((x / 0.11) ** 2)) * (y > -0.5 && y < 0.55 ? 1 : 0);
                    if (ellipse(x, y, 0, 0.62, 0.24, 0.34) < 1) v += 0.18;
                    if (inside(earL, x, y) || inside(EAR_R, x, y)) v = 0.12 + 0.05 * Math.sin(y * 20 + t);
                    for (const s of [-1, 1]) {
                        const ex = s * 0.31;
                        const ey = -0.12;
                        const tilt = (y - ey) + s * (x - ex) * 0.35;
                        const mask = ellipse(x, ey + tilt, ex, ey, 0.17, 0.085);
                        if (mask < 1) v = Math.min(v, 0.16);
                        const eye = ellipse(x, ey + tilt, ex, ey, 0.09, blink ? 0.01 : 0.032);
                        if (eye < 1) v = blink ? 0.45 : 1;
                    }
                    if (ellipse(x, y, 0, 0.84, 0.09, 0.05) < 1) v = 0.05;
                    if (Math.abs(x) < 0.018 && y > 0.89 && y < 0.97) v = 0.1;

                    const i = Math.max(1, Math.min(RAMP.length - 1, Math.round(v * (RAMP.length - 1))));
                    out += RAMP[i];
                }
                out += '\n';
            }
            wolfEl.textContent = out;
        }

        drawWolf();
        if (!reduceMotion) wolfTimer = setInterval(drawWolf, 140);

        const fitWolf = () => {
            const box = wolfEl.parentElement;
            const w = wolfEl.offsetWidth;
            const h = wolfEl.offsetHeight;
            if (!w || !h) return;
            wolfEl.style.setProperty('--wolf-k', String(Math.min(box.clientWidth / w, box.clientHeight / h)));
        };
        fitWolf();
        window.addEventListener('resize', fitWolf);
        document.fonts?.ready.then(fitWolf);
    }

    const nameEl = document.getElementById('logon-name');
    if (nameEl && !reduceMotion) {
        const real = nameEl.textContent;
        const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&@$/<>';
        const start = performance.now();
        const decrypt = () => {
            const settled = Math.floor((performance.now() - start - 250) / 38);
            nameEl.textContent = [...real].map((ch, i) => (ch === ' ' || i < settled ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join('');
            if (settled < real.length) setTimeout(decrypt, 40);
        };
        decrypt();
    }

    if (logon && logonUser) {
        logonUser.focus({ preventScroll: true });
        logonUser.addEventListener('click', () => {
            if (logon.classList.contains('granted')) return;
            logon.classList.add('granted');
            const btnText = document.getElementById('logon-btn-text');
            if (btnText) btnText.textContent = 'Access granted';
            document.getElementById('logon-status').textContent = 'Access granted. Welcome';
            setTimeout(() => {
                logon.classList.add('leaving');
                setTimeout(() => {
                    clearInterval(wolfTimer);
                    logon.hidden = true;
                    document.dispatchEvent(new CustomEvent('logon'));
                    openWelcome();
                }, reduceMotion ? 0 : 420);
            }, reduceMotion ? 0 : 280);
        });
    } else {
        openWelcome();
    }

    // Background ASCII plasma in Welcome window; runs only while Welcome is visible.
    const aura = document.getElementById('ascii-aura');
    if (aura && welcomeWin) {
        const RAMP = ' .,:;-~=+*o#%@';
        const SPARKS = '+*.\'';
        const FPS = 18;
        let cols = 0;
        let rows = 0;
        let charW = 7;
        let rafId = 0;
        let last = 0;
        const t0 = performance.now();

        function measure() {
            const probe = document.createElement('span');
            probe.textContent = 'M'.repeat(50);
            aura.append(probe);
            charW = probe.offsetWidth / 50 || 7;
            probe.remove();
            cols = Math.ceil(aura.offsetWidth / charW);
            rows = Math.ceil(aura.offsetHeight / 12);
        }

        function frame(t) {
            const s = t / 1000;
            const cx = cols * (0.5 + 0.28 * Math.sin(s * 0.37));
            const cy = rows * (0.5 + 0.3 * Math.sin(s * 0.74));
            let out = '';
            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    const dx = (x - cx) * 0.5;
                    const dy = y - cy;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    let v = Math.sin(x * 0.11 + s * 1.1)
                        + Math.sin(y * 0.23 - s * 1.4)
                        + Math.sin((x * 0.5 + y) * 0.09 + s * 0.6)
                        + Math.sin(d * 0.45 - s * 2.6);
                    v = (v + 4) / 8;
                    v = v * 0.75 + Math.max(0, 1 - d / 14) * 0.6;
                    if (Math.random() < 0.0025) {
                        out += SPARKS[(Math.random() * SPARKS.length) | 0];
                    } else {
                        out += RAMP[Math.min(RAMP.length - 1, Math.max(0, (v * RAMP.length) | 0))];
                    }
                }
                out += '\n';
            }
            aura.textContent = out;
        }

        function loop(t) {
            rafId = requestAnimationFrame(loop);
            if (t - last < 1000 / FPS) return;
            last = t;
            frame(t - t0);
        }

        function update() {
            const visible = !welcomeWin.hidden && !document.hidden;
            if (visible && !rafId) {
                measure();
                if (reduceMotion) frame(4000);
                else rafId = requestAnimationFrame(loop);
            } else if (!visible && rafId) {
                cancelAnimationFrame(rafId);
                rafId = 0;
            }
        }

        new MutationObserver(update).observe(welcomeWin, { attributes: true, attributeFilter: ['hidden'] });
        document.addEventListener('visibilitychange', update);
        new ResizeObserver(() => {
            if (welcomeWin.hidden) return;
            measure();
            frame(reduceMotion ? 4000 : performance.now() - t0);
        }).observe(welcomeWin);
        update();
    }

    // Draggable desktop icons on mouse/pen; touch leaves native scrolling intact.
    let iconLayer = 3;
    document.querySelectorAll('.desk-icon').forEach((icon) => {
        let drag = null;
        icon.addEventListener('dragstart', (e) => e.preventDefault());

        icon.addEventListener('pointerdown', (e) => {
            if (e.button !== 0 || e.pointerType === 'touch') return;
            drag = {
                startX: e.clientX,
                startY: e.clientY,
                baseX: Number(icon.dataset.x || 0),
                baseY: Number(icon.dataset.y || 0),
                rect: icon.getBoundingClientRect(),
                moved: false,
            };
            icon.setPointerCapture(e.pointerId);
        });

        icon.addEventListener('pointermove', (e) => {
            if (!drag) return;
            let dx = e.clientX - drag.startX;
            let dy = e.clientY - drag.startY;
            if (!drag.moved) {
                if (Math.hypot(dx, dy) < 5) return;
                drag.moved = true;
                icon.classList.add('dragging');
                icon.style.zIndex = String(++iconLayer);
            }
            const r = drag.rect;
            dx = Math.min(Math.max(dx, -r.left), window.innerWidth - r.right);
            dy = Math.min(Math.max(dy, -r.top), window.innerHeight - taskbarH() - r.bottom);
            const x = drag.baseX + dx;
            const y = drag.baseY + dy;
            icon.dataset.x = x;
            icon.dataset.y = y;
            icon.style.transform = `translate(${x}px, ${y}px)`;
        });

        const endDrag = () => {
            if (!drag) return;
            if (drag.moved) icon.dataset.justDragged = '1';
            icon.classList.remove('dragging');
            drag = null;
        };
        icon.addEventListener('pointerup', endDrag);
        icon.addEventListener('pointercancel', endDrag);

        icon.addEventListener('click', (e) => {
            if (icon.dataset.justDragged) {
                e.preventDefault();
                delete icon.dataset.justDragged;
            }
        });
    });

    // Welcome window drag with retro "Not Responding" smear trail when shaken rapidly.
    const hungWindow = document.querySelector('.window-welcome');
    const hungBar = hungWindow?.querySelector('.titlebar');
    const hungTitle = hungWindow?.querySelector('.titlebar-text');
    const welcomeStatus = hungWindow?.querySelector('.statusbar span');

    if (hungWindow && hungBar && hungTitle) {
        const baseTitle = hungTitle.textContent;
        const baseStatus = welcomeStatus?.textContent || 'Ready';
        const MAX_TRAIL = 140;
        const SHAKES = 4;
        const SHAKE_WINDOW = 900;
        let drag = null;
        let statusTimer = 0;

        function stamp() {
            const r = hungWindow.getBoundingClientRect();
            const ghost = hungWindow.cloneNode(true);
            ghost.removeAttribute('id');
            ghost.removeAttribute('aria-labelledby');
            ghost.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'));
            ghost.classList.add('trail');
            Object.assign(ghost.style, {
                left: `${r.left}px`,
                top: `${r.top}px`,
                width: `${r.width}px`,
                height: `${r.height}px`,
            });
            drag.layer.append(ghost);
            if (drag.layer.childElementCount > MAX_TRAIL) drag.layer.firstElementChild.remove();
        }

        function panic() {
            const layer = document.createElement('div');
            layer.className = 'trail-layer';
            layer.setAttribute('aria-hidden', 'true');
            document.body.append(layer);
            const z = Number(hungWindow.style.zIndex) || LAYER_BASE;
            layer.style.zIndex = String(z);
            hungWindow.style.zIndex = String(z + 1);
            drag.layer = layer;
            drag.z = z;
            drag.lastStamp = null;
            hungWindow.classList.add('hung');
            hungTitle.textContent = `${baseTitle} (Not Responding)`;
            document.dispatchEvent(new CustomEvent('welcomepanic'));
        }

        hungBar.addEventListener('pointerdown', (e) => {
            if (e.button !== 0 || e.target.closest('button') || hungWindow.classList.contains('maximized')) return;
            e.preventDefault();
            hungBar.setPointerCapture(e.pointerId);
            drag = {
                startX: e.clientX,
                startY: e.clientY,
                baseX: Number(hungWindow.dataset.x || 0),
                baseY: Number(hungWindow.dataset.y || 0),
                rect: hungWindow.getBoundingClientRect(),
                prevX: e.clientX,
                dir: 0,
                turns: [],
                layer: null,
            };
            hungWindow.style.transition = 'none';
        });

        hungBar.addEventListener('pointermove', (e) => {
            if (!drag) return;
            const r = drag.rect;
            const dx = Math.min(Math.max(e.clientX - drag.startX, 80 - r.right), window.innerWidth - 80 - r.left);
            const dy = Math.min(Math.max(e.clientY - drag.startY, -r.top), window.innerHeight - taskbarH() - 32 - r.top);
            const x = drag.baseX + dx;
            const y = drag.baseY + dy;
            hungWindow.dataset.x = x;
            hungWindow.dataset.y = y;
            hungWindow.style.transform = `translate(${x}px, ${y}px)`;

            const step = e.clientX - drag.prevX;
            if (Math.abs(step) > 3) {
                const dir = Math.sign(step);
                if (drag.dir && dir !== drag.dir) {
                    const now = performance.now();
                    drag.turns = drag.turns.filter((t) => now - t < SHAKE_WINDOW);
                    drag.turns.push(now);
                    if (!drag.layer && drag.turns.length >= SHAKES) panic();
                }
                drag.dir = dir;
                drag.prevX = e.clientX;
            }

            if (drag.layer && (drag.lastStamp === null || Math.hypot(x - drag.lastStamp.x, y - drag.lastStamp.y) >= 6)) {
                stamp();
                drag.lastStamp = { x, y };
            }
        });

        const release = () => {
            if (!drag) return;
            if (drag.layer) {
                drag.layer.remove();
                hungWindow.style.zIndex = String(drag.z);
                hungTitle.textContent = baseTitle;
                hungWindow.classList.remove('hung');
                if (welcomeStatus) {
                    welcomeStatus.textContent = 'Recovered. Window responsive again.';
                    clearTimeout(statusTimer);
                    statusTimer = setTimeout(() => { welcomeStatus.textContent = baseStatus; }, 4000);
                }
            }
            drag = null;
        };
        hungBar.addEventListener('pointerup', release);
        hungBar.addEventListener('pointercancel', release);
        hungBar.addEventListener('lostpointercapture', release);
    }
});
