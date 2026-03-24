/**
 * Promo Carousel Module
 * Gère le défilement automatique des accroches promotionnelles
 */

export function initPromoCarousel() {
    const carousels = document.querySelectorAll('.promo-carousel');

    carousels.forEach(carousel => {
        new PromoCarousel(carousel);
    });
}

class PromoCarousel {
    constructor(element) {
        this.carousel = element;
        this.slides = element.querySelectorAll('.promo-carousel__slide');
        this.prevBtn = element.querySelector('.promo-carousel__nav--prev');
        this.nextBtn = element.querySelector('.promo-carousel__nav--next');

        // Configuration
        this.autoplay = element.dataset.autoplay === 'true';
        this.interval = parseInt(element.dataset.interval, 10) * 1000 || 4000;
        this.pauseOnHover = element.dataset.pauseOnHover === 'true';

        // État
        this.currentIndex = 0;
        this.totalSlides = this.slides.length;
        this.autoplayTimer = null;
        this.isPaused = false;
        this.isTransitioning = false;

        if (this.totalSlides <= 1) return;

        this.init();
    }

    init() {
        this.bindEvents();

        if (this.autoplay) {
            this.startAutoplay();
        }
    }

    bindEvents() {
        // Navigation arrows
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prev());
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.next());
        }

        // Pause on hover
        if (this.pauseOnHover) {
            this.carousel.addEventListener('mouseenter', () => this.pause());
            this.carousel.addEventListener('mouseleave', () => this.resume());
        }

        // Pause when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else if (!this.isPaused) {
                this.resume();
            }
        });

        // Touch/swipe support
        this.initTouchSupport();

        // Keyboard navigation
        this.carousel.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    initTouchSupport() {
        let touchStartX = 0;
        let touchEndX = 0;
        const minSwipeDistance = 50;

        this.carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            this.pause();
        }, { passive: true });

        this.carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const swipeDistance = touchEndX - touchStartX;

            if (Math.abs(swipeDistance) > minSwipeDistance) {
                if (swipeDistance > 0) {
                    this.prev();
                } else {
                    this.next();
                }
            }

            // Resume autoplay after swipe
            setTimeout(() => this.resume(), 1000);
        }, { passive: true });
    }

    handleKeyboard(e) {
        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.prev();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.next();
                break;
        }
    }

    prev() {
        const newIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
        this.goTo(newIndex);
    }

    next() {
        const newIndex = (this.currentIndex + 1) % this.totalSlides;
        this.goTo(newIndex);
    }

    goTo(index) {
        if (index === this.currentIndex || this.isTransitioning) return;

        this.isTransitioning = true;

        const currentSlide = this.slides[this.currentIndex];
        const nextSlide = this.slides[index];

        // Animate out current slide
        currentSlide.classList.add('is-leaving');

        setTimeout(() => {
            currentSlide.classList.remove('is-active', 'is-leaving');
            currentSlide.setAttribute('aria-hidden', 'true');

            // Animate in next slide
            nextSlide.classList.add('is-entering');

            requestAnimationFrame(() => {
                nextSlide.classList.add('is-active');
                nextSlide.classList.remove('is-entering');
                nextSlide.removeAttribute('aria-hidden');
            });

            this.currentIndex = index;
            this.isTransitioning = false;
        }, 300);

        // Reset autoplay timer
        if (this.autoplay && !this.isPaused) {
            this.resetAutoplay();
        }
    }

    startAutoplay() {
        if (this.autoplayTimer) return;

        this.autoplayTimer = setInterval(() => {
            if (!this.isPaused) {
                this.next();
            }
        }, this.interval);
    }

    stopAutoplay() {
        if (this.autoplayTimer) {
            clearInterval(this.autoplayTimer);
            this.autoplayTimer = null;
        }
    }

    resetAutoplay() {
        this.stopAutoplay();
        this.startAutoplay();
    }

    pause() {
        this.isPaused = true;
        this.carousel.classList.add('is-paused');
    }

    resume() {
        this.isPaused = false;
        this.carousel.classList.remove('is-paused');

        if (this.autoplay && !this.autoplayTimer) {
            this.startAutoplay();
        }
    }

    destroy() {
        this.stopAutoplay();
        // Remove event listeners if needed
    }
}

export default PromoCarousel;
