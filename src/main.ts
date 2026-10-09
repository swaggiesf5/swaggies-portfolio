import './styles/tokens.css';
import './styles/base.css';
import './styles/crt.css';
import './styles/memory-card.css';
import './styles/intro.css';

import { SKILLS } from './data/skills';
import { byId } from './lib/dom';
import { prefersReducedMotion } from './lib/motion';
import { createBackground } from './scene/background';
import { renderSkills } from './ui/skills';

const reduce = prefersReducedMotion();

createBackground(byId('stage', HTMLCanvasElement), reduce);
renderSkills(byId('skills', HTMLDivElement), SKILLS);
