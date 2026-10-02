import * as THREE from 'three';

// ── Data (copied from index.html: TEAM_COLORS, TEAM_ABBR, MANUAL_RESULTS, STATIC_MATCHES) ──
const TEAMS = [
  ['Real Madrid','#00529F','RMA'], ['Barcelona','#A50044','BAR'], ['Atlético Madrid','#CB3524','ATM'],
  ['Paris Saint-Germain','#004170','PSG'], ['Bayern München','#DC052D','BAY'], ['Inter','#0068A8','INT'],
  ['Manchester City','#6CABDD','MCI'], ['Arsenal','#EF0107','ARS'], ['Liverpool','#C8102E','LIV'],
  ['Aston Villa','#670E36','AVL'], ['Manchester United','#DA291C','MUN'], ['Borussia Dortmund','#FDE100','BVB'],
  ['Napoli','#12A0D7','NAP'], ['Villarreal','#FFE400','VIL'], ['Porto','#003D7C','POR'],
  ['Lille','#DA1F2F','LIL'], ['Real Betis','#00954C','BET'], ['Feyenoord','#EE1010','FEY'],
  ['Stuttgart','#E32219','VFB'], ['Viking','#001489','VIK'], ['Slovan Bratislava','#0057A8','SLB'],
  ['Sporting CP','#006633','SCP'], ['Galatasaray','#A90432','GAL'], ['Fenerbahçe','#FFED00','FB'],
  ['Roma','#8E1F2B','ROM'], ['PSV Eindhoven','#ED1C24','PSV'], ['Shakhtar Donetsk','#FF7500','SHK'],
  ['Como','#004B87','COM'], ['Leipzig','#DD0741','RBL'], ['Bodø/Glimt','#FFD400','BOD'],
  ['Sabah','#1C3F94','SAB'], ['Slavia Praha','#B60E23','SLA'], ['Lens','#FFCC00','LEN'],
  ['AEK Athens','#F7D117','AEK'], ['LASK','#1A1A1A','LAS'], ['Club Brugge','#0066B3','CLB'],
];

const MD1 = [
  ['AEK Athens','LASK',1,0], ['Club Brugge','Aston Villa',2,3], ['Borussia Dortmund','Villarreal',3,2],
  ['Porto','Manchester City',0,2], ['Lille','Real Betis',2,3], ['Real Madrid','Inter',2,1],
  ['Barcelona','Feyenoord',5,1], ['Stuttgart','Viking',3,1], ['Liverpool','Atlético Madrid',2,1],
  ['Paris Saint-Germain','Slovan Bratislava',6,1], ['Sporting CP','Galatasaray',3,1], ['Napoli','Arsenal',0,1],
  ['Fenerbahçe','Roma',1,1], ['PSV Eindhoven','Shakhtar Donetsk',1,1], ['Como','Leipzig',4,1],
  ['Bayern München','Bodø/Glimt',5,0], ['Manchester United','Sabah',4,0], ['Slavia Praha','Lens',2,3],
];

const MD2 = [
  ['Lens','Sporting CP'], ['Sabah','Slavia Praha'], ['Arsenal','Lille'], ['Atlético Madrid','Manchester United'],
  ['Inter','Club Brugge'], ['Galatasaray','Barcelona'], ['Leipzig','PSV Eindhoven'], ['Viking','Bayern München'],
  ['Villarreal','Napoli'], ['Feyenoord','Como'], ['LASK','Liverpool'], ['Roma','Real Madrid'],
  ['Aston Villa','Fenerbahçe'], ['Shakhtar Donetsk','AEK Athens'], ['Bodø/Glimt','Borussia Dortmund'],
  ['Manchester City','Paris Saint-Germain'], ['Real Betis','Porto'], ['Slovan Bratislava','Stuttgart'],
];

