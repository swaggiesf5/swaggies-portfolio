import * as THREE from 'three';

export interface Background {
  /** Lerp the tower caps towards this CSS colour (the selected save's c2). */
  setAccent(color: string): void;
}

/** Render at 40% of CSS size; the canvas is upscaled with image-rendering: pixelated. */
const RES = 0.4;

// The original ran on three r128: no colour management, linear output, "legacy" light units.
// Disabling management + linear output reproduces its colours; light intensities are multiplied
// by PI to map legacy units onto the physical ones used since r155.
const LEGACY = Math.PI;

const ease = (x: number): number => (x < 0 ? 0 : x > 1 ? 1 : 1 - Math.pow(1 - x, 3));

function glowTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  if (g) {
    const rg = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    rg.addColorStop(0, '#fff');
    rg.addColorStop(0.25, 'rgba(200,225,255,.7)');
    rg.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = rg;
    g.fillRect(0, 0, 64, 64);
  }
  return new THREE.CanvasTexture(c);
}

export function createBackground(canvas: HTMLCanvasElement, reduce: boolean): Background {
  let R: THREE.WebGLRenderer;
  try {
    R = new THREE.WebGLRenderer({ canvas, antialias: false });
  } catch {
    // No WebGL: the void stays the body's background colour, like the original without THREE.
    return { setAccent: () => undefined };
  }
  THREE.ColorManagement.enabled = false;
  R.outputColorSpace = THREE.LinearSRGBColorSpace;
  // The low-res buffer is the look, so it tracks CSS pixels and ignores devicePixelRatio.
  R.setPixelRatio(1);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x02030a);
  scene.fog = new THREE.FogExp2(0x040818, 0.05);
  const cam = new THREE.PerspectiveCamera(55, 1, 0.1, 200);

  function resize(): void {
    R.setSize(Math.max(160, (innerWidth * RES) | 0), Math.max(120, (innerHeight * RES) | 0), false);
    cam.aspect = innerWidth / innerHeight;
    cam.updateProjectionMatrix();
  }
  addEventListener('resize', resize);
  // DPR changes (moving between monitors, zoom) don't always fire resize; re-arm on each change.
  const watchDpr = (): void => {
    matchMedia(`(resolution: ${String(devicePixelRatio)}dppx)`).addEventListener(
      'change',
      () => {
        resize();
        watchDpr();
      },
      { once: true },
    );
  };
  watchDpr();
  resize();

  scene.add(new THREE.AmbientLight(0x1a2650, 0.6 * LEGACY));
  const dl = new THREE.DirectionalLight(0x6fa8ff, 0.3 * LEGACY);
  dl.position.set(-5, 12, 4);
  scene.add(dl);

  const GT = glowTexture();

  // towers + glowing caps
  const N = 15;
  const SP = 1.6;
  const towers: { x: number; z: number; h: number; dl: number; ph: number; skip: boolean }[] = [];
  const geo = new THREE.BoxGeometry(0.62, 1, 0.62);
  geo.translate(0, 0.5, 0);
  const mat = new THREE.MeshPhongMaterial({
    color: 0x1b2d66,
    emissive: 0x0a1440,
    specular: 0x88bbff,
    shininess: 60,
    transparent: true,
    opacity: 0.6,
  });
  const inst = new THREE.InstancedMesh(geo, mat, N * N);
  const capMat = new THREE.MeshBasicMaterial({
    color: 0x5aa8ff,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const caps = new THREE.InstancedMesh(new THREE.BoxGeometry(0.64, 0.04, 0.64), capMat, N * N);
  let sd = 11;
  const rnd = (): number => (sd = (sd * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < N; i++)
    for (let j = 0; j < N; j++) {
      const x = (i - (N - 1) / 2) * SP;
      const z = (j - (N - 1) / 2) * SP;
      const d = Math.hypot(x, z);
      towers.push({
        x,
        z,
        h: d < 2.2 ? 0.001 : 0.4 + Math.pow(rnd(), 2.2) * 6 * (0.35 + d / 14),
        dl: d * 0.12 + rnd() * 0.8,
        ph: rnd() * 6.28,
        skip: d < 2.2,
      });
    }
  scene.add(inst, caps);

  const grid = new THREE.GridHelper(N * SP * 1.4, N * 2, 0x2a4a9a, 0x0f1d44);
  grid.material.transparent = true;
  grid.material.opacity = 0.3;
  scene.add(grid);

  // three orbiting point lights, each carrying an additive glow sprite
  const orbs = [0x7fc8ff, 0x9a8cff, 0x5ff0ff].map((col, k) => {
    // r128 decay 2 was (1 - d/9)^2; physical 1/d^2 is far dimmer here. Decay 1 tracks the old curve over d = 2..7.
    const L = new THREE.PointLight(col, 2 * LEGACY, 9, 1);
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: GT,
        color: col,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    sprite.scale.set(1.1, 1.1, 1);
    L.add(sprite);
    scene.add(L);
    return { L, r: 2.6 + k * 1.8, s: 0.1 + k * 0.05, ph: k * 2, y: 1.3 + k * 0.8 };
  });

  // rising motes
  const MN = 380;
  const mg = new THREE.BufferGeometry();
  const mp = new Float32Array(MN * 3);
  const mv = new Float32Array(MN);
  for (let i = 0; i < MN; i++) {
    mp[i * 3] = (Math.random() - 0.5) * 26;
    mp[i * 3 + 1] = Math.random() * 14;
    mp[i * 3 + 2] = (Math.random() - 0.5) * 26;
    mv[i] = 0.15 + Math.random() * 0.4;
  }
  const motePos = new THREE.BufferAttribute(mp, 3);
  mg.setAttribute('position', motePos);
  scene.add(
    new THREE.Points(
      mg,
      new THREE.PointsMaterial({
        map: GT,
        size: 0.15,
        color: 0x9fd4ff,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    ),
  );

  // star dome
  const SN = 1200;
  const sg = new THREE.BufferGeometry();
  const spos = new Float32Array(SN * 3);
  for (let i = 0; i < SN; i++) {
    const u = Math.random() * 2 - 1;
    const t = Math.random() * 6.283;
    const s = Math.sqrt(1 - u * u);
    spos[i * 3] = 80 * s * Math.cos(t);
    spos[i * 3 + 1] = Math.abs(80 * u) * 0.9 + 4;
    spos[i * 3 + 2] = 80 * s * Math.sin(t);
  }
  sg.setAttribute('position', new THREE.BufferAttribute(spos, 3));
  const starMat = new THREE.PointsMaterial({
    color: 0xcfe4ff,
    size: 1.4,
    sizeAttenuation: false,
    fog: false,
    transparent: true,
    opacity: 0,
  });
  scene.add(new THREE.Points(sg, starMat));

  const target = new THREE.Color(0x5aa8ff);

  let scrollY = window.scrollY;
  addEventListener(
    'scroll',
    () => {
      scrollY = window.scrollY;
    },
    { passive: true },
  );

  const M = new THREE.Matrix4();
  const Q = new THREE.Quaternion();
  const S = new THREE.Vector3();
  const P = new THREE.Vector3();
  const t0 = performance.now() / 1000;
  const K = reduce ? 3 : 1;
  const orbit = reduce ? 0.01 : 0.04;

  function frame(now: number): void {
    const t = now / 1000;
    const tt = t - t0;
    starMat.opacity = ease((tt * K - 1.2) / 3) * 0.9;

    for (let i = 0; i < towers.length; i++) {
      const w = towers[i];
      if (!w) continue;
      const gr = w.skip ? 0 : ease((tt * K - 2.2 - w.dl * 1.8) / 2.4);
      const ht = Math.max(0.001, w.h * gr * (1 + 0.04 * Math.sin(t * 0.8 + w.ph)));
      P.set(w.x, 0, w.z);
      S.set(1, ht, 1);
      M.compose(P, Q, S);
      inst.setMatrixAt(i, M);
      P.set(w.x, ht, w.z);
      S.set(1, gr > 0.02 ? 1 : 0.001, 1);
      M.compose(P, Q, S);
      caps.setMatrixAt(i, M);
    }
    inst.instanceMatrix.needsUpdate = caps.instanceMatrix.needsUpdate = true;

    capMat.color.lerp(target, 0.04);
    capMat.opacity = 0.5 + 0.3 * Math.sin(t * 2.1);

    orbs.forEach((o, k) => {
      const a = t * o.s + o.ph;
      o.L.position.set(
        Math.cos(a) * o.r,
        o.y + Math.sin(t * 0.6 + k) * 0.8,
        Math.sin(a * 1.3) * o.r,
      );
    });

    for (let i = 0; i < MN; i++) {
      const yi = i * 3 + 1;
      let y = (mp[yi] ?? 0) + (mv[i] ?? 0) * 0.016;
      if (y > 14) y = 0;
      mp[yi] = y;
    }
    motePos.needsUpdate = true;

    // camera: descend from above over ~9s, then a slow orbit; scrolling lifts it and tilts down
    const a = t * orbit + 0.6;
    const sc = Math.min(1, scrollY / 1400);
    const io = ease((tt * K) / 9);
    const rad = 4 + 5.5 * io;
    const cy = 14 - 11.4 * io;
    cam.position.set(Math.cos(a) * rad, cy + sc * 5, Math.sin(a) * rad);
    cam.lookAt(0, 2.2 * io - sc * 1.5, 0);

    R.render(scene, cam);
    raf = requestAnimationFrame(frame);
  }

  let raf = 0;
  const start = (): void => {
    if (!raf) raf = requestAnimationFrame(frame);
  };
  const stop = (): void => {
    cancelAnimationFrame(raf);
    raf = 0;
  };
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else start();
  });
  if (!document.hidden) start();

  return {
    setAccent: (color) => {
      target.set(color);
    },
  };
}
