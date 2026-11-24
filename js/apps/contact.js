// Contact window (New Message): form validation, clipboard email copy, and mailto/Formspree delivery.
const FORM_ENDPOINT = '';
const DIRECT_EMAIL = 'sultanapri86@gmail.com';

export const contactApp = {
    id: 'contact',
    focusFirst: true,
    label: 'Contact',
    startLabel: 'New Message',
    taskLabel: 'New Message',
    icon: `
        <svg viewBox="0 0 48 48" aria-hidden="true">
            <rect x="5" y="11" width="38" height="26" rx="2" fill="#fdfdfd" stroke="#6b7b8c" stroke-width="2"/>
            <path d="M6 13l18 13 18-13" fill="none" stroke="#c0392b" stroke-width="2.5"/>
        </svg>`,

    render() {
        return `
        <section id="contact" class="section" hidden>
            <article class="window window-contact" role="dialog" aria-labelledby="contact-title">
                <header class="titlebar">
                    <span class="titlebar-icon icon-mail" aria-hidden="true"></span>
                    <h2 class="titlebar-text" id="contact-title">New Message</h2>
                    <div class="titlebar-buttons">
                        <button type="button" class="tb-btn tb-min" data-win="minimize" aria-label="Minimize"></button><button type="button" class="tb-btn tb-max" data-win="maximize" aria-label="Maximize"></button><button type="button" class="tb-btn tb-close" data-win="close" aria-label="Close"></button>
                    </div>
                </header>
                <div class="window-body">
                    <p class="section-lede">Hiring for a software engineering role or planning a web, mobile, or cloud build? Send a message below or write directly to <strong>${DIRECT_EMAIL}</strong>.</p>
                    <form id="contact-form" class="contact-form" method="POST" novalidate>
                        <div class="field field-static">
                            <span>To:</span>
                            <div class="static-value">Brian Wibowo &lt;${DIRECT_EMAIL}&gt;</div>
                        </div>
                        <label class="field">
                            <span>From:</span>
                            <input type="text" name="name" autocomplete="name" maxlength="100" placeholder="Your name" required>
                        </label>
                        <label class="field">
                            <span>Email:</span>
                            <input type="email" name="email" autocomplete="email" maxlength="254" placeholder="you@company.com" required>
                        </label>
                        <label class="field">
                            <span>Subject:</span>
                            <input type="text" name="subject" maxlength="150" placeholder="Role or project inquiry" required>
                        </label>
                        <label class="field field-message">
                            <span class="visually-hidden">Message</span>
                            <textarea name="message" rows="6" maxlength="5000" placeholder="Tell me about the team, scope, or timeline..." required></textarea>
                        </label>
                        <div class="hp-field" aria-hidden="true">
                            <label>Leave this empty <input type="text" name="_gotcha" tabindex="-1" autocomplete="off"></label>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">Send Message</button>
                            <button type="button" class="btn" id="copy-email-btn" data-email="${DIRECT_EMAIL}">Copy Email Address</button>
                            <a href="https://github.com/brianwibowo" target="_blank" rel="noopener noreferrer" class="btn">GitHub Profile</a>
                        </div>
                        <div class="form-status" id="form-status" role="status" aria-live="polite" hidden><p></p></div>
                    </form>
                </div>
            </article>
        </section>`;
    },

    init() {
        const form = document.getElementById('contact-form');
        const status = document.getElementById('form-status');
        const copyBtn = document.getElementById('copy-email-btn');
        if (!form || !status) return;

        const statusText = status.querySelector('p');
        const submitButton = form.querySelector('button[type="submit"]');
        const buttonLabel = submitButton.textContent;
        const fields = ['name', 'email', 'subject', 'message'].map((n) => form.elements[n]).filter(Boolean);

        function showStatus(message, type) {
            statusText.textContent = message;
            statusText.className = type;
            status.hidden = false;
        }

        fields.forEach((field) => {
            field.addEventListener('input', () => {
                if (field.getAttribute('aria-invalid') === 'true') field.removeAttribute('aria-invalid');
            });
        });

        copyBtn?.addEventListener('click', async () => {
            const email = copyBtn.dataset.email || DIRECT_EMAIL;
            try {
                await navigator.clipboard.writeText(email);
                showStatus(`Copied ${email} to clipboard.`, 'success');
            } catch (e) {
                showStatus(`Direct email address: ${email}`, 'success');
            }
        });

        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            if (form.elements._gotcha?.value) return;

            const name = form.elements.name.value.trim();
            const email = form.elements.email.value.trim();
            const subject = form.elements.subject.value.trim();
            const message = form.elements.message.value.trim();
            const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

            let firstInvalid = null;
            [
                [form.elements.name, Boolean(name)],
                [form.elements.email, emailValid],
                [form.elements.subject, Boolean(subject)],
                [form.elements.message, Boolean(message)],
            ].forEach(([el, ok]) => {
                if (!ok) {
                    el.setAttribute('aria-invalid', 'true');
                    if (!firstInvalid) firstInvalid = el;
                } else {
                    el.removeAttribute('aria-invalid');
                }
            });

            if (firstInvalid) {
                showStatus('Please fill in your name, a valid email address, a subject, and a message before sending.', 'error');
                firstInvalid.focus();
                return;
            }

            if (!FORM_ENDPOINT) {
                const mailSubject = encodeURIComponent(`[Portfolio] ${subject}`);
                const mailBody = encodeURIComponent(`From: ${name} (${email})\n\n${message}`);
                window.location.href = `mailto:${DIRECT_EMAIL}?subject=${mailSubject}&body=${mailBody}`;
                showStatus(`Opened your email client addressed to ${DIRECT_EMAIL} with your message pre-filled. If nothing opened, click Copy Email Address above.`, 'success');
                return;
            }

            const data = new FormData(form);
            data.set('_subject', `Portfolio: ${subject}`);
            data.set('_replyto', email);

            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            status.hidden = true;

            try {
                const response = await fetch(FORM_ENDPOINT, {
                    method: 'POST',
                    body: data,
                    headers: { Accept: 'application/json' },
                });

                if (response.ok) {
                    form.reset();
                    showStatus("Thanks for your message. I'll reply to your email soon.", 'success');
                    return;
                }

                const result = await response.json().catch(() => ({}));
                const detail = Array.isArray(result.errors) ? result.errors.map((e) => e.message).join(' ') : '';
                throw new Error(detail || `HTTP ${response.status}`);
            } catch (error) {
                console.error('Contact form error:', error);
                showStatus(`Message delivery failed. Please email ${DIRECT_EMAIL} directly or use Copy Email Address above.`, 'error');
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = buttonLabel;
            }
        });
    },
};
