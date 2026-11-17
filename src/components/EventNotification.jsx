import { LuckyCatArt, MilkSpillArt, UiIcon } from './art/SceneArt.jsx';
import { EVENTS } from '../data/events.js';
import { GAME_CONFIG } from '../utils/gameConfig.js';
import { bannerText, useI18n } from '../i18n/index.js';

/**
 * 事件提示區：
 * - 固定高度的狀態列（招財貓倒數、打翻牛奶、尖峰時段）
 * - 事件剛發生時的大型提示（banner），時間由遊戲狀態控制，暫停時一起暫停
 */
export function EventBar({ event, elapsed, rush }) {
  const { t } = useI18n();
  let content = null;
  if (event?.type === 'luckyCat') {
    const left = Math.max(0, event.endsAt - elapsed);
    const ratio = left / EVENTS.luckyCat.duration;
    content = (
      <div className="event-chip chip-lucky">
        <LuckyCatArt />
        <span>{t('eventBar.lucky', { x: GAME_CONFIG.scoring.luckyMultiplier })}</span>
        <strong>{left.toFixed(1)}s</strong>
        <span className="chip-timer" style={{ transform: `scaleX(${ratio})` }} />
      </div>
    );
  } else if (event?.type === 'milkSpill') {
    content = (
      <div className="event-chip chip-spill">
        <MilkSpillArt />
        <span>{t('eventBar.spill', { n: event.cleaned, total: event.required })}</span>
      </div>
    );
  } else if (rush) {
    content = (
      <div className="event-chip chip-rush">
        <UiIcon name="paw" />
        <span>{t('eventBar.rush')}</span>
      </div>
    );
  } else {
    content = (
      <div className="event-chip chip-calm">
        <UiIcon name="paw" />
        <span>{t('eventBar.calm')}</span>
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
  const { t } = useI18n();
  if (!banner) return null;
  const { title, text } = bannerText(t, banner);
  return (
    <div className={`event-banner banner-${banner.kind}`} key={banner.id} role="status">
      {banner.kind === 'lucky' && <LuckyCatArt className="banner-art" />}
      {banner.kind === 'spill' && <MilkSpillArt className="banner-art" />}
      <strong>{title}</strong>
      <span>{text}</span>
    </div>
  );
}
