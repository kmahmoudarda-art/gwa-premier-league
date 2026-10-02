// Cinematic motion for the site, in the style of the concept page: each page
// has a full-bleed night photo that pushes in when it appears and drifts and
// dims as you scroll, and each tab's hero rises in out of a blur.
const { gsap, ScrollTrigger } = window;
const root = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const photo = document.getElementById('tabPhoto');
const appPage = document.getElementById('appPage');
let tab = 'predictions';

// Signed-in pages get the night palette; signed out shows the sign-in photo.
// The sign-in page is always dark: a light choice is held back until sign-in.
let wantLight = document.body.classList.contains('light');
function syncPage() {
  const body = document.body;
  const inApp = !!appPage?.classList.contains('active');
  if (!inApp && body.classList.contains('light')) { wantLight = true; body.classList.remove('light'); }
  else if (inApp && body.classList.contains('in-app')) wantLight = body.classList.contains('light');
  else if (inApp && wantLight) body.classList.add('light');
  body.classList.toggle('in-app', inApp);
  swapPhoto(inApp ? tab : 'signin');
}
new MutationObserver(syncPage).observe(document.body, { attributes: true, attributeFilter: ['class'] });

function swapPhoto(view) {
  if (!photo || photo.dataset.view === view) return;
  if (!gsap || reduce.matches) { photo.dataset.view = view; return; }
  gsap.to(photo, { autoAlpha: 0, duration: 0.25, overwrite: 'auto', onComplete() {
    photo.dataset.view = view;
    gsap.fromTo(photo, { autoAlpha: 0, scale: 1.08 }, { autoAlpha: 1, scale: 1, duration: 2.4, ease: 'power2.out', overwrite: 'auto' });
  } });
}

if (appPage) new MutationObserver(syncPage).observe(appPage, { attributes: true, attributeFilter: ['class'] });

if (gsap && ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.ticker.lagSmoothing(0); // on slow frames, finish on time rather than stall half-faded

  // Scroll progress over the first 70% of a screen dims the photo and lets it drift up.
  const proxy = { p: 0 };
  gsap.to(proxy, {
    p: 1,
    ease: 'none',
    scrollTrigger: { trigger: document.body, start: 'top top', end: () => '+=' + innerHeight * 0.7, scrub: reduce.matches ? true : 0.6 },
    onUpdate() {
      root.style.setProperty('--stage-o', (1 - 0.6 * proxy.p).toFixed(3));
      if (photo && !reduce.matches) gsap.set(photo, { yPercent: -3 * proxy.p });
    },
  });

  // Signed-out home: each story stop brings in its photo and its headline.
  const stops = [...document.querySelectorAll('.intro-stop')];
  stops.forEach((stop, i) => {
    ScrollTrigger.create({
      trigger: stop, start: 'top 55%', end: 'bottom 55%',
      onToggle(self) {
        if (document.body.classList.contains('in-app')) return;
        if (self.isActive) swapPhoto(stop.dataset.photo);
        else if (i === 0 && self.direction < 0) swapPhoto('signin');
      },
    });
    if (!reduce.matches) gsap.from(stop.children, {
      y: 36, autoAlpha: 0, filter: 'blur(12px)', duration: 1, ease: 'power3.out', stagger: 0.12,
      scrollTrigger: { trigger: stop, start: 'top 70%', toggleActions: 'play none none reverse' },
    });
  });

  const tabEl = t => document.getElementById('tab' + t[0].toUpperCase() + t.slice(1));

  function enter(t) {
    if (reduce.matches) return;
    const el = tabEl(t);
    if (!el) return;
    const hero = el.querySelectorAll('.tab-hero > *');
    const rest = [...el.querySelectorAll('.main-wrap > :not(.tab-hero)')].slice(0, 4);
    const show = { y: 0, autoAlpha: 1, filter: 'blur(0px)', overwrite: true, clearProps: 'transform,opacity,visibility,filter' };
    gsap.timeline({ defaults: { duration: 0.9, ease: 'power3.out' } })
      .fromTo(hero, { y: 32, autoAlpha: 0, filter: 'blur(10px)' }, { ...show, stagger: 0.09 })
      .fromTo(rest, { y: 24, autoAlpha: 0 }, { ...show, duration: 0.6, stagger: 0.07 }, '-=0.5');
  }

  if (typeof window.showTab === 'function') {
    const showTab = window.showTab;
    window.showTab = (t, ...rest) => {
      const out = showTab(t, ...rest);
      tab = t;
      syncPage();
      enter(t);
      ScrollTrigger.refresh();
      return out;
    };
  }
}

syncPage();
