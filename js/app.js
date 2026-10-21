/* MUHAMMAD UMair — animations: GSAP intro, 3D tilt, parallax, magnetic buttons, cursor */
gsap.registerPlugin(ScrollTrigger);

const isTouch = window.matchMedia("(pointer: coarse)").matches;

/* ---------- LOADER INTRO ---------- */
const loaderTl = gsap.timeline();
loaderTl
  .to(".loader-name span", { y: 0, duration: 0.9, stagger: 0.05, ease: "power4.out" }, 0.2)
  .to(".loader-bar span", { width: "100%", duration: 1.4, ease: "power2.inOut" }, 0.3)
  .to(".loader", {
    yPercent: -100, duration: 0.9, ease: "power4.inOut",
    onComplete: () => document.getElementById("loader").remove()
  }, 1.9);

/* ---------- HERO REVEAL ---------- */
gsap.set([".hero-name .line", ".hero-meta", ".sidebar", ".chip-about", ".hero-name"], { autoAlpha: 0 });
gsap.set(".hero-name .line", { yPercent: 60 });
gsap.set(".sidebar", { x: 80 });

const heroTl = gsap.timeline({ delay: 2.1 });
heroTl
  .to(".hero-name .line", { yPercent: 0, duration: 1.1, stagger: 0.12, ease: "power4.out", autoAlpha: 1 })
  .to(".hero-name, .hero-meta", { autoAlpha: 1, duration: 0.4 }, 0)
  .to(".chip-about", { autoAlpha: 1, duration: 0.5 }, 0.4)
  .to(".sidebar", { x: 0, autoAlpha: 1, duration: 1, ease: "power3.out" }, 0.3)
  .from(".work-row", { x: 40, autoAlpha: 0, duration: 0.6, stagger: 0.07, ease: "power3.out" }, 0.5)
  .from(".social, .book-call", { scale: 0, autoAlpha: 0, duration: 0.5, stagger: 0.08, ease: "back.out(1.6)" }, 0.9)
  .from(".fcard", { autoAlpha: 0, y: 40, rotate: 0, duration: 0.8, stagger: 0.15, ease: "power3.out" }, 0.7);

/* ---------- PORTRAIT 3D TILT + PARALLAX ---------- */
const stage = document.getElementById("portraitStage");
const tilt = document.getElementById("portraitTilt");
const heroName = document.getElementById("heroName");
const floatCards = document.getElementById("floatCards");

if (!isTouch && tilt) {
  const rx = gsap.quickTo(tilt, "rotationX", { duration: 0.6, ease: "power3" });
  const ry = gsap.quickTo(tilt, "rotationY", { duration: 0.6, ease: "power3" });

  window.addEventListener("mousemove", (e) => {
    const nx = e.clientX / window.innerWidth - 0.5;
    const ny = e.clientY / window.innerHeight - 0.5;
    rx(ny * -7); ry(nx * 9);

    gsap.to(heroName, { x: nx * -14, y: ny * -8, duration: 1, ease: "power3.out", overwrite: "auto" });
    gsap.to(floatCards, { x: nx * 26, y: ny * 18, duration: 1.2, ease: "power3.out", overwrite: "auto" });
  });
}

/* ---------- CURSOR ---------- */
if (!isTouch) {
  const dot = document.getElementById("cursorDot");
  const ring = document.getElementById("cursorRing");
  const dx = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power2" });
  const dy = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power2" });
  const rx2 = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power2" });
  const ry2 = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power2" });

  window.addEventListener("mousemove", (e) => {
    dx(e.clientX); dy(e.clientY); rx2(e.clientX); ry2(e.clientY);
    const t = e.target.closest("a, .work-row, .pcard, button");
    ring.classList.toggle("hovering", !!t);
  });
}

/* ---------- MAGNETIC BUTTONS ---------- */
document.querySelectorAll(".magnetic").forEach((el) => {
  el.addEventListener("mousemove", (e) => {
    const r = el.getBoundingClientRect();
    gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * 0.35, y: (e.clientY - r.top - r.height / 2) * 0.35, duration: 0.4, ease: "power3.out" });
  });
  el.addEventListener("mouseleave", () => gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" }));
});

/* ---------- WORKS ROW CLICK ---------- */
document.querySelectorAll(".work-row").forEach((row) => {
  row.addEventListener("click", () => {
    const target = row.dataset.href;
    document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
  });
});

/* ---------- SCROLL REVEALS ---------- */
gsap.utils.toArray(".reveal-line").forEach((el) => {
  gsap.from(el, {
    autoAlpha: 0, y: 50, duration: 1, ease: "power3.out",
    scrollTrigger: { trigger: el, start: "top 88%" }
  });
});

gsap.utils.toArray(".stat").forEach((el, i) => {
  gsap.from(el, {
    autoAlpha: 0, y: 40, duration: 0.8, delay: i * 0.1, ease: "power3.out",
    scrollTrigger: { trigger: el, start: "top 90%" }
  });
});

/* ---------- PROJECT CARD 3D TILT ---------- */
document.querySelectorAll(".tilt-card").forEach((card) => {
  if (isTouch) return;
  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(card, { rotationY: nx * 10, rotationX: ny * -10, transformPerspective: 900, duration: 0.5, ease: "power3.out" });
  });
  card.addEventListener("mouseleave", () => {
    gsap.to(card, { rotationY: 0, rotationX: 0, duration: 0.9, ease: "elastic.out(1, 0.5)" });
  });
});

gsap.utils.toArray(".pcard").forEach((el, i) => {
  gsap.from(el, {
    autoAlpha: 0, y: 60, duration: 0.9, delay: (i % 3) * 0.08, ease: "power3.out",
    scrollTrigger: { trigger: el, start: "top 92%" }
  });
});

/* ---------- HERO PARALLAX OUT ON SCROLL ---------- */
gsap.to(".portrait-tilt", {
  yPercent: -6, ease: "none",
  scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
});

/* ---------- MARQUEE PAUSE ON HOVER ---------- */
const marquee = document.querySelector(".marquee-track");
if (marquee) {
  marquee.addEventListener("mouseenter", () => (marquee.style.animationPlayState = "paused"));
  marquee.addEventListener("mouseleave", () => (marquee.style.animationPlayState = "running"));
}
