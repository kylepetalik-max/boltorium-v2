/** Night / storm skin from local hour. */
export function getSkin(date = new Date()) {
  const h = date.getHours();
  if (h >= 22 || h < 5) return 'storm';
  if (h >= 19 || h < 7) return 'night';
  return 'day';
}

export function skinLabel(skin) {
  if (skin === 'storm') return 'STORM CELL';
  if (skin === 'night') return 'NIGHT OPS';
  return 'DAYLIGHT';
}
