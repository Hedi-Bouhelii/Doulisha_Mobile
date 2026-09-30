const NOT_COLOURS = /^text-(xs|sm|base|lg|xl|\d|center|left|right|start|end|justify|\[)/;

/**
 * Whether the classes already set a text colour. Tailwind applies whichever
 * colour class comes later in its stylesheet, not in `className`, so a
 * default colour must only be added when no other one is given.
 */
export function hasTextColour(className: string | undefined): boolean {
  return (className ?? '')
    .split(/\s+/)
    .some((name) => name.startsWith('text-') && !NOT_COLOURS.test(name));
}
