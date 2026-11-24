// Start menu, live taskbar clock, copyright year, and draggable desktop shortcuts.
export function initTaskbar() {
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

    const startBtn = document.getElementById('start-btn');
    const startMenu = document.getElementById('start-menu');

    function setStart(open) {
        if (!startMenu || !startBtn) return;
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

    // Draggable desktop icons on mouse/pen; touch leaves native scrolling intact.
    const taskbarH = () => document.querySelector('.taskbar')?.offsetHeight || 44;
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
}
