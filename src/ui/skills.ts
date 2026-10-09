import type { Skill } from '../data/skills';
import { h } from '../lib/dom';

export function renderSkills(root: HTMLElement, skills: readonly Skill[]): void {
  root.replaceChildren(
    ...skills.map((s) => {
      const card = h('div', 'sk');
      card.append(h('h3', undefined, s.title), h('p', undefined, s.body));
      return card;
    }),
  );
}