// ── Standings after matchday 1 ──
const clubs = TEAMS.map(([name, color, abbr]) => ({ name, color, abbr, pts: 0, gf: 0, ga: 0, md1: '' }));
const byName = Object.fromEntries(clubs.map(c => [c.name, c]));
for (const [h, a, hg, ag] of MD1) {
  const H = byName[h], A = byName[a];
  H.gf += hg; H.ga += ag; A.gf += ag; A.ga += hg;
  if (hg > ag) H.pts += 3; else if (ag > hg) A.pts += 3; else { H.pts++; A.pts++; }
  H.md1 = A.md1 = `${h} ${hg}–${ag} ${a}`;
}
const table = [...clubs].sort((x, y) =>
  y.pts - x.pts || (y.gf - y.ga) - (x.gf - x.ga) || y.gf - x.gf || x.name.localeCompare(y.name));
table.forEach((c, i) => { c.rank = i + 1; });

const ordinal = n => { const s = ['th','st','nd','rd'], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); };
const gd = c => { const d = c.gf - c.ga; return d > 0 ? `+${d}` : `${d}`; };

// Accessible list (also the visible fallback without WebGL)
document.getElementById('standings').innerHTML = table
  .map(c => `<li>${c.name}, ${c.pts} pts, goal difference ${gd(c)}</li>`).join('');

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarse = matchMedia('(pointer: coarse)').matches;
if (coarse) document.getElementById('hint').textContent = 'Tap a club to see its matchday 1 result.';

// ── Renderer ──
const canvas = document.getElementById('stage');
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
} catch (e) {
  document.body.classList.add('no-webgl');
  throw e;
}
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const NIGHT = new THREE.Color('#050d1f');
const scene = new THREE.Scene();
scene.background = NIGHT;
scene.fog = new THREE.Fog(NIGHT, 24, 52);

const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 200);

// ── Pitch ──
// Canvas covers 113 × 76 m: a 105 × 68 m pitch with a 4 m margin.
const PITCH_W = 22, PITCH_D = PITCH_W * 76 / 113;
function pitchTexture() {
  const W = 2260, H = 1520, m = W / 113;
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d');
  for (let i = 0; i < 14; i++) {
    g.fillStyle = i % 2 ? '#0f3d27' : '#124530';
    g.fillRect(i * W / 14, 0, W / 14 + 1, H);
  }
  g.strokeStyle = 'rgba(238,242,234,.78)'; g.lineWidth = 0.14 * m;
  const x0 = 4 * m, y0 = 4 * m, pw = 105 * m, ph = 68 * m, cx = W / 2, cy = H / 2;
  g.strokeRect(x0, y0, pw, ph);
  g.beginPath(); g.moveTo(cx, y0); g.lineTo(cx, y0 + ph); g.stroke();
  g.beginPath(); g.arc(cx, cy, 9.15 * m, 0, Math.PI * 2); g.stroke();
  for (const side of [0, 1]) {
    const dir = side ? -1 : 1, gx = side ? x0 + pw : x0;
    const box = (d, w) => g.strokeRect(side ? gx - d * m : gx, cy - w * m / 2, d * m, w * m);
    box(16.5, 40.32); box(5.5, 18.32);
    const spot = gx + dir * 11 * m;
    g.beginPath(); g.arc(spot, cy, 9.15 * m, -Math.acos(5.5 / 9.15) + (side ? Math.PI : 0), Math.acos(5.5 / 9.15) + (side ? Math.PI : 0)); g.stroke();
    g.fillStyle = 'rgba(238,242,234,.78)';
    g.beginPath(); g.arc(spot, cy, 0.3 * m, 0, Math.PI * 2); g.fill();
  }
  g.beginPath(); g.arc(cx, cy, 0.3 * m, 0, Math.PI * 2); g.fill();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return t;
}
const pitch = new THREE.Mesh(
  new THREE.PlaneGeometry(PITCH_W, PITCH_D),
  new THREE.MeshStandardMaterial({ map: pitchTexture(), roughness: 0.92 }));
pitch.rotation.x = -Math.PI / 2;
pitch.receiveShadow = true;
scene.add(pitch);

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(200, 200),
  new THREE.MeshStandardMaterial({ color: '#07160f', roughness: 1 }));
ground.rotation.x = -Math.PI / 2; ground.position.y = -0.01;
ground.receiveShadow = true;
scene.add(ground);

