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

    // ── REVIEWS DATA ──
    const subjectData = {
        "FLF1010": {
            desc: "Trang bị kiến thức về nhận thức bản thân, điều tiết cảm xúc và kỹ năng giao tiếp hiệu quả trong các mối quan hệ.",
            review: "Môn học cực chill, giúp bạn hiểu mình và người khác hơn qua các bài tập tình huống thực tế trên lớp.",
            rating: "4.9"
        },
        "FLF1007": {
            desc: "Trang bị kỹ năng sử dụng công cụ số và sản xuất nội dung truyền thông đa phương tiện như video, đồ họa và landing page.",
            review: "Môn học cực vui, bài tập thực hành nhiều giúp làm chủ các công cụ sáng tạo hiện đại mà không bị áp lực lý thuyết.",
            rating: "4.8"
        },
        "FLF1009": {
            desc: "Phát triển khả năng tư duy đột phá và trang bị các bước cơ bản để xây dựng một dự án khởi nghiệp thực tế.",
            review: "Môn này kích thích óc sáng tạo cực tốt, làm việc nhóm nhiều nên rất vui và gắn kết các thành viên.",
            rating: "4.8"
        },
        "FLF1016": {
            desc: "Phân tích mối quan hệ giữa các yếu tố địa lý và quyền lực chính trị, quân sự trong các khu vực trên thế giới.",
            review: "Môn học mang lại tầm nhìn vĩ mô và hiểu biết sâu sắc về các vấn đề thời sự, quốc tế đang diễn ra.",
            rating: "4.5"
        },
        "GEO101": {
            desc: "Nghiên cứu các quy luật tự nhiên và kinh tế - xã hội, được lồng ghép các kiến thức đặc thù phù hợp với khu vực ngôn ngữ của từng khoa.",
            review: "Kiến thức thực tế, giúp hiểu rõ mối quan hệ giữa địa lý và văn hóa của quốc gia mình đang theo học. Đề thi bám sát nội dung trên lớp.",
            rating: "4.3"
        },
        "ENV101": {
            desc: "Tìm hiểu về các vấn đề môi trường toàn cầu và các chính sách phát triển bền vững của các quốc gia thuộc khối ngôn ngữ chuyên ngành.",
            review: "Môn học mang tính thời sự cao, giúp mở rộng vốn từ vựng chuyên ngành về môi trường và có cái nhìn đa chiều về phát triển bền vững.",
            rating: "4.6"
        },
        "FLF1006": {
            desc: "Khám phá lịch sử hình thành, văn hóa đặc trưng và các thể chế kinh tế - chính trị của khối Liên minh Châu Âu.",
            review: "Nội dung thú vị, giúp bạn hiểu sâu về lối sống và tư duy của người châu Âu qua các thời kỳ.",
            rating: "4.7"
        },
        "FLF1005": {
            desc: "Nghiên cứu về sự đa dạng văn hóa, lịch sử và xu hướng phát triển kinh tế của các quốc gia trong khu vực Châu Á.",
            review: "Môn học gần gũi, giúp khám phá những nét đẹp văn hóa độc đáo và mối quan hệ giữa các nước láng giềng.",
            rating: "4.7"
        },
        "FLF1015": {
            desc: "Kết hợp học lý thuyết với các hoạt động thiện nguyện và phục vụ cộng đồng thực tế.",
            review: "Trải nghiệm cực kỳ ý nghĩa! Vừa được đi thực tế, vừa được giúp đỡ mọi người mà vẫn được tính tín chỉ.",
            rating: "5.0"
        },
        "FLF1059": {
            desc: "Làm quen với các con số, biểu đồ và cách xử lý số liệu bằng phần mềm chuyên dụng.",
            review: "Phù hợp cho những bạn thích nghiên cứu. Ban đầu nhìn số liệu hơi sợ nhưng giáo trình rất chi tiết, dễ theo dõi.",
            rating: "4.2"
        },
        "VLF1053": {
            desc: "Rèn luyện kỹ năng sử dụng tiếng Việt chuẩn xác trong soạn thảo văn bản, giao tiếp và thuyết trình chuyên nghiệp.",
            review: "Môn học rất thực dụng, giúp chỉnh sửa những lỗi diễn đạt cơ bản và nâng cao kỹ năng viết tiểu luận cực hiệu quả.",
            rating: "4.9"
        },
        "FLF1002": {
            desc: "Trang bị tư duy nghiên cứu bài bản, cách đặt vấn đề và trích dẫn tài liệu chuẩn.",
            review: "Nền tảng quan trọng cho bạn nào định làm khóa luận. Môn học khá khó, cần đầu tư nhiều thời gian, công sức nhưng cực kỳ cần thiết cho tương lai.",
            rating: "4.0"
        },
        "PHI1051": {
            desc: "Rèn luyện khả năng suy luận chính xác và phát hiện các lỗi lập luận sai lầm.",
            review: "Môn này hơi 'hack não' một chút nhưng học xong thấy mình thông minh hẳn ra. Thầy cô dạy rất logic, dễ hiểu.",
            rating: "4.5"
        },
        "PSF1050": {
            desc: "Khám phá các quy luật tâm lý cơ bản của con người từ nhận thức, cảm xúc đến hành vi và nhân cách.",
            review: "Kiến thức cực kỳ thú vị, giúp bạn giải mã được nhiều hành vi của bản thân và những người xung quanh trong cuộc sống.",
            rating: "4.8"
        },
        "FLF1056": {
            desc: "Giúp sinh viên rèn luyện khả năng phân tích, đánh giá các lập luận một cách khách quan và đa chiều.",
            review: "Môn này cực kỳ hữu ích cho việc viết tiểu luận. Thầy cô dạy rất hay, kích thích tư duy phản biện tốt.",
            rating: "4.7"
        },
        "FLF1050": {
            desc: "Khám phá vẻ đẹp của âm nhạc, hội họa và các hình thức nghệ thuật khác để nuôi dưỡng tâm hồn.",
            review: "Học nhẹ nhàng, chill lắm. Những bạn thích nghệ thuật hoặc muốn tìm cảm hứng mới thì nên chọn môn này.",
            rating: "4.9"
        },
        "HIS1053": {
            desc: "Tổng hợp các giai đoạn phát triển rực rỡ nhất của nhân loại từ các nền văn minh cổ đại đến hiện đại.",
            review: "Như một chuyến du hành thời gian, môn này giúp mở mang kiến thức văn hóa đồ sộ và hiểu rõ nguồn gốc các giá trị nhân văn.",
            rating: "4.6"
        },
        "FLF1057": {
            desc: "Tìm hiểu về phong tục, tập quán và bản sắc văn hóa đặc trưng của các quốc gia trong khu vực Đông Nam Á.",
            review: "Kiến thức thực tế, thú vị. Bài tập nhóm thường là về du lịch hoặc ẩm thực nên làm rất vui.",
            rating: "4.6"
        },
        "FLF1052": {
            desc: "Phát triển khả năng quan sát, phân tích và diễn đạt ý tưởng thông qua ngôn ngữ hình ảnh và thị giác.",
            review: "Môn học đầy cảm hứng, rất phù hợp cho những bạn yêu thích sáng tạo và muốn cải thiện khả năng trình bày trực quan.",
            rating: "4.9"
        },
        "FLF1053": {
            desc: "Ứng dụng tư duy thiết kế để định hướng bản thân, xây dựng mục tiêu và lộ trình phát triển sự nghiệp hạnh phúc.",
            review: "Một môn học mang tính định hướng cao, giúp bạn bớt mông lung và biết cách tự tạo ra lộ trình tương lai cho riêng mình.",
            rating: "5.0"
        },
        "FLF1054": {
            desc: "Làm quen với nghệ thuật viết chữ, rèn luyện sự kiên nhẫn và tìm hiểu nét đẹp văn hóa qua từng nét bút.",
            review: "Môn học giúp rèn tính tĩnh tâm rất tốt, không khí lớp học nhẹ nhàng và mang lại những trải nghiệm nghệ thuật độc đáo.",
            rating: "4.7"
        },
        "FLF1055": {
            desc: "Trích dẫn và phân tích những bài học đạo đức, triết lý nhân sinh sâu sắc từ các điển tích và tác phẩm kinh điển xưa.",
            review: "Những câu chuyện ngắn gọn nhưng chứa đựng bài học quý giá, giúp bạn trau dồi vốn sống và cách đối nhân xử thế.",
            rating: "4.7"
        }
    };

    const reviewsContainer = document.getElementById('reviewsContainer');
    const allSubjectItems = document.querySelectorAll('.subject-list li');

    // Dynamically generate a review card for each subject
    if (reviewsContainer) {
        allSubjectItems.forEach(item => {
            const subjectId = item.dataset.id;
            const infoEl = item.querySelector('.subject-info');
            if (!infoEl || !subjectData[subjectId]) return;

            const fullText = infoEl.textContent.replace('✔', '').trim();
            const data = subjectData[subjectId];

            const card = document.createElement('div');
            card.className = 'review-card fade-up';
            card.dataset.subject = subjectId;
            card.style.display = 'none'; // Hidden by default

            card.innerHTML = `
                <div class="review-header">
                    <h4>${fullText}</h4>
                    <span class="rating-badge">⭐ ${data.rating}/5.0</span>
                </div>
                <div class="review-content">
                    <p class="subject-desc"><strong>Mô tả:</strong> ${data.desc}</p>
                    <blockquote class="student-quote">"${data.review}"</blockquote>
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
            item.classList.toggle('expanded');

            const review = item.querySelector('.inline-review');
            const subjectId = item.dataset.id;
            const data = subjectData[subjectId];

            if (review && item.classList.contains('expanded') && data) {
                if (!review.innerHTML) {
                    review.innerHTML = `
                        <div class="rating-badge">⭐ ${data.rating}/5.0</div>
                        <p><strong>Mô tả:</strong> ${data.desc}</p>
                        <blockquote>"${data.review}"</blockquote>
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
