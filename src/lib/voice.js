/**
 * Web Speech recognition. Commands: Start / End / Where am I.
 * Fails soft if the API is missing or permission is denied.
 */
export function startVoice({ onStart, onEnd, onWhere, onStatus }) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    onStatus?.({ ok: false, reason: 'unavailable' });
    return () => {};
  }

  let rec;
  let stopped = false;

  const boot = () => {
    if (stopped) return;
    rec = new SR();
    rec.continuous = true;
    rec.interimResults = false;
    rec.lang = 'en-US';
    rec.onresult = (ev) => {
      const last = ev.results[ev.results.length - 1];
      if (!last || !last.isFinal) return;
      const phrase = String(last[0]?.transcript || '')
        .trim()
        .toLowerCase();
      if (!phrase) return;
      if (/\b(start( ride)?|go|launch)\b/.test(phrase)) onStart?.(phrase);
      else if (/\b(end( ride)?|stop|finish)\b/.test(phrase)) onEnd?.(phrase);
      else if (/\b(where am i|location|gps)\b/.test(phrase)) onWhere?.(phrase);
    };
    rec.onerror = (e) => {
      const err = e?.error;
      if (err === 'not-allowed' || err === 'service-not-allowed') {
        onStatus?.({ ok: false, reason: err });
        stopped = true;
        return;
      }
      onStatus?.({ ok: false, reason: err || 'error' });
    };
    rec.onend = () => {
      if (!stopped) {
        try {
          rec.start();
        } catch {
          /* fail soft */
        }
      }
    };
    try {
      rec.start();
      onStatus?.({ ok: true, reason: 'listening' });
    } catch {
      onStatus?.({ ok: false, reason: 'start_failed' });
    }
  };

  boot();

  return () => {
    stopped = true;
    try {
      rec?.stop();
    } catch {
      /* ignore */
    }
  };
}

export function speak(text) {
  try {
    if (!window.speechSynthesis) return;
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1.05;
    u.pitch = 0.95;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  } catch {
    /* fail soft */
  }
}