// ── Floodlights: four masts with a soft glow ──
function glowTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d');
  const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  r.addColorStop(0, 'rgba(255,250,235,1)'); r.addColorStop(0.25, 'rgba(255,245,220,.45)'); r.addColorStop(1, 'rgba(255,245,220,0)');
  g.fillStyle = r; g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}
const glowMat = new THREE.SpriteMaterial({ map: glowTexture(), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true });
const mastMat = new THREE.MeshStandardMaterial({ color: '#1b2536', roughness: 0.6, metalness: 0.4 });
const headMat = new THREE.MeshBasicMaterial({ color: '#fff8e6' });
scene.add(new THREE.HemisphereLight('#9fb4d9', '#0b1a10', 0.55));
const fill = new THREE.DirectionalLight('#dfe8ff', 0.9);
fill.position.set(0, 6, 24);
scene.add(fill);
[[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz], i) => {
  const x = sx * (PITCH_W / 2 + 3), z = sz * (PITCH_D / 2 + 3), h = 13;
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.2, h, 8), mastMat);
  mast.position.set(x, h / 2, z);
  scene.add(mast);
  const head = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.9, 0.2), headMat);
  head.position.set(x, h, z); head.lookAt(0, 0, 0);
  scene.add(head);
  const glow = new THREE.Sprite(glowMat);
  glow.position.copy(head.position); glow.scale.setScalar(6);
  scene.add(glow);
  const spot = new THREE.SpotLight('#fff3dc', 2.4, 0, 0.62, 0.7, 0);
  spot.position.set(x, h, z);
  spot.target.position.set(-sx * 3, 0, -sz * 2);
  if (i === 1) {
    spot.castShadow = true;
    spot.shadow.mapSize.set(2048, 2048);
    spot.shadow.bias = -0.0004;
  }
  scene.add(spot, spot.target);
});

// ── Club pucks ──
const R = 0.42, HGT = 0.16;
const puckGeo = new THREE.CylinderGeometry(R, R, HGT, 48);

function faceTexture(c) {
  const S = 256;
  const cv = document.createElement('canvas'); cv.width = cv.height = S;
  const g = cv.getContext('2d');
  g.fillStyle = c.color; g.fillRect(0, 0, S, S);
  const n = parseInt(c.color.slice(1), 16);
  const light = (0.299 * (n >> 16 & 255) + 0.587 * (n >> 8 & 255) + 0.114 * (n & 255)) > 150;
  g.fillStyle = light ? '#111' : '#fff';
  g.strokeStyle = light ? 'rgba(0,0,0,.35)' : 'rgba(255,255,255,.45)';
  g.lineWidth = 6;
  g.beginPath(); g.arc(S / 2, S / 2, S / 2 - 14, 0, Math.PI * 2); g.stroke();
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = '400 104px "Bebas Neue", sans-serif';
  g.fillText(c.abbr, S / 2, S / 2 - 6);
  g.font = '600 26px "Outfit", sans-serif';
  g.fillText(`${c.pts} PTS`, S / 2, S / 2 + 62);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  t.center.set(0.5, 0.5);
  t.rotation = Math.PI / 2; // cap UVs run sideways; turn text so it reads upright
  return t;
}

// Grid of 18 fixtures on the pitch (6 × 3), home on the left of each pair.
function fixtureSpots(fixtures) {
  const spots = {};
  fixtures.forEach(([h, a], k) => {
    const col = k % 6, row = Math.floor(k / 6);
    const x = -8.4 + col * 3.36, z = -3.9 + row * 3.9;
    spots[h] = new THREE.Vector3(x - 0.52, HGT / 2, z);
    spots[a] = new THREE.Vector3(x + 0.52, HGT / 2, z);
  });
  return spots;
}
const heroSpots = fixtureSpots(MD1);
const finaleSpots = fixtureSpots(MD2);

// Table grid: 4 columns × 9 rows, so the zones fall on whole rows (2 / 4 / 3).
const GRID = { x: 0, y: 5.3, z: 2.5, dx: 1.06, dy: 0.98 };
function tableSpot(rank) {
  const i = rank - 1, col = i % 4, row = Math.floor(i / 4);
  return new THREE.Vector3(GRID.x + (col - 1.5) * GRID.dx, GRID.y + (4 - row) * GRID.dy, GRID.z);
}

