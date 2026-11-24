// Contact form handler: submits via Formspree when configured, or opens a pre-filled email draft.
const FORM_ENDPOINT = '';
const DIRECT_EMAIL = 'sultanapri86@gmail.com';

document.addEventListener('DOMContentLoaded', () => {
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
            if (field.getAttribute('aria-invalid') === 'true') {
                field.removeAttribute('aria-invalid');
            }
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

        // Honeypot spam filter.
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
            const detail = Array.isArray(result.errors)
                ? result.errors.map((e) => e.message).join(' ')
                : '';
            throw new Error(detail || `HTTP ${response.status}`);
        } catch (error) {
            console.error('Contact form error:', error);
            showStatus(`Message delivery failed. Please email ${DIRECT_EMAIL} directly or use Copy Email Address above.`, 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = buttonLabel;
        }
    });
});
