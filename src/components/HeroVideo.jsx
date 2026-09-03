import { useCallback, useState } from 'react';
import { LIVE_PLAYLIST } from '../lib/playlist.js';

export default function HeroVideo() {
  const [i, setI] = useState(0);
  const next = useCallback(() => {
    setI((n) => (n + 1) % LIVE_PLAYLIST.length);
  }, []);

  return (
    <video
      key={LIVE_PLAYLIST[i]}
      className="absolute inset-0 h-full w-full object-cover"
      src={LIVE_PLAYLIST[i]}
      muted
      autoPlay
      playsInline
      loop={false}
      onEnded={next}
      onError={next}
    />
  );
}
