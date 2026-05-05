document.addEventListener('DOMContentLoaded', function() {
    const config = {
        images: [
            'media/slider1.jpg',
            'media/slider2.jpg',
            'media/slider3.jpg',
            'media/slider4.jpg',
        ],
        transitionDuration: 500,
        autoplay: true,
        autoplayInterval: 3000,
        showArrows: true,
        showDots: true
    };

    const slider = document.querySelector('.slider');
    const slidesContainer = document.querySelector('.slides');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const dotsContainer = document.querySelector('.dots');

    let currentSlide = 0;
    let autoplayTimer;
    let isAnimating = false;

    function initSlider() {
        config.images.forEach((img, index) => {
            const slide = document.createElement('div');
            slide.className = 'slide';
            slide.innerHTML = `<img src="${img}" alt="Слайд ${index + 1}">`;
            slidesContainer.appendChild(slide);
        });

        if (config.showDots) {
            config.images.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.className = 'dot';
                dot.dataset.slide = index;
                dotsContainer.appendChild(dot);
            });
            updateDots();
        } else {
            dotsContainer.style.display = 'none';
        }

        if (!config.showArrows) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        }

        if (config.autoplay) {
            startAutoplay();
        }

        addEventListeners();
    }

    function goToSlide(index, animate = true) {
        if (isAnimating || index === currentSlide) return;

        isAnimating = true;
        currentSlide = index;

        if (animate) {
            slidesContainer.style.transition = `transform ${config.transitionDuration}ms ease`;
        } else {
            slidesContainer.style.transition = 'none';
        }

        slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;

        setTimeout(() => {
            isAnimating = false;
        }, config.transitionDuration);

        updateDots();
    }

    function updateDots() {
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function startAutoplay() {
        autoplayTimer = setInterval(() => {
            nextSlide();
        }, config.autoplayInterval);
    }

    function stopAutoplay() {
        clearInterval(autoplayTimer);
    }

    function nextSlide() {
        const next = (currentSlide + 1) % config.images.length;
        goToSlide(next);
    }

    function prevSlide() {
        const prev = (currentSlide - 1 + config.images.length) % config.images.length;
        goToSlide(prev);
    }

    function addEventListeners() {
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') nextSlide();
            if (e.key === 'ArrowLeft') prevSlide();
        });

        dotsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('dot')) {
                const slideIndex = parseInt(e.target.dataset.slide);
                goToSlide(slideIndex);
            }
        });

        slider.addEventListener('mouseenter', stopAutoplay);
        slider.addEventListener('mouseleave', () => {
            if (config.autoplay) startAutoplay();
        });
    }

    initSlider();
});