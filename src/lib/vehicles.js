import { vehicleProfiles } from '@boltorium/striker';

/** Display + earn meta. Physics envelopes live in @boltorium/striker. */
export const VEHICLE_META = {
  emoto: { label: 'E-Moto', icon: '⚡', electric: true, crew: 'VOLT' },
  dirtbike: { label: 'Dirt Bike', icon: '🏍', electric: false, crew: 'DIRT' },
  motorcycle: { label: 'Motorcycle', icon: '🏍', electric: false, crew: 'STREET' },
  ebike: { label: 'eBike', icon: '🚴', electric: true, crew: 'COMMUTE' },
  bicycle: { label: 'Bicycle', icon: '🚲', electric: false, crew: 'COMMUTE' },
  mtb: { label: 'MTB', icon: '🚵', electric: false, crew: 'TRAIL' },
  eskate: { label: 'eSkate', icon: '🛹', electric: true, crew: 'STREET' },
  skateboard: { label: 'Skateboard', icon: '🛹', electric: false, crew: 'STREET' },
  scooter: { label: 'Scooter', icon: '🛴', electric: false, crew: 'CITY' },
  escooter: { label: 'eScooter', icon: '🛴', electric: true, crew: 'CITY' },
  euc: { label: 'EUC', icon: '🔘', electric: true, crew: 'WHEEL' },
  onewheel: { label: 'Onewheel', icon: '🛞', electric: true, crew: 'WHEEL' },
  gocart: { label: 'Go-Kart', icon: '🏎', electric: false, crew: 'PIT' },
  quad: { label: 'Quad', icon: '🛻', electric: false, crew: 'DIRT' },
  golf_cart: { label: 'Golf Cart', icon: '⛳', electric: true, crew: 'PIT' },
  etrike: { label: 'eTrike', icon: '🚲', electric: true, crew: 'COMMUTE' },
  cargo_bike: { label: 'Cargo Bike', icon: '📦', electric: false, crew: 'COMMUTE' },
  wheelchair: { label: 'Wheelchair', icon: '♿', electric: false, crew: 'OPEN' },
  e_wheelchair: { label: 'e-Wheelchair', icon: '♿', electric: true, crew: 'OPEN' },
  mobility_scooter: { label: 'Mobility Scooter', icon: '🛵', electric: true, crew: 'OPEN' },
  foilboard: { label: 'Foilboard', icon: '🌊', electric: false, crew: 'WATER' },
  paddleboard: { label: 'Paddleboard', icon: '🏄', electric: false, crew: 'WATER' },
  kayak: { label: 'Kayak', icon: '🛶', electric: false, crew: 'WATER' },
  canoe: { label: 'Canoe', icon: '🛶', electric: false, crew: 'WATER' },
  jetski: { label: 'Jet Ski', icon: '🚤', electric: false, crew: 'WATER' },
  drone: { label: 'Drone', icon: '🛸', electric: true, crew: 'AIR' },
  diy_conversion: { label: 'DIY Conversion', icon: '🔧', electric: true, crew: 'GARAGE' },
};

export const VEHICLE_ORDER = Object.keys(vehicleProfiles);

export function getVehicle(id) {
  const profile = vehicleProfiles[id];
  const meta = VEHICLE_META[id] || { label: id, icon: '⚡', electric: false, crew: 'OPEN' };
  return { id, ...meta, ...profile };
}

export function earnMultiplier(id) {
  return getVehicle(id).electric ? 1.5 : 1;
}

export function listVehicles() {
  return VEHICLE_ORDER.filter((id) => id !== 'hoverboard' && id !== 'segway').map(getVehicle);
}


export const GARAGE_CATEGORIES = [
  { id: "emoto", label: "E-MOTO" },
  { id: "scooter", label: "SCOOTER" },
  { id: "jetski", label: "JET-SKI" },
  { id: "air", label: "AIR" },
];

const CAT_IDS = {
  scooter: new Set(["scooter", "escooter", "mobility_scooter"]),
  jetski: new Set(["jetski", "foilboard", "paddleboard", "kayak", "canoe"]),
  air: new Set(["drone"]),
};

export function garageCategory(id) {
  if (CAT_IDS.scooter.has(id)) return "scooter";
  if (CAT_IDS.jetski.has(id)) return "jetski";
  if (CAT_IDS.air.has(id)) return "air";
  return "emoto";
}

export function garageCategoryLabel(id) {
  const cat = garageCategory(id);
  return GARAGE_CATEGORIES.find((c) => c.id === cat)?.label || "E-MOTO";
}

export function vehiclesInCategory(catId) {
  return listVehicles().filter((v) => garageCategory(v.id) === catId);
}

export { vehicleProfiles };
