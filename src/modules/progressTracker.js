class ProgressTracker {
    constructor() {
        this.storageKey = 'aloittelijan-opas-progress';
        this.sectionsKey = 'aloittelijan-opas-sections';
        this.init();
    }

    init() {
        this.loadProgress();
        this.updateUI();
        this.setupEventListeners();
    }

    // Get all available sections by scanning the sections directory
    getAllSections() {
        // This will be called from the main page to register sections
        const savedSections = localStorage.getItem(this.sectionsKey);
        if (savedSections) {
            return JSON.parse(savedSections);
        }
        return [];
    }

    // Register available sections (called from main page)
    registerSections(sections) {
        localStorage.setItem(this.sectionsKey, JSON.stringify(sections));
    }

    // Load progress from localStorage
    loadProgress() {
        const saved = localStorage.getItem(this.storageKey);
        this.progress = saved ? JSON.parse(saved) : {};
    }

    // Save progress to localStorage
    saveProgress() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.progress));
    }

    // Mark a section as completed
    markSectionCompleted(sectionId, completed = true) {
        const wasCompleted = this.progress[sectionId] === true;
        this.progress[sectionId] = completed;
        this.saveProgress();

        // Check if this completion triggers the badge
        if (completed && !wasCompleted) {
            // Small delay to ensure UI updates before checking completion
            setTimeout(() => {
                this.updateUI();
            }, 100);
        } else {
            this.updateUI();
        }
    }

    // Check if a section is completed
    isSectionCompleted(sectionId) {
        return this.progress[sectionId] === true;
    }

    // Get completion percentage
    getCompletionPercentage() {
        const sections = this.getAllSections();
        if (sections.length === 0) return 0;

        const completedSections = sections.filter(section => this.isSectionCompleted(section.id));
        return Math.round((completedSections.length / sections.length) * 100);
    }

    // Get completed sections count
    getCompletedCount() {
        const sections = this.getAllSections();
        return sections.filter(section => this.isSectionCompleted(section.id)).length;
    }

    // Get total sections count
    getTotalCount() {
        return this.getAllSections().length;
    }

    // Update UI elements
    updateUI() {
        this.updateProgressBar();
        this.updateStartButton();
        this.updateCheckboxes();
        this.checkForCompletion();
    }

    // Update progress bar
    updateProgressBar() {
        const progressBar = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        const progressStats = document.querySelector('.progress-stats');

        if (progressBar && progressText && progressStats) {
            const percentage = this.getCompletionPercentage();
            const completed = this.getCompletedCount();
            const total = this.getTotalCount();

            progressBar.style.width = `${percentage}%`;
            progressText.textContent = `${percentage}%`;
            progressStats.textContent = `${completed} of ${total} sections completed`;
        }
    }

    // Update start/continue button
    updateStartButton() {
        const button = document.querySelector('.start-learning-btn');
        if (button) {
            const completed = this.getCompletedCount();
            const total = this.getTotalCount();

            if (completed === 0) {
                button.innerHTML = '<span>Start Learning</span>';
            } else if (completed === total) {
                button.innerHTML = '<span>Review Guide</span>';
            } else {
                button.innerHTML = '<span>Continue Learning</span>';
            }
        }
    }

    // Update checkboxes on section pages
    updateCheckboxes() {
        const checkbox = document.querySelector('.section-completion-checkbox');
        if (checkbox) {
            const sectionId = this.getCurrentSectionId();
            if (sectionId) {
                checkbox.checked = this.isSectionCompleted(sectionId);
            }
        }
    }

    // Get current section ID from URL
    getCurrentSectionId() {
        const path = window.location.pathname;
        const match = path.match(/section(\d+)/);
        return match ? match[0] : null;
    }

    // Setup event listeners
    setupEventListeners() {
        // Listen for checkbox changes on section pages
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('section-completion-checkbox')) {
                const sectionId = this.getCurrentSectionId();
                if (sectionId) {
                    this.markSectionCompleted(sectionId, e.target.checked);
                }
            }
        });
    }

    // Get next uncompleted section
    getNextSection() {
        const sections = this.getAllSections();
        for (const section of sections) {
            if (!this.isSectionCompleted(section.id)) {
                return section;
            }
        }
        return sections[0]; // If all completed, return first section
    }

    // Navigate to next uncompleted section or first section
    navigateToNextSection() {
        const nextSection = this.getNextSection();
        if (nextSection) {
            window.location.href = `./${nextSection.id}/`;
        }
    }

    // Reset completion badge tracking (for testing)
    resetCompletionBadge() {
        localStorage.removeItem('completion-badge-shown');
        console.log('Completion badge tracking reset. Badge will show again when all sections are completed.');
    }

    // Force show completion badge (for testing)
    forceShowCompletionBadge() {
        this.showCompletionBadge();
    }

    // Check if all sections are completed and show badge
    checkForCompletion() {
        const completed = this.getCompletedCount();
        const total = this.getTotalCount();

        // Only show popup if we just completed all sections
        if (completed === total && total > 0) {
            const hasShownBadge = localStorage.getItem('completion-badge-shown');
            const currentCompletionState = `${completed}-${total}`;

            // Show badge if we haven't shown it for this completion state
            if (hasShownBadge !== currentCompletionState) {
                this.showCompletionBadge();
                localStorage.setItem('completion-badge-shown', currentCompletionState);
            }
        }
    }

    // Show completion badge popup
    showCompletionBadge() {
        // Create popup HTML
        const popupHTML = `
            <div class="completion-badge-popup" id="completion-popup">
                <div class="completion-badge-content">
                    <button class="close-btn" onclick="window.progressTracker.hideCompletionBadge()">&times;</button>
                    
                    <div class="completion-badge-header">
                        <span class="completion-icon">🎉</span>
                        <h2 class="completion-title">Congratulations!</h2>
                        <p class="completion-subtitle">You've completed the Hacker Bible!</p>
                    </div>
                    
                    <div class="completion-message">
                        <p>Amazing work! You've successfully completed all ${this.getTotalCount()} sections of the Aloittelijan Opas (Hacker Bible).</p>
                        
                        <div class="completion-stats">
                            ✅ ${this.getCompletedCount()}/${this.getTotalCount()} Sections Completed<br>
                            📊 ${this.getCompletionPercentage()}% Progress
                        </div>
                        
                        <p>You now have the foundational knowledge to participate in H-T8 activities and continue your cybersecurity journey!</p>
                    </div>
                    
                    <div class="completion-actions">
                        <a href="https://discord.gg/HmGuxvauZQ" class="completion-btn primary">Join Our Community</a>
                        <a href="/hall of fame/" class="completion-btn secondary">View Hall of Fame</a>
                    </div>
                </div>
            </div>
        `;

        // Add popup to body
        document.body.insertAdjacentHTML('beforeend', popupHTML);

        // Show popup with animation
        setTimeout(() => {
            const popup = document.getElementById('completion-popup');
            if (popup) {
                popup.classList.add('show');
            }
        }, 100);

        // Add escape key listener
        this.escapeKeyListener = (e) => {
            if (e.key === 'Escape') {
                this.hideCompletionBadge();
            }
        };
        document.addEventListener('keydown', this.escapeKeyListener);
    }

    // Hide completion badge popup
    hideCompletionBadge() {
        const popup = document.getElementById('completion-popup');
        if (popup) {
            popup.classList.remove('show');
            setTimeout(() => {
                popup.remove();
                // Remove escape key listener
                if (this.escapeKeyListener) {
                    document.removeEventListener('keydown', this.escapeKeyListener);
                    this.escapeKeyListener = null;
                }
            }, 300);
        }
    }
}

// Create global instance
window.progressTracker = new ProgressTracker();

export default ProgressTracker;
