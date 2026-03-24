/**
 * Scroll Animations - sudestchape
 * IntersectionObserver pour animations fade-in / slide-up au scroll.
 * Respecte prefers-reduced-motion.
 */

export function init() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            el.classList.add('animate-on-scroll--visible');
        });
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-on-scroll--visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px',
        }
    );

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });

    // Announcement bar rotation
    const bar = document.querySelector('.announcement-bar');
    if (bar) {
        const messages = bar.querySelectorAll('.announcement-bar__message');
        if (messages.length > 1) {
            let current = 0;
            setInterval(() => {
                messages[current].classList.remove('announcement-bar__message--active');
                current = (current + 1) % messages.length;
                messages[current].classList.add('announcement-bar__message--active');
            }, 5000);
        }
    }
}
