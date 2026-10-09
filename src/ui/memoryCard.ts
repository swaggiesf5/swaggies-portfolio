import type { Save } from '../data/saves';
import { h } from '../lib/dom';

export interface MemoryCardOptions {
  slots: HTMLElement;
  panel: HTMLElement;
  /** Called on every selection; `user` is false for the initial render. */
  onSelect: (save: Save, index: number, user: boolean) => void;
}

export interface MemoryCard {
  focusFirst: () => void;
}

function externalLink(text: string, href: string, className?: string): HTMLAnchorElement {
  const a = h('a', className, text);
  a.href = href;
  a.target = '_blank';
  a.rel = 'noopener';
  return a;
}

function cube(save: Save): HTMLDivElement {
  const wrap = h('div', 'cube');
  const inner = h('div', 'in');
  // front + back carry the glyph; the other four faces are plain
  for (let i = 0; i < 6; i++) inner.append(h('div', 'f', i < 2 ? save.glyph : undefined));
  wrap.append(inner);
  return wrap;
}

function slotButton(save: Save): HTMLButtonElement {
  const b = h('button', 'slot');
  b.type = 'button';
  b.id = `slot-${save.id}`;
  b.style.setProperty('--c1', save.c1);
  b.style.setProperty('--c2', save.c2);
  b.append(cube(save), h('div', 'nm', save.name), h('div', 'sz', save.size));
  return b;
}

function panelContent(s: Save): Node[] {
  const out: Node[] = [];

  const dl = h('dl', 'meta');
  for (const m of s.meta) {
    const dd = h('dd');
    dd.append(m.href ? externalLink(m.value, m.href) : m.value);
    dl.append(h('dt', undefined, m.label), dd);
  }
  out.push(dl, h('h3', undefined, s.title));

  out.push(
    s.sum
      ? h('p', 'sum', s.sum)
      : h('p', 'pending', 'SAVE DATA NOT YET WRITTEN · description coming soon'),
  );

  for (const g of s.groups) {
    const grp = h('div', 'grp');
    const ul = h('ul');
    ul.append(...g.items.map((x) => h('li', undefined, x)));
    grp.append(h('h4', undefined, g.title), ul);
    out.push(grp);
  }

  if (s.links?.length) {
    const chips = h('div', 'chips');
    chips.append(...s.links.map((l) => externalLink(`${l.label} ↗`, l.href, 'btn')));
    out.push(chips);
  }
  if (s.stack.length) {
    const chips = h('div', 'chips');
    chips.append(...s.stack.map((x) => h('span', 'chip', x)));
    out.push(chips);
  }
  return out;
}

/** Save slots (buttons with CSS 3D cube icons) + the selected save's data panel. */
export function renderMemoryCard(
  saves: readonly Save[],
  { slots, panel, onSelect }: MemoryCardOptions,
): MemoryCard {
  const buttons = saves.map(slotButton);
  slots.replaceChildren(...buttons);
  let cur = 0;

  function select(i: number, user: boolean): void {
    cur = (i + saves.length) % saves.length;
    const save = saves[cur];
    if (!save) return;
    buttons.forEach((b, k) => {
      b.setAttribute('aria-pressed', String(k === cur));
    });
    panel.replaceChildren(...panelContent(save));
    onSelect(save, cur, user);
  }

  buttons.forEach((b, i) => {
    b.addEventListener('click', () => {
      select(i, true);
    });
  });

  // Arrow keys browse only while a slot has focus, and focus follows the selection
  slots.addEventListener('keydown', (e) => {
    const step =
      e.key === 'ArrowRight' || e.key === 'ArrowDown'
        ? 1
        : e.key === 'ArrowLeft' || e.key === 'ArrowUp'
          ? -1
          : 0;
    if (!step || !(e.target instanceof HTMLElement) || !e.target.classList.contains('slot')) return;
    e.preventDefault();
    select(cur + step, true);
    buttons[cur]?.focus();
  });

  select(0, false);

  return {
    focusFirst: () => {
      buttons[0]?.focus({ preventScroll: true });
    },
  };
}
