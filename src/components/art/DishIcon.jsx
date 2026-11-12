import { memo } from 'react';

/** 原創餐點插畫（64×64） */
const L = '#5C4033';
const base = { stroke: L, strokeWidth: 2.6, strokeLinejoin: 'round', strokeLinecap: 'round' };

function Cup({ liquid, children }) {
  return (
    <g {...base}>
      <ellipse cx="32" cy="54" rx="24" ry="5" fill="#E9DCCB" />
      <path d="M46 28 q11 0 10 9 q-1 8 -12 8" fill="none" strokeWidth="3.4" />
      <path d="M12 26 h40 l-3 18 q-2 9 -17 9 q-15 0 -17 -9 Z" fill="#FFF8EC" />
      <ellipse cx="32" cy="26" rx="20" ry="5.5" fill={liquid} />
      {children}
    </g>
  );
}

const DISHES = {
  americano: (
    <>
      <path d="M24 16 q-3 -4 0 -8 M32 18 q-3 -5 0 -10 M40 16 q-3 -4 0 -8" fill="none" stroke="#C9B8A6" strokeWidth="2.2" strokeLinecap="round" />
      <Cup liquid="#6B4029">
        <path d="M24 38 q8 4 16 0" fill="none" stroke="#D9AD82" strokeWidth="2" />
      </Cup>
    </>
  ),
  latte: (
    <Cup liquid="#C9925F">
      {/* 貓臉拉花 */}
      <g stroke="#FFF8EC" strokeWidth="1.6" fill="#FFF3E2">
        <path d="M26 26 l1 -4 l3 2.6 h4 l3 -2.6 l1 4 q0 4 -6 4 q-6 0 -6 -4 Z" />
      </g>
      <path d="M17 38 q2 -3 4 0 M43 38 q2 -3 4 0" fill="none" stroke="#F3B5B5" strokeWidth="2" transform="translate(0 -1)" />
    </Cup>
  ),
  strawberryMilk: (
    <g {...base}>
      <path d="M38 4 L32 30" fill="none" stroke={L} strokeWidth="5" />
      <path d="M38 4 L32 30" fill="none" stroke="#F3B5B5" strokeWidth="2.4" />
      <path d="M16 16 h32 l-4 40 q-1 4 -5 4 h-14 q-4 0 -5 -4 Z" fill="#FFFFFF" fillOpacity="0.7" />
      <path d="M17.5 28 h29 l-2.8 27.5 q-0.6 3 -4 3 h-15.4 q-3.4 0 -4 -3 Z" fill="#F7C3C6" />
      <path d="M44 12 C 54 10, 58 18, 52 24 Q48 28 44 24 C 40 20, 40 14, 44 12 Z" fill="#EE8C88" />
      <path d="M44 12 q2 -4 6 -3" fill="none" stroke="#7F9E77" strokeWidth="2.4" />
      <path d="M22 40 q4 3 8 0" fill="none" stroke="#fff" strokeWidth="2" />
    </g>
  ),
  pawPancake: (
    <g {...base}>
      <ellipse cx="32" cy="54" rx="26" ry="6" fill="#E9DCCB" />
      <ellipse cx="32" cy="47" rx="22" ry="7" fill="#D9A06A" />
      <ellipse cx="32" cy="41" rx="22" ry="7" fill="#E7B47C" />
      <ellipse cx="32" cy="34" rx="22" ry="7.5" fill="#F2C98A" />
      {/* 貓掌印 */}
      <g fill="#B97A4E" stroke="none">
        <ellipse cx="32" cy="35.5" rx="5.5" ry="3.2" />
        <ellipse cx="24.5" cy="32.5" rx="2.2" ry="1.6" />
        <ellipse cx="29" cy="30" rx="2.2" ry="1.6" />
        <ellipse cx="35" cy="30" rx="2.2" ry="1.6" />
        <ellipse cx="39.5" cy="32.5" rx="2.2" ry="1.6" />
      </g>
      <path d="M14 33 q2 6 3 10 q1 3 3 0 q0 -3 1 -6" fill="#F6C94E" strokeWidth="1.8" />
      <path d="M48 33 q0 5 -1 8 q-1 3 -3 0 q0 -2 -1 -5" fill="#F6C94E" strokeWidth="1.8" />
      <rect x="26" y="20" width="9" height="6" rx="1.4" fill="#FFF3C9" />
    </g>
  ),
  strawberryCake: (
    <g {...base}>
      <ellipse cx="32" cy="55" rx="26" ry="5.5" fill="#E9DCCB" />
      <path d="M10 40 L34 28 L54 36 L30 48 Z" fill="#FFFFFF" />
      <path d="M10 40 L30 48 L30 54 L10 46 Z" fill="#FBE8B6" />
      <path d="M30 48 L54 36 L54 42 L30 54 Z" fill="#F6DC93" />
      <path d="M10 43 L30 51 L54 39" fill="none" stroke="#F3B5B5" strokeWidth="2.2" />
      <path d="M22 34 q-2 -6 4 -6 q6 0 4 6" fill="#FFFFFF" />
      <path d="M32 24 C 22 22, 22 12, 28 10 Q32 9 36 10 C 42 12, 42 22, 32 24 Z" fill="#EE8C88" />
      <path d="M28 10 q4 4 8 0 q-4 -4 -8 0 Z" fill="#A8BEA0" />
      <circle cx="30" cy="16" r="0.9" fill="#FFF3C9" stroke="none" />
      <circle cx="34" cy="17" r="0.9" fill="#FFF3C9" stroke="none" />
    </g>
  ),
};

function DishIcon({ id, className = '' }) {
  return (
    <svg className={`dish-icon ${className}`} viewBox="0 0 64 64" aria-hidden="true">
      {DISHES[id] ?? null}
    </svg>
  );
}

export default memo(DishIcon);
