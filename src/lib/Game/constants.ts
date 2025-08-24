// Константы домена игры: каталог зданий, иконки, масштаб стоимости и пресеты времени.
// В этом модуле нет логики — только неизменяемые данные и справочники.

import type {
  BuildingKey,
  BuildingDef,
  DifficultyCost,
  DifficultyTime,
} from "./types";

/**
 * Каталог всех типов зданий в игре.
 * Используется для:
 * - отображения названий;
 * - вычисления стоимости (baseCost);
 * - понимания производимого ресурса (resource) и его базового темпа (baseRate);
 * - проверки уникальности (single);
 * - разового прироста населения (fixedPopGain) для дома.
 */
export const BUILDINGS: Record<BuildingKey, BuildingDef> = {
  house: {
    key: "house",
    name: "Дом",
    resource: "pop",
    baseRate: 0,
    fixedPopGain: 3,
    baseCost: { wood: 5, stone: 5, food: 5, gold: 0, pop: 0 },
  },
  lumberMill: {
    key: "lumberMill",
    name: "Лесопилка",
    resource: "wood",
    baseRate: 1,
    baseCost: { wood: 0, stone: 10, food: 5, gold: 0, pop: 1 },
  },
  quarry: {
    key: "quarry",
    name: "Каменоломня",
    resource: "stone",
    baseRate: 1,
    baseCost: { wood: 10, stone: 0, food: 5, gold: 0, pop: 1 },
  },
  farm: {
    key: "farm",
    name: "Ферма",
    resource: "food",
    baseRate: 1,
    baseCost: { wood: 10, stone: 10, food: 0, gold: 0, pop: 1 },
  },
  goldMine: {
    key: "goldMine",
    name: "Золотой рудник",
    resource: "gold",
    baseRate: 0.5,
    baseCost: { wood: 30, stone: 30, food: 20, gold: 0, pop: 2 },
  },
  townHall: {
    key: "townHall",
    name: "Ратуша",
    resource: null,
    baseRate: 0,
    baseCost: { wood: 150, stone: 150, food: 100, gold: 75, pop: 5 },
    single: true,
  },
};

/**
 * Отображение иконок для визуализации зданий на UI/карте.
 */
export const ICONS: Record<BuildingKey, string> = {
  house: "🏠",
  lumberMill: "🪓",
  quarry: "⛏️",
  farm: "🌾",
  goldMine: "🪙",
  townHall: "🏛️",
};

/**
 * Масштаб стоимости в зависимости от выбранной сложности затрат.
 * Применяется как общий коэффициент к базовым стоимостям зданий.
 */
export const COST_SCALE: Record<DifficultyCost, number> = {
  cheap: 0.8,
  medium: 1.0,
  expensive: 1.5,
};

/**
 * Предустановки длительности уровня (в секундах) по выбранной сложности времени.
 */
export const TIME_PRESETS: Record<DifficultyTime, number> = {
  short: 240,
  medium: 360,
  long: 480,
};
