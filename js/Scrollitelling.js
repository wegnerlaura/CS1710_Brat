// This currently does not really work. It used to work, but once I implemented the quiz, it did not anymore. I tried debugging, but that didn't work,
// so I would love your advice on what is not working for the scrollitelling animations.

// No Scrollitelling updates because I was working on the table of contents and my two visualizations.

//document.addEventListener('DOMContentLoaded', function() {
 //   AOS.init({
   //     duration: 1000,
     //   easing: 'ease-in-out',
       // once: false,
        //mirror: false
    //});
//});



//AOS.init();

/*
document.addEventListener("DOMContentLoaded", () => {
    const animateOnScroll = (elements, animationClass) => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(animationClass);
                    // Trigger animation only once
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        elements.forEach((element) => observer.observe(element));
    };

    // Animate elements
    animateOnScroll(document.querySelectorAll(".animated-title"), "fade-in");
    animateOnScroll(document.querySelectorAll(".animated-paragraph"), "fade-in");
    animateOnScroll(document.querySelectorAll(".timeline-item"), "fade-in");
    animateOnScroll(document.querySelectorAll(".quiz-placeholder"), "slide-in");
    animateOnScroll(document.querySelectorAll(".visual-placeholder.large"), "scale-up");
});

*/