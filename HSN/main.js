function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.15,
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll(".fade-in");
    fadeElements.forEach((el) => observer.observe(el));
}

function initCarousel() {
    const track = document.querySelector(".carousel-track");
    const slideElements = document.querySelectorAll(".carousel-slide");
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");

    if (!track || slideElements.length === 0) return;

    let slides = Array.from(slideElements);
    let autoInterval = null;
    let isDesktop = window.innerWidth > 900;
    let isAnimating = false;
    let currentMobileSlide = 0;

    function moveNext() {
        if (isAnimating || !isDesktop) return;
        isAnimating = true;

        const currentSlides = track.querySelectorAll(".carousel-slide");
        currentSlides.forEach((s) => {
            s.style.transition = "transform 0.5s ease-in-out";
            s.style.transform = "translateX(-100%)";
        });

        setTimeout(() => {
            track.appendChild(currentSlides[0]);
            const newSlides = track.querySelectorAll(".carousel-slide");
            newSlides.forEach((s) => {
                s.style.transition = "none";
                s.style.transform = "translateX(0)";
            });
            isAnimating = false;
        }, 500);
    }

    function movePrev() {
        if (isAnimating || !isDesktop) return;
        isAnimating = true;

        const currentSlides = track.querySelectorAll(".carousel-slide");
        const lastSlide = currentSlides[currentSlides.length - 1];

        track.insertBefore(lastSlide, currentSlides[0]);

        const newSlides = track.querySelectorAll(".carousel-slide");
        newSlides.forEach((s) => {
            s.style.transition = "none";
            s.style.transform = "translateX(-100%)";
        });

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                newSlides.forEach((s) => {
                    s.style.transition = "transform 0.5s ease-in-out";
                    s.style.transform = "translateX(0)";
                });
            });
        });

        setTimeout(() => {
            isAnimating = false;
        }, 500);
    }

    function nextMobile() {
        if (isDesktop) return;
        slides[currentMobileSlide].classList.remove("active");
        currentMobileSlide = (currentMobileSlide + 1) % slides.length;
        slides[currentMobileSlide].classList.add("active");
    }

    function setup() {
        isDesktop = window.innerWidth > 900;

        clearInterval(autoInterval);

        slides.forEach((s, i) => {
            s.style.transition = isDesktop ? "none" : "opacity 1.2s ease-in-out";
            s.style.transform = isDesktop ? "translateX(0)" : "none";
            s.style.opacity = "";

            if (!isDesktop) {
                if (i === currentMobileSlide) s.classList.add("active");
                else s.classList.remove("active");
            } else {
                s.classList.remove("active");
            }
        });

        if (!isDesktop) {
            autoInterval = setInterval(nextMobile, 4000);
        }
    }

    if (nextBtn) nextBtn.addEventListener("click", moveNext);
    if (prevBtn) prevBtn.addEventListener("click", movePrev);

    window.addEventListener("resize", () => {
        clearTimeout(window.resizeTimer);
        window.resizeTimer = setTimeout(setup, 150);
    });

    setup();
}

function initGradientBackground() {
    const canvas = document.getElementById("bg-gradient-canvas");
    if (!canvas || typeof window.Gradient === "undefined") return;

    const gradient = new window.Gradient();
    gradient.t = Math.random() * 100000;
    gradient.seed = Math.random() * 100;
    gradient.isStatic = true;
    gradient.initGradient("#bg-gradient-canvas");
}

document.addEventListener("DOMContentLoaded", () => {
    initScrollAnimations();
    initCarousel();
    initGradientBackground();
});