import { memo } from 'react';

/** 原創食材圖示（48×48），柔和深棕描邊 */
const L = '#5C4033';
const base = { stroke: L, strokeWidth: 2.4, strokeLinejoin: 'round', strokeLinecap: 'round' };

const ICONS = {
  coffee: (
    <g {...base}>
      <g transform="rotate(-28 17 26)">
        <ellipse cx="17" cy="26" rx="8.5" ry="12" fill="#8A5A3C" />
        <path d="M17 15 Q12 26 17 37" fill="none" stroke="#5E3A26" strokeWidth="2.2" />
      </g>
      <g transform="rotate(22 32 22)">
        <ellipse cx="32" cy="22" rx="8" ry="11.5" fill="#A06C47" />
        <path d="M32 11.5 Q27 22 32 32.5" fill="none" stroke="#5E3A26" strokeWidth="2.2" />
      </g>
      <path d="M24 41 q2 -2 4 0" fill="none" stroke="#A06C47" />
    </g>
  ),
  hotWater: (
    <g {...base}>
      <path d="M17 8 q-3 3 0 6 q3 3 0 6 M24 6 q-3 3 0 6 q3 3 0 6" fill="none" stroke="#9CC3CC" strokeWidth="2.2" />
      <path d="M33 24 L43 17" fill="none" strokeWidth="4.5" />
      <path d="M33 24 L43 17" fill="none" stroke="#DCEBEE" strokeWidth="1.8" />
      <path d="M10 42 Q8 24 22 22 Q36 24 34 42 Z" fill="#DCEBEE" />
      <path d="M14 22 Q22 16 30 22" fill="#BFD8DD" />
      <circle cx="22" cy="17" r="2.2" fill="#BFD8DD" />
      <path d="M9 30 Q2 30 4 37 Q6 41 10 40" fill="none" />
      <path d="M15 34 q3 2 6 0" fill="none" stroke="#9CC3CC" />
    </g>
  ),
  milk: (
    <g {...base}>
      <path d="M14 18 L24 9 L34 18 Z" fill="#E7EEF2" />
      <rect x="14" y="18" width="20" height="24" rx="2" fill="#FFFFFF" />
      <rect x="14" y="25" width="20" height="10" fill="#A8BEA0" />
      <path d="M24 27.5 q3 4 0 6 q-3 -2 0 -6 Z" fill="#fff" strokeWidth="1.4" />
      <rect x="21" y="5.5" width="6" height="4" rx="1" fill="#F6DC93" />
    </g>
  ),
  strawberry: (
    <g {...base}>
      <path d="M24 42 C 10 34, 8 20, 16 16 Q24 13 32 16 C 40 20, 38 34, 24 42 Z" fill="#EE8C88" />
      <path d="M16 16 Q20 22 24 16 Q28 22 32 16 Q28 11 24 13 Q20 11 16 16 Z" fill="#A8BEA0" />
      <path d="M24 13 L25 7" fill="none" />
      <g fill="#FFF3C9" stroke="none">
        <ellipse cx="18" cy="24" rx="1.1" ry="1.6" />
        <ellipse cx="24" cy="23" rx="1.1" ry="1.6" />
        <ellipse cx="30" cy="24" rx="1.1" ry="1.6" />
        <ellipse cx="21" cy="30" rx="1.1" ry="1.6" />
        <ellipse cx="27" cy="30" rx="1.1" ry="1.6" />
        <ellipse cx="24" cy="36" rx="1.1" ry="1.6" />
      </g>
    </g>
  ),
  batter: (
    <g {...base}>
      <path d="M33 6 L26 24" fill="none" strokeWidth="2.6" />
      <path d="M26 24 q-6 -3 -5 -9 M26 24 q1 -7 7 -8" fill="none" stroke="#B9A493" strokeWidth="1.8" />
      <ellipse cx="24" cy="26" rx="17" ry="5" fill="#FBE8B6" />
      <path d="M7 26 Q8 42 24 42 Q40 42 41 26" fill="#F3B5B5" />
      <path d="M12 33 q12 4 24 0" fill="none" stroke="#fff" strokeWidth="1.8" />
    </g>
  ),
  bake: (
    <g {...base}>
      <path d="M17 44 q-4 -6 1 -11 q1 4 4 4 q-1 -6 4 -9 q0 6 5 7 q2 -3 1 -6 q6 6 1 15 Z" fill="#F4A261" />
      <path d="M21 44 q-1 -4 2 -6 q1 3 3 3 q2 -2 2 -4 q3 4 0 7 Z" fill="#F6DC93" strokeWidth="1.6" />
      <ellipse cx="22" cy="22" rx="15" ry="6.5" fill="#6E5A50" />
      <ellipse cx="22" cy="21" rx="10" ry="3.6" fill="#F2C98A" strokeWidth="1.6" />
      <path d="M37 21 L46 18" fill="none" strokeWidth="4.4" />
      <path d="M37 21 L46 18" fill="none" stroke="#B07C55" strokeWidth="1.8" />
    </g>
  ),
  honey: (
    <g {...base}>
      <rect x="13" y="9" width="22" height="6" rx="2" fill="#B07C55" />
      <path d="M12 15 h24 v20 a7 7 0 0 1 -7 7 h-10 a7 7 0 0 1 -7 -7 Z" fill="#F6C94E" />
      <path d="M12 19 h24 q-2 5 -6 2 q-3 6 -6 1 q-4 4 -6 -1 q-4 3 -6 -2 Z" fill="#E9A93B" strokeWidth="1.6" />
      <rect x="17" y="26" width="14" height="9" rx="2" fill="#FFF8EC" strokeWidth="1.6" />
      <path d="M21 30.5 h6" fill="none" strokeWidth="1.6" />
      <path d="M38 6 L33 20" fill="none" strokeWidth="2.6" />
      <ellipse cx="40" cy="6" rx="3.2" ry="2.4" fill="#B07C55" transform="rotate(-20 40 6)" />
    </g>
  ),
  cake: (
    <g {...base}>
      <path d="M6 30 L26 18 L42 26 L22 38 Z" fill="#FBE8B6" />
      <path d="M6 30 L22 38 L22 44 L6 36 Z" fill="#F6DC93" />
      <path d="M22 38 L42 26 L42 32 L22 44 Z" fill="#EBC47A" />
      <path d="M8 33.5 L22 40.5 L42 29" fill="none" stroke="#FFF8EC" strokeWidth="1.6" />
      <circle cx="24" cy="28" r="1.2" fill="#E5BE7B" stroke="none" />
      <circle cx="30" cy="25.5" r="1.2" fill="#E5BE7B" stroke="none" />
    </g>
  ),
  cream: (
    <g {...base}>
      <path d="M10 40 Q8 34 14 33 Q10 26 18 25 Q16 17 24 16 Q24 9 28 7 Q30 14 32 17 Q38 19 34 26 Q41 28 36 34 Q42 36 38 40 Z" fill="#FFFFFF" />
      <path d="M15 33 q8 3 16 -1 M19 25 q6 2 12 -1" fill="none" stroke="#E6D7C7" strokeWidth="1.8" />
      <ellipse cx="24" cy="41" rx="17" ry="3.4" fill="#F3B5B5" />
    </g>
  ),
};

function IngredientIcon({ id, className = '' }) {
  return (
    <svg className={`ingredient-icon ${className}`} viewBox="0 0 48 48" aria-hidden="true">
      {ICONS[id] ?? null}
    </svg>
  );
}

export default memo(IngredientIcon);
