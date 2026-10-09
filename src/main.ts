import './styles/tokens.css';
import './styles/base.css';
import './styles/crt.css';
import './styles/memory-card.css';
import './styles/intro.css';

import { SKILLS } from './data/skills';
import { byId } from './lib/dom';
import { renderSkills } from './ui/skills';

renderSkills(byId('skills', HTMLDivElement), SKILLS);
