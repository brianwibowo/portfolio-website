// Projects window: featured case studies, studio archive table, live tech filter, and empty state.
export const projectsApp = {
    id: 'projects',
    label: 'Projects',
    startLabel: 'Projects (60+ Shipped)',
    taskLabel: 'Projects',
    icon: `
        <svg viewBox="0 0 48 48" aria-hidden="true">
            <path d="M4 12a2 2 0 0 1 2-2h12l4 4h20a2 2 0 0 1 2 2v4H4z" fill="#e0a92e" stroke="#9a6d10" stroke-width="2" stroke-linejoin="round"/>
            <path d="M4 18h40v20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" fill="#f6c94c" stroke="#9a6d10" stroke-width="2" stroke-linejoin="round"/>
            <path d="M6 20.5h36" stroke="#fde59a" stroke-width="2"/>
        </svg>`,

    render() {
        return `
        <section id="projects" class="section" hidden>
            <article class="window window-projects" role="dialog" aria-labelledby="projects-title">
                <header class="titlebar">
                    <span class="titlebar-icon icon-folder" aria-hidden="true"></span>
                    <h2 class="titlebar-text" id="projects-title">Projects: Key Systems &amp; Case Studies</h2>
                    <div class="titlebar-buttons">
                        <button type="button" class="tb-btn tb-min" data-win="minimize" aria-label="Minimize"></button><button type="button" class="tb-btn tb-max" data-win="maximize" aria-label="Maximize"></button><button type="button" class="tb-btn tb-close" data-win="close" aria-label="Close"></button>
                    </div>
                </header>
                <div class="proj-toolbar">
                    <div class="proj-filters" role="group" aria-label="Filter projects by technology">
                        <button type="button" class="filter-chip" data-proj-filter="all" aria-pressed="true">All (9)</button>
                        <button type="button" class="filter-chip" data-proj-filter="laravel" aria-pressed="false">Laravel &amp; PHP</button>
                        <button type="button" class="filter-chip" data-proj-filter="nextjs" aria-pressed="false">Next.js &amp; Web</button>
                        <button type="button" class="filter-chip" data-proj-filter="cloud" aria-pressed="false">Go &amp; Cloud</button>
                        <button type="button" class="filter-chip" data-proj-filter="ai" aria-pressed="false">AI &amp; Desktop</button>
                    </div>
                    <label class="proj-search-label">
                        <span class="visually-hidden">Search projects</span>
                        <input type="search" id="proj-search" placeholder="Search project, client, or stack..." autocomplete="off">
                    </label>
                </div>
                <div class="window-body projects-body">
                    <div class="project-grid" id="project-key-grid">
                        <article class="project-card project-featured" data-stack="laravel cloud" data-search="sip-hapus polda samsat bapenda jasa raharja wajib pajak semarang laravel mysql docker rbac vehicle registration">
                            <div class="project-top">
                                <div>
                                    <h3>SIP-Hapus: Interagency Vehicle Registration Deletion</h3>
                                    <p class="project-client">Polda, Samsat, Bapenda, Jasa Raharja &amp; Wajib Pajak · Semarang, Central Java</p>
                                </div>
                                <span class="project-badge">30% faster processing</span>
                            </div>
                            <p>Digitized interagency vehicle registration deletion with online submission, multi-agency document management, and live status tracking. Reduced manual processing time by 30% while enforcing verification rules through role-based access control (RBAC) and province-level data segregation.</p>
                            <ul class="tags" aria-label="SIP-Hapus tech stack">
                                <li>Laravel</li>
                                <li>MySQL</li>
                                <li>Docker</li>
                                <li>RBAC</li>
                                <li>Province Data Segregation</li>
                            </ul>
                        </article>

                        <article class="project-card" data-stack="nextjs" data-search="pt citra agung busana career recruitment management platform north jakarta next.js postgresql supabase applicant tracking">
                            <div class="project-top">
                                <h3>Career &amp; Recruitment Platform</h3>
                                <span class="project-badge muted">Enterprise HR</span>
                            </div>
                            <p class="project-client">PT Citra Agung Busana · North Jakarta</p>
                            <p>Centralized end-to-end recruitment administration so HR teams manage openings and selection stages in one place while candidates browse roles, submit applications, and track progress.</p>
                            <ul class="tags" aria-label="Recruitment platform tech stack">
                                <li>Next.js</li>
                                <li>PostgreSQL</li>
                                <li>Supabase</li>
                            </ul>
                        </article>

                        <article class="project-card" data-stack="nextjs cloud" data-search="gymnastics learning system semarang next.js mysql go golang concurrent learning">
                            <div class="project-top">
                                <h3>Gymnastics Learning System</h3>
                                <span class="project-badge muted">50-100 concurrent</span>
                            </div>
                            <p class="project-client">Academic Digital Learning · Semarang, Central Java</p>
                            <p>Built a web-based gymnastics learning platform serving 50 to 100 concurrent active students, pairing a Next.js frontend with a low-overhead Go backend to keep response times steady under simultaneous classroom load.</p>
                            <ul class="tags" aria-label="Gymnastics Learning System tech stack">
                                <li>Go (Golang)</li>
                                <li>Next.js</li>
                                <li>MySQL</li>
                            </ul>
                        </article>
                    </div>

                    <div class="shipped-archive" id="shipped-archive">
                        <h3 class="archive-heading">Selected Studio &amp; Cloud Systems</h3>
                        <div class="archive-table-wrap">
                            <table class="archive-table">
                                <thead>
                                    <tr>
                                        <th scope="col">System</th>
                                        <th scope="col">Organization / Sector</th>
                                        <th scope="col">What Shipped</th>
                                        <th scope="col">Stack</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr data-stack="ai cloud" data-search="farmer app pt indonesian cloud saas agricultural multimodal rag vector database openrouter">
                                        <th scope="row">Farmer App</th>
                                        <td>PT Indonesian Cloud</td>
                                        <td>Agricultural land SaaS with text, image, and audio AI assistant grounded via RAG and vector search</td>
                                        <td>RAG, Vector DB, OpenRouter</td>
                                    </tr>
                                    <tr data-stack="ai cloud" data-search="salep pt indonesian cloud sales intelligence spse procurement scraping llm guardrails">
                                        <th scope="row">SALEP</th>
                                        <td>PT Indonesian Cloud</td>
                                        <td>Sales intelligence pipeline combining SPSE procurement scraping, LLM social analysis, and confidence-scored leads</td>
                                        <td>SPSE Scraper, LLM Guardrails</td>
                                    </tr>
                                    <tr data-stack="cloud nextjs" data-search="openstack customer portal pt indonesian cloud vm server management">
                                        <th scope="row">OpenStack Portal</th>
                                        <td>PT Indonesian Cloud</td>
                                        <td>Customer-facing cloud portal customized from OpenStack for virtual machine and server provisioning</td>
                                        <td>OpenStack, Web Portal</td>
                                    </tr>
                                    <tr data-stack="laravel ai" data-search="mindfit vuriko studio health assessment bmr tdee bmi n8n llm laravel">
                                        <th scope="row">MindFit</th>
                                        <td>Vuriko Studio</td>
                                        <td>Health diagnostic web app computing BMR, TDEE, and BMI with LLM nutrition and fitness guidance via n8n</td>
                                        <td>Laravel, n8n, LLM API</td>
                                    </tr>
                                    <tr data-stack="nextjs" data-search="si-mliwis pantai mliwis vuriko studio correspondence archiving revenue analytics next.js supabase">
                                        <th scope="row">SI-Mliwis</th>
                                        <td>Pantai Mliwis Operations</td>
                                        <td>Correspondence workflow, digital document archive, revenue reporting, and operational analytics</td>
                                        <td>Next.js, Supabase</td>
                                    </tr>
                                    <tr data-stack="laravel" data-search="funbumi iot recycling unj jakarta bapak pucung studio waste deposit rewards laravel">
                                        <th scope="row">Funbumi IoT Web</th>
                                        <td>UNJ Jakarta Deployment</td>
                                        <td>4-category waste sorting deposit workflow, resident tracking, and reward redemption integrated with IoT bins</td>
                                        <td>Laravel, REST API, IoT</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="empty-state" id="proj-empty" hidden>
                        <p id="proj-empty-msg">No projects match your current filter.</p>
                        <button type="button" class="btn btn-small" id="proj-reset">Show all 9 systems</button>
                    </div>
                </div>
                <footer class="statusbar">
                    <span id="proj-status">Showing 9 of 9 featured &amp; studio systems (60+ total delivered)</span>
                    <span>C:\\Projects</span>
                </footer>
            </article>
        </section>`;
    },

    init() {
        const projChips = [...document.querySelectorAll('[data-proj-filter]')];
        const projSearch = document.getElementById('proj-search');
        const projCards = [...document.querySelectorAll('#project-key-grid .project-card')];
        const projRows = [...document.querySelectorAll('#shipped-archive tbody tr')];
        const projGrid = document.getElementById('project-key-grid');
        const projArchive = document.getElementById('shipped-archive');
        const projEmpty = document.getElementById('proj-empty');
        const projEmptyMsg = document.getElementById('proj-empty-msg');
        const projReset = document.getElementById('proj-reset');
        const projStatus = document.getElementById('proj-status');
        let activeStack = 'all';

        function filterProjects() {
            const q = (projSearch?.value || '').trim().toLowerCase();
            const total = projCards.length + projRows.length;
            let visibleCards = 0;
            let visibleRows = 0;

            const matches = (el) => {
                const stacks = (el.dataset.stack || '').split(/\s+/);
                const hay = `${el.dataset.search || ''} ${el.textContent}`.toLowerCase();
                return (activeStack === 'all' || stacks.includes(activeStack)) && (!q || hay.includes(q));
            };

            projCards.forEach((card) => {
                const ok = matches(card);
                card.hidden = !ok;
                if (ok) visibleCards++;
            });
            projRows.forEach((row) => {
                const ok = matches(row);
                row.hidden = !ok;
                if (ok) visibleRows++;
            });

            const shown = visibleCards + visibleRows;
            if (projGrid) projGrid.hidden = visibleCards === 0;
            if (projArchive) projArchive.hidden = visibleRows === 0;
            if (projEmpty) {
                projEmpty.hidden = shown > 0;
                if (shown === 0 && projEmptyMsg) {
                    projEmptyMsg.textContent = q
                        ? `No shipped systems match "${projSearch.value.trim()}". Reset the filter to browse all ${total} systems.`
                        : 'No systems match the selected category.';
                }
            }
            if (projStatus) {
                projStatus.textContent = `Showing ${shown} of ${total} featured & studio systems (60+ total delivered)`;
            }
        }

        projChips.forEach((chip) => {
            chip.addEventListener('click', () => {
                activeStack = chip.dataset.projFilter || 'all';
                projChips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
                filterProjects();
            });
        });
        projSearch?.addEventListener('input', filterProjects);
        projReset?.addEventListener('click', () => {
            activeStack = 'all';
            if (projSearch) projSearch.value = '';
            projChips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.projFilter === 'all')));
            filterProjects();
            projSearch?.focus();
        });
    },
};
