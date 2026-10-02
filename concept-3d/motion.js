// Cinematic motion for the signed-in tabs, in the style of the concept page:
// each tab's hero rises in when it opens, and scrolling dims the 3D backdrop
// and eases the camera back so the content takes over.
const { gsap, ScrollTrigger } = window;

if (gsap && ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.ticker.lagSmoothing(0); // on slow frames, finish on time rather than stall half-faded
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');

  // Scroll progress over the first 70% of a screen drives the backdrop.
  const proxy = { p: 0 };
  gsap.to(proxy, {
    p: 1,
    ease: 'none',
    scrollTrigger: { trigger: document.body, start: 'top top', end: () => '+=' + innerHeight * 0.7, scrub: reduce.matches ? true : 0.6 },
    onUpdate() {
      root.style.setProperty('--stage-o', (1 - 0.68 * proxy.p).toFixed(3));
      dispatchEvent(new CustomEvent('stage-scroll', { detail: proxy.p }));
    },
  });

  const tabEl = tab => document.getElementById('tab' + tab[0].toUpperCase() + tab.slice(1));

  function enter(tab) {
    if (reduce.matches) return;
    const el = tabEl(tab);
    if (!el) return;
    const hero = el.querySelectorAll('.tab-hero > *');
    const rest = [...el.querySelectorAll('.main-wrap > :not(.tab-hero)')].slice(0, 4);
    const show = { y: 0, autoAlpha: 1, overwrite: true, clearProps: 'transform,opacity,visibility' };
    gsap.timeline({ defaults: { duration: 0.8, ease: 'power3.out' } })
      .fromTo(hero, { y: 32, autoAlpha: 0 }, { ...show, stagger: 0.09 })
      .fromTo(rest, { y: 24, autoAlpha: 0 }, { ...show, duration: 0.6, stagger: 0.07 }, '-=0.5');
  }

  if (typeof window.showTab === 'function') {
    const showTab = window.showTab;
    window.showTab = (tab, ...rest) => {
      const out = showTab(tab, ...rest);
      enter(tab);
      ScrollTrigger.refresh();
      return out;
    };
  }
}
