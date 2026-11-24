// Desktop OS bootstrapper: mounts all registered apps, then starts core services and app modules.
import { APPS, EXTERNAL_LINKS } from './apps/index.js';
import { initSound } from './core/sound.js';
import { initSkins } from './core/skins.js';
import { initTaskbar } from './core/taskbar.js';
import { initWindows } from './core/window-manager.js';
import { initLogon } from './core/logon.js';
import { initDroid } from './core/droid.js';

function mountApps() {
    const iconNav = document.getElementById('desktop-icons');
    const heroSection = document.getElementById('home');
    const windowsRoot = document.getElementById('windows-root');
    const startList = document.getElementById('start-list');
    const taskButtons = document.getElementById('task-buttons');

    if (iconNav) {
        iconNav.innerHTML = APPS.map((app) => `
            <a class="desk-icon" href="#${app.id}">
                ${app.icon}
                <span>${app.label}</span>
            </a>`).join('');
    }

    if (startList) {
        const appItems = APPS.map((app) => `<li><a href="#${app.id}">${app.startLabel || app.label}</a></li>`).join('');
        const extItems = EXTERNAL_LINKS.map((link) => {
            const attrs = link.external ? ' target="_blank" rel="noopener noreferrer"' : '';
            return `<li><a href="${link.href}"${attrs}>${link.label}</a></li>`;
        }).join('');
        startList.innerHTML = `${appItems}<li class="sep" role="separator"></li>${extItems}`;
    }

    if (taskButtons) {
        taskButtons.innerHTML = APPS.map((app) => `
            <li id="task-${app.id}" hidden><a href="#${app.id}" data-task="${app.id}">${app.taskLabel || app.label}</a></li>`).join('');
    }

    APPS.forEach((app) => {
        if (app.isWelcome) {
            heroSection?.insertAdjacentHTML('beforeend', app.render());
        } else {
            windowsRoot?.insertAdjacentHTML('beforeend', app.render());
        }
    });
}

document.documentElement.classList.add('js');

function boot() {
    mountApps();
    initSound();
    initSkins();
    initTaskbar();
    const { openWelcome } = initWindows(APPS);
    APPS.forEach((app) => app.init?.());
    initLogon(openWelcome);
    initDroid();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
} else {
    boot();
}
