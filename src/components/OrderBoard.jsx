import OrderCard from './OrderCard.jsx';
import { CafeBackdrop, UiIcon } from './art/SceneArt.jsx';
import { GAME_CONFIG } from '../utils/gameConfig.js';

/** 貓咪訂單區：固定三個座位，避免訂單進出時版面跳動 */
export default function OrderBoard({ orders, selectedId, lucky, elapsed, floaters, onSelect, children }) {
  const slots = Array.from({ length: GAME_CONFIG.maxOrders }, (_, i) => i);
  return (
    <section className="order-board" aria-label="貓咪訂單區">
      <CafeBackdrop />
      <div className="order-slots">
        {slots.map((slot) => {
          const order = orders.find((o) => o.slot === slot);
          const slotFloaters = floaters.filter((f) => f.slot === slot);
          return (
            <div className="order-slot" key={slot}>
              {order ? (
                <OrderCard
                  key={order.id}
                  order={order}
                  selected={order.id === selectedId}
                  lucky={lucky}
                  elapsed={elapsed}
                  onSelect={onSelect}
                />
              ) : (
                <div className="order-empty" aria-hidden="true">
                  <UiIcon name="paw" />
                  <span>空位</span>
                </div>
              )}
              {slotFloaters.map((f, i) => (
                <span key={f.id} className={`floater floater-${f.kind}`} style={{ '--i': i }}>
                  {f.text}
                </span>
              ))}
            </div>
          );
        })}
      </div>
      {children}
    </section>
  );
}
