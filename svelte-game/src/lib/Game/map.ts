// Вспомогательные функции работы с картой: сетка занятых клеток, поиск свободной клетки,
// размещение здания и сброс состояния карты.

import type { BuildingKey, GameState } from "./types";

/**
 * Создать пустую матрицу занятости карты размером w x h.
 * Клетка равна null, если не занята, либо хранит ключ типа здания, если занята.
 */
export function emptyOccupied(w: number, h: number): (BuildingKey | null)[][] {
  return Array.from({ length: h }, () => Array.from({ length: w }, () => null));
}

/**
 * Сбросить состояние карты (очистить занятость и список построек).
 */
export function resetMapState(s: GameState) {
  s.map.occupied = emptyOccupied(s.map.w, s.map.h);
  s.built = [];
}

/**
 * Найти первую свободную клетку, просматривая строки сверху вниз и слева направо.
 * Возвращает координаты x,y или null, если свободных клеток нет.
 */
export function findFreeCell(s: GameState): { x: number; y: number } | null {
  for (let y = 0; y < s.map.h; y++) {
    for (let x = 0; x < s.map.w; x++) {
      if (!s.map.occupied[y][x]) return { x, y };
    }
  }
  return null;
}

/**
 * Пометить клетку как занятую данным типом здания и добавить запись в список построек.
 */
export function placeBuildingAt(
  s: GameState,
  buildKey: BuildingKey,
  x: number,
  y: number
) {
  s.map.occupied[y][x] = buildKey;
  s.built.push({ key: buildKey, x, y });
}
