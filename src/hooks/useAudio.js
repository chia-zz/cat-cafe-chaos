import { useCallback, useEffect, useMemo, useRef } from 'react';

/**
 * 以 Web Audio API 即時合成的小音效，不需要任何音檔。
 * AudioContext 只會在使用者互動（開啟音效、點擊按鈕）之後建立 / resume，
 * 以符合瀏覽器的自動播放限制。
 */

const NOTE = {
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880, B5: 987.77,
  C6: 1046.5, E6: 1318.5, G6: 1568,
  G4: 392, E4: 329.63, C4: 261.63, A4: 440,
};

function tone(ctx, out, { freq, to, start = 0, dur = 0.12, type = 'sine', gain = 0.18 }) {
  const t0 = ctx.currentTime + start;
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (to) osc.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  amp.gain.setValueAtTime(0.0001, t0);
  amp.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
  amp.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(amp).connect(out);
  osc.start(t0);
  osc.stop(t0 + dur + 0.03);
}

function meow(ctx, out, start = 0, pitch = 1) {
  const t0 = ctx.currentTime + start;
  const osc = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const amp = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(420 * pitch, t0);
  osc.frequency.exponentialRampToValueAtTime(760 * pitch, t0 + 0.12);
  osc.frequency.exponentialRampToValueAtTime(380 * pitch, t0 + 0.38);
  filter.type = 'bandpass';
  filter.Q.value = 4;
  filter.frequency.setValueAtTime(900, t0);
  filter.frequency.exponentialRampToValueAtTime(1800, t0 + 0.12);
  filter.frequency.exponentialRampToValueAtTime(700, t0 + 0.38);
  amp.gain.setValueAtTime(0.0001, t0);
  amp.gain.exponentialRampToValueAtTime(0.22, t0 + 0.05);
  amp.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.4);
  osc.connect(filter).connect(amp).connect(out);
  osc.start(t0);
  osc.stop(t0 + 0.45);
}

const SOUNDS = {
  click: (c, o) => tone(c, o, { freq: 740, dur: 0.05, type: 'triangle', gain: 0.12 }),
  correct: (c, o) => {
    tone(c, o, { freq: NOTE.E5, dur: 0.09, type: 'triangle' });
    tone(c, o, { freq: NOTE.A5, start: 0.07, dur: 0.12, type: 'triangle' });
  },
  wrong: (c, o) => {
    tone(c, o, { freq: 260, to: 150, dur: 0.22, type: 'square', gain: 0.08 });
    tone(c, o, { freq: 200, to: 120, start: 0.1, dur: 0.22, type: 'square', gain: 0.06 });
  },
  serve: (c, o) => {
    [NOTE.C5, NOTE.E5, NOTE.G5, NOTE.C6].forEach((f, i) =>
      tone(c, o, { freq: f, start: i * 0.07, dur: 0.16, type: 'triangle', gain: 0.16 }),
    );
  },
  angry: (c, o) => {
    tone(c, o, { freq: 330, to: 140, dur: 0.35, type: 'sawtooth', gain: 0.07 });
    meow(c, o, 0.05, 0.7);
  },
  combo: (c, o) => {
    [NOTE.G5, NOTE.B5, NOTE.D5 * 2, NOTE.G6].forEach((f, i) =>
      tone(c, o, { freq: f, start: i * 0.055, dur: 0.12, type: 'square', gain: 0.07 }),
    );
  },
  event: (c, o) => {
    tone(c, o, { freq: NOTE.A5, dur: 0.14, type: 'sine', gain: 0.2 });
    tone(c, o, { freq: NOTE.E5, start: 0.15, dur: 0.2, type: 'sine', gain: 0.2 });
  },
  lucky: (c, o) => {
    [NOTE.E6, NOTE.G6, NOTE.C6, NOTE.E6, NOTE.G6].forEach((f, i) =>
      tone(c, o, { freq: f, start: i * 0.06, dur: 0.18, type: 'sine', gain: 0.1 }),
    );
  },
  meow: (c, o) => meow(c, o, 0, 1.1),
  wipe: (c, o) => tone(c, o, { freq: 1800, to: 600, dur: 0.12, type: 'triangle', gain: 0.06 }),
  go: (c, o) => {
    tone(c, o, { freq: NOTE.G5, dur: 0.12, type: 'triangle' });
    tone(c, o, { freq: NOTE.C6, start: 0.12, dur: 0.22, type: 'triangle' });
  },
  gameover: (c, o) => {
    [NOTE.G5, NOTE.E5, NOTE.C5, NOTE.D5, NOTE.C5].forEach((f, i) =>
      tone(c, o, { freq: f, start: i * 0.15, dur: i === 4 ? 0.5 : 0.18, type: 'triangle', gain: 0.16 }),
    );
  },
};

export function useAudio(enabled) {
  const ctxRef = useRef(null);
  const masterRef = useRef(null);
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  const ensureContext = useCallback(() => {
    if (typeof window === 'undefined') return null;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!ctxRef.current) {
      try {
        ctxRef.current = new AC();
        masterRef.current = ctxRef.current.createGain();
        masterRef.current.gain.value = 0.8;
        masterRef.current.connect(ctxRef.current.destination);
      } catch {
        return null;
      }
    }
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume().catch(() => {});
    return ctxRef.current;
  }, []);

  /** 必須在使用者手勢（click / pointerdown）中呼叫，解鎖音訊 */
  const unlock = useCallback(() => {
    if (enabledRef.current) ensureContext();
  }, [ensureContext]);

  const play = useCallback(
    (name) => {
      if (!enabledRef.current) return;
      const ctx = ensureContext();
      const sound = SOUNDS[name];
      if (!ctx || !sound || ctx.state === 'closed') return;
      try {
        sound(ctx, masterRef.current);
      } catch {
        /* ignore */
      }
    },
    [ensureContext],
  );

  useEffect(() => () => {
    ctxRef.current?.close?.().catch(() => {});
    ctxRef.current = null;
  }, []);

  return useMemo(() => ({ play, unlock, ensureContext }), [play, unlock, ensureContext]);
}
