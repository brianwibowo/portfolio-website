// Welcome hero window and background ASCII plasma animation.
export const welcomeApp = {
    id: 'welcome',
    isWelcome: true,
    label: 'welcome.exe',
    startLabel: 'Welcome',
    taskLabel: 'Welcome',
    icon: `
        <svg viewBox="0 0 48 48" aria-hidden="true">
            <rect x="5" y="8" width="38" height="32" rx="2" fill="#fdfdfd" stroke="#6b7b8c" stroke-width="2"/>
            <rect x="6" y="9" width="36" height="7" fill="#4f86d9"/>
            <rect x="35" y="10.5" width="5" height="4" rx="1" fill="#e8805e"/>
            <path d="M12 23h16M12 29h22M12 35h12" stroke="#9aa6b2" stroke-width="2.5" stroke-linecap="round"/>
        </svg>`,

    render() {
        return `
        <article class="window window-welcome pending" id="welcome" aria-labelledby="welcome-title">
            <header class="titlebar">
                <span class="titlebar-icon" aria-hidden="true"></span>
                <h2 class="titlebar-text" id="welcome-title">Welcome</h2>
                <div class="titlebar-buttons">
                    <button type="button" class="tb-btn tb-min" data-win="minimize" aria-label="Minimize"></button><button type="button" class="tb-btn tb-max" data-win="maximize" aria-label="Maximize"></button><button type="button" class="tb-btn tb-close" data-win="close" aria-label="Close"></button>
                </div>
            </header>
            <div class="window-body hero-body">
                <pre class="ascii-aura" id="ascii-aura" aria-hidden="true"></pre>
                <div class="hero-layout">
                    <div class="hero-main">
                        <p class="greeting" id="greeting">Hello.</p>
                        <h1 class="hero-name">Brian Wibowo</h1>
                        <p class="hero-tagline">Full-Stack Developer</p>
                        <p class="hero-lede">Informatics Engineering graduate (GPA 3.88/4.00) with 2 years of professional experience building end-to-end web, mobile, and desktop applications. Shipped 60+ production software solutions across government, academic, and private-sector clients using Laravel, Next.js, Go, and Docker.</p>
                    </div>
                    <figure class="hero-portrait" id="hero-portrait">
                        <div class="pixel-screen">
                            <img src="assets/images/portrait-pixel.png?v=2" width="320" height="384" alt="Retro pixel art portrait of Brian Wibowo" class="pixel-photo">
                        </div>
                        <figcaption class="pixel-caption">
                            <span>brian.bmp · 160x192</span>
                            <button type="button" class="pixel-mode-btn" id="portrait-mode-btn" aria-pressed="false" title="Toggle retro LCD tint">LCD</button>
                        </figcaption>
                    </figure>
                    <dl class="hero-metrics" aria-label="Career highlights">
                        <div class="metric-item">
                            <dt>Production Systems</dt>
                            <dd>60+ shipped</dd>
                        </div>
                        <div class="metric-item">
                            <dt>UNNES Informatics GPA</dt>
                            <dd>3.88 / 4.00</dd>
                        </div>
                        <div class="metric-item">
                            <dt>National Competitions</dt>
                            <dd>20+ awards</dd>
                        </div>
                    </dl>
                    <div class="hero-cta">
                        <a href="#projects" class="btn btn-primary">Open Projects</a>
                        <a href="#experience" class="btn">View Work History</a>
                        <a href="#education" class="btn">Academic &amp; Leadership</a>
                        <a href="#contact" class="btn">Send a Message</a>
                        <a href="https://github.com/brianwibowo" class="btn" target="_blank" rel="noopener noreferrer">GitHub</a>
                    </div>
                </div>
            </div>
            <footer class="statusbar">
                <span>Apriansyah Wibowo (Brian)</span>
                <span>South Jakarta, Indonesia</span>
            </footer>
        </article>`;
    },

    init() {
        const greeting = document.getElementById('greeting');
        if (greeting) {
            const hour = new Date().getHours();
            greeting.textContent = hour < 12 ? 'Good morning.' : hour < 18 ? 'Good afternoon.' : 'Good evening.';
        }

        const portrait = document.getElementById('hero-portrait');
        const modeBtn = document.getElementById('portrait-mode-btn');
        modeBtn?.addEventListener('click', () => {
            const isLcd = portrait?.classList.toggle('is-lcd');
            modeBtn.setAttribute('aria-pressed', String(Boolean(isLcd)));
            modeBtn.textContent = isLcd ? 'Color' : 'LCD';
        });

        const welcomeWin = document.getElementById('welcome');
        const aura = document.getElementById('ascii-aura');
        if (!aura || !welcomeWin) return;

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
    },
};
