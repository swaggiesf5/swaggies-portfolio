export interface Synth {
  /** Flip sound on/off. Must be called from a user gesture: the AudioContext is created here. */
  toggle: () => boolean;
  /** Short decaying sine with echo; silent while sound is off. */
  blip: (freq: number) => void;
  /** Rising four-note arpeggio. */
  chime: () => void;
}

interface Graph {
  ac: AudioContext;
  master: GainNode;
  echo: DelayNode;
}

/** Low drone + blips through a feedback delay. OFF by default; nothing is created until toggle(). */
export function createSynth(): Synth {
  let graph: Graph | null = null;
  let on = false;

  function init(): Graph {
    const ac = new AudioContext();
    const master = ac.createGain();
    master.gain.value = 0;
    master.connect(ac.destination);

    const lp = ac.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 500;
    lp.connect(master);
    [55, 55.5, 82.4].forEach((f, i) => {
      const o = ac.createOscillator();
      o.type = i < 2 ? 'sawtooth' : 'sine';
      o.frequency.value = f;
      const g = ac.createGain();
      g.gain.value = 0.05;
      o.connect(g);
      g.connect(lp);
      o.start();
    });

    const echo = ac.createDelay(1);
    echo.delayTime.value = 0.38;
    const fb = ac.createGain();
    fb.gain.value = 0.4;
    echo.connect(fb);
    fb.connect(echo);
    echo.connect(master);
    return { ac, master, echo };
  }

  function blip(freq: number): void {
    if (!graph || !on) return;
    const { ac, master, echo } = graph;
    const o = ac.createOscillator();
    const g = ac.createGain();
    const n = ac.currentTime;
    o.frequency.value = freq;
    g.gain.setValueAtTime(0, n);
    g.gain.linearRampToValueAtTime(0.12, n + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, n + 0.9);
    o.connect(g);
    g.connect(master);
    g.connect(echo);
    o.start(n);
    o.stop(n + 1);
  }

  return {
    toggle() {
      graph ??= init();
      void graph.ac.resume();
      on = !on;
      graph.master.gain.setTargetAtTime(on ? 0.6 : 0, graph.ac.currentTime, 0.25);
      if (on) blip(784);
      return on;
    },
    blip,
    chime() {
      [523.3, 784, 1046.5, 1568].forEach((f, i) => {
        setTimeout(() => {
          blip(f);
        }, i * 140);
      });
    },
  };
}
