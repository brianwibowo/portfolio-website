// Work History window (experience.exe): master-detail employer inspector.
import { initTabs } from '../core/window-manager.js';

export const experienceApp = {
    id: 'experience',
    label: 'Experience',
    startLabel: 'Work History',
    taskLabel: 'Work History',
    icon: `
        <svg viewBox="0 0 48 48" aria-hidden="true">
            <rect x="6" y="14" width="36" height="26" rx="3" fill="#8b5e34" stroke="#4f3319" stroke-width="2"/>
            <path d="M18 14v-4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4" fill="none" stroke="#4f3319" stroke-width="2.5"/>
            <path d="M6 25h36" stroke="#4f3319" stroke-width="2"/>
            <rect x="21" y="22" width="6" height="6" rx="1" fill="#f6c94c" stroke="#4f3319" stroke-width="1.5"/>
        </svg>`,

    render() {
        return `
        <section id="experience" class="section" hidden>
            <article class="window window-experience" role="dialog" aria-labelledby="experience-title">
                <header class="titlebar">
                    <span class="titlebar-icon icon-folder" aria-hidden="true"></span>
                    <h2 class="titlebar-text" id="experience-title">experience.exe: Work History</h2>
                    <div class="titlebar-buttons">
                        <button type="button" class="tb-btn tb-min" data-win="minimize" aria-label="Minimize"></button><button type="button" class="tb-btn tb-max" data-win="maximize" aria-label="Maximize"></button><button type="button" class="tb-btn tb-close" data-win="close" aria-label="Close"></button>
                    </div>
                </header>
                <div class="address-bar">
                    <span class="address-label">Location</span>
                    <span class="address-path">C:\\Career\\Working_Experience (3 roles)</span>
                </div>
                <div class="window-body exp-body">
                    <div class="exp-split">
                        <div class="exp-sidebar" role="tablist" aria-label="Employers" aria-orientation="vertical">
                            <button type="button" class="exp-tab" role="tab" id="tab-exp-icloud" aria-selected="true" aria-controls="panel-exp-icloud" data-exp-status="PT Indonesian Cloud | Sep 2026 to Present">
                                <span class="exp-tab-company">PT Indonesian Cloud</span>
                                <span class="exp-tab-meta">Full-Stack Intern · Sep 2026 - Present</span>
                            </button>
                            <button type="button" class="exp-tab" role="tab" id="tab-exp-vuriko" aria-selected="false" aria-controls="panel-exp-vuriko" tabindex="-1" data-exp-status="Vuriko Studio | Sep 2024 to Present">
                                <span class="exp-tab-company">Vuriko Studio</span>
                                <span class="exp-tab-meta">Founder &amp; Full-Stack · Sep 2024 - Present</span>
                            </button>
                            <button type="button" class="exp-tab" role="tab" id="tab-exp-pucung" aria-selected="false" aria-controls="panel-exp-pucung" tabindex="-1" data-exp-status="Bapak Pucung Studio | Dec 2025 to Present">
                                <span class="exp-tab-company">Bapak Pucung Studio</span>
                                <span class="exp-tab-meta">Full-Stack Developer · Dec 2025 - Present</span>
                            </button>
                        </div>

                        <div class="exp-detail-wrap">
                            <div class="exp-panel" role="tabpanel" id="panel-exp-icloud" aria-labelledby="tab-exp-icloud" tabindex="0">
                                <div class="exp-head">
                                    <div>
                                        <h3>PT Indonesian Cloud</h3>
                                        <p class="exp-role">Full-Stack Developer Intern</p>
                                    </div>
                                    <div class="exp-place">
                                        <span>DKI Jakarta</span>
                                        <span>Sep 2026 - Present</span>
                                    </div>
                                </div>
                                <ul class="exp-points">
                                    <li>Developed <strong>Farmer App</strong>, an agricultural land management SaaS platform with a multimodal assistant supporting text, image, and audio input. Integrated retrieval-augmented generation (RAG), a vector database, and the OpenRouter API to ground responses in domain knowledge.</li>
                                    <li>Automated procurement data collection and prospect analysis through a sales intelligence platform (<strong>SALEP</strong>) combining SPSE scraping with LLM social media analysis. Applied data labeling, preprocessing, and guardrails to score relevance and rank sales leads with confidence scores.</li>
                                    <li>Customized Indonesian Cloud's <strong>OpenStack dashboard</strong> into a customer-facing portal for server and virtual machine management, adapting cloud infrastructure controls into an integrated customer web portal.</li>
                                </ul>
                                <ul class="tags" aria-label="Technologies used at PT Indonesian Cloud">
                                    <li>RAG &amp; Vector DB</li>
                                    <li>OpenRouter API</li>
                                    <li>OpenStack</li>
                                    <li>SPSE Scraping</li>
                                    <li>LLM Guardrails</li>
                                </ul>
                            </div>

                            <div class="exp-panel" role="tabpanel" id="panel-exp-vuriko" aria-labelledby="tab-exp-vuriko" tabindex="0" hidden>
                                <div class="exp-head">
                                    <div>
                                        <h3>Vuriko Studio</h3>
                                        <p class="exp-role">Founder &amp; Full-Stack Developer</p>
                                    </div>
                                    <div class="exp-place">
                                        <span>Semarang</span>
                                        <span>Sep 2024 - Present</span>
                                    </div>
                                </div>
                                <ul class="exp-points">
                                    <li>Delivered <strong>45+ digital solutions for 30+ government, academic, and private-sector clients</strong> by gathering stakeholder requirements, analyzing business processes, defining product scope, and coordinating sprints in ClickUp under Scrum and Waterfall workflows.</li>
                                    <li>Built <strong>MindFit</strong>, a Laravel health assessment platform connected to a diagnostic engine via n8n webhooks, combining computed health metrics (BMR, TDEE, BMI) with LLM analysis to produce personalized health assessments, nutrition guidance, and fitness plans.</li>
                                    <li>Developed <strong>SI-Mliwis</strong> with Next.js and Supabase, turning operational requirements at Pantai Mliwis into integrated workflows for incoming and outgoing correspondence, digital document archiving, revenue reporting, and analytics dashboards.</li>
                                </ul>
                                <ul class="tags" aria-label="Technologies used at Vuriko Studio">
                                    <li>Laravel</li>
                                    <li>Next.js</li>
                                    <li>Supabase</li>
                                    <li>n8n Webhooks</li>
                                    <li>Scrum &amp; ClickUp</li>
                                </ul>
                            </div>

                            <div class="exp-panel" role="tabpanel" id="panel-exp-pucung" aria-labelledby="tab-exp-pucung" tabindex="0" hidden>
                                <div class="exp-head">
                                    <div>
                                        <h3>Bapak Pucung Studio</h3>
                                        <p class="exp-role">Full-Stack Developer</p>
                                    </div>
                                    <div class="exp-place">
                                        <span>Semarang</span>
                                        <span>Dec 2025 - Present</span>
                                    </div>
                                </div>
                                <ul class="exp-points">
                                    <li>Developed <strong>15+ production digital products</strong> spanning information systems, marketplaces, browser games, and desktop applications across full-stack architectures and deployment pipelines.</li>
                                    <li>Digitized waste deposit and reward management for <strong>Funbumi's IoT recycling system</strong> deployed around UNJ Jakarta by building Laravel web workflows and API integrations, enabling residents to sort physical waste across 4 categories, log deposits, track contributions, and redeem rewards.</li>
                                    <li>Built <strong>Wayang Playverse</strong>, an Electron.js desktop application supporting daily museum operations and interactive visitor learning at Banyumas Wayang Museum, presented during a 2026 Ministry of Culture institutional visit.</li>
                                </ul>
                                <ul class="tags" aria-label="Technologies used at Bapak Pucung Studio">
                                    <li>Laravel</li>
                                    <li>Electron.js</li>
                                    <li>IoT API Integration</li>
                                    <li>Full-Stack Deployment</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <footer class="statusbar">
                    <span id="exp-status">PT Indonesian Cloud | Sep 2026 to Present</span>
                    <span>2+ years professional experience</span>
                </footer>
            </article>
        </section>`;
    },

    init() {
        const expStatus = document.getElementById('exp-status');
        initTabs('#experience [role="tablist"]', (tab) => {
            if (expStatus && tab.dataset.expStatus) expStatus.textContent = tab.dataset.expStatus;
        });
    },
};
