/**
 * Realisations Feed - Slider horizontal navigation
 * Gère la navigation au clavier et par boutons pour le feed des réalisations
 */

class RealisationsFeed {
    constructor(element) {
        this.container = element;
        this.track = element.querySelector('.realisations-feed__track');
        this.items = element.querySelectorAll('.realisations-feed__item');
        this.prevBtn = element.querySelector('.realisations-feed__nav--prev');
        this.nextBtn = element.querySelector('.realisations-feed__nav--next');

        if (!this.track || this.items.length === 0) return;

        this.scrollAmount = 0;
        this.init();
    }

    init() {
        // Calcul du scroll amount basé sur la largeur d'un item + gap
        this.calculateScrollAmount();

        // Event listeners
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.scroll('prev'));
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.scroll('next'));
        }

        // Mise à jour des boutons au scroll
        this.track.addEventListener('scroll', () => this.updateButtons());

        // Recalcul au resize
        window.addEventListener('resize', () => {
            this.calculateScrollAmount();
            this.updateButtons();
        });

        // État initial des boutons
        this.updateButtons();

        // Navigation clavier
        this.track.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    calculateScrollAmount() {
        if (this.items.length > 0) {
            const item = this.items[0];
            const style = window.getComputedStyle(this.track);
            const gap = parseInt(style.gap) || 12;
            this.scrollAmount = item.offsetWidth + gap;
        }
    }

    scroll(direction) {
        const scrollDistance = this.scrollAmount * 2; // Scroll de 2 items à la fois

        if (direction === 'prev') {
            this.track.scrollBy({ left: -scrollDistance, behavior: 'smooth' });
        } else {
            this.track.scrollBy({ left: scrollDistance, behavior: 'smooth' });
        }
    }

    updateButtons() {
        const scrollLeft = this.track.scrollLeft;
        const maxScroll = this.track.scrollWidth - this.track.clientWidth;

        if (this.prevBtn) {
            this.prevBtn.disabled = scrollLeft <= 0;
        }
        if (this.nextBtn) {
            this.nextBtn.disabled = scrollLeft >= maxScroll - 1;
        }
    }

    handleKeyboard(e) {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            this.scroll('prev');
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            this.scroll('next');
        }
    }
}

/**
 * Initialise tous les feeds de réalisations sur la page
 */
export function initRealisationsFeed() {
    const feeds = document.querySelectorAll('.realisations-feed');

    feeds.forEach(feed => {
        new RealisationsFeed(feed);
    });
}

export default RealisationsFeed;