const zonePlates = [];
[[0, 2, '#3b82f6'], [2, 4, '#f59e0b'], [6, 3, '#ef4444']].forEach(([row, rows, color]) => {
  const h = rows * GRID.dy - 0.1;
  const plate = new THREE.Mesh(
    new THREE.PlaneGeometry(4 * GRID.dx + 0.3, h),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0, depthWrite: false, fog: false }));
  plate.position.set(GRID.x, GRID.y + (4 - row) * GRID.dy - (rows - 1) * GRID.dy / 2, GRID.z - 0.3);
  plate.userData.max = 0.2;
  scene.add(plate);
  zonePlates.push(plate);
});

const pucks = [];
const sideMats = {};

async function buildPucks() {
  try {
    await Promise.race([
      Promise.all([document.fonts.load('400 104px "Bebas Neue"'), document.fonts.load('600 26px "Outfit"')]),
      new Promise(r => setTimeout(r, 2500)),
    ]);
  } catch (_) { /* draw with fallback fonts */ }
  for (const c of table) {
    const side = sideMats[c.color] ||= new THREE.MeshStandardMaterial({
      color: new THREE.Color(c.color).multiplyScalar(0.7), roughness: 0.4, metalness: 0.25 });
    const top = new THREE.MeshStandardMaterial({ map: faceTexture(c), roughness: 0.45, emissive: '#ffffff', emissiveIntensity: 0 });
    const mesh = new THREE.Mesh(puckGeo, [side, top, side]);
    mesh.castShadow = true;
    mesh.userData = {
      club: c, top,
      hero: heroSpots[c.name], table: tableSpot(c.rank), finale: finaleSpots[c.name],
      delay: (c.rank - 1) / 35 * 0.35,
      drop: 5 + Math.random() * 5, dropDelay: Math.random() * 0.6,
      hover: 0,
    };
    mesh.position.copy(mesh.userData.hero);
    scene.add(mesh);
    pucks.push(mesh);
  }
}

// ── Camera keyframes ──
const v3 = (x, y, z) => new THREE.Vector3(x, y, z);
function keyframes() {
  const narrow = innerWidth / innerHeight < 0.9;
  const dist = narrow ? 24 : 15.5;
  // Shift the view left of the grid so it sits right of the copy on wide screens.
  const vw = 2 * dist * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect;
  const off = narrow ? 0 : Math.min(vw * 0.22, 5);
  const lift = narrow ? -3.6 : 0; // on phones, keep the grid above the copy
  return {
    hero:   narrow ? { pos: v3(0, 12, 11.5), look: v3(0, 0, 3.5) } : { pos: v3(-2, 13.5, 15.5), look: v3(-2.8, 0, 0.6) },
    table:  { pos: v3(GRID.x - off, GRID.y + lift + 0.6, GRID.z + dist), look: v3(GRID.x - off, GRID.y + lift, GRID.z) },
    finale: narrow ? { pos: v3(-6, 6.5, 15), look: v3(0, 0, 5) } : { pos: v3(-12, 2.6, 10.5), look: v3(-1, 0.4, -1) },
  };
}
let KF;

function resize() {
  const w = innerWidth, h = innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  KF = keyframes();
}
addEventListener('resize', resize);
resize();

// ── Scroll → scene state ──
const clamp01 = x => Math.min(1, Math.max(0, x));
const smooth = x => x * x * (3 - 2 * x);
const tableEl = document.getElementById('table');
function scrollState() {
  const y = scrollY, vh = innerHeight;
  const tableIn = tableEl.offsetTop * 0.85;
  const tableOut = tableEl.offsetTop + tableEl.offsetHeight - vh;
  const end = document.documentElement.scrollHeight - vh;
  return {
    a: clamp01(y / tableIn),
    b: clamp01((y - tableOut) / Math.max(1, end - tableOut)),
  };
}

