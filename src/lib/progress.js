/** Live XP → Volt tier. Mock LVL/XP figures are chrome — never invent 1M/50K. */
const XP_PER_LEVEL = 100;

const TIER_BY_LEVEL = [
  { until: 10, name: 'SPARK' },
  { until: 20, name: 'VOLT' },
  { until: 35, name: 'SURGE' },
  { until: 50, name: 'STORM' },
  { until: Infinity, name: 'THUNDER' },
];

export function voltFromXp(xp) {
  const n = Math.max(0, Math.floor(Number(xp) || 0));
  const level = Math.floor(n / XP_PER_LEVEL) + 1;
  const into = n % XP_PER_LEVEL;
  const need = XP_PER_LEVEL;
  const tier = TIER_BY_LEVEL.find((t) => level <= t.until) || TIER_BY_LEVEL[TIER_BY_LEVEL.length - 1];
  return {
    name: tier.name,
    level,
    xp: n,
    into,
    need,
    pct: Math.min(100, (into / need) * 100),
  };
}

export function crewRank(crew) {
  const list = Array.isArray(crew) ? crew : [];
  const sorted = [...list].sort((a, b) => (b.km || 0) - (a.km || 0) || (b.boltz || 0) - (a.boltz || 0));
  const idx = sorted.findIndex((c) => c.id === 'you');
  const of = Math.max(1, sorted.length);
  const place = idx < 0 ? of : idx + 1;
  const pct = Math.max(1, Math.round((place / of) * 100));
  return { place, of, pct };
}
