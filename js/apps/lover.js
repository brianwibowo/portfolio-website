// lover.exe: full heart desktop shortcut opening a retro 404 Not Found system dialog.
export const loverApp = {
    id: 'lover',
    label: 'lover.exe',
    startLabel: 'lover.exe',
    taskLabel: 'lover.exe',
    icon: `
        <svg viewBox="0 0 48 48" aria-hidden="true">
            <path d="M24 41.5L9.2 27.2C4.8 22.8 4.8 15.6 9.2 11.2c4.1-4.1 10.6-4.1 14.8.2 4.2-4.3 10.7-4.3 14.8-.2 4.4 4.4 4.4 11.6 0 16L24 41.5z" fill="#e53935" stroke="#8e1b18" stroke-width="2" stroke-linejoin="round"/>
            <path d="M13 15c2.2-2.2 5.4-2.5 7.8-.8" fill="none" stroke="#ff9e9b" stroke-width="2.5" stroke-linecap="round"/>
        </svg>`,

    render() {
        return `
        <section id="lover" class="section" hidden>
            <article class="window window-lover" role="dialog" aria-labelledby="lover-title">
                <header class="titlebar">
                    <span class="titlebar-icon icon-error" aria-hidden="true"></span>
                    <h2 class="titlebar-text" id="lover-title">lover.exe: 404 Not Found</h2>
                    <div class="titlebar-buttons">
                        <button type="button" class="tb-btn tb-min" data-win="minimize" aria-label="Minimize"></button><button type="button" class="tb-btn tb-max" data-win="maximize" aria-label="Maximize"></button><button type="button" class="tb-btn tb-close" data-win="close" aria-label="Close"></button>
                    </div>
                </header>
                <div class="window-body lover-body">
                    <div class="lover-alert">
                        <svg class="lover-icon" viewBox="0 0 48 48" aria-hidden="true">
                            <path d="M24 41.5L9.2 27.2C4.8 22.8 4.8 15.6 9.2 11.2c4.1-4.1 10.6-4.1 14.8.2 4.2-4.3 10.7-4.3 14.8-.2 4.4 4.4 4.4 11.6 0 16L24 41.5z" fill="#e53935" stroke="#8e1b18" stroke-width="2" stroke-linejoin="round"/>
                            <path d="M13 15c2.2-2.2 5.4-2.5 7.8-.8" fill="none" stroke="#ff9e9b" stroke-width="2.5" stroke-linecap="round"/>
                        </svg>
                        <div class="lover-copy">
                            <h3>HTTP 404: Lover Not Found</h3>
                            <p>Windows cannot find <code>C:\\Life\\lover.exe</code>. Make sure the person exists in this timeline, or click <strong>Retry Scan</strong> to search again.</p>
                        </div>
                    </div>
                    <div class="lover-diag" id="lover-log" role="status" aria-live="polite">Diagnostic: 0 active instances found. All system resources are currently busy shipping production code and maintaining servers.</div>
                    <div class="lover-actions">
                        <button type="button" class="btn" id="lover-retry">Retry Scan</button>
                        <a href="#contact" class="btn">Send a Message</a>
                        <button type="button" class="btn btn-primary" data-win="close">OK</button>
                    </div>
                </div>
                <footer class="statusbar">
                    <span id="lover-status">Status: 404 Not Found</span>
                    <span>ERR_NO_PARTNER</span>
                </footer>
            </article>
        </section>`;
    },

    init() {
        const loverWin = document.querySelector('#lover .window');
        const loverRetry = document.getElementById('lover-retry');
        const loverLog = document.getElementById('lover-log');
        const loverStatus = document.getElementById('lover-status');
        const LOGS = [
            'Scan complete: HTTP 404 persists. Only Docker containers responded on localhost.',
            'Connection timed out: port 443 is open, heart port remains closed.',
            'Query returned 0 matches. Redirecting CPU cycles back to shipping features.',
            'Still 404 Not Found. Try reaching out via Send a Message instead.',
        ];
        let tries = 0;

        loverWin?.addEventListener('winopen', () => {
            window.systemSound?.beep(320, 2);
            document.dispatchEvent(new CustomEvent('lover404'));
        });

        loverRetry?.addEventListener('click', () => {
            loverRetry.disabled = true;
            loverRetry.textContent = 'Scanning...';
            if (loverStatus) loverStatus.textContent = 'Scanning local timeline...';
            setTimeout(() => {
                const msg = LOGS[tries % LOGS.length];
                tries++;
                if (loverLog) loverLog.textContent = `[Attempt #${tries}] ${msg}`;
                if (loverStatus) loverStatus.textContent = `Status: 404 Not Found (attempt ${tries})`;
                loverRetry.disabled = false;
                loverRetry.textContent = 'Retry Scan';
                window.systemSound?.beep(280, 2);
            }, 320);
        });
    },
};
