// --- İÇERİK VERİLERİ (Dil Destekli) ---
const content = {
    tr: {
        heroPrefix: "Merhaba, ben ",
        heroName: "Emin",
        logo: "Muhammet Emin Şen",
        cookieText: "Sitemizde analiz yapmak için çerezler kullanılmaktadır. Gezinmeye devam ederek bunu kabul etmiş sayılırsınız.",
        cookieBtn: "Anladım, Devam Et"
    },
    en: {
        heroPrefix: "Hi, I'm ",
        heroName: "Emin",
        logo: "Muhammet Emin Şen",
        cookieText: "We use cookies to analyze traffic. By continuing to browse, you agree to our use of cookies.",
        cookieBtn: "Got it, Continue"
    }
};

let activeIntervals = [];
let slideIndices = { 'projects-slider': 0, 'jams-slider': 0 };
let currentLang = localStorage.getItem('language') || 'en';

document.addEventListener('DOMContentLoaded', () => {
    // 1. BAŞLANGIÇ
    window.scrollTo(0, 0);

    // 2. DİL AYARLAMALARI
    setLanguage(currentLang);

    // 3. COOKIE KONTROLÜ
    showCookieBanner();

    // 4. PARTICLES JS
    if(window.particlesJS) {
        particlesJS("particles-js", {
            "particles": {
                "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": "#ffffff" },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.5, "random": true },
                "size": { "value": 1.5, "random": true },
                "line_linked": { "enable": true, "distance": 150, "color": "#8b5cf6", "opacity": 0.2, "width": 1 },
                "move": { "enable": true, "speed": 2 } 
            },
            "interactivity": { "events": { "onhover": { "enable": true, "mode": "repulse" }, "onclick": { "enable": true, "mode": "push" } } },
            "retina_detect": true
        });
    }

    // 5. SLIDER & SCROLL
    duplicateSlides('projects-slider');
    duplicateSlides('jams-slider');
    setupSmoothScrollCenter();
    setupScrollAnimations();
});

// --- COOKIE FONKSİYONLARI ---
function showCookieBanner() {
    const banner = document.getElementById("cookie-banner");
    setTimeout(() => {
        if(banner) {
            banner.classList.add("show");
        }
    }, 2000);
}

function acceptCookies() {
    const banner = document.getElementById("cookie-banner");
    if(banner) {
        banner.classList.remove("show");
    }
}

function updateCookieText() {
    const textEl = document.getElementById("cookie-text");
    const btnEl = document.getElementById("cookie-btn");
    
    if(textEl && btnEl) {
        textEl.textContent = content[currentLang].cookieText;
        btnEl.textContent = content[currentLang].cookieBtn;
    }
}

// --- DİL VE HERO SEQUENCE ---
function toggleLanguage() {
    const newLang = currentLang === 'en' ? 'tr' : 'en';
    setLanguage(newLang);
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    clearAllTypeWriters();

    // HEM MASAÜSTÜ HEM MOBİL BUTONUNU GÜNCELLE
    const btn = document.getElementById('lang-btn');
    const mobileBtn = document.getElementById('mobile-lang-btn');
    
    const text = lang === 'en' ? 'TR' : 'EN';
    
    if(btn) btn.innerText = text;
    if(mobileBtn) mobileBtn.innerText = text; // Mobil buton yazısını da değiştir

    // HTML içindeki data-en etiketlerini güncelle
    const elements = document.querySelectorAll('[data-en]');
    elements.forEach(el => {
        if (lang === 'en') {
            if (!el.getAttribute('data-tr')) el.setAttribute('data-tr', el.innerHTML);
            el.innerHTML = el.getAttribute('data-en');
        } else {
            if (el.getAttribute('data-tr')) el.innerHTML = el.getAttribute('data-tr');
        }
    });

    // Hero Typewriter Başlat
    const prefix = content[lang].heroPrefix;
    const name = content[lang].heroName;
    runHeroSequence(prefix, name);
    typeWriterNav(content[lang].logo);
    
    // Cookie metnini de güncelle
    updateCookieText();
}

function runHeroSequence(prefixText, nameText) {
    const prefixEl = document.getElementById('hero-prefix');
    const nameEl = document.getElementById('hero-name');
    const hiddenContent = document.getElementById('hero-hidden-content');
    
    if(prefixEl && nameEl && hiddenContent) {
        prefixEl.innerHTML = ""; 
        nameEl.innerHTML = ""; 
        hiddenContent.classList.remove('visible');
        
        typeWriterCore(prefixText, prefixEl, () => {
            typeWriterCore(nameText, nameEl, () => { 
                hiddenContent.classList.add('visible'); 
            });
        });
    }
}

function typeWriterNav(text) { 
    const el = document.getElementById('nav-logo'); 
    if(el) {
        el.innerHTML = ""; 
        typeWriterCore(text, el, null); 
    }
}

function typeWriterCore(text, element, callback) {
    let i = 0;
    let interval = setInterval(() => {
        if (i < text.length) { 
            element.innerHTML += text.charAt(i); 
            i++; 
        } else { 
            clearInterval(interval); 
            if (callback) callback(); 
        }
    }, 100);
    activeIntervals.push(interval);
}

function clearAllTypeWriters() { 
    activeIntervals.forEach(id => clearInterval(id)); 
    activeIntervals = []; 
}

// --- SCROLL ANİMASYONLARI ---
function setupScrollAnimations() {
    const observerElements = document.querySelectorAll('.tech-stack-bar, .section-title, .slider-card, .exp-card, .about-text, .timeline-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show-animate');
            }
        });
    }, { threshold: 0.15 });

    observerElements.forEach((el) => {
        el.classList.add('hidden-animate');
        observer.observe(el);
    });
}

function setupSmoothScrollCenter() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    });
}

// --- SLIDER ---
function duplicateSlides(sliderId) { 
    const track = document.getElementById(sliderId); 
    if(track) track.innerHTML += track.innerHTML; 
}

function moveSlide(sliderId, direction) {
    const track = document.getElementById(sliderId);
    if(!track) return;
    
    const cards = track.getElementsByClassName('slider-card');
    const cardsPerView = window.innerWidth > 768 ? 2 : 1;
    const totalCards = cards.length;
    slideIndices[sliderId] += direction;
    
    if (slideIndices[sliderId] < 0) { slideIndices[sliderId] = 0; }
    if (slideIndices[sliderId] > totalCards - cardsPerView) {
        track.style.transition = 'none';
        slideIndices[sliderId] = 0;
        track.style.transform = `translateX(0px)`;
        setTimeout(() => {
            track.style.transition = 'transform 0.5s ease-in-out';
            slideIndices[sliderId] = 1;
            const cardWidthPx = cards[0].offsetWidth + 20; 
            track.style.transform = `translateX(-${cardWidthPx}px)`;
        }, 50);
        return; 
    }
    const cardWidthPx = cards[0].offsetWidth + 20; 
    track.style.transform = `translateX(-${slideIndices[sliderId] * cardWidthPx}px)`;
}

// KONAMI CODE
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let cursor = 0;
document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[cursor]) { cursor++; if (cursor === konamiCode.length) { alert("🚀 GOD MODE ON! 🚀"); cursor = 0; } } else { cursor = 0; }
});