// ── Hover / tap ──
const ray = new THREE.Raycaster();
const ndc = new THREE.Vector2();
const tip = document.getElementById('tip');
let pointer = null, hovered = null;
addEventListener('pointermove', e => {
  if (e.pointerType === 'touch') return;
  pointer = { x: e.clientX, y: e.clientY };
});
addEventListener('pointerleave', () => { pointer = null; });
canvas.ownerDocument.addEventListener('pointerdown', e => {
  if (e.pointerType === 'touch') pointer = { x: e.clientX, y: e.clientY };
});
addEventListener('scroll', () => { if (coarse) pointer = null; }, { passive: true });

function updateHover() {
  let hit = null;
  if (pointer && pucks.length) {
    ndc.set(pointer.x / innerWidth * 2 - 1, -(pointer.y / innerHeight) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    hit = ray.intersectObjects(pucks, false)[0]?.object || null;
  }
  if (hit !== hovered) {
    hovered = hit;
    document.body.style.cursor = hit ? 'pointer' : '';
    if (hit) {
      const c = hit.userData.club;
      tip.innerHTML = `<strong>${c.name}</strong><span class="rank">${ordinal(c.rank)} · ${c.pts} pts · GD ${gd(c)}</span><br>${c.md1}`;
    }
    tip.classList.toggle('on', !!hit);
  }
  if (hit) {
    const w = tip.offsetWidth, h = tip.offsetHeight;
    tip.style.left = Math.min(pointer.x + 16, innerWidth - w - 12) + 'px';
    tip.style.top = Math.min(pointer.y + 16, innerHeight - h - 12) + 'px';
  }
}

// ── Loop ──
const camPos = new THREE.Vector3(), camLook = new THREE.Vector3();
const tmpPos = new THREE.Vector3(), tmpLook = new THREE.Vector3();
let first = true, last = performance.now();
const t0 = last;

function frame(now) {
  const dt = Math.min(0.1, (now - last) / 1000); last = now;
  const ease = 1 - Math.exp(-dt * 5); // frame-rate independent damping
  const { a, b } = scrollState();
  const ea = smooth(a), eb = smooth(b);

  // Camera: hero → table → finale
  if (b > 0) {
    tmpPos.lerpVectors(KF.table.pos, KF.finale.pos, eb);
    tmpLook.lerpVectors(KF.table.look, KF.finale.look, eb);
  } else {
    tmpPos.lerpVectors(KF.hero.pos, KF.table.pos, ea);
    tmpLook.lerpVectors(KF.hero.look, KF.table.look, ea);
  }
  if (first || reduceMotion) { camPos.copy(tmpPos); camLook.copy(tmpLook); first = false; }
  else { camPos.lerp(tmpPos, ease); camLook.lerp(tmpLook, ease); }
  camera.position.copy(camPos);
  camera.lookAt(camLook);

  const plateOn = b > 0 ? 1 - eb : ea;
  for (const p of zonePlates) p.material.opacity = p.userData.max * smooth(clamp01(plateOn * 1.6 - 0.6));

  // Intro: pucks drop onto the pitch once, staggered
  const intro = reduceMotion ? 1 : (now - t0) / 1000;

  for (const m of pucks) {
    const u = m.userData;
    const la = smooth(clamp01((a - u.delay) / 0.65));
    const lb = smooth(clamp01((b - u.delay) / 0.65));
    let l, from, to;
    if (b > 0) { from = u.table; to = u.finale; l = lb; } else { from = u.hero; to = u.table; l = la; }
    m.position.lerpVectors(from, to, l);
    m.position.y += Math.sin(l * Math.PI) * 1.4;
    const standing = b > 0 ? 1 - lb : la;
    m.rotation.x = standing * Math.PI / 2;
    m.rotation.z = Math.sin(l * Math.PI) * 0.6;

    const d = clamp01((intro - u.dropDelay) / 0.9);
    if (d < 1) {
      const fall = 1 - d;
      m.position.y += fall * fall * u.drop;
    }

    u.hover += ((m === hovered ? 1 : 0) - u.hover) * (reduceMotion ? 1 : Math.min(1, ease * 2.5));
    m.scale.setScalar(1 + u.hover * 0.14);
    u.top.emissiveIntensity = u.hover * 0.12;
  }

  updateHover();
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}

buildPucks().then(() => requestAnimationFrame(frame));
