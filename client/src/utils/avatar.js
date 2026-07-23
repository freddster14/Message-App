const PALETTE = ['oklch(70% 0.12 250)', 'oklch(70% 0.12 230)', 'oklch(70% 0.12 200)', 'oklch(70% 0.12 20)', 'oklch(70% 0.12 60)', 'oklch(70% 0.12 340)'];

export function colorFor(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % PALETTE.length;
  return PALETTE[h];
}

export function initialsFor(name) {
  return name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
}
