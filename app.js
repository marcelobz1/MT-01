// Professional Investor Presentation JavaScript

class PresentationController {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 10;
        this.slides = document.querySelectorAll('.slide');
        this.indicators = document.getElementById('slideIndicators');
        this.progressFill = document.getElementById('progressFill');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        
        this.init();
    }

    init() {
        this.createIndicators();
        this.updateUI();
        this.bindEvents();
        this.startAutoplay();
    }

    createIndicators() {
        this.indicators.innerHTML = '';
        for (let i = 0; i < this.totalSlides; i++) {
            const indicator = document.createElement('div');
            indicator.className = 'slide-indicator';
            indicator.setAttribute('data-slide', i);
            // Use arrow function to preserve 'this' context
            indicator.addEventListener('click', (e) => {
                e.preventDefault();
                this.goToSlide(i);
            });
            this.indicators.appendChild(indicator);
        }
    }

    updateUI() {
        // Update slides
        this.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentSlide);
        });

        // Update indicators
        const indicators = this.indicators.querySelectorAll('.slide-indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });

        // Update progress bar
        const progress = ((this.currentSlide + 1) / this.totalSlides) * 100;
        this.progressFill.style.width = `${progress}%`;

        // Update navigation buttons
        this.prevBtn.disabled = this.currentSlide === 0;
        this.nextBtn.disabled = this.currentSlide === this.totalSlides - 1;

        // Update navigation button text for better UX
        if (this.currentSlide === this.totalSlides - 1) {
            this.nextBtn.innerHTML = '✓';
            this.nextBtn.title = 'Apresentação concluída';
        } else {
            this.nextBtn.innerHTML = '›';
            this.nextBtn.title = 'Próximo slide';
        }
    }

    goToSlide(slideIndex) {
        if (slideIndex >= 0 && slideIndex < this.totalSlides) {
            this.currentSlide = slideIndex;
            this.updateUI();
            this.addSlideTransition();
            this.trackSlideView(slideIndex);
        }
    }

    nextSlide() {
        if (this.currentSlide < this.totalSlides - 1) {
            this.currentSlide++;
            this.updateUI();
            this.addSlideTransition();
            this.trackSlideView(this.currentSlide);
        }
    }

    prevSlide() {
        if (this.currentSlide > 0) {
            this.currentSlide--;
            this.updateUI();
            this.addSlideTransition();
            this.trackSlideView(this.currentSlide);
        }
    }

    addSlideTransition() {
        // Add a subtle animation effect
        const currentSlideElement = this.slides[this.currentSlide];
        currentSlideElement.style.transform = 'scale(0.95)';
        setTimeout(() => {
            currentSlideElement.style.transform = 'scale(1)';
        }, 100);
    }

    bindEvents() {
        // Navigation buttons
        this.prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.prevSlide();
        });
        
        this.nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.nextSlide();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    this.prevSlide();
                    break;
                case 'ArrowRight':
                case 'ArrowDown':
                case ' ':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToSlide(0);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToSlide(this.totalSlides - 1);
                    break;
                case 'Escape':
                    e.preventDefault();
                    this.toggleFullscreen();
                    break;
            }
        });

        // Touch/swipe support for mobile
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;

        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            this.handleSwipe(startX, startY, endX, endY);
        });

        // Mouse wheel support
        document.addEventListener('wheel', (e) => {
            e.preventDefault();
            if (e.deltaY > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }, { passive: false });

        // Window resize handler
        window.addEventListener('resize', () => {
            this.updateUI();
        });

        // Contact CTA button - wait for DOM to be ready
        setTimeout(() => {
            const ctaButton = document.querySelector('.contact-cta .btn');
            if (ctaButton) {
                ctaButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.showContactModal();
                });
            }
        }, 100);
    }

    handleSwipe(startX, startY, endX, endY) {
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const minSwipeDistance = 50;

        // Only handle horizontal swipes
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) {
                this.prevSlide();
            } else {
                this.nextSlide();
            }
        }
    }

    startAutoplay() {
        // Optional: Add autoplay functionality for demo purposes
        // Uncomment the following lines to enable autoplay
        /*
        this.autoplayInterval = setInterval(() => {
            if (this.currentSlide < this.totalSlides - 1) {
                this.nextSlide();
            } else {
                this.goToSlide(0);
            }
        }, 15000); // 15 seconds per slide
        */
    }

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
        }
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Error attempting to enable fullscreen:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }

    showContactModal() {
        // Remove any existing modal first
        const existingModal = document.querySelector('.contact-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Create a simple modal for contact information
        const modal = document.createElement('div');
        modal.className = 'contact-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Contacto para Investimento</h3>
                    <button class="modal-close" type="button">×</button>
                </div>
                <div class="modal-body">
                    <p>Obrigado pelo seu interesse na oportunidade de investimento no mercado europeu de carrinhas de carga.</p>
                    <div class="contact-info">
                        <div class="contact-item">
                            <strong>Email:</strong> investimentos@exemplo.com
                        </div>
                        <div class="contact-item">
                            <strong>Telefone:</strong> +351 xxx xxx xxx
                        </div>
                        <div class="contact-item">
                            <strong>LinkedIn:</strong> linkedin.com/in/exemplo
                        </div>
                    </div>
                    <p>Vamos agendar uma reunião para discutir os detalhes desta oportunidade de investimento.</p>
                </div>
                <div class="modal-footer">
                    <button class="btn btn--primary modal-close-btn" type="button">Fechar</button>
                </div>
            </div>
        `;

        // Add modal styles
        const modalStyles = document.createElement('style');
        modalStyles.id = 'modal-styles';
        modalStyles.textContent = `
            .contact-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                backdrop-filter: blur(5px);
            }
            .modal-content {
                background: var(--color-surface);
                border-radius: var(--radius-lg);
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: var(--shadow-lg);
                border: 1px solid var(--color-card-border);
            }
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: var(--space-20) var(--space-24);
                border-bottom: 1px solid var(--color-card-border-inner);
            }
            .modal-header h3 {
                color: var(--color-primary);
                margin: 0;
            }
            .modal-close {
                background: none;
                border: none;
                font-size: var(--font-size-xl);
                cursor: pointer;
                color: var(--color-text-secondary);
                padding: var(--space-4);
                border-radius: var(--radius-sm);
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .modal-close:hover {
                background: var(--color-secondary);
            }
            .modal-body {
                padding: var(--space-24);
            }
            .contact-info {
                background: var(--color-secondary);
                padding: var(--space-16);
                border-radius: var(--radius-base);
                margin: var(--space-16) 0;
            }
            .contact-item {
                margin-bottom: var(--space-8);
                font-size: var(--font-size-md);
            }
            .contact-item:last-child {
                margin-bottom: 0;
            }
            .modal-footer {
                padding: var(--space-20) var(--space-24);
                border-top: 1px solid var(--color-card-border-inner);
                text-align: right;
            }
        `;

        // Remove existing styles and add new ones
        const existingStyles = document.getElementById('modal-styles');
        if (existingStyles) {
            existingStyles.remove();
        }
        document.head.appendChild(modalStyles);
        document.body.appendChild(modal);

        // Bind close events
        const closeModal = () => {
            modal.remove();
            modalStyles.remove();
        };

        // Close button events
        const closeBtn = modal.querySelector('.modal-close');
        const closeBtnFooter = modal.querySelector('.modal-close-btn');
        
        closeBtn.addEventListener('click', closeModal);
        closeBtnFooter.addEventListener('click', closeModal);

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Close modal with Escape key
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }

    trackSlideView(slideIndex) {
        // This function can be used to track slide views for analytics
        console.log(`Slide ${slideIndex + 1} viewed`);
        
        if (slideIndex === this.totalSlides - 1) {
            console.log('Presentation completed');
        }
    }

    // Public methods for external control
    getCurrentSlide() {
        return this.currentSlide;
    }

    getTotalSlides() {
        return this.totalSlides;
    }

    isFirstSlide() {
        return this.currentSlide === 0;
    }

    isLastSlide() {
        return this.currentSlide === this.totalSlides - 1;
    }
}

// Global functions for backward compatibility
function changeSlide(direction) {
    if (window.presentation) {
        if (direction > 0) {
            window.presentation.nextSlide();
        } else {
            window.presentation.prevSlide();
        }
    }
}

function goToSlide(slideIndex) {
    if (window.presentation) {
        window.presentation.goToSlide(slideIndex);
    }
}

// Initialize presentation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add some smooth loading animation
    document.body.style.opacity = '0';
    
    // Initialize presentation
    window.presentation = new PresentationController();
    
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    // Add presentation loaded event
    window.dispatchEvent(new CustomEvent('presentationLoaded', {
        detail: { presentation: window.presentation }
    }));
});

// Handle page visibility changes (pause/resume autoplay)
document.addEventListener('visibilitychange', () => {
    if (window.presentation) {
        if (document.hidden) {
            window.presentation.stopAutoplay();
        } else {
            window.presentation.startAutoplay();
        }
    }
});

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PresentationController;
}