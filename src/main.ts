import './styles/tokens.css';
import './styles/base.css';
import './styles/crt.css';
import './styles/memory-card.css';
import './styles/intro.css';

import { createSynth } from './audio/synth';
import { SKILLS } from './data/skills';
import { runIntro } from './intro/intro';
import { byId } from './lib/dom';
import { prefersReducedMotion } from './lib/motion';
import { createBackground } from './scene/background';
import { renderSkills } from './ui/skills';

const reduce = prefersReducedMotion();
const synth = createSynth();

createBackground(byId('stage', HTMLCanvasElement), reduce);
renderSkills(byId('skills', HTMLDivElement), SKILLS);

const soundBtn = byId('snd', HTMLButtonElement);
soundBtn.addEventListener('click', () => {
  soundBtn.textContent = `SOUND: ${synth.toggle() ? 'ON' : 'OFF'}`;
});

runIntro({
  reduce,
  saveCount: 5,
  blip: synth.blip,
  chime: synth.chime,
  onDone: () => undefined,
});
