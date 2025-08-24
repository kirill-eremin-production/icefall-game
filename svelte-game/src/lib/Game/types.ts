// Типы доменной модели игры: ресурсы, здания, миссии, карта и состояние игры.
// Этот файл не содержит логики — только строго типизированные контракты,
// которые используются во всех остальных модулях проекта.

/**
 * Перечень ключей ресурсов, которыми оперирует экономика игры.
 * - wood  — дерево
 * - stone — камень
 * - food  — еда
 * - gold  — золото
 * - pop   — население (количество жителей)
 */
export type ResourceKey = "wood" | "stone" | "food" | "gold" | "pop";

/**
 * Перечень ключей доступных зданий.
 * - house      — Дом (даёт фиксированный прирост населения)
 * - lumberMill — Лесопилка (производит дерево)
 * - quarry     — Каменоломня (производит камень)
 * - farm       — Ферма (производит еду)
 * - goldMine   — Золотой рудник (производит золото)
 * - townHall   — Ратуша (уникальное здание; победное условие)
 */
export type BuildingKey =
  | "house"
  | "lumberMill"
  | "quarry"
  | "farm"
  | "goldMine"
  | "townHall";

/**
 * Набор значений по каждому ресурсу.
 * Используется и для текущих запасов, и для стоимостей, и для скоростей (rates).
 */
export interface Resources {
  wood: number;
  stone: number;
  food: number;
  gold: number;
  pop: number;
}

/**
 * Скорости прироста ресурсов в единицу игрового времени.
 * Совпадает по форме с Resources для единообразия.
 */
export interface Rates extends Resources {}

/**
 * Описание типа здания, используемое в каталоге BUILDINGS.
 * - resource     — какой ресурс производит (или null, если не производит)
 * - baseRate     — базовая скорость производства ресурса
 * - baseCost     — базовая стоимость постройки
 * - single       — уникальность (true = можно построить только 1 раз за игру)
 * - fixedPopGain — фиксированный разовый прирост населения при постройке
 */
export interface BuildingDef {
  key: BuildingKey;
  name: string;
  resource: ResourceKey | null;
  baseRate: number;
  baseCost: Partial<Resources>;
  single?: boolean;
  fixedPopGain?: number;
}

/**
 * Сложность по стоимости зданий:
 * - cheap     — дешёвые
 * - medium    — средние
 * - expensive — дорогие
 */
export type DifficultyCost = "cheap" | "medium" | "expensive";

/**
 * Сложность по длительности уровня:
 * - short  — короткий
 * - medium — средний
 * - long   — длинный
 */
export type DifficultyTime = "short" | "medium" | "long";

/**
 * Сложность по заданиям (набор миссий):
 * - easy   — лёгкая
 * - medium — средняя
 * - hard   — сложная
 */
export type DifficultyMissions = "easy" | "medium" | "hard";

/**
 * Игровые настройки, комбинирующие три оси сложности.
 */
export interface GameSettings {
  cost: DifficultyCost;
  time: DifficultyTime;
  missions: DifficultyMissions;
}

/**
 * Экземпляр построенного здания на карте.
 * Содержит ключ здания и координаты клетки.
 */
export interface BuiltItem {
  key: BuildingKey;
  x: number;
  y: number;
}

/**
 * Типы миссий, встречающиеся в игре:
 * - buildSet           — требуется построить определённый набор зданий в указанных количествах
 * - resourceThreshold  — требуется накопить определённые количества ресурсов
 * - goldMine           — требуется построить Золотой рудник
 * - townHall           — требуется построить Ратушу (обычно завершающее условие)
 */
export type MissionKind =
  | "buildSet"
  | "resourceThreshold"
  | "goldMine"
  | "townHall";

/**
 * Миссия с текстом, типом и дополнительными параметрами.
 * - payload — параметры, зависящие от типа миссии (например, целевые значения)
 * - done    — флаг выполнения (заполняется логикой игры)
 */
export interface Mission {
  id: number;
  text: string;
  kind: MissionKind;
  payload?: Record<string, any>;
  done?: boolean;
}

/**
 * Дескрипторы активных таймеров игрового цикла.
 * Используются для старта/остановки интервалов ресурсов и таймера уровня.
 */
export interface Loops {
  tick: any;
  timer: any;
}

/**
 * Карта игрового поля:
 * - w, h            — ширина и высота в клетках
 * - occupied[y][x]  — ключ здания, если клетка занята, иначе null
 */
export interface GameMap {
  w: number;
  h: number;
  occupied: (BuildingKey | null)[][];
}

/**
 * Полное состояние игры, хранящееся в Svelte store.
 * Все поля обновляются иммутабельно через store.update().
 */
export interface GameState {
  started: boolean; // Игра запущена
  paused: boolean; // Игра на паузе
  won: boolean; // Победа достигнута
  timeLeft: number; // Оставшееся время (секунды)
  timeSpeed: 1 | 2 | 3; // Ускорение времени (множитель тика)
  multiplier: number; // Множитель роста цены при повторных постройках
  resources: Resources; // Текущие запасы
  rates: Rates; // Текущие скорости набора ресурсов
  counts: Record<BuildingKey, number>; // Сколько каждого типа зданий построено
  settings: GameSettings; // Текущие настройки сложности
  map: GameMap; // Состояние карты
  built: BuiltItem[]; // Построенные здания c координатами
  placement: {
    // Режим размещения здания на карте
    active: boolean;
    buildKey: BuildingKey | null;
    prevPaused?: boolean; // Сохранённое состояние паузы до входа в режим
  };
  missions: Mission[]; // Текущий набор миссий с прогрессом
  log: string[]; // Журнал событий (последние сверху)
  loops: Loops; // Активные интервальные таймеры
}
