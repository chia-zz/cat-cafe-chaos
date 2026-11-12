import { LuckyCatArt, MilkSpillArt, UiIcon } from './art/SceneArt.jsx';
import { EVENTS } from '../data/events.js';

/**
 * 事件提示區：
 * - 固定高度的狀態列（招財貓倒數、打翻牛奶、尖峰時段）
 * - 事件剛發生時的大型提示（banner），時間由遊戲狀態控制，暫停時一起暫停
 */
export function EventBar({ event, elapsed, rush }) {
  let content = null;
  if (event?.type === 'luckyCat') {
    const left = Math.max(0, event.endsAt - elapsed);
    const ratio = left / EVENTS.luckyCat.duration;
    content = (
      <div className="event-chip chip-lucky">
        <LuckyCatArt />
        <span>招財貓加持中・分數 ×2</span>
        <strong>{left.toFixed(1)}s</strong>
        <span className="chip-timer" style={{ transform: `scaleX(${ratio})` }} />
      </div>
    );
  } else if (event?.type === 'milkSpill') {
    content = (
      <div className="event-chip chip-spill">
        <MilkSpillArt />
        <span>
          牛奶打翻了！快擦乾淨（{event.cleaned}/{event.required}）
        </span>
      </div>
    );
  } else if (rush) {
    content = (
      <div className="event-chip chip-rush">
        <UiIcon name="paw" />
        <span>尖峰時段！貓咪更沒耐心了</span>
      </div>
    );
  } else {
    content = (
      <div className="event-chip chip-calm">
        <UiIcon name="paw" />
        <span>依照順序點食材，做好就出餐！</span>
      </div>
    );
  }
  return (
    <div className="event-bar" aria-live="polite">
      {content}
    </div>
  );
}

export function EventBanner({ banner }) {
  if (!banner) return null;
  return (
    <div className={`event-banner banner-${banner.kind}`} key={banner.id} role="status">
      {banner.kind === 'lucky' && <LuckyCatArt className="banner-art" />}
      {banner.kind === 'spill' && <MilkSpillArt className="banner-art" />}
      <strong>{banner.title}</strong>
      <span>{banner.text}</span>
    </div>
  );
}
