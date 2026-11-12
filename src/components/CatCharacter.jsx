import { memo } from 'react';

/**
 * 貓咪角色：4 花色 × 4 表情的手繪插畫（原始檔在 src/art-source/，
 * 以 scripts/build-art.py 轉成 src/assets/cats/*.webp）。
 * 16 張使用同一個裁切框，換表情時貓咪位置不會跳動。
 */
const FILES = import.meta.glob('../assets/cats/*.webp', { eager: true, import: 'default' });

/** 圖片寬高比（400×348），讓圖片載入前就佔好空間 */
const CAT_ASPECT = '400 / 348';

function catImage(catId, mood) {
  return FILES[`../assets/cats/${catId}-${mood}.webp`] ?? FILES['../assets/cats/orange-waiting.webp'];
}

// 預先載入全部表情，避免耐心下降換圖時閃一下
if (typeof Image !== 'undefined') {
  Object.values(FILES).forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}

function CatCharacter({ catId = 'orange', mood = 'waiting', className = '', title }) {
  return (
    <span className={`cat-art mood-${mood} cat-${catId} ${className}`} style={{ aspectRatio: CAT_ASPECT }}>
      <img
        src={catImage(catId, mood)}
        alt={title ?? ''}
        aria-hidden={title ? undefined : true}
        draggable="false"
        decoding="async"
      />
    </span>
  );
}

export default memo(CatCharacter);
