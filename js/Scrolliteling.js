document.addEventListener("DOMContentLoaded", () => {
    // Function to animate elements when they scroll into view
    const animateOnScroll = (elements, animationClass) => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(animationClass);
                    // Trigger animation only once
                    observer.unobserve(entry.target);
                }
            });
            // Animation starts when 50% of the element is visible
        }, { threshold: 0.5 });

        elements.forEach((element) => observer.observe(element));
    };

    // Animations
    // Timeline items
    animateOnScroll(document.querySelectorAll(".timeline-item"), "fade-in");
    // Quiz section
    animateOnScroll(document.querySelectorAll(".quiz-placeholder"), "slide-in");
    // Last section
    animateOnScroll(document.querySelectorAll(".visual-placeholder.large"), "scale-up");
});
