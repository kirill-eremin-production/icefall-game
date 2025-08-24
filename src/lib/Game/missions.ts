// Логика формирования и проверки миссий уровня.
// Содержит функции генерации набора миссий по сложности и проверку выполнения конкретной миссии.

import type { DifficultyMissions, GameState, Mission } from "./types";

/**
 * Сгенерировать список миссий для выбранного уровня сложности.
 * Наборы "easy" / "medium" / "hard" отличаются целями и порогами ресурсов.
 */
export function generateMissions(level: DifficultyMissions): Mission[] {
  if (level === "easy") {
    return [
      {
        id: 1,
        text: "Постройте 1 Лесопилку, 1 Каменоломню и 1 Ферму",
        kind: "buildSet",
        payload: { lumberMill: 1, quarry: 1, farm: 1 },
      },
      {
        id: 2,
        text: "Накопите 150 дерева, 150 камня и 80 еды",
        kind: "resourceThreshold",
        payload: { wood: 150, stone: 150, food: 80 },
      },
      { id: 3, text: "Постройте Ратушу", kind: "townHall" },
    ];
  }

  if (level === "hard") {
    return [
      {
        id: 1,
        text: "Постройте 6 лесопилок, 6 каменоломен и 6 ферм",
        kind: "buildSet",
        payload: { lumberMill: 6, quarry: 6, farm: 6 },
      },
      {
        id: 2,
        text: "Накопите 250 дерева, 250 камня и 120 еды",
        kind: "resourceThreshold",
        payload: { wood: 250, stone: 250, food: 120 },
      },
      { id: 3, text: "Постройте Золотой рудник", kind: "goldMine" },
      {
        id: 4,
        text: "Накопите 50 золота",
        kind: "resourceThreshold",
        payload: { gold: 50 },
      },
      { id: 5, text: "Постройте Ратушу", kind: "townHall" },
    ];
  }

  // medium
  return [
    {
      id: 1,
      text: "Постройте 1 Лесопилку, 1 Каменоломню и 1 Ферму",
      kind: "buildSet",
      payload: { lumberMill: 1, quarry: 1, farm: 1 },
    },
    {
      id: 2,
      text: "Накопите 200 дерева, 200 камня и 100 еды",
      kind: "resourceThreshold",
      payload: { wood: 200, stone: 200, food: 100 },
    },
    { id: 3, text: "Постройте Ратушу", kind: "townHall" },
  ];
}

/**
 * Проверка, выполнена ли миссия в текущем состоянии игры.
 * Для разных типов миссий критерии проверяются по-разному.
 */
export function missionDone(m: Mission, s: GameState): boolean {
  switch (m.kind) {
    case "buildSet": {
      const req = m.payload || {};
      return Object.entries(req).every(([k, v]) => (s.counts as any)[k] >= v);
    }
    case "resourceThreshold": {
      const req = m.payload || {};
      return Object.entries(req).every(
        ([k, v]) => (s.resources as any)[k] >= v
      );
    }
    case "goldMine":
      return s.counts.goldMine >= 1;
    case "townHall":
      return s.counts.townHall >= 1;
  }
}
