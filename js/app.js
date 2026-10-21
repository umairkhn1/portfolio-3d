/* MUHAMMAD UMair — animations: GSAP intro, 3D tilt, particles, glare, magnetic buttons, cursor */
gsap.registerPlugin(ScrollTrigger);

const isTouch = window.matchMedia("(pointer: coarse)").matches;

/* ---------- 3D PARTICLE FIELD (hero background, depth-parallaxed) ---------- */
(function particleField() {
  const hero = document.querySelector(".hero");
  if (!hero) return;
  const canvas = document.createElement("canvas");
  canvas.className = "hero-particles";
  hero.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  let w, h;
  const parts = [];
  function size() { w = canvas.width = hero.offsetWidth; h = canvas.height = hero.offsetHeight; }
  size();
  window.addEventListener("resize", size);
  for (let i = 0; i < 90; i++) {
    parts.push({
      x: Math.random(), y: Math.random(),
      z: Math.random() * 0.9 + 0.1,
      r: Math.random() * 1.7 + 0.4,
      vx: (Math.random() - 0.5) * 0.00025,
      vy: (Math.random() - 0.5) * 0.00025
    });
  }
  let mx = 0, my = 0, tx = 0, ty = 0;
  window.addEventListener("mousemove", (e) => {
    tx = e.clientX / window.innerWidth - 0.5;
    ty = e.clientY / window.innerHeight - 0.5;
  });
  (function tick() {
    mx += (tx - mx) * 0.05;
    my += (ty - my) * 0.05;
    ctx.clearRect(0, 0, w, h);
    for (const p of parts) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > 1) p.vx *= -1;
      if (p.y < 0 || p.y > 1) p.vy *= -1;
      const px = (p.x + mx * 0.07 * p.z) * w;
      const py = (p.y + my * 0.07 * p.z) * h;
      ctx.beginPath();
      ctx.arc(px, py, p.r * p.z, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 140, 0, " + (0.12 + 0.5 * p.z) + ")";
      ctx.fill();
    }
    requestAnimationFrame(tick);
  })();
})();

/* ---------- LOADER INTRO (letters slam, curtain exit with skew) ---------- */
const loaderTl = gsap.timeline();
loaderTl
  .fromTo(".loader-name span",
    { y: "-120%", rotationX: 90 },
    { y: "0%", rotationX: 0, duration: 0.9, stagger: 0.06, ease: "back.out(1.8)" }, 0.2)
  .to(".loader-bar span", { width: "100%", duration: 1.3, ease: "power2.inOut" }, 0.3)
  .to(".loader", {
    yPercent: -100, skewY: 3, duration: 0.9, ease: "power4.inOut",
    onComplete: () => document.getElementById("loader").remove()
  }, 1.8);

/* ---------- HERO REVEAL ---------- */
gsap.set([".hero-name .line", ".hero-meta", ".sidebar", ".chip-about", ".hero-name"], { autoAlpha: 0 });
gsap.set(".hero-name .line", { yPercent: 70 });
gsap.set(".sidebar", { x: 90 });

const heroTl = gsap.timeline({ delay: 2.05 });

/* portrait 3D swing-in from deep rotated position */
heroTl.from(".portrait-tilt", {
  rotationY: -26, rotationX: 12, autoAlpha: 0, scale: 0.88,
  duration: 1.6, ease: "power3.out"
}, 0.1);

heroTl
  .to(".hero-name .line", { yPercent: 0, duration: 1.1, stagger: 0.12, ease: "power4.out", autoAlpha: 1 }, 0.35)
  .to(".hero-name, .hero-meta", { autoAlpha: 1, duration: 0.4 }, 0.3)
  .to(".chip-about", { autoAlpha: 1, duration: 0.5 }, 0.45)
  .to(".sidebar", { x: 0, autoAlpha: 1, duration: 1, ease: "power3.out" }, 0.5)
  .from(".work-row", { x: 40, autoAlpha: 0, duration: 0.6, stagger: 0.07, ease: "power3.out" }, 0.7)
  .from(".social, .book-call", { scale: 0, autoAlpha: 0, duration: 0.5, stagger: 0.08, ease: "back.out(1.6)" }, 1.1)
  .from(".fcard", { autoAlpha: 0, y: 40, rotation: 0, duration: 0.8, stagger: 0.15, ease: "power3.out" }, 0.9);

