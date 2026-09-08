// =========================================================
// SOURABH CHETAN — PORTFOLIO
// All interactivity in one file (previously split across
// script.js / nav.js / home.js, which redeclared the same
// globals and broke each other when loaded together).
// =========================================================

document.addEventListener("DOMContentLoaded", () => {

    /* ---------- MOBILE NAV TOGGLE ---------- */
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("navLinks");

    if (hamburger && navLinks) {
        hamburger.addEventListener("click", () => {
            const isOpen = navLinks.classList.toggle("show-menu");
            hamburger.setAttribute("aria-expanded", String(isOpen));
            hamburger.innerHTML = isOpen
                ? '<i class="fas fa-times"></i>'
                : '<i class="fas fa-bars"></i>';
        });

        document.querySelectorAll(".nav-links a").forEach((link) => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("show-menu");
                hamburger.innerHTML = '<i class="fas fa-bars"></i>';
                hamburger.setAttribute("aria-expanded", "false");
            });
        });
    }

    /* ---------- HIDE NAVBAR ON SCROLL DOWN ---------- */
    const navbar = document.getElementById("siteNav");
    let lastScroll = 0;

    window.addEventListener("scroll", () => {
        const current = window.pageYOffset;

        if (navbar) {
            if (current > lastScroll && current > 120) {
                navbar.classList.add("hide-nav");
            } else {
                navbar.classList.remove("hide-nav");
            }
        }
        lastScroll = current;
    }, { passive: true });

    /* ---------- ACTIVE NAV LINK ON SCROLL ---------- */
    const sections = document.querySelectorAll("section[id]");
    const navItems = document.querySelectorAll(".nav-links a");

    function setActiveLink() {
        let current = "";
        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            if (window.pageYOffset >= sectionTop - 220) {
                current = section.getAttribute("id");
            }
        });

        navItems.forEach((link) => {
            link.classList.remove("active-link");
            if (link.getAttribute("href") === `#${current}`) {
                link.classList.add("active-link");
            }
        });
    }

    window.addEventListener("scroll", setActiveLink, { passive: true });
    setActiveLink();

    /* ---------- SCROLL-REVEAL SECTIONS ---------- */
    const revealEls = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window && revealEls.length) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("show");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12 }
        );

        revealEls.forEach((el) => observer.observe(el));
    } else {
        revealEls.forEach((el) => el.classList.add("show"));
    }

    /* ---------- TERMINAL TYPING EFFECT ---------- */
    const typedRole = document.getElementById("typedRole");
    const roles = [
        "Backend Developer",
        "Full Stack Developer",
        "AI & ML Enthusiast",
        "Founder, EV Yatra"
    ];

    if (typedRole) {
        let roleIndex = 0;
        let charIndex = 0;
        let deleting = false;

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        function typeEffect() {
            const currentWord = roles[roleIndex];

            typedRole.textContent = deleting
                ? currentWord.substring(0, charIndex--)
                : currentWord.substring(0, charIndex++);

            let speed = deleting ? 45 : 90;

            if (!deleting && charIndex === currentWord.length) {
                speed = 1400;
                deleting = true;
            } else if (deleting && charIndex === 0) {
                deleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                speed = 300;
            }

            setTimeout(typeEffect, speed);
        }

        if (prefersReducedMotion) {
            typedRole.textContent = roles[0];
        } else {
            typeEffect();
        }
    }

    /* ---------- SCROLL-TO-TOP BUTTON ---------- */
    const scrollBtn = document.createElement("button");
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.className = "scroll-top-btn";
    scrollBtn.setAttribute("aria-label", "Scroll to top");
    document.body.appendChild(scrollBtn);

    window.addEventListener("scroll", () => {
        scrollBtn.classList.toggle("show-btn", window.scrollY > 400);
    }, { passive: true });

    scrollBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    /* ---------- GITHUB STATS (live data only, never hardcoded) ---------- */
    const githubStatsEl = document.getElementById("githubStats");

    if (githubStatsEl) {
        fetch("https://api.github.com/users/sourabhchetan")
            .then((res) => {
                if (!res.ok) throw new Error("GitHub API request failed");
                return res.json();
            })
            .then((data) => {
                const repos = data.public_repos;
                const followers = data.followers;

                if (typeof repos !== "number" || typeof followers !== "number") {
                    return;
                }

                githubStatsEl.innerHTML = `
                    <div class="stat-item"><b>${repos}</b><span>public repos</span></div>
                    <div class="stat-item"><b>${followers}</b><span>followers</span></div>
                `;
                githubStatsEl.classList.add("show-stats");
            })
            .catch(() => {
                // Fetch failed or rate-limited — leave the section hidden
                // rather than showing stale or fabricated numbers.
            });
    }

});
