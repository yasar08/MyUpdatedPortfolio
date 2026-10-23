// ============ HELPERS ============
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

// ============ THEME TOGGLE ============
const themeBtn = $("#themeToggle");
const savedTheme = localStorage.getItem("theme");
if (savedTheme) document.documentElement.setAttribute("data-theme", savedTheme);
updateThemeIcon();

themeBtn.addEventListener("click", () => {
    const next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    updateThemeIcon();
});

function updateThemeIcon() {
    const light = document.documentElement.getAttribute("data-theme") === "light";
    themeBtn.innerHTML = light ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
}

// ============ MOBILE MENU ============
const navLinks = $("#navLinks");
$("#menuBtn").addEventListener("click", () => navLinks.classList.toggle("open"));
$$("#navLinks a").forEach((a) => a.addEventListener("click", () => navLinks.classList.remove("open")));

// ============ SCROLL: NAV STATE, ACTIVE LINK, TO TOP ============
const nav = $("#nav");
const toTop = $("#toTop");
const sections = $$("main section[id]");
const links = $$("#navLinks a:not(.btn)");

window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 20);
    toTop.classList.toggle("show", window.scrollY > 500);

    let current = "";
    sections.forEach((sec) => {
        if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
    });
    links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + current));
});
toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// ============ TYPING EFFECT ============
const words = ["Java Full Stack Developer", "Frontend Developer", "Web Designer", "Problem Solver"];
const typedEl = $("#typed");
let wi = 0, ci = 0, deleting = false;

function type() {
    const word = words[wi];
    typedEl.textContent = word.substring(0, ci);
    if (!deleting && ci < word.length) { ci++; setTimeout(type, 85); }
    else if (!deleting) { deleting = true; setTimeout(type, 1500); }
    else if (ci > 0) { ci--; setTimeout(type, 40); }
    else { deleting = false; wi = (wi + 1) % words.length; setTimeout(type, 300); }
}
type();

// ============ PROFILE IMAGE FALLBACK ============
const img = $("#profileImg");
img.addEventListener("error", () => {
    const fb = document.createElement("div");
    fb.className = "photo-fallback";
    fb.textContent = "YA";
    img.replaceWith(fb);
});

// ============ SCROLL REVEAL + COUNTERS ============
const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            el.classList.add("visible");
            $$("[data-count]", el).forEach(animateCount);
            observer.unobserve(el);
        });
    },
    { threshold: 0.12 }
);
$$(".reveal").forEach((el) => observer.observe(el));

function animateCount(el) {
    const target = +el.dataset.count;
    const duration = 1400;
    const start = performance.now();
    function step(now) {
        const p = Math.min((now - start) / duration, 1);
        el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target);
        if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

// ============ CERTIFICATE LIGHTBOX ============
const lightbox = $("#lightbox");
const lbImg = $("#lbImg");
const lbTitle = $("#lbTitle");

$$(".view-cert").forEach((btn) => {
    btn.addEventListener("click", () => {
        lbImg.src = btn.dataset.img;
        lbTitle.textContent = btn.dataset.title;
        lightbox.classList.add("open");
        document.body.style.overflow = "hidden";
    });
});

function closeLightbox() {
    lightbox.classList.remove("open");
    lbImg.src = "";
    document.body.style.overflow = "";
}
$("#lbClose").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });

// ============ CONTACT FORM (Formspree - messages go to your Gmail) ============
const form = $("#contactForm");
const msg = $("#formMsg");
const FORM_URL = "https://formspree.io/f/moeeqglb";

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  let valid = true;

  ["name", "email", "message"].forEach((id) => {
    const input = $("#" + id);
    const value = input.value.trim();
    const emailOk = id === "email" ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) : true;
    const ok = value !== "" && emailOk;
    input.closest(".field").classList.toggle("error", !ok);
    if (!ok) valid = false;
  });

  if (!valid) {
    msg.textContent = "Please fill all fields correctly.";
    msg.className = "form-msg err";
    return;
  }

  const btn = form.querySelector("button[type=submit]");
  const oldHTML = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
  msg.textContent = "";

  try {
    const res = await fetch(FORM_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        name: $("#name").value.trim(),
        email: $("#email").value.trim(),
        message: $("#message").value.trim(),
      }),
    });
    if (!res.ok) throw new Error("Request failed");
    msg.textContent = "Thank you! Your message has been sent. I'll reply soon.";
    msg.className = "form-msg ok";
    form.reset();
  } catch (err) {
    msg.textContent = "Could not send the message. Please email me at yasar2002j@gmail.com.";
    msg.className = "form-msg err";
  } finally {
    btn.disabled = false;
    btn.innerHTML = oldHTML;
  }
});

// ============ FOOTER YEAR ============
$("#year").textContent = new Date().getFullYear();
