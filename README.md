# Muhammad Umair — Portfolio

Dark, 3D-animated portfolio website. Pure HTML/CSS/JS with GSAP animations — no build tools, so it can be hosted anywhere for free, including Vercel.

## What's inside
- `index.html` — the whole site
- `css/style.css` — design system (dark theme, glassmorphism, 3D)
- `js/app.js` — GSAP intro, 3D tilt, parallax, magnetic buttons, custom cursor
- `img/portrait.jpg` — hero portrait

## Effects
- Loader intro with letter-stagger name reveal
- 3D mouse-tilt on the portrait + parallax layers
- Glassmorphism sidebar with gradient-highlighted rows
- Floating 3D project cards
- Custom cursor with hover states
- Magnetic buttons
- Scroll-triggered reveals (GSAP ScrollTrigger)
- Skills marquee strip

## Deploy on Vercel
1. Push this folder to a GitHub repo.
2. Vercel → Add New → Project → import the repo.
3. Framework preset: **Other**. No build command. Output directory: leave blank.
4. Deploy.

## Customize
- Photo: replace `img/portrait.jpg`
- Links, projects and counts: edit `index.html`
- Colors: edit the `:root` variables at the top of `css/style.css`
