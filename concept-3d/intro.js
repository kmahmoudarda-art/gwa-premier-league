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
  // Open on the stadium photo, push in, then dissolve to the 3D pitch;
  // the first stop's badges arrive once the pitch is showing.
  tl.fromTo('#intro .photo', { scale: 1 }, { scale: 1.12, duration: 0.6, ease: 'none' }, 0)
    .to('#intro .photo', { autoAlpha: 0, duration: 0.3 }, 0.2)
    .fromTo(stops[0].querySelectorAll('.badge'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15 }, 0.4);
  stops.forEach((stop, i) => {
    const h = stop.querySelector('h2');
    if (i > 0) tl.fromTo(stop, { autoAlpha: 0 }, { autoAlpha: 1 }, i - 0.35)
      .fromTo(h, { filter: 'blur(8px)', y: 24 }, { filter: 'blur(0px)', y: 0 }, i - 0.35);
    tl.to(stop, { autoAlpha: 0 }, i + 0.5).to(h, { filter: 'blur(8px)', y: -24 }, i + 0.5);
  });
  tl.set({}, {}, stops.length); // timeline spans one unit per stop
}
