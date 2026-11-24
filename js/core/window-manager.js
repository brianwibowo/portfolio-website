// Window manager: stacking, open/minimize/maximize/close, drag, resize/pinch, and accessible tabs.
export function initTabs(tablistSelector, onSwitch) {
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

export function initWindows(apps) {
    const LAYER_BASE = 50;
    const stack = [];
    const layerOf = (win) => win.closest('.section.popup') || win;
    const taskbarH = () => document.querySelector('.taskbar')?.offsetHeight || 44;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

        win.querySelectorAll('[data-win="close"]').forEach((btn) => btn.addEventListener('click', close));
        win.querySelector('[data-win="minimize"]')?.addEventListener('click', minimize);

        return { win, taskLink, isOpen, open, minimize, close };
    }

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

    const MIN_W = 280;
    const MIN_H = 180;
    const RZ_DIRS = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];
    const desk = () => ({ w: window.innerWidth, h: window.innerHeight - taskbarH() });

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

    function detach(win) {
        const r = win.getBoundingClientRect();
        setRect(win, r.left, r.top, r.width, r.height);
        win.classList.add('resized');
        return { left: r.left, top: r.top, width: r.width, height: r.height };
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

    const windows = {};
    const welcomeWin = document.getElementById('welcome');
    if (welcomeWin) {
        windows['#welcome'] = makeWindow({ win: welcomeWin, task: document.getElementById('task-welcome') });
        welcomeWin.hidden = true;
    }

    apps.filter((app) => !app.isWelcome).forEach(({ id, focusFirst = false }) => {
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
        makeResizable(win);
    });

    const welcomeIcon = document.querySelector('.desk-icon[href="#welcome"]');
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

    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        const w = link && windows[link.getAttribute('href')];
        if (!w || e.defaultPrevented) return;
        e.preventDefault();
        if (link === w.taskLink && w.isOpen()) w.minimize();
        else if (w === windows['#welcome'] && w.taskLink?.parentElement.hidden) openWelcome();
        else w.open();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        const startMenu = document.getElementById('start-menu');
        const skinMenu = document.getElementById('skin-menu');
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

    // Welcome window drag with retro "Not Responding" smear trail when shaken rapidly.
    const hungBar = welcomeWin?.querySelector('.titlebar');
    const hungTitle = welcomeWin?.querySelector('.titlebar-text');
    const welcomeStatus = welcomeWin?.querySelector('.statusbar span');

    if (welcomeWin && hungBar && hungTitle) {
        const baseTitle = hungTitle.textContent;
        const baseStatus = welcomeStatus?.textContent || 'Ready';
        const MAX_TRAIL = 140;
        const SHAKES = 4;
        const SHAKE_WINDOW = 900;
        let drag = null;
        let statusTimer = 0;

        function stamp() {
            const r = welcomeWin.getBoundingClientRect();
            const ghost = welcomeWin.cloneNode(true);
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
            const z = Number(welcomeWin.style.zIndex) || LAYER_BASE;
            layer.style.zIndex = String(z);
            welcomeWin.style.zIndex = String(z + 1);
            drag.layer = layer;
            drag.z = z;
            drag.lastStamp = null;
            welcomeWin.classList.add('hung');
            hungTitle.textContent = `${baseTitle} (Not Responding)`;
            document.dispatchEvent(new CustomEvent('welcomepanic'));
        }

        hungBar.addEventListener('pointerdown', (e) => {
            if (e.button !== 0 || e.target.closest('button') || welcomeWin.classList.contains('maximized')) return;
            e.preventDefault();
            hungBar.setPointerCapture(e.pointerId);
            drag = {
                startX: e.clientX,
                startY: e.clientY,
                baseX: Number(welcomeWin.dataset.x || 0),
                baseY: Number(welcomeWin.dataset.y || 0),
                rect: welcomeWin.getBoundingClientRect(),
                prevX: e.clientX,
                dir: 0,
                turns: [],
                layer: null,
            };
            welcomeWin.style.transition = 'none';
        });

        hungBar.addEventListener('pointermove', (e) => {
            if (!drag) return;
            const r = drag.rect;
            const dx = Math.min(Math.max(e.clientX - drag.startX, 80 - r.right), window.innerWidth - 80 - r.left);
            const dy = Math.min(Math.max(e.clientY - drag.startY, -r.top), window.innerHeight - taskbarH() - 32 - r.top);
            const x = drag.baseX + dx;
            const y = drag.baseY + dy;
            welcomeWin.dataset.x = x;
            welcomeWin.dataset.y = y;
            welcomeWin.style.transform = `translate(${x}px, ${y}px)`;

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
                welcomeWin.style.zIndex = String(drag.z);
                hungTitle.textContent = baseTitle;
                welcomeWin.classList.remove('hung');
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

    return { windows, openWelcome };
}
