let activeIntervals = [];

document.addEventListener('DOMContentLoaded', () => {
    // 1. BAŞLANGIÇ
    window.scrollTo(0, 0);

    // 2. DİL
    const storedLang = localStorage.getItem('language');
    if (!storedLang || storedLang === 'en') {
        setLanguage('en');
    } else {
        document.getElementById('lang-btn').innerText = 'EN';
        runHeroSequence("Merhaba, ben ", "Emin");
        typeWriterNav("Muhammet Emin Şen");
    }

    if(window.particlesJS) {
        particlesJS("particles-js", {
            "particles": {
                "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": "#ffffff" },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.5, "random": true },
                
                // --- BURAYI DEĞİŞTİRDİM ---
                "size": { 
                    "value": 1.5,  // Eskiden 3'tü, şimdi 1.5 yaptık (Daha küçük)
                    "random": true // Rastgele boyutlarda olsun (doğallık katar)
                },
                // ---------------------------

                "line_linked": { 
                    "enable": true, 
                    "distance": 150, 
                    "color": "#8b5cf6", 
                    "opacity": 0.2, 
                    "width": 1 // Çizgiler kalın gelirse burayı da 0.5 yapabilirsin
                },
                "move": { "enable": true, "speed": 2 } 
            },
            "interactivity": { "events": { "onhover": { "enable": true, "mode": "repulse" }, "onclick": { "enable": true, "mode": "push" } } },
            "retina_detect": true
        });
    }

    duplicateSlides('projects-slider');
    duplicateSlides('jams-slider');

    // 4. SCROLL İŞLEMLERİ (Smooth Scroll & Animasyon)
    setupSmoothScrollCenter();
    setupScrollAnimations(); // YENİ EKLENEN FONKSİYON
});

// --- YENİ: GÖRÜNÜR OLUNCA AÇILIP KAPANAN ANİMASYON ---
function setupScrollAnimations() {
    // Animasyon uygulanacak elementleri seç
    // (Barlar, Kartlar, Bölümler, Hero içindeki yazılar)
    const observerElements = document.querySelectorAll('.tech-stack-bar, .section-title, .slider-card, .exp-card, .about-text, .timeline-item');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            // Ekrana girdi mi?
            if (entry.isIntersecting) {
                entry.target.classList.add('show-animate');
            } else {
                // Ekrandan çıktı mı? (Sınıfı sil ki tekrar gelince animasyon baştan başlasın)
                entry.target.classList.remove('show-animate');
            }
        });
    }, {
        threshold: 0.15 // Öğenin %15'i görününce tetikle
    });

    // Seçilen her elemente başlangıç sınıfını ekle ve izlemeye başla
    observerElements.forEach((el) => {
        el.classList.add('hidden-animate');
        observer.observe(el);
    });
}

// --- MEVCUT YUMUŞAK KAYDIRMA ---
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

// --- DİĞER FONKSİYONLAR (AYNEN KORUNDU) ---
function clearAllTypeWriters() { activeIntervals.forEach(id => clearInterval(id)); activeIntervals = []; }
function duplicateSlides(sliderId) { const track = document.getElementById(sliderId); track.innerHTML += track.innerHTML; }
let slideIndices = { 'projects-slider': 0, 'jams-slider': 0 };

function moveSlide(sliderId, direction) {
    const track = document.getElementById(sliderId);
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

function runHeroSequence(prefixText, nameText) {
    clearAllTypeWriters();
    const prefixEl = document.getElementById('hero-prefix');
    const nameEl = document.getElementById('hero-name');
    const hiddenContent = document.getElementById('hero-hidden-content');
    prefixEl.innerHTML = ""; nameEl.innerHTML = ""; hiddenContent.classList.remove('visible');
    typeWriterCore(prefixText, prefixEl, () => {
        typeWriterCore(nameText, nameEl, () => { hiddenContent.classList.add('visible'); });
    });
}
function typeWriterNav(text) { const el = document.getElementById('nav-logo'); el.innerHTML = ""; typeWriterCore(text, el, null); }
function typeWriterCore(text, element, callback) {
    let i = 0;
    let interval = setInterval(() => {
        if (i < text.length) { element.innerHTML += text.charAt(i); i++; } 
        else { clearInterval(interval); if (callback) callback(); }
    }, 100);
    activeIntervals.push(interval);
}
function toggleLanguage() {
    const currentLang = localStorage.getItem('language') || 'en';
    const newLang = currentLang === 'en' ? 'tr' : 'en';
    setLanguage(newLang);
}
function setLanguage(lang) {
    clearAllTypeWriters();
    localStorage.setItem('language', lang);
    const btn = document.getElementById('lang-btn');
    if(btn) btn.innerText = lang === 'en' ? 'TR' : 'EN';
    const elements = document.querySelectorAll('[data-en]');
    elements.forEach(el => {
        if (lang === 'en') {
            if (!el.getAttribute('data-tr')) el.setAttribute('data-tr', el.innerHTML);
            el.innerHTML = el.getAttribute('data-en');
        } else {
            if (el.getAttribute('data-tr')) el.innerHTML = el.getAttribute('data-tr');
        }
    });
    if (lang === 'en') { runHeroSequence("Hi, I'm ", "Emin"); typeWriterNav("Muhammet Emin Şen"); } 
    else { runHeroSequence("Merhaba, ben ", "Emin"); typeWriterNav("Muhammet Emin Şen"); }
}
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let cursor = 0;
document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[cursor]) { cursor++; if (cursor === konamiCode.length) { alert("🚀 GOD MODE ON! 🚀"); cursor = 0; } } else { cursor = 0; }
});
// ÇEREZ UYARISI KONTROLÜ
const cookieBanner = document.getElementById("cookie-banner");
const cookieBtn = document.querySelector("#cookie-banner button");

// Eğer kullanıcı daha önce "Anladım" dediyse kutuyu gösterme
if (localStorage.getItem("cookiesAccepted") === "true") {
    cookieBanner.style.display = "none";
}

// Butona basınca kutuyu gizle ve hafızaya kaydet
function acceptCookies() {
    cookieBanner.style.display = "none";
    localStorage.setItem("cookiesAccepted", "true");
}


