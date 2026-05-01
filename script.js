document.addEventListener('DOMContentLoaded', () => {
    // ── PAGE REVEAL ──
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.8s ease';
    setTimeout(() => document.body.style.opacity = '1', 50);

    // ── TOAST NOTIFICATION SYSTEM ──
    const toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);

    window.showToast = (message, type = 'success') => {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        const icon = type === 'success' ? '✓' : 'ℹ';

        toast.innerHTML = `
            <div class="toast-icon">${icon}</div>
            <div class="toast-message">${message}</div>
        `;

        toastContainer.appendChild(toast);

        // Trigger animation
        setTimeout(() => toast.classList.add('active'), 10);

        // Remove toast
        setTimeout(() => {
            toast.classList.remove('active');
            setTimeout(() => toast.remove(), 500);
        }, 4000);
    };

    // ── LUMINA CURSOR LOGIC ──
    const cursorDot = document.querySelector('.cursor-dot');
    const body = document.body;
    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (cursorDot) {
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        }

        // Create dense trail
        createTrail(mouseX, mouseY);
        if (Math.random() > 0.5) createTrail(mouseX + (Math.random() - 0.5) * 10, mouseY + (Math.random() - 0.5) * 10);
    });

    function createTrail(x, y) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail-dot';
        body.appendChild(trail);
        trail.style.left = `${x}px`;
        trail.style.top = `${y}px`;
        trail.style.opacity = '0.6';

        trail.animate([
            { transform: 'translate(-50%, -50%) scale(1.2)', opacity: 0.6 },
            { transform: 'translate(-50%, -50%) scale(0)', opacity: 0 }
        ], { duration: 1000, easing: 'ease-out' }).onfinish = () => trail.remove();
    }

    // ── FEATURE CARDS MOUSE TRACKING ──
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--mouse-x', `${x}%`);
            card.style.setProperty('--mouse-y', `${y}%`);
        });
    });

    // ── MAGNETIC BUTTONS ──
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            if (cursorDot) cursorDot.style.transform = 'translate(-50%, -50%) scale(1.3)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
            if (cursorDot) cursorDot.style.transform = 'translate(-50%, -50%) rotate(45deg)';
        });
    });

    // ScrollSpy: Highlighting menu based on scroll position
    const menuLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section[id], header[id]');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPos = window.pageYOffset || document.documentElement.scrollTop;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const id = section.getAttribute('id');
            if (scrollPos >= sectionTop - 300) {
                current = id;
            }
        });

        // Fallback to first section if at the very top
        if (!current && sections.length > 0) current = sections[0].getAttribute('id');

        menuLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href').replace('#', '');
            if (href === current) {
                link.classList.add('active');
            }
        });
    });

    // Hover & Click States
    const interactives = document.querySelectorAll('a, button, .btn, .subject-list li, .review-card, input, select, textarea');
    interactives.forEach(el => {
        el.addEventListener('mouseenter', () => body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => body.classList.remove('cursor-hover'));
    });

    window.addEventListener('mousedown', (e) => {
        body.classList.add('cursor-click');
        // Tạo pháo hoa khi click
        const colors = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#F473B9', '#FFFFFF'];
        for (let i = 0; i < 25; i++) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            createBurst(e.clientX, e.clientY, color);
        }
    });
    window.addEventListener('mouseup', () => body.classList.remove('cursor-click'));

    function createBurst(x, y, color) {
        const p = document.createElement('div');
        p.className = 'burst-particle';
        body.appendChild(p);

        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 120 + 60;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        const size = Math.random() * 6 + 2;

        p.style.left = `${x}px`;
        p.style.top = `${y}px`;
        p.style.width = `${size}px`;
        p.style.height = `${size}px`;
        p.style.background = color || (Math.random() > 0.5 ? 'var(--accent)' : 'var(--c2)');
        p.style.boxShadow = `0 0 10px ${p.style.background}`;

        p.animate([
            { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
            { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0)`, opacity: 0 }
        ], { duration: Math.random() * 500 + 800, easing: 'cubic-bezier(0.1, 0.9, 0.2, 1)' }).onfinish = () => p.remove();
    }

    // ── NAVBAR SCROLL ──
    const navbar = document.querySelector('.navbar');
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
            backToTop?.classList.add('visible');
        } else {
            navbar.classList.remove('scrolled');
            backToTop?.classList.remove('visible');
        }
    }, { passive: true });

    backToTop?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ── MOBILE MENU ──
    const menuToggle = document.querySelector('.menu-toggle');
    const closeMenu = document.querySelector('.close-menu');
    const navMenu = document.querySelector('.nav-links');

    const toggleMenu = () => {
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    };

    menuToggle?.addEventListener('click', toggleMenu);
    closeMenu?.addEventListener('click', toggleMenu);

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) toggleMenu();
        });
    });

    // ── REVIEWS ──
    const reviewsContainer = document.getElementById('reviewsContainer');
    const allSubjectItems = document.querySelectorAll('.subject-list li');

    // Dynamically generate a review card for each subject
    if (reviewsContainer) {
        allSubjectItems.forEach(item => {
            const subjectId = item.dataset.id;
            const infoEl = item.querySelector('.subject-info');
            if (!infoEl) return;
            const fullText = infoEl.textContent.replace('✔', '').trim();
            const card = document.createElement('div');
            card.className = 'review-card fade-up';
            card.dataset.subject = subjectId;
            card.style.display = 'none'; // Hidden by default

            // Random rating for demo
            const rating = (4.0 + Math.random()).toFixed(1);

            card.innerHTML = `
                <div class="review-header">
                    <h4>${fullText}</h4>
                    <span class="rating-badge">⭐ ${rating}/5.0</span>
                </div>
                <div class="review-content">
                    <p class="subject-desc"><strong>Mô tả:</strong> Cung cấp kiến thức và kỹ năng thực tế về môn học ${fullText}.</p>
                    <blockquote class="student-quote">"Môn học rất thú vị, bổ ích và mang tính ứng dụng cao trong thực tế!"</blockquote>
                </div>
            `;
            reviewsContainer.appendChild(card);
        });
    }

    const reviewCards = document.querySelectorAll('.review-card');


    // ── SEARCH SUBJECTS ──
    const searchInput = document.getElementById('subjectSearch');
    const searchBar = document.querySelector('.search-bar');
    const subjectItems = document.querySelectorAll('.subject-list li');

    if (searchBar && searchInput) {
        searchBar.addEventListener('click', () => {
            searchInput.focus();
        });

        // Add cursor hover effect to the whole search bar
        searchBar.addEventListener('mouseenter', () => body.classList.add('cursor-hover'));
        searchBar.addEventListener('mouseleave', () => body.classList.remove('cursor-hover'));
    }

    searchInput?.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase().trim();

        // Only show reviews if there is a search term and it matches
        reviewCards.forEach(card => {
            const title = card.querySelector('h4').textContent.toLowerCase();
            const subjectId = card.dataset.subject.toLowerCase();
            if (term !== '' && (title.includes(term) || subjectId.includes(term))) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });

    // ── SUBJECT EXPANSION ──
    subjectItems.forEach(item => {
        item.addEventListener('click', () => {
            // Close other items if desired (optional)
            // subjectItems.forEach(i => { if(i !== item) i.classList.remove('expanded'); });

            item.classList.toggle('expanded');

            // Re-trigger reveal on child elements if needed
            const review = item.querySelector('.inline-review');
            if (review && item.classList.contains('expanded')) {
                // Add some content if empty (random review)
                if (!review.innerHTML) {
                    const rating = (4.0 + Math.random()).toFixed(1);
                    review.innerHTML = `
                        <div class="rating-badge">⭐ ${rating}/5.0</div>
                        <p>Học phần này mang lại nhiều kiến thức thực tế và rèn luyện kỹ năng tư duy phản biện tốt.</p>
                        <blockquote>"Một trong những môn tự chọn đáng học nhất tại ULIS!"</blockquote>
                    `;
                }
            }
        });
    });


    // ── MULTI-SELECT TAGS ──
    const tagCloud = document.getElementById('tagCloudSubjects');
    const subjects = [
        "Trí tuệ cảm xúc và giao tiếp xã hội (FLF1010)",
        "Công nghệ thông tin & truyền thông (FLF1007)",
        "Tư duy sáng tạo và khởi nghiệp (FLF1009)",
        "Địa chính trị (FLF1016)",
        "Địa lý đại cương",
        "Môi trường và phát triển",
        "Tìm hiểu cộng đồng Châu Âu (FLF1006)",
        "Tìm hiểu cộng đồng Châu Á (FLF1005)",
        "Học tập cùng cộng đồng (FLF1015)",
        "Thống kê và phân tích dữ liệu trong NCKH (FLF1059)",
        "Tiếng Việt thực hành (VLF1053)",
        "Phương pháp luận nghiên cứu khoa học (FLF1002)",
        "Logic học đại cương (PHI1051)",
        "Tâm lý học đại cương (PSF1050)",
        "Tư duy phê phán (FLF1056)",
        "Cảm thụ nghệ thuật (FLF1050)",
        "Lịch sử văn minh thế giới (HIS1053)",
        "Văn hóa các nước ASEAN (FLF1057)",
        "Tư duy hình ảnh (FLF1052)",
        "Thiết kế cuộc đời (FLF1053)",
        "Thư pháp (FLF1054)",
        "Cổ học tinh hoa (FLF1055)"
    ];

    subjects.forEach(sub => {
        const tag = document.createElement('div');
        tag.className = 'tag';
        tag.textContent = sub;
        tag.addEventListener('click', () => tag.classList.toggle('active'));
        tagCloud?.appendChild(tag);
    });

    // ── STAR RATING ──
    const stars = document.querySelectorAll('#starRating span');
    const ratingLabel = document.getElementById('ratingLabel');
    const ratingTexts = {
        0: "Chọn mức độ hài lòng của bạn",
        1: "Rất không hài lòng ☹️",
        2: "Không hài lòng 😟",
        3: "Bình thường 😐",
        4: "Hài lòng 🙂",
        5: "Cực kỳ hài lòng! 😍"
    };
    let currentRating = 0;

    stars.forEach(star => {
        star.addEventListener('mouseenter', () => {
            const val = parseInt(star.dataset.val);
            updateStarsDisplay(val);
            ratingLabel.textContent = ratingTexts[val];
        });

        star.addEventListener('mouseleave', () => {
            updateStarsDisplay(currentRating);
            ratingLabel.textContent = ratingTexts[currentRating];
        });

        star.addEventListener('click', () => {
            currentRating = parseInt(star.dataset.val);
            updateStarsDisplay(currentRating);
            ratingLabel.textContent = ratingTexts[currentRating];
            showToast(`Bạn đã chọn ${currentRating} sao!`, 'info');
        });
    });

    function updateStarsDisplay(val) {
        stars.forEach(star => {
            const starVal = parseInt(star.dataset.val);
            if (starVal <= val) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }
    updateStarsDisplay(0); // Initial call

    // ── FADE IN ON SCROLL ──
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal, .fade-up').forEach(el => {
        el.classList.add('reveal'); // Ensure base class is present
        observer.observe(el);
    });

    // ── REGISTRATION FORM LOGIC ──
    const regFormBody = document.getElementById('regFormBody');
    const regSuccessBody = document.getElementById('regSuccessBody');

    // ── FORMS SUBMISSION & VALIDATION ──
    const forms = ['advisorForm', 'experienceForm'];
    forms.forEach(id => {
        const form = document.getElementById(id);
        if (!form) return;

        form.setAttribute('novalidate', true); // Disable browser tooltips

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Manual Validation
            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');

            requiredFields.forEach(field => {
                const group = field.closest('.input-group');
                if (!field.value.trim()) {
                    isValid = false;
                    group.classList.add('error');
                    // Remove error after animation
                    setTimeout(() => group.classList.remove('error'), 1000);
                } else {
                    group.classList.remove('error');
                }
            });

            if (!isValid) {
                showToast('Vui lòng điền đầy đủ các thông tin bắt buộc!', 'info');
                return;
            }

            const btn = form.querySelector('button[type="submit"]');
            const origText = btn.textContent;
            btn.textContent = 'Đang xử lý...';
            btn.disabled = true;

            setTimeout(() => {
                if (id === 'advisorForm') {
                    if (regFormBody) regFormBody.style.display = 'none';
                    if (regSuccessBody) regSuccessBody.classList.add('visible');
                    form.reset();
                    // Cuộn lên đầu section đăng ký để thấy thông báo
                    document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' });
                } else {
                    // Only show success message and reset form

                    showToast('Cảm ơn bạn đã chia sẻ trải nghiệm!');
                    form.reset();
                    currentRating = 0;
                    updateStarsDisplay(currentRating);
                }

                btn.textContent = origText;
                btn.disabled = false;
                document.querySelectorAll('.tag.active').forEach(t => t.classList.remove('active'));
            }, 1500);
        });
    });

});