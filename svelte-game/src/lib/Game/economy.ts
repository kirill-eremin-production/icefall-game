// Экономические расчёты: стоимость зданий, проверка доступности,
// списание ресурсов и изменение темпов производства.
//
// Важно: функции модифицируют переданное состояние (GameState) в рамках store.update().

import type { BuildingKey, GameState, ResourceKey } from "./types";
import { BUILDINGS, COST_SCALE } from "./constants";

/**
 * Рассчитать текущую стоимость постройки здания с учётом:
 * - количества уже построенных зданий этого типа (рост цены);
 * - глобального множителя стоимости (настройка сложности);
 * - базовой стоимости конкретного здания.
 */
export function currentCost(s: GameState, key: BuildingKey) {
  const def = BUILDINGS[key];
  const c = s.counts[key];
  const factor = def.single ? 1 : Math.pow(s.multiplier, c);
  const base = def.baseCost;
  const scale = COST_SCALE[s.settings.cost] ?? 1;
  const bv = (v: number | undefined) => Math.ceil((v || 0) * factor * scale);
  return {
    wood: bv(base.wood),
    stone: bv(base.stone),
    food: bv(base.food),
    gold: bv(base.gold),
    pop: bv(base.pop),
  };
}

/**
 * Достаточно ли ресурсов у игрока для оплаты указанной стоимости.
 */
export function canAfford(
  s: GameState,
  cost: ReturnType<typeof currentCost>
): boolean {
  return (
    s.resources.wood >= cost.wood &&
    s.resources.stone >= cost.stone &&
    s.resources.food >= cost.food &&
    s.resources.gold >= cost.gold &&
    s.resources.pop >= (cost.pop || 0)
  );
}

/**
 * Списать ресурсы согласно стоимости.
 */
export function spend(s: GameState, cost: ReturnType<typeof currentCost>) {
  s.resources.wood -= cost.wood;
  s.resources.stone -= cost.stone;
  s.resources.food -= cost.food;
  s.resources.gold -= cost.gold;
  s.resources.pop -= cost.pop || 0;
}

/**
 * Увеличить темпы производства по ресурсу (при постройке производящего здания).
 */
export function addRates(s: GameState, res: ResourceKey | null, value: number) {
  if (!res) return;
  s.rates[res] += value;
}
