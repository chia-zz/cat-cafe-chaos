import { UiIcon } from './art/SceneArt.jsx';
import { usePlayer } from '../utils/player.js';
import { useI18n } from '../i18n/index.js';

/** 玩家顯示區：用來確認平台帶進來的身分是否正確 */
export default function PlayerBadge({ className = '' }) {
  const player = usePlayer();
  const { t } = useI18n();
  // 訪客名稱跟著語言切換；平台帶入的名字照原樣顯示
  const name = player.source === 'guest' ? t('player.guest') : player.name;
  return (
    <div
      className={`player-badge ${player.source === 'guest' ? 'is-guest' : ''} ${className}`}
      aria-label={t('player.aria', { name })}
      title={name}
      data-player-source={player.source}
    >
      <UiIcon name="paw" />
      <span className="player-name">{name}</span>
    </div>
  );
}
