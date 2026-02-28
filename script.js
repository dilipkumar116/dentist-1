document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('is-active'); // Hamburger animation class
            navLinks.classList.toggle('active');
            const isExpanded = navLinks.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isExpanded);
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Close mobile menu if open
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    if (menuToggle) menuToggle.classList.remove('is-active');
                }

                // Account for sticky header offset
                const headerOffset = document.querySelector('.sticky-header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // WhatsApp Floating Button interaction
    const chatBubble = document.getElementById('whatsapp-btn');
    if (chatBubble) {

        const openWhatsApp = () => {
            const whatsappNumber = "918939126080";
            const message = "Hello Dr. Arul's Dental Care! I'm reaching out from your website and would like to chat.";
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
            window.open(whatsappUrl, '_blank');
        };

        chatBubble.addEventListener('click', openWhatsApp);

        // Accessibility for keyboard users
        chatBubble.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openWhatsApp();
            }
        });
    }

    // --- Scroll Animations (Intersection Observer) ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% visible
    };

    const animateOnScrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Determine animation delay if present
                const delay = entry.target.getAttribute('data-delay');
                let animateClass = 'visible';
                if (entry.target.classList.contains('wiggle-on-scroll')) animateClass = 'initial-wiggle';
                if (entry.target.classList.contains('single-wiggle-on-scroll')) animateClass = 'single-wiggle';

                if (delay) {
                    setTimeout(() => {
                        entry.target.classList.add(animateClass);
                    }, parseInt(delay));
                } else {
                    entry.target.classList.add(animateClass);
                }
                // Optional: Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Select all elements to animate
    const animateElements = document.querySelectorAll('.slide-up, .fade-in, .wiggle-on-scroll, .single-wiggle-on-scroll');
    animateElements.forEach(el => animateOnScrollObserver.observe(el));

    // --- Reviews Auto Slider Logic ---
    const reviews = [
        { text: "Best root canal experience in Adyar. Dr. Arul was incredibly gentle and the clinic is spotless. Highly recommend!", author: "Priya S." },
        { text: "Dr. Arul explained everything clearly before starting the procedure. The pain relief was immediate, and I felt so taken care of.", author: "Rajesh K." },
        { text: "Very patient with kids. My 6-year-old didn't cry at all during her cavity filling. Thank you!", author: "Anitha R." },
        { text: "The team is so professional. I went in for dental implants, and the entire process was seamless. I can smile confidently again.", author: "Manoj V." },
        { text: "I had a severe toothache on a Sunday, and their emergency care saved me! Fast, effective, and truly painless.", author: "Sujatha N." },
        { text: "Highly experienced dentist. The clinic is equipped with the latest tech. My laser teeth whitening results are amazing.", author: "Deepak L." },
        { text: "Always on time with appointments, no sitting in the waiting room forever. Highly recommend for busy professionals.", author: "Karthik M." },
        { text: "My entire family goes to Dr. Arul's Dental Care. They handle everything from pediatric checkups to complex surgeries perfectly.", author: "Lakshmi S." },
        { text: "The staff makes you feel at ease the moment you walk in. I used to fear dentists, but not anymore!", author: "Arun P." },
        { text: "Exceptional hygiene standards and crystal clear communication regarding the treatment plan and costs.", author: "Nandini R." }
    ];

    const sliderContainer = document.getElementById('review-slider');
    const progressBar = document.getElementById('progress-fill');
    const prevBtn = document.getElementById('prev-review');
    const nextBtn = document.getElementById('next-review');

    let currentSlide = 0;
    const slideDuration = 1000; // 1 second as requested
    let sliderInterval;
    let progressInterval;
    const progressUpdateRate = 20; // ms

    // Initialize Slider
    if (sliderContainer) {
        // Build Slides
        reviews.forEach((review, index) => {
            const slide = document.createElement('div');
            slide.className = `slide ${index === 0 ? 'active-slide' : ''}`;
            slide.innerHTML = `
                <div class="rating-stars">
                    <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                </div>
                <p>"${review.text}"</p>
                <cite>- ${review.author}</cite>
            `;
            sliderContainer.appendChild(slide);
        });

        const updateSlider = () => {
            sliderContainer.style.transform = `translateX(-${currentSlide * 100}%)`;

            // Update active class for opacity transition
            const slides = document.querySelectorAll('.slide');
            slides.forEach((s, idx) => {
                if (idx === currentSlide) s.classList.add('active-slide');
                else s.classList.remove('active-slide');
            });
        };

        const resetProgress = () => {
            clearInterval(progressInterval);
            let width = 0;
            progressBar.style.width = '0%';

            progressInterval = setInterval(() => {
                width += (progressUpdateRate / slideDuration) * 100;
                progressBar.style.width = `${Math.min(width, 100)}%`;
                if (width >= 100) clearInterval(progressInterval);
            }, progressUpdateRate);
        };

        const nextSlide = () => {
            currentSlide = (currentSlide + 1) % reviews.length;
            updateSlider();
            resetProgress();
        };

        const prevSlide = () => {
            currentSlide = (currentSlide - 1 + reviews.length) % reviews.length;
            updateSlider();
            resetProgress();
        };

        const startAutoPlay = () => {
            clearInterval(sliderInterval);
            resetProgress();
            sliderInterval = setInterval(nextSlide, slideDuration);
        };

        const stopAutoPlay = () => {
            clearInterval(sliderInterval);
            clearInterval(progressInterval);
            progressBar.style.width = '0%';
        };

        // Event Listeners for controls
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                startAutoPlay(); // Restart timer on manual interaction
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                startAutoPlay();
            });
        }

        // Pause on hover
        const sliderWrapper = document.querySelector('.review-slider-wrapper');
        if (sliderWrapper) {
            sliderWrapper.addEventListener('mouseenter', stopAutoPlay);
            sliderWrapper.addEventListener('mouseleave', startAutoPlay);

            // Touch events for mobile
            sliderWrapper.addEventListener('touchstart', stopAutoPlay);
            sliderWrapper.addEventListener('touchend', startAutoPlay);
        }

        // Start initial playback
        startAutoPlay();
    }

    // --- WhatsApp Form Submission ---

    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;

            const treatmentSelect = document.getElementById('treatment');
            const treatmentText = treatmentSelect.options[treatmentSelect.selectedIndex].text;

            // Format message for WhatsApp
            const message = `Hello Dr. Arul's Dental Care! I would like to request an appointment.%0A%0A*Name:* ${name}%0A*Phone:* ${phone}%0A*Treatment:* ${treatmentText}`;

            // REPLACE THIS NUMBER WITH THE CLINIC'S ACTUAL WHATSAPP NUMBER
            // Format: Country code + phone number without '+' or spaces. e.g. '919812345678'
            const whatsappNumber = "918939126080";

            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

            window.open(whatsappUrl, '_blank');
        });
    }

    // --- FAQ Accordion Logic ---
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            const answer = question.nextElementSibling;

            // Close all others
            faqQuestions.forEach(q => {
                q.setAttribute('aria-expanded', 'false');
                q.nextElementSibling.style.maxHeight = null;
                q.nextElementSibling.setAttribute('aria-hidden', 'true');
            });

            // Toggle current
            if (!isExpanded) {
                question.setAttribute('aria-expanded', 'true');
                answer.style.maxHeight = answer.scrollHeight + "px";
                answer.setAttribute('aria-hidden', 'false');
            }
        });
    });
});