/* idle float: portrait + floating cards breathe */
gsap.to(".portrait-tilt", { y: 14, duration: 3.6, yoyo: true, repeat: -1, ease: "sine.inOut" });
document.querySelectorAll(".fcard").forEach((card, i) => {
  gsap.to(card, { y: 16 + i * 6, duration: 2.8 + i * 0.7, yoyo: true, repeat: -1, ease: "sine.inOut", delay: i * 0.3 });
});

/* ---------- PORTRAIT 3D TILT + PARALLAX ---------- */
const stage = document.getElementById("portraitStage");
const tilt = document.getElementById("portraitTilt");
const heroName = document.getElementById("heroName");
const floatCards = document.getElementById("floatCards");

if (!isTouch && tilt) {
  const rx = gsap.quickTo(tilt, "rotationX", { duration: 0.6, ease: "power3" });
  const ry = gsap.quickTo(tilt, "rotationY", { duration: 0.6, ease: "power3" });
  const glow = document.querySelector(".portrait-glow");
  const gx = glow ? gsap.quickTo(glow, "x", { duration: 0.8, ease: "power3" }) : null;
  const gy = glow ? gsap.quickTo(glow, "y", { duration: 0.8, ease: "power3" }) : null;

  window.addEventListener("mousemove", (e) => {
    const nx = e.clientX / window.innerWidth - 0.5;
    const ny = e.clientY / window.innerHeight - 0.5;
    rx(ny * -10); ry(nx * 13);
    if (gx && gy) { gx(nx * -40); gy(ny * -30); }

    gsap.to(heroName, { x: nx * -22, y: ny * -12, duration: 1, ease: "power3.out", overwrite: "auto" });
    gsap.to(floatCards, { x: nx * 36, y: ny * 26, duration: 1.2, ease: "power3.out", overwrite: "auto" });
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

/* ---------- MAGNETIC BUTTONS (stronger pull) ---------- */
document.querySelectorAll(".magnetic").forEach((el) => {
  el.addEventListener("mousemove", (e) => {
    const r = el.getBoundingClientRect();
    gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * 0.45, y: (e.clientY - r.top - r.height / 2) * 0.45, duration: 0.4, ease: "power3.out" });
  });
  el.addEventListener("mouseleave", () => gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.35)" }));
});

/* ---------- WORKS ROW CLICK + HOVER PUSH ---------- */
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

/* ---------- PROJECT CARDS: 3D TILT + CURSOR GLARE ---------- */
document.querySelectorAll(".tilt-card").forEach((card) => {
  const glare = document.createElement("div");
  glare.className = "glare";
  card.appendChild(glare);

  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    glare.style.setProperty("--mx", (e.clientX - r.left) + "px");
    glare.style.setProperty("--my", (e.clientY - r.top) + "px");
    if (!isTouch) {
      gsap.to(card, {
        rotationY: nx * 15, rotationX: ny * -15, scale: 1.02,
        transformPerspective: 900, duration: 0.5, ease: "power3.out"
      });
    }
  });
  card.addEventListener("mouseleave", () => {
    gsap.to(card, { rotationY: 0, rotationX: 0, scale: 1, duration: 1, ease: "elastic.out(1, 0.45)" });
  });
});

gsap.utils.toArray(".pcard").forEach((el, i) => {
  gsap.from(el, {
    autoAlpha: 0, y: 70, rotationX: 8, duration: 0.9, delay: (i % 3) * 0.08, ease: "power3.out",
    scrollTrigger: { trigger: el, start: "top 92%" }
  });
});

/* ---------- HERO PARALLAX OUT ON SCROLL ---------- */
gsap.to(".portrait-tilt", {
  yPercent: -8, scale: 1.04, ease: "none",
  scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
});

/* ---------- MARQUEE PAUSE ON HOVER ---------- */
const marquee = document.querySelector(".marquee-track");
if (marquee) {
  marquee.addEventListener("mouseenter", () => (marquee.style.animationPlayState = "paused"));
  marquee.addEventListener("mouseleave", () => (marquee.style.animationPlayState = "running"));
}
