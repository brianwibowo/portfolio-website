// Desktop pet: "Bit", a maintenance droid with jet boots that wanders the taskbar and window titlebars.
export function initDroid() {
    const taskbarH = () => document.querySelector('.taskbar')?.offsetHeight || 44;
    const W = 46;
    const H = 52;
    const GRAVITY = 1500;
    const JET_FALL = 0.55;
    const MAX_FALL = 520;
    const SPEED = 55;
    const SLEEP_AFTER = 30000;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const el = document.createElement('div');
    el.className = 'droid';
    el.setAttribute('role', 'img');
    el.setAttribute('aria-label', 'Bit, a small desktop robot. Click it to say hi.');
    el.title = 'Bit';
    el.innerHTML = `
        <div class="droid-bubble" aria-live="polite"></div>
        <svg class="droid-svg" viewBox="0 0 40 46" aria-hidden="true">
            <g class="d-bob">
                <line class="d-antenna" x1="25" y1="2.5" x2="25" y2="10"/>
                <circle class="d-tip" cx="25" cy="2.5" r="1.8"/>
                <rect class="d-shell" x="7.5" y="9.5" width="25" height="14" rx="4.5"/>
                <rect class="d-visor" x="10.5" y="12.5" width="19" height="7" rx="3.5"/>
                <g class="d-eye-track"><circle class="d-eye" cx="20" cy="16" r="2.4"/></g>
                <rect class="d-neck" x="17" y="23.5" width="6" height="2.5"/>
                <rect class="d-shell" x="9" y="25.5" width="22" height="12" rx="3"/>
                <rect class="d-panel" x="12" y="28.5" width="9" height="2.2" rx="1"/>
                <rect class="d-panel d-panel-dim" x="12" y="32" width="6" height="2.2" rx="1"/>
                <circle class="d-light" cx="26" cy="30" r="1.3"/>
                <circle class="d-light d-light-2" cx="26" cy="34" r="1.3"/>
            </g>
            <g>
                <rect class="d-leg" x="12" y="37" width="3" height="2.5"/>
                <rect class="d-leg" x="25" y="37" width="3" height="2.5"/>
                <rect class="d-boot" x="9.5" y="39" width="8" height="4" rx="1.6"/>
                <rect class="d-boot" x="22.5" y="39" width="8" height="4" rx="1.6"/>
                <rect class="d-nozzle" x="11.5" y="43" width="4" height="1.4" rx="0.5"/>
                <rect class="d-nozzle" x="24.5" y="43" width="4" height="1.4" rx="0.5"/>
            </g>
            <g class="d-jet"><path class="d-flame" d="M11.6 44.4h3.8l-1.9 8.5z"/><path class="d-flame-core" d="M12.6 44.4h1.8l-0.9 4.6z"/></g>
            <g class="d-jet"><path class="d-flame" d="M24.6 44.4h3.8l-1.9 8.5z"/><path class="d-flame-core" d="M25.6 44.4h1.8l-0.9 4.6z"/></g>
        </svg>`;
    document.body.append(el);

    const svg = el.querySelector('.droid-svg');
    const eye = el.querySelector('.d-eye-track');
    const bob = el.querySelector('.d-bob');
    const bubble = el.querySelector('.droid-bubble');

    const ground = () => window.innerHeight - taskbarH() - H + 4;
    let x = -W;
    let y = ground();
    let vy = 0;
    let facing = 1;
    let thrust = 0;
    let lift = 0;
    let surface = null;
    let surfaceOffset = 0;
    let mode = 'enter';
    let targetX = 140;
    let targetOff = 0;
    let until = 0;
    let hop = null;
    let drag = null;
    let lastActivity = performance.now();
    let bubbleTimer = 0;

    const visibleWindows = () => [...document.querySelectorAll('.window')].filter((w) => {
        if (w.classList.contains('trail') || w.closest('[hidden]') || w.hidden) return false;
        const r = w.getBoundingClientRect();
        return r.width > 120 && r.top > H + 10 && r.top < window.innerHeight - taskbarH() - 60;
    });

    const GROUND_Z = 49;
    const CARRIED_Z = 1000;
    let z = GROUND_Z;

    const layerZ = (win) => {
        const layer = window.desktopLayers?.layerOf(win) || win;
        return Number(getComputedStyle(layer).zIndex) || GROUND_Z + 1;
    };

    const topWindowAt = (px, py) => {
        for (const node of document.elementsFromPoint(px, py)) {
            if (el.contains(node)) continue;
            const w = node.closest('.window');
            if (w && !w.classList.contains('trail')) return w;
            if (node.closest('.taskbar')) return null;
        }
        return null;
    };

    const say = (text, ms = 1600) => {
        bubble.textContent = text;
        bubble.classList.add('show');
        clearTimeout(bubbleTimer);
        bubbleTimer = setTimeout(() => bubble.classList.remove('show'), ms);
    };

    const lookAround = (ms) => {
        mode = 'look';
        until = performance.now() + ms;
    };

    function startHop(tx, ty, toWindow, rect) {
        hop = { fromX: x, fromY: y, toX: tx, toY: ty, t: 0, dur: 0.7, to: toWindow, rect };
        facing = tx >= x ? 1 : -1;
        mode = 'hop';
        window.systemSound?.beep(1200, 1);
    }

    function pickNext() {
        const r = Math.random();
        const wins = visibleWindows();
        if (r < 0.22 && wins.length && !reduceMotion && window.innerWidth > 520) {
            const w = wins[Math.floor(Math.random() * wins.length)];
            if (w !== surface) {
                const rect = w.getBoundingClientRect();
                for (let tries = 0; tries < 6; tries++) {
                    const tx = rect.left + 20 + Math.random() * Math.max(10, rect.width - W - 40);
                    if (topWindowAt(tx + W / 2, rect.top + 4) === w) {
                        startHop(tx, rect.top - H + 3, w, rect);
                        return;
                    }
                }
            }
        }
        if (r < 0.55) {
            lookAround(1200 + Math.random() * 2200);
            return;
        }
        mode = 'roll';
        if (surface) {
            const width = surface.getBoundingClientRect().width;
            targetOff = Math.random() < 0.3
                ? (Math.random() < 0.5 ? -W : width + 4)
                : 4 + Math.random() * Math.max(1, width - W - 8);
        } else {
            targetX = 8 + Math.random() * Math.max(1, window.innerWidth - W - 16);
        }
    }

    function dropOff() {
        surface = null;
        vy = 0;
        mode = 'fall';
        say(Math.random() < 0.5 ? 'whoosh!' : 'wheee!', 900);
    }

    function landingFor(prevBottom, newBottom, cx) {
        for (const w of visibleWindows()) {
            const r = w.getBoundingClientRect();
            if (cx > r.left + 6 && cx < r.right - 6 && prevBottom <= r.top + 3 && newBottom >= r.top + 3
                && topWindowAt(cx, r.top + 4) === w) {
                return { win: w, y: r.top - H + 3 };
            }
        }
        if (newBottom >= ground() + H) return { win: null, y: ground() };
        return null;
    }

    function land(target) {
        surface = target.win;
        y = target.y;
        vy = 0;
        if (surface) surfaceOffset = x - surface.getBoundingClientRect().left;
        lookAround(700);
    }

    let last = performance.now();
    function step(now) {
        requestAnimationFrame(step);
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        if (document.hidden) return;

        if (surface && mode !== 'hop' && mode !== 'carried') {
            const r = surface.getBoundingClientRect();
            if (surface.hidden || surface.closest('[hidden]') || r.width === 0) {
                dropOff();
            } else {
                x = r.left + surfaceOffset;
                y = r.top - H + 3;
                const centre = surfaceOffset + W / 2;
                if (centre < 2 || centre > r.width - 2) dropOff();
            }
        } else if (!surface && mode !== 'hop' && mode !== 'carried' && mode !== 'fall') {
            y = ground();
        }

        if (mode !== 'sleep' && mode !== 'carried' && mode !== 'fall' && mode !== 'hop' && now - lastActivity > SLEEP_AFTER) {
            mode = 'sleep';
            el.classList.add('asleep');
            say('z z z', 2500);
        }

        let moving = 0;
        switch (mode) {
            case 'enter':
            case 'roll': {
                if (reduceMotion) { mode = 'look'; until = Infinity; break; }
                const d = surface ? targetOff - surfaceOffset : targetX - x;
                facing = d >= 0 ? 1 : -1;
                const stepX = Math.sign(d) * Math.min(Math.abs(d), SPEED * dt);
                if (surface) {
                    surfaceOffset += stepX;
                    x = surface.getBoundingClientRect().left + surfaceOffset;
                } else {
                    x += stepX;
                }
                moving = stepX;
                if (Math.abs(d) < 1) {
                    if (mode === 'enter') { say('beep!'); window.systemSound?.beep(900, 2); }
                    lookAround(900 + Math.random() * 1500);
                }
                break;
            }
            case 'look':
                if (now > until) pickNext();
                break;
            case 'hop': {
                hop.t += dt / hop.dur;
                const t = Math.min(1, hop.t);
                if (hop.to) hop.toY = hop.to.getBoundingClientRect().top - H + 3;
                x = hop.fromX + (hop.toX - hop.fromX) * t;
                y = hop.fromY + (hop.toY - hop.fromY) * t - Math.sin(t * Math.PI) * 90;
                if (t >= 1) {
                    const target = hop.to && !hop.to.closest('[hidden]') ? { win: hop.to, y: hop.toY } : { win: null, y: ground() };
                    hop = null;
                    land(target);
                }
                break;
            }
            case 'fall': {
                const prevBottom = y + H;
                vy = Math.min(MAX_FALL, vy + GRAVITY * JET_FALL * dt);
                y += vy * dt;
                const hit = landingFor(prevBottom, y + H, x + W / 2);
                if (hit) land(hit);
                break;
            }
            default:
                break;
        }

        x = Math.max(-W, Math.min(window.innerWidth - W + 2, x));
        const want = { hop: 1, fall: 0.85, carried: 0.35, roll: 0.55, enter: 0.55 }[mode] ?? 0;
        thrust += ((moving || mode !== 'roll' ? want : 0) - thrust) * Math.min(1, dt * 10);
        const hoverTarget = moving ? 4 : 0;
        lift += (hoverTarget - lift) * Math.min(1, dt * 8);
        el.style.setProperty('--thrust', thrust.toFixed(3));
        bob.style.transform = moving ? `translateY(${Math.sin(now / 120) * 0.7}px)` : '';

        el.style.transform = `translate(${x}px, ${y - lift}px)`;
        svg.style.transform = `scaleX(${facing})`;

        if (mode === 'carried') z = CARRIED_Z;
        else if (mode === 'hop') z = hop?.to ? layerZ(hop.to) : GROUND_Z;
        else if (mode !== 'fall') z = surface ? layerZ(surface) : GROUND_Z;
        else if (z === CARRIED_Z) z = GROUND_Z;
        el.style.zIndex = String(z);
    }

    setInterval(() => {
        if (mode === 'sleep') return;
        eye.style.transform = `translateX(${(Math.random() * 2 - 1) * 4.5}px)`;
    }, 1800);

    el.addEventListener('pointerdown', (e) => {
        if (e.button !== 0) return;
        e.preventDefault();
        try { el.setPointerCapture(e.pointerId); } catch (err) { /* pointer gone */ }
        drag = { sx: e.clientX, sy: e.clientY, ox: e.clientX - x, oy: e.clientY - y, moved: false };
    });

    el.addEventListener('pointermove', (e) => {
        if (!drag) return;
        if (!drag.moved && Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) < 5) return;
        if (!drag.moved) {
            drag.moved = true;
            mode = 'carried';
            surface = null;
            el.classList.add('carried');
            el.classList.remove('asleep');
            say('whoa!', 900);
            window.systemSound?.beep(1500, 2);
        }
        x = e.clientX - drag.ox;
        y = Math.max(0, Math.min(ground(), e.clientY - drag.oy));
        el.style.transform = `translate(${x}px, ${y}px)`;
    });

    const release = () => {
        if (!drag) return;
        const wasDrag = drag.moved;
        drag = null;
        el.classList.remove('carried');
        if (wasDrag) {
            vy = 0;
            mode = 'fall';
            return;
        }
        el.classList.remove('asleep');
        el.classList.add('happy');
        setTimeout(() => el.classList.remove('happy'), 900);
        const lines = ['beep-boop!', 'bweee?', '*whirr*', 'bip bip!', 'hello, human', '01101000 01101001'];
        say(lines[Math.floor(Math.random() * lines.length)]);
        window.systemSound?.beep(700 + Math.random() * 700, 3 + Math.floor(Math.random() * 3));
        if (!reduceMotion && mode !== 'fall' && mode !== 'hop') {
            startHop(x, y, surface, null);
            hop.toY = y;
            hop.dur = 0.45;
        } else if (mode === 'sleep') {
            lookAround(800);
        }
    };
    el.addEventListener('pointerup', release);
    el.addEventListener('pointercancel', release);

    const activity = () => {
        lastActivity = performance.now();
        if (mode === 'sleep') {
            el.classList.remove('asleep');
            say('!', 800);
            lookAround(600);
        }
    };
    ['mousemove', 'keydown', 'pointerdown', 'wheel', 'touchstart'].forEach((t) => document.addEventListener(t, activity, { passive: true }));

    document.addEventListener('welcomepanic', () => {
        el.classList.remove('asleep');
        if (mode === 'sleep') lookAround(800);
        say('uh oh...', 1800);
        window.systemSound?.beep(420, 4);
    });

    document.addEventListener('lover404', () => {
        el.classList.remove('asleep');
        if (mode === 'sleep') lookAround(800);
        say('404? same here.', 2000);
    });

    window.addEventListener('resize', () => {
        if (!surface && mode !== 'carried') y = ground();
    });

    if (reduceMotion) {
        x = 120;
        mode = 'look';
        until = Infinity;
    } else {
        until = Infinity;
        mode = 'look';
        x = -W;
        const rollIn = () => setTimeout(() => { targetX = 110 + Math.random() * 80; mode = 'enter'; }, 1500);
        const logon = document.getElementById('logon');
        if (logon && !logon.hidden) document.addEventListener('logon', rollIn, { once: true });
        else rollIn();
    }
    requestAnimationFrame(step);
}
