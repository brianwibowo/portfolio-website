// Central app registry. To add a new window/feature, create a file in js/apps/ and add it to APPS below.
import { welcomeApp } from './welcome.js';
import { experienceApp } from './experience.js';
import { projectsApp } from './projects.js';
import { educationApp } from './education.js';
import { skillsApp } from './skills.js';
import { contactApp } from './contact.js';
import { loverApp } from './lover.js';

export const APPS = [
    welcomeApp,
    experienceApp,
    projectsApp,
    educationApp,
    skillsApp,
    contactApp,
    loverApp,
];

export const EXTERNAL_LINKS = [
    { label: 'GitHub (@brianwibowo)', href: 'https://github.com/brianwibowo', external: true },
    { label: 'Email sultanapri86@gmail.com', href: 'mailto:sultanapri86@gmail.com', external: false },
];
