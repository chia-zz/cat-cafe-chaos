import { memo } from 'react';
import cafeBg from '../../assets/cafe-bg.webp';
import logoImg from '../../assets/logo.webp';

const L = '#5C4033';
const s = { stroke: L, strokeWidth: 2.4, strokeLinejoin: 'round', strokeLinecap: 'round' };

/** 咖啡廳牆面背景（手繪插畫，來源 src/art-source/bg.png） */
export const CafeBackdrop = memo(function CafeBackdrop() {
  return <img className="cafe-backdrop" src={cafeBg} alt="" aria-hidden="true" draggable="false" />;
});

/** 招財貓 */
export const LuckyCatArt = memo(function LuckyCatArt({ className = '' }) {
  return (
    <svg className={`lucky-cat ${className}`} viewBox="0 0 64 64" aria-hidden="true">
      <g {...s} strokeWidth="2.2">
        <ellipse cx="32" cy="50" rx="17" ry="12" fill="#FFFDF8" />
        <g className="lucky-paw">
          <path d="M46 34 q8 -4 8 -16 q-1 -6 -6 -4 q-4 2 -6 14" fill="#FFFDF8" />
          <path d="M48 16 q2 -3 5 -1" fill="none" strokeWidth="1.6" />
        </g>
        <path d="M14 22 L16 6 L27 13 Z M50 22 L48 6 L37 13 Z" fill="#FFFDF8" />
        <path d="M17 17 L18 10 L23 14 Z M47 17 L46 10 L41 14 Z" fill="#F3B5B5" stroke="none" />
        <ellipse cx="32" cy="27" rx="19" ry="15" fill="#FFFDF8" />
        <ellipse cx="22" cy="18" rx="6" ry="5" fill="#E9A15F" stroke="none" />
        <path d="M22 28 q3 -4 6 0 M36 28 q3 -4 6 0" fill="none" strokeWidth="2" />
        <path d="M29 33 q3 3 6 0" fill="none" strokeWidth="1.8" />
        <path d="M18 40 q14 6 28 0" fill="none" stroke="#D9706A" strokeWidth="3.4" />
        <circle cx="32" cy="44" r="3.6" fill="#F6C94E" strokeWidth="1.8" />
        <ellipse cx="22" cy="54" rx="8" ry="6.5" fill="#F6C94E" />
        <ellipse cx="22" cy="54" rx="4.4" ry="3.4" fill="none" stroke="#C99A3B" strokeWidth="1.6" />
      </g>
    </svg>
  );
});

/** 打翻的牛奶 */
export const MilkSpillArt = memo(function MilkSpillArt({ className = '' }) {
  return (
    <svg className={`milk-spill ${className}`} viewBox="0 0 160 70" aria-hidden="true">
      <g {...s}>
        <path d="M14 50 q-6 -14 14 -16 q8 -14 30 -8 q20 -10 40 2 q26 -4 30 12 q20 6 6 16 q-10 8 -30 4 q-20 8 -44 2 q-26 6 -40 -4 q-10 -2 -6 -8 Z" fill="#FFFFFF" />
        <circle cx="148" cy="38" r="5" fill="#FFFFFF" />
        <circle cx="10" cy="36" r="3.4" fill="#FFFFFF" />
        <g transform="rotate(-70 112 26)">
          <path d="M100 8 h24 l-3 30 h-18 Z" fill="#E7F1F2" />
          <path d="M101 14 h22" fill="none" stroke="#A8BEA0" strokeWidth="3" />
        </g>
        <path d="M40 44 q10 4 20 0" fill="none" stroke="#E6DCD0" strokeWidth="2" />
      </g>
    </svg>
  );
});

/** 標誌：貓耳咖啡杯（手繪插畫） */
export const LogoMark = memo(function LogoMark({ className = '' }) {
  return <img className={`logo-mark ${className}`} src={logoImg} alt="" aria-hidden="true" draggable="false" />;
});

/** 小星星（正確製作特效） */
export function Sparkle({ className = '', style }) {
  return (
    <svg className={`sparkle ${className}`} style={style} viewBox="0 0 20 20" aria-hidden="true">
      <path d="M10 1 L12.4 7.6 L19 10 L12.4 12.4 L10 19 L7.6 12.4 L1 10 L7.6 7.6 Z" fill="#F6DC93" stroke="#C9963B" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

/** 小圖示：時鐘、星星、暫停、喇叭 */
export function UiIcon({ name, className = '' }) {
  const p = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.4, strokeLinecap: 'round', strokeLinejoin: 'round' };
  return (
    <svg className={`ui-icon ${className}`} viewBox="0 0 24 24" aria-hidden="true">
      {name === 'clock' && (
        <g {...p}>
          <circle cx="12" cy="13" r="8.5" />
          <path d="M12 8.5 V13 L15 15" />
          <path d="M9 2.5 h6" />
        </g>
      )}
      {name === 'star' && <path d="M12 3 L14.6 9 L21 9.5 L16 13.6 L17.6 20 L12 16.6 L6.4 20 L8 13.6 L3 9.5 L9.4 9 Z" {...p} />}
      {name === 'pause' && (
        <g {...p}>
          <path d="M9 6 v12 M15 6 v12" strokeWidth="3" />
        </g>
      )}
      {name === 'sound-on' && (
        <g {...p}>
          <path d="M4 9.5 h3.5 L12 5.5 v13 L7.5 14.5 H4 Z" />
          <path d="M15.5 9 q2 3 0 6 M18.5 6.5 q4 5.5 0 11" />
        </g>
      )}
      {name === 'sound-off' && (
        <g {...p}>
          <path d="M4 9.5 h3.5 L12 5.5 v13 L7.5 14.5 H4 Z" />
          <path d="M16 9.5 l5 5 M21 9.5 l-5 5" />
        </g>
      )}
      {name === 'paw' && (
        <g fill="currentColor">
          <ellipse cx="12" cy="15" rx="5" ry="4.2" />
          <circle cx="5.5" cy="10" r="2.2" />
          <circle cx="9.5" cy="6" r="2.2" />
          <circle cx="14.5" cy="6" r="2.2" />
          <circle cx="18.5" cy="10" r="2.2" />
        </g>
      )}
    </svg>
  );
}
