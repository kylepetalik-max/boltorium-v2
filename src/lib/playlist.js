import { asset } from './asset.js';

/** OG splash clips — local first, live CDN fallback in HeroVideo. */
export const LIVE_PLAYLIST = [
  asset('videos/euc.mp4'),
  asset('videos/electric_dirtbike.mp4'),
  asset('videos/skateboard.mp4'),
  asset('videos/electric_longboard.mp4'),
  asset('videos/gas_dirtbike.mp4'),
  asset('videos/surfer.mp4'),
];

export const REMOTE_PLAYLIST = [
  'https://boltorium.co/videos/euc.mp4',
  'https://boltorium.co/videos/electric_dirtbike.mp4',
  'https://boltorium.co/videos/skateboard.mp4',
  'https://boltorium.co/videos/electric_longboard.mp4',
  'https://boltorium.co/videos/gas_dirtbike.mp4',
  'https://boltorium.co/videos/surfer.mp4',
];
