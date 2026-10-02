// Pinned intro: as the camera moves between stops, the old line blurs out and
// the next one sharpens in. scene.js moves the camera from the same scroll.
const { gsap, ScrollTrigger } = window;
const stops = [...document.querySelectorAll('#intro .stop')];

if (gsap && ScrollTrigger && stops.length && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  gsap.registerPlugin(ScrollTrigger);
  const tl = gsap.timeline({
    defaults: { duration: 0.3, ease: 'power2.inOut' },
    scrollTrigger: { trigger: '#intro', start: 'top top', end: 'bottom bottom', scrub: 0.5 },
  });
  stops.forEach((stop, i) => {
    const h = stop.querySelector('h2');
    if (i > 0) tl.fromTo(stop, { autoAlpha: 0 }, { autoAlpha: 1 }, i - 0.35)
      .fromTo(h, { filter: 'blur(8px)', y: 24 }, { filter: 'blur(0px)', y: 0 }, i - 0.35);
    tl.to(stop, { autoAlpha: 0 }, i + 0.5).to(h, { filter: 'blur(8px)', y: -24 }, i + 0.5);
  });
  tl.set({}, {}, stops.length); // timeline spans one unit per stop
}
