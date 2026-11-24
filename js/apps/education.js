// Education & Leadership window (education.exe): System Properties tabbed dialog.
import { initTabs } from '../core/window-manager.js';

export const educationApp = {
    id: 'education',
    label: 'Education',
    startLabel: 'Education & Leadership',
    taskLabel: 'Education',
    icon: `
        <svg viewBox="0 0 48 48" aria-hidden="true">
            <path d="M24 8L4 18l20 10 20-10-20-10z" fill="#3a6fd8" stroke="#1d3b7a" stroke-width="2" stroke-linejoin="round"/>
            <path d="M12 22v11c0 3.5 5.4 6 12 6s12-2.5 12-6V22" fill="#5d94ec" stroke="#1d3b7a" stroke-width="2" stroke-linejoin="round"/>
            <path d="M42 19v13" stroke="#f6c94c" stroke-width="2.5" stroke-linecap="round"/>
            <circle cx="42" cy="33" r="2.5" fill="#f6c94c"/>
        </svg>`,

    render() {
        return `
        <section id="education" class="section" hidden>
            <article class="window window-education" role="dialog" aria-labelledby="education-title">
                <header class="titlebar">
                    <span class="titlebar-icon" aria-hidden="true"></span>
                    <h2 class="titlebar-text" id="education-title">education.exe: Academic &amp; Leadership Record</h2>
                    <div class="titlebar-buttons">
                        <button type="button" class="tb-btn tb-min" data-win="minimize" aria-label="Minimize"></button><button type="button" class="tb-btn tb-max" data-win="maximize" aria-label="Maximize"></button><button type="button" class="tb-btn tb-close" data-win="close" aria-label="Close"></button>
                    </div>
                </header>
                <div class="window-body edu-body">
                    <div class="sys-tabs" role="tablist" aria-label="Academic and leadership sections">
                        <button type="button" class="sys-tab" role="tab" id="tab-edu-academic" aria-selected="true" aria-controls="panel-edu-academic">Education &amp; Honors</button>
                        <button type="button" class="sys-tab" role="tab" id="tab-edu-leadership" aria-selected="false" aria-controls="panel-edu-leadership" tabindex="-1">Leadership &amp; Community</button>
                    </div>

                    <div class="sys-panel" role="tabpanel" id="panel-edu-academic" aria-labelledby="tab-edu-academic" tabindex="0">
                        <div class="edu-block">
                            <div class="edu-header">
                                <div>
                                    <h3>Universitas Negeri Semarang (UNNES)</h3>
                                    <p class="edu-degree">Bachelor's Degree in Informatics and Computer Engineering</p>
                                </div>
                                <div class="edu-meta">
                                    <span class="edu-score">GPA 3.88 / 4.00</span>
                                    <span>Aug 2022 - May 2026</span>
                                </div>
                            </div>
                            <dl class="honors-ledger">
                                <div>
                                    <dt>PILMAPRES 2025</dt>
                                    <dd>National Candidate for the Most Outstanding Student (PILMAPRES Awal Nasional) 2025, Indonesia.</dd>
                                </div>
                                <div>
                                    <dt>National Competitions</dt>
                                    <dd>Winner of 20+ awards across national-level academic and technology competitions.</dd>
                                </div>
                                <div>
                                    <dt>Academic Distinction</dt>
                                    <dd>Awarded The Best Academic Achievement Student at Universitas Negeri Semarang, 2025.</dd>
                                </div>
                                <div>
                                    <dt>Published Research</dt>
                                    <dd>Student Researcher with h-index 3, i10-index 1, and 22 citations on Google Scholar and ResearchGate.</dd>
                                </div>
                                <div>
                                    <dt>Public Speaking</dt>
                                    <dd>Invited speaker at 25+ local and national forums covering technology and personal development.</dd>
                                </div>
                                <div>
                                    <dt>AIESEC 2024</dt>
                                    <dd>Selected among the Best Delegates of AIESEC Future Leaders (Summer Batch) 2024, Semarang.</dd>
                                </div>
                            </dl>
                        </div>

                        <div class="edu-block edu-compact">
                            <div class="edu-header">
                                <div>
                                    <h3>Bangkit Academy</h3>
                                    <p class="edu-degree">Mobile Development Cohort (led by Google, Tokopedia, Gojek &amp; Traveloka)</p>
                                </div>
                                <div class="edu-meta">
                                    <span class="edu-score">Grade 93.10 / 100</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="sys-panel" role="tabpanel" id="panel-edu-leadership" aria-labelledby="tab-edu-leadership" tabindex="0" hidden>
                        <div class="leader-list">
                            <article class="leader-item">
                                <div class="edu-header">
                                    <div>
                                        <h3>Google Student Ambassador</h3>
                                        <p class="edu-degree">Google Indonesia (UNNES Semarang)</p>
                                    </div>
                                    <span class="leader-date">Sep 2025 - Feb 2026</span>
                                </div>
                                <ul>
                                    <li>Generated 500+ referral clicks and drove Gemini Pro sign-ups through targeted student campaigns.</li>
                                    <li>Organized and ran 5 on-campus offline events demonstrating practical Gemini AI workflows across academic disciplines.</li>
                                    <li>Produced technical and educational social content reaching 20,000+ impressions.</li>
                                </ul>
                            </article>

                            <article class="leader-item">
                                <div class="edu-header">
                                    <div>
                                        <h3>BSO MAWAPRES FT UNNES</h3>
                                        <p class="edu-degree">President · Faculty of Engineering, Semarang</p>
                                    </div>
                                    <span class="leader-date">Dec 2024 - Dec 2025</span>
                                </div>
                                <ul>
                                    <li>Directed faculty-wide mentorship and competition preparation across academic and engineering tracks.</li>
                                    <li>Guided engineering students to win 100+ local and national awards throughout 2025.</li>
                                </ul>
                            </article>

                            <article class="leader-item">
                                <div class="edu-header">
                                    <div>
                                        <h3>HIMPROTE FT UNNES</h3>
                                        <p class="edu-degree">Senior Staff, Department of Household Budgeting and Entrepreneurship</p>
                                    </div>
                                    <span class="leader-date">Jan 2023 - Jan 2025</span>
                                </div>
                                <ul>
                                    <li>Led a 10-member entrepreneurship team generating IDR 30 million in revenue through online and offline sales.</li>
                                    <li>Managed end-to-end vendor production and distribution of 700+ student apparel items.</li>
                                </ul>
                            </article>
                        </div>
                    </div>
                </div>
                <footer class="statusbar">
                    <span id="edu-status">Academic Record | GPA 3.88 / 4.00</span>
                    <span>Semarang &amp; Jakarta</span>
                </footer>
            </article>
        </section>`;
    },

    init() {
        const eduStatus = document.getElementById('edu-status');
        initTabs('#education [role="tablist"]', (tab) => {
            if (!eduStatus) return;
            eduStatus.textContent = tab.id === 'tab-edu-leadership'
                ? 'Leadership Record | 3 campus & national roles'
                : 'Academic Record | GPA 3.88 / 4.00';
        });
    },
};
