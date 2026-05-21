
        // Custom elegant Toast System (completely replacing standard alerts)
        function showToast(title, body) {
            const container = document.getElementById('toast-container');
            const toast = document.createElement('div');
            toast.className = "bg-charcoal text-cream p-4 rounded-xl border border-sand/20 shadow-2xl flex flex-col gap-1 transition-all duration-300 translate-y-2 opacity-0 pointer-events-auto";
            
            toast.innerHTML = `
                <div class="flex items-center justify-between">
                    <span class="text-xs uppercase tracking-wider text-terracotta font-bold">${title}</span>
                    <button class="text-cream/50 hover:text-cream text-sm font-sans" onclick="this.parentElement.parentElement.remove()">&times;</button>
                </div>
                <p class="text-xs text-cream/80 font-light">${body}</p>
            `;
            
            container.appendChild(toast);
            
            // Animation Trigger
            setTimeout(() => {
                toast.classList.remove('translate-y-2', 'opacity-0');
            }, 10);
            
            // Auto destroy
            setTimeout(() => {
                toast.classList.add('translate-y-2', 'opacity-0');
                setTimeout(() => toast.remove(), 300);
            }, 4000);
        }

        // Mobile Menu toggle control
        function toggleMobileMenu() {
            const menu = document.getElementById('mobile-menu');
            menu.classList.toggle('hidden');
        }

        // Gallery Filter implementation
        function filterGallery(category) {
            const items = document.querySelectorAll('.gallery-item');
            const btns = {
                all: document.getElementById('btn-all'),
                design: document.getElementById('btn-design'),
                writing: document.getElementById('btn-writing')
            };

            // Reset standard button styles
            Object.values(btns).forEach(btn => {
                btn.className = "px-5 py-2.5 rounded-full border border-sand text-charcoal/60 hover:border-charcoal hover:text-charcoal transition-all duration-300";
            });

            // Set chosen active button style
            btns[category].className = "px-5 py-2.5 rounded-full border border-charcoal bg-charcoal text-cream transition-all duration-300 shadow-md";

            // Hide/Show entries with nice visual fade transitions
            items.forEach(item => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(10px)';
                setTimeout(() => {
                    if (category === 'all' || item.classList.contains(category)) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        item.style.display = 'none';
                    }
                }, 200);
            });
        }

        /* Real Song Player */
        // Configuration Constants
        const SONG_SRC = "./media/song.mp3"; 
        const SONG_TITLE = "Ambient Track";  

        let songAudio = null;
        let isSongPlaying = false;
        
        function ensureSongAudio() {
            if (songAudio) return songAudio;

            songAudio = new Audio();
            songAudio.src = SONG_SRC;
            songAudio.preload = 'auto';
            songAudio.loop = true; // play continuously

            // Diagnostics: surface load/decode issues immediately
            songAudio.addEventListener('error', () => {
                showToast("Audio Load Failed", `Could not load: ${SONG_SRC}. Check path + format support.`);
            });

            songAudio.addEventListener('loadedmetadata', () => {
                // Helps confirm the file is reachable (even if autoplay policies block play)
                showToast("Audio Ready", `Loaded: ${SONG_TITLE}`);
            });

            songAudio.addEventListener('ended', () => {
                isSongPlaying = false;
                const btns = [document.getElementById('ambient-btn'), document.getElementById('mobile-ambient-btn')];
                btns.forEach(btn => btn.innerText = "Play");
                const indicator = document.getElementById('sound-indicator');
                indicator.classList.remove('bg-terracotta');
                indicator.classList.add('bg-sand');
                showToast("Playback Ended", "The song finished playing.");
            });

            return songAudio;
        }

        async function toggleAmbientAudio() {
            const btns = [document.getElementById('ambient-btn'), document.getElementById('mobile-ambient-btn')];
            const indicator = document.getElementById('sound-indicator');

            try {
                const audio = ensureSongAudio();

                if (!isSongPlaying) {
                    // Must be called from a user gesture: this function is triggered by a click.
                    await audio.play();
                    isSongPlaying = true;
                    btns.forEach(btn => btn.innerText = "Pause");
                    indicator.classList.remove('bg-sand');
                    indicator.classList.add('bg-terracotta');
                    showToast("Now Playing", `${SONG_TITLE}`);
                } else {
                    audio.pause();
                    isSongPlaying = false;
                    btns.forEach(btn => btn.innerText = "Play");
                    indicator.classList.remove('bg-terracotta');
                    indicator.classList.add('bg-sand');
                    showToast("Paused", "Playback has been paused.");
                }
            } catch (err) {
                // Common issues: missing file, autoplay restrictions, unsupported format.
                showToast("Audio Error", "Could not play the song. Check SONG_SRC and that the file exists / is accessible.");
                console.error(err);
            }
        }


        /* Canva Design Sandbox Controls */
        let activeSandboxPalette = 'cream';
        let activeSandboxFont = 'poetic';
        let activeSandboxArt = 'moon';

        function setSandboxPalette(color) {
            const artboard = document.getElementById('sandbox-artboard');
            const sub = document.getElementById('sb-subtitle');
            
            activeSandboxPalette = color;

            // Clear old Tailwind palette background, text, and border classes
            artboard.classList.remove(
                'bg-cream', 'bg-charcoal', 'bg-sage', 'bg-terracotta',
                'text-charcoal', 'text-cream',
                'border-sand', 'border-sand/40', 'border-neutral-800', 'border-white/10'
            );
            
            if (sub) {
                sub.classList.remove('text-terracotta', 'text-cream', 'text-cream/80', 'text-cream/90');
            }

            // Apply designated palette classes safely
            if (color === 'cream') {
                artboard.classList.add('bg-cream', 'text-charcoal', 'border-sand/40');
                if (sub) sub.classList.add('text-terracotta');
            } else if (color === 'charcoal') {
                artboard.classList.add('bg-charcoal', 'text-cream', 'border-neutral-800');
                if (sub) sub.classList.add('text-terracotta');
            } else if (color === 'sage') {
                artboard.classList.add('bg-sage', 'text-cream', 'border-white/10');
                if (sub) sub.classList.add('text-cream/80');
            } else if (color === 'terracotta') {
                artboard.classList.add('bg-terracotta', 'text-cream', 'border-white/10');
                if (sub) sub.classList.add('text-cream/90');
            }

            // Highlight chosen color's selector circle
            const colors = ['cream', 'charcoal', 'sage', 'terracotta'];
            colors.forEach(c => {
                const btn = document.querySelector(`button[onclick="setSandboxPalette('${c}')"]`);
                if (btn) {
                    if (c === color) {
                        btn.classList.add('border-terracotta');
                        btn.classList.remove('border-transparent');
                    } else {
                        btn.classList.remove('border-terracotta');
                        btn.classList.add('border-transparent');
                    }
                }
            });
            
            showToast("Palette Shifted", `Visual Theme swapped to: ${color.toUpperCase()}`);
        }

        function setSandboxFont(font) {
            activeSandboxFont = font;
            const title = document.getElementById('sb-title');
            title.className = "text-3xl font-light leading-none transition-all";
            
            if (font === 'poetic') {
                title.classList.add('font-serif', 'italic');
            } else if (font === 'classic') {
                title.classList.add('font-display');
            } else if (font === 'minimal') {
                title.classList.add('font-sans', 'font-bold', 'tracking-tight');
            }

            // Update button outlines to show active font group
            const fonts = ['poetic', 'classic', 'minimal'];
            fonts.forEach(f => {
                const btn = document.getElementById(`font-btn-${f}`);
                if (btn) {
                    if (f === font) {
                        btn.className = "text-left p-3 rounded-lg border-2 border-charcoal bg-white font-serif text-sm transition-all";
                        if (f === 'classic') btn.className = "text-left p-3 rounded-lg border-2 border-charcoal bg-white font-display text-sm transition-all";
                        if (f === 'minimal') btn.className = "text-left p-3 rounded-lg border-2 border-charcoal bg-white font-sans text-sm transition-all col-span-2";
                    } else {
                        btn.className = "text-left p-3 rounded-lg border border-sand bg-white/50 font-serif text-sm transition-all hover:border-charcoal";
                        if (f === 'classic') btn.className = "text-left p-3 rounded-lg border border-sand bg-white/50 font-display text-sm transition-all hover:border-charcoal";
                        if (f === 'minimal') btn.className = "text-left p-3 rounded-lg border border-sand bg-white/50 font-sans text-sm transition-all hover:border-charcoal col-span-2";
                    }
                }
            });
            
            showToast("Typography Updated", `Font group updated.`);
        }

        function setSandboxArt(shape) {
            activeSandboxArt = shape;
            const moon = document.getElementById('sb-art-moon');
            const flower = document.getElementById('sb-art-flower');
            const wave = document.getElementById('sb-art-wave');
            const arts = { moon, flower, wave };

            // Reset visibility settings using absolute overlay structures
            Object.keys(arts).forEach(key => {
                const el = arts[key];
                if (key === shape) {
                    el.classList.remove('opacity-0', 'scale-50', 'pointer-events-none');
                    el.classList.add('opacity-100', 'scale-100', 'pointer-events-auto');
                } else {
                    el.classList.remove('opacity-100', 'scale-100', 'pointer-events-auto');
                    el.classList.add('opacity-0', 'scale-50', 'pointer-events-none');
                }
            });

            // Update art visual selection toggles
            const shapes = ['moon', 'flower', 'wave'];
            shapes.forEach(s => {
                const btn = document.getElementById(`art-btn-${s}`);
                if (btn) {
                    if (s === shape) {
                        btn.className = "p-2 border-2 border-charcoal rounded bg-white text-xs text-center transition-all font-bold";
                    } else {
                        btn.className = "p-2 border border-sand rounded bg-white/50 text-xs text-center transition-all opacity-70";
                    }
                }
            });

            showToast("Art Selected", `Active vector silhouette switched.`);
        }


        /* Case Study Navigation Data Model */
        const caseStudySlides = {
            spark: [
                {
                    title: "The Problem",
                    content: "Digital Noise",
                    sub: "Campus bulletins are visual overload."
                },
                {
                    title: "The Vision",
                    content: "Whisper vs Shout",
                    sub: "By designing with raw paper tones and massive empty white space, we stood out instantly."
                }
            ],
            craft: [
                {
                    title: "Color Choices",
                    content: "Terracotta & Alabaster",
                    sub: "Reflects tangible organic textures."
                },
                {
                    title: "Canva Structure",
                    content: "Precision Grid",
                    sub: "Structured columns with high editorial margins."
                }
            ],
            copy: [
                {
                    title: "Voice Setup",
                    content: "Vibe Branding",
                    sub: "We wrote the tagline 'Between the lines we live' to invite deeper connections."
                },
                {
                    title: "The Trigger",
                    content: "Emotional Prompts",
                    sub: "Avoid administrative alerts; speak directly to human vulnerability."
                }
            ],
            impact: [
                {
                    title: "Output",
                    content: "Full House",
                    sub: "120+ seats registered within 48 hours."
                },
                {
                    title: "Sustained Audience",
                    content: "Creative Growth",
                    sub: "Student poetry group membership expanded by 45% following the promotion."
                }
            ]
        };

        let currentActiveTab = 'spark';
        let currentSlideIndex = 0;

        function updateCarousel() {
            const slideData = caseStudySlides[currentActiveTab];
            const slide = slideData[currentSlideIndex];
            const slideContainer = document.getElementById('slide-container');
            const infoText = document.getElementById('carousel-info');
            const dotsContainer = document.getElementById('carousel-dots');

            slideContainer.innerHTML = `
                <div class="py-10 flex flex-col justify-center h-full transition-opacity duration-300">
                    <span class="text-[10px] uppercase tracking-widest text-terracotta font-bold mb-2">${slide.title}</span>
                    <h5 class="font-serif text-3xl font-light italic mb-4 leading-snug text-charcoal/90">${slide.content}</h5>
                    <p class="text-[10px] text-charcoal/60 max-w-[200px] mx-auto leading-relaxed font-sans font-medium">${slide.sub}</p>
                </div>
            `;

            infoText.innerText = `Slide ${currentSlideIndex + 1} of ${slideData.length}`;

            dotsContainer.innerHTML = '';
            slideData.forEach((_, index) => {
                const isActive = index === currentSlideIndex;
                dotsContainer.innerHTML += `
                    <span class="h-1.5 rounded-full transition-all duration-300 ${isActive ? 'w-4 bg-terracotta' : 'w-1.5 bg-sand'}"></span>
                `;
            });
        }

        function switchTab(tabKey) {
            currentActiveTab = tabKey;
            currentSlideIndex = 0;

            ['spark', 'craft', 'copy', 'impact'].forEach(t => {
                const tabBtn = document.getElementById(`tab-${t}`);
                tabBtn.className = "text-left py-2 font-serif text-xl border-l-2 border-transparent -ml-5 pl-5 hover:text-terracotta focus:outline-none transition-all text-charcoal/60";
            });

            const activeBtn = document.getElementById(`tab-${tabKey}`);
            activeBtn.className = "text-left py-2 font-serif text-xl border-l-2 -ml-5 pl-5 hover:text-terracotta focus:outline-none transition-all font-bold text-terracotta border-l-terracotta";

            const descBox = document.getElementById('case-study-desc');
            const descriptions = {
                spark: {
                    title: "Concept Goals & Focus",
                    text: "How do you capture raw spoken-word expression on an Instagram feed? We realized that less is more. For our college literary club's poetry slam, we designed with extreme space and rich typography—relying on cozy, minimalist layouts so the poetry itself breathed first."
                },
                craft: {
                    title: "Exquisite Canva Styling",
                    text: "To evoke an intimate aesthetic, we configured organic, tactile paper textures inside Canva, restricted the theme strict to earthy Terracotta, and aligned with highly polished, classical typography."
                },
                copy: {
                    title: "Prompts & Poetic Copy",
                    text: "Promotional copywriting designed to intrigue the creative mind. Rather than traditional promotional headlines, we used micro-quotes, rhetorical prompts, and poetic fragments to establish the vibe of the room before you ever walked in."
                },
                impact: {
                    title: "Measurable Reach Output",
                    text: "By establishing extreme curiosity, this Campaign layout created heavy engagement. Results indicated that clean visual poetry can capture digital spaces much more deeply than generic loud promotions."
                }
            };

            descBox.innerHTML = `
                <h4 class="font-serif text-2xl font-light mb-3">${descriptions[tabKey].title}</h4>
                <p class="text-charcoal/70 text-sm leading-relaxed font-light">${descriptions[tabKey].text}</p>
            `;

            updateCarousel();
        }

        function prevSlide() {
            const slideData = caseStudySlides[currentActiveTab];
            currentSlideIndex = (currentSlideIndex - 1 + slideData.length) % slideData.length;
            updateCarousel();
        }

        function nextSlide() {
            const slideData = caseStudySlides[currentActiveTab];
            currentSlideIndex = (currentSlideIndex + 1) % slideData.length;
            updateCarousel();
        }

        /* Mock Instagram Comment Simulator */
        function postMockComment(e) {
            e.preventDefault();
            const input = document.getElementById('comment-input');
            const commentsContainer = document.getElementById('phone-comments');
            
            if (input.value.trim() !== '') {
                const newComment = document.createElement('div');
                newComment.className = "text-[9px] leading-tight border-t border-sand/10 pt-1.5";
                newComment.innerHTML = `
                    <span class="font-bold text-charcoal">guest_writer:</span>
                    <span class="text-charcoal/80">${input.value}</span>
                `;
                commentsContainer.appendChild(newComment);
                commentsContainer.scrollTop = commentsContainer.scrollHeight;
                
                input.value = '';
                showToast("Comment Simulated", "Your comment has been rendered live on the iPhone simulation screen!");
            }
        }

        /* Handle Contact Form Submissions safely */
        function handleContact(e) {
            e.preventDefault();
            const name = document.getElementById('contact-name').value;
            
            showToast("Message Sent!", `Thank you, ${name}! Your consultation query has been successfully dispatched to Pousali.`);
            
            document.getElementById('contact-name').value = '';
            document.getElementById('contact-email').value = '';
            document.getElementById('contact-message').value = '';
        }

        /* Scroll Animation Engine */
        document.addEventListener("DOMContentLoaded", () => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, { threshold: 0.1 });

            const sections = document.querySelectorAll('section');
            sections.forEach(sec => {
                sec.classList.add('fade-in-on-scroll');
                observer.observe(sec);
            });
            
            updateCarousel();
        });
