import './styles/tokens.css';
import './styles/base.css';
import './styles/crt.css';
import './styles/memory-card.css';
import './styles/intro.css';

import { createSynth } from './audio/synth';
import { SAVES } from './data/saves';
import { SKILLS } from './data/skills';
import { runIntro } from './intro/intro';
import { byId } from './lib/dom';
import { prefersReducedMotion } from './lib/motion';
import { createBackground } from './scene/background';
import { renderMemoryCard } from './ui/memoryCard';
import { renderSkills } from './ui/skills';

const reduce = prefersReducedMotion();
const synth = createSynth();

// Scene first so the initial selection below can set its accent colour.
const background = createBackground(byId('stage', HTMLCanvasElement), reduce);

byId('free', HTMLSpanElement).textContent = `${String(SAVES.length)} SAVES · ← → TO BROWSE`;
const card = renderMemoryCard(SAVES, {
  slots: byId('slots', HTMLDivElement),
  panel: byId('data', HTMLElement),
  onSelect: (save, index, user) => {
    if (user) synth.blip(520 + index * 60);
    background.setAccent(save.c2);
  },
});

renderSkills(byId('skills', HTMLDivElement), SKILLS);

const soundBtn = byId('snd', HTMLButtonElement);
soundBtn.addEventListener('click', () => {
  soundBtn.textContent = `SOUND: ${synth.toggle() ? 'ON' : 'OFF'}`;
});

runIntro({
  reduce,
  saveCount: SAVES.length,
  blip: synth.blip,
  chime: synth.chime,
  onDone: card.focusFirst,
});
