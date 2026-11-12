import { UiIcon } from './art/SceneArt.jsx';
import { usePlayer } from '../utils/player.js';

/** 玩家顯示區：用來確認平台帶進來的身分是否正確 */
export default function PlayerBadge({ className = '' }) {
  const player = usePlayer();
  return (
    <div
      className={`player-badge ${player.source === 'guest' ? 'is-guest' : ''} ${className}`}
      aria-label={`玩家：${player.name}`}
      title={player.name}
      data-player-source={player.source}
    >
      <UiIcon name="paw" />
      <span className="player-name">{player.name}</span>
    </div>
  );
}
