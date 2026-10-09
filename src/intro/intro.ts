import { byId } from '../lib/dom';

export interface IntroOptions {
  reduce: boolean;
  saveCount: number;
  blip: (freq: number) => void;
  chime: () => void;
  /** Runs once the intro has faded out and been removed (≈1.3s after enter). */
  onDone: () => void;
}

const biosLines = (saveCount: number): string[] => [
  'SW-BIOS  v2.04  (C) 2026',
  'MEMORY CHECK ........ 32768K OK',
  'VECTOR UNIT 0 ....... READY',
  'VECTOR UNIT 1 ....... READY',
  `MEMORY CARD SLOT 1 .. ${String(saveCount)} SAVES`,
  'LOADING PORTFOLIO ...',
];

/** BIOS lines → wordmark → PRESS START. START, Enter/Space (once START is up) and SKIP all enter. */
export function runIntro({ reduce, saveCount, blip, chime, onDone }: IntroOptions): void {
  const intro = byId('intro', HTMLDivElement);
  const boot = byId('boot', HTMLDivElement);
  const mark = byId('mark', HTMLDivElement);
  const startBtn = byId('start', HTMLButtonElement);
  const skipBtn = byId('skip', HTMLButtonElement);

  // body.booting is set in the markup so main never flashes before the intro paints
  document.body.classList.add('booting');

  const timers: number[] = [];
  const later = (fn: () => void, ms: number): void => {
    timers.push(window.setTimeout(fn, ms));
  };

  biosLines(saveCount).forEach((line, i) => {
    later(
      () => {
        boot.textContent += line + '\n';
        blip(600 + i * 80);
      },
      220 * i + 150,
    );
  });
  later(() => {
    boot.classList.add('off');
  }, 1900);
  later(
    () => {
      mark.classList.add('on');
      chime();
    },
    reduce ? 1800 : 6800,
  );
  later(
    () => {
      startBtn.classList.add('on');
      startBtn.focus({ preventScroll: true });
    },
    reduce ? 2600 : 8800,
  );

  let done = false;
  function enter(): void {
    if (done) return;
    done = true;
    timers.forEach(clearTimeout);
    removeEventListener('keydown', onKey);
    chime();
    intro.classList.add('gone');
    document.body.classList.remove('booting');
    skipBtn.hidden = true;
    setTimeout(() => {
      intro.hidden = true;
      onDone();
    }, 1300);
  }

  function onKey(e: KeyboardEvent): void {
    if ((e.key === 'Enter' || e.key === ' ') && startBtn.classList.contains('on')) {
      e.preventDefault();
      enter();
    }
  }

  startBtn.addEventListener('click', enter);
  skipBtn.addEventListener('click', enter);
  addEventListener('keydown', onKey);
}
