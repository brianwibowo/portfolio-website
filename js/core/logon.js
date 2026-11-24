// Log-on screen with animated ASCII wolf and decrypting display name.
export function initLogon(onEnterDesktop) {
    const logon = document.getElementById('logon');
    const logonUser = document.getElementById('logon-user');
    const wolfEl = document.getElementById('logon-wolf');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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

        const inside = (poly, x, y) => {
            let hit = false;
            for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
                const [xi, yi] = poly[i];
                const [xj, yj] = poly[j];
                if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
            }
            return hit;
        };

        const edgeDist = (poly, x, y) => {
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
        };

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
            const status = document.getElementById('logon-status');
            if (status) status.textContent = 'Access granted. Welcome';
            setTimeout(() => {
                logon.classList.add('leaving');
                setTimeout(() => {
                    clearInterval(wolfTimer);
                    logon.hidden = true;
                    document.dispatchEvent(new CustomEvent('logon'));
                    onEnterDesktop?.();
                }, reduceMotion ? 0 : 420);
            }, reduceMotion ? 0 : 280);
        });
    } else {
        onEnterDesktop?.();
    }
}
