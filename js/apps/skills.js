// Technical Skills window (skills.txt): searchable monospace skill reference with empty state.
export const skillsApp = {
    id: 'readme',
    label: 'skills.txt',
    startLabel: 'Technical Skills',
    taskLabel: 'skills.txt',
    icon: `
        <svg viewBox="0 0 48 48" aria-hidden="true">
            <path d="M10 4h20l8 8v32H10z" fill="#fdfdfd" stroke="#6b7b8c" stroke-width="2" stroke-linejoin="round"/>
            <path d="M30 4v8h8" fill="#e3e7ec" stroke="#6b7b8c" stroke-width="2" stroke-linejoin="round"/>
            <path d="M15 19h18M15 24h18M15 29h18M15 34h12" stroke="#7d8a99" stroke-width="2" stroke-linecap="round"/>
        </svg>`,

    render() {
        return `
        <section id="readme" class="section" hidden>
            <article class="window window-notepad" role="dialog" aria-labelledby="readme-title">
                <header class="titlebar">
                    <span class="titlebar-icon icon-text" aria-hidden="true"></span>
                    <h2 class="titlebar-text" id="readme-title">skills.txt: Technical Stack &amp; Profile</h2>
                    <div class="titlebar-buttons">
                        <button type="button" class="tb-btn tb-min" data-win="minimize" aria-label="Minimize"></button><button type="button" class="tb-btn tb-max" data-win="maximize" aria-label="Maximize"></button><button type="button" class="tb-btn tb-close" data-win="close" aria-label="Close"></button>
                    </div>
                </header>
                <div class="notepad-toolbar">
                    <label class="skill-search-wrap">
                        <span>Find skill:</span>
                        <input type="search" id="skill-search" placeholder="e.g. Laravel, Go, Docker, RAG, Kotlin..." autocomplete="off">
                    </label>
                    <button type="button" class="btn btn-small" id="skill-clear" hidden>Clear</button>
                </div>
                <div class="window-body notepad-body">
                    <div class="notepad-doc" id="skills-doc" tabindex="0">
                        <div class="notepad-header">
                            <p class="mono-title">BRIAN WIBOWO (APRIANSYAH WIBOWO)</p>
                            <p class="mono-sub">Full-Stack Software Developer | South Jakarta, Jakarta | sultanapri86@gmail.com</p>
                            <p class="mono-sub">GitHub: <a href="https://github.com/brianwibowo" target="_blank" rel="noopener noreferrer">https://github.com/brianwibowo</a></p>
                        </div>

                        <div class="skill-groups" id="skill-groups">
                            <section class="skill-group" data-skill-text="languages javascript typescript php sql kotlin python">
                                <h3>[01] Languages</h3>
                                <p>JavaScript, TypeScript, PHP, SQL, Kotlin, Python</p>
                            </section>

                            <section class="skill-group" data-skill-text="frameworks libraries laravel react.js next.js express.js angular react native vue.js tailwind css electron.js">
                                <h3>[02] Frameworks &amp; Libraries</h3>
                                <p>Laravel, React.js, Next.js, Express.js, Angular, React Native, Vue.js, Tailwind CSS, Electron.js</p>
                            </section>

                            <section class="skill-group" data-skill-text="backend databases infrastructure golang go laravel spring boot rest apis mysql postgresql firebase cloudflare vercel supabase docker linux apache kafka grafana vps cloudpanel ci/cd openstack">
                                <h3>[03] Backend, Databases &amp; Infrastructure</h3>
                                <p>Golang, Laravel, Spring Boot, REST APIs, MySQL, PostgreSQL, Firebase, Cloudflare, Vercel, Supabase, Docker, Linux, Apache Kafka, Grafana, VPS, CloudPanel, CI/CD, OpenStack</p>
                            </section>

                            <section class="skill-group" data-skill-text="version control dev tools git bitbucket github gitea postman vs code android studio clickup n8n">
                                <h3>[04] Version Control &amp; Dev Tools</h3>
                                <p>Git, Bitbucket, GitHub, Gitea, Postman, VS Code, Android Studio, ClickUp, n8n</p>
                            </section>

                            <section class="skill-group" data-skill-text="software engineering concepts oop mvc solid system design authentication authorization rbac sdlc agile scrum kanban waterfall">
                                <h3>[05] Software Engineering Concepts</h3>
                                <p>OOP, MVC, SOLID, System Design, Authentication &amp; Authorization, Role-Based Access Control (RBAC), SDLC, Agile, Scrum, Kanban, Waterfall</p>
                            </section>

                            <section class="skill-group" data-skill-text="machine learning ai pytorch tensorflow scikit-learn random forest xgboost svm knn">
                                <h3>[06] Machine Learning &amp; Data Modeling</h3>
                                <p>PyTorch, TensorFlow, scikit-learn, Random Forest, XGBoost, SVM, KNN</p>
                            </section>

                            <section class="skill-group" data-skill-text="generative ai llm applications retrieval-augmented generation rag vector databases openrouter api llm guardrails multimodal ai integration">
                                <h3>[07] Generative AI &amp; LLM Applications</h3>
                                <p>Retrieval-Augmented Generation (RAG), Vector Databases, OpenRouter API, LLM Guardrails, Multimodal AI Integration</p>
                            </section>
                        </div>

                        <div class="empty-state" id="skill-empty" hidden>
                            <p id="skill-empty-msg">No skill category matches that search term.</p>
                            <button type="button" class="btn btn-small" id="skill-reset">Show all 7 categories</button>
                        </div>
                    </div>
                </div>
                <footer class="statusbar">
                    <span id="skill-status">7 skill categories loaded</span>
                    <span>UTF-8</span>
                </footer>
            </article>
        </section>`;
    },

    init() {
        const skillSearch = document.getElementById('skill-search');
        const skillClear = document.getElementById('skill-clear');
        const skillReset = document.getElementById('skill-reset');
        const skillGroups = [...document.querySelectorAll('.skill-group')];
        const skillEmpty = document.getElementById('skill-empty');
        const skillEmptyMsg = document.getElementById('skill-empty-msg');
        const skillStatus = document.getElementById('skill-status');

        function filterSkills() {
            const raw = (skillSearch?.value || '').trim();
            const q = raw.toLowerCase();
            if (skillClear) skillClear.hidden = !raw;
            let shown = 0;

            skillGroups.forEach((grp) => {
                const hay = `${grp.dataset.skillText || ''} ${grp.textContent}`.toLowerCase();
                const ok = !q || hay.includes(q);
                grp.hidden = !ok;
                if (ok) shown++;
            });

            if (skillEmpty) {
                skillEmpty.hidden = shown > 0;
                if (shown === 0 && skillEmptyMsg) {
                    skillEmptyMsg.textContent = `No skill category matches "${raw}". Clear the search to view all ${skillGroups.length} categories.`;
                }
            }
            if (skillStatus) {
                skillStatus.textContent = q
                    ? `Showing ${shown} of ${skillGroups.length} skill categories`
                    : `${skillGroups.length} skill categories loaded`;
            }
        }

        const resetSkills = () => {
            if (skillSearch) skillSearch.value = '';
            filterSkills();
            skillSearch?.focus();
        };
        skillSearch?.addEventListener('input', filterSkills);
        skillClear?.addEventListener('click', resetSkills);
        skillReset?.addEventListener('click', resetSkills);
    },
};
