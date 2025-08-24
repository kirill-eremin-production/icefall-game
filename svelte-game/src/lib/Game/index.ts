import { writable, get, type Writable } from "svelte/store";

// Централизованный Svelte-store игры: хранит состояние, управляет циклами,
// режимом постройки, журналом событий и проверкой победы.
// Логику и данные вынесены по модулям для лучшей читаемости/тестируемости.
import type {
  GameState,
  GameSettings,
  BuildingKey,
  DifficultyCost,
} from "./types";
import { BUILDINGS, ICONS, COST_SCALE, TIME_PRESETS } from "./constants";
import { format, formatTimeSecToMMSS } from "./utils";
import { generateMissions, missionDone } from "./missions";
import { currentCost, canAfford, spend, addRates } from "./economy";
import { emptyOccupied, findFreeCell, placeBuildingAt } from "./map";

// Реэкспорт публичных утилит/констант/типов для обратной совместимости с импортами из gameStore.
export { BUILDINGS, ICONS, COST_SCALE, TIME_PRESETS } from "./constants";
export { format, formatTimeSecToMMSS } from "./utils";
export type { GameState, GameSettings, BuildingKey } from "./types";

// =============== Initial State ===============

/**
 * Сформировать начальное состояние игры.
 * Здесь задаются стартовые ресурсы, карта, настройки и пр.
 */
function initialState(): GameState {
  return {
    started: false,
    paused: false,
    won: false,
    timeLeft: 240,
    timeSpeed: 1,
    multiplier: 1.25,
    resources: { wood: 50, stone: 50, food: 30, gold: 0, pop: 3 },
    rates: { wood: 0, stone: 0, food: 0, gold: 0, pop: 0 },
    counts: {
      house: 0,
      lumberMill: 0,
      quarry: 0,
      farm: 0,
      goldMine: 0,
      townHall: 0,
    },
    settings: { cost: "medium", time: "medium", missions: "medium" },
    map: { w: 12, h: 12, occupied: emptyOccupied(12, 12) },
    built: [],
    placement: { active: false, buildKey: null },
    missions: [],
    log: [],
    loops: { tick: null, timer: null },
  };
}

// =============== Store ===============

/**
 * Главный фабричный метод, создающий API игры и инкапсулирующий внутреннюю логику.
 * Внешним компонентам предоставляется только набор безопасных методов и subscribe().
 */
function createGameStore() {
  const store: Writable<GameState> = writable(initialState());

  // =============== Внутренние утилиты стора ===============

  function log(message: string) {
    store.update((s) => {
      s.log.unshift(message);
      return s;
    });
  }

  function applySettings() {
    store.update((s) => {
      s.timeLeft = TIME_PRESETS[s.settings.time] || 240;
      s.missions = generateMissions(s.settings.missions);
      return s;
    });
  }

  function setSetting<K extends keyof GameSettings>(
    key: K,
    value: GameSettings[K]
  ) {
    store.update((s) => {
      s.settings[key] = value as any;
      return s;
    });
  }

  function getCostLabel(cost: DifficultyCost) {
    return cost === "cheap"
      ? "дешёвые"
      : cost === "expensive"
      ? "дорогие"
      : "средние";
  }

  function previewStartInfo(): string {
    const s = get(store);
    const t = TIME_PRESETS[s.settings.time] || 240;
    const count = generateMissions(s.settings.missions).length;
    const costLabel = getCostLabel(s.settings.cost);
    return `Время: ${formatTimeSecToMMSS(
      t
    )}, цены: ${costLabel}, заданий: ${count}.`;
  }

  function refreshMissionFlags() {
    store.update((s) => {
      for (const m of s.missions) {
        const now = missionDone(m, s);
        if (now !== !!m.done) {
          m.done = now;
          if (now) log("Задание выполнено: " + m.text);
        }
      }
      return s;
    });
  }

  function allMissionsDone(s: GameState) {
    return s.missions.length > 0 && s.missions.every((m) => missionDone(m, s));
  }

  function checkWin() {
    store.update((s) => {
      if (!s.won && allMissionsDone(s)) {
        s.won = true;
        stopLoops();
        log("Вы выиграли! Ратуша возведена, все задания закрыты.");
      }
      return s;
    });
  }

  // =============== Игровые циклы (ресурсы и таймер времени) ===============

  function startLoops() {
    stopLoops();
    store.update((s) => {
      s.loops.tick = setInterval(() => {
        const st = get(store);
        if (st.paused || st.won || !st.started) return;
        const sp = st.timeSpeed || 1;

        // Прирост ресурсов раз в секунду с учётом ускорения времени
        store.update((u) => {
          u.resources.wood += u.rates.wood * sp;
          u.resources.stone += u.rates.stone * sp;
          u.resources.food += u.rates.food * sp;
          u.resources.gold += u.rates.gold * sp;
          u.resources.pop += u.rates.pop * sp;
          return u;
        });

        refreshMissionFlags();
        checkWin();
      }, 1000);

      s.loops.timer = setInterval(() => {
        const st = get(store);
        if (st.paused || st.won || !st.started) return;
        s.timeLeft -= st.timeSpeed || 1;
        if (s.timeLeft <= 0) {
          s.timeLeft = 0;
          stopLoops();
          if (!s.won) {
            log("Поражение: время вышло.");
          }
        }
      }, 1000);
      return s;
    });
  }

  function stopLoops() {
    store.update((s) => {
      if (s.loops.tick) clearInterval(s.loops.tick);
      if (s.loops.timer) clearInterval(s.loops.timer);
      s.loops.tick = null;
      s.loops.timer = null;
      return s;
    });
  }

  // =============== Управление жизненным циклом ===============

  function pause() {
    store.update((s) => {
      s.paused = true;
      return s;
    });
  }
  function resume() {
    store.update((s) => {
      s.paused = false;
      return s;
    });
  }

  function setSpeed(mult: 1 | 2 | 3) {
    store.update((s) => {
      s.timeSpeed = mult;
      return s;
    });
  }

  function startGame() {
    store.update((s) => {
      if (s.started) return s;
      // Применить настройки к времени/наборам миссий
      s.timeLeft = TIME_PRESETS[s.settings.time] || 240;
      s.missions = generateMissions(s.settings.missions);
      s.started = true;
      return s;
    });
    const s = get(store);
    const tasksCount = s.missions.length;
    const timeText = formatTimeSecToMMSS(s.timeLeft);
    const costLabel = getCostLabel(s.settings.cost);
    log(
      `Игра началась! Настройки: время ${timeText}, цены ${costLabel}, заданий ${tasksCount}.`
    );
    startLoops();
  }

  function restart() {
    stopLoops();
    store.set(initialState());
    applySettings();
  }

  // =============== Режим размещения зданий ===============

  function enterPlacementMode(buildKey: BuildingKey) {
    store.update((s) => {
      const def = BUILDINGS[buildKey];
      if (def.single && s.counts[buildKey] >= 1) {
        log(def.name + ": уже построено.");
        return s;
      }
      const free = findFreeCell(s);
      if (!free) {
        log("На карте нет свободных клеток.");
        return s;
      }
      s.placement.prevPaused = !!s.paused;
      s.placement.active = true;
      s.placement.buildKey = buildKey;
      s.paused = true;
      log(
        "Игра поставлена на паузу. Выберите клетку для строительства: " +
          def.name +
          ". Нажмите Esc, чтобы отменить."
      );
      return s;
    });
  }

  function leavePlacementMode() {
    store.update((s) => {
      s.placement.active = false;
      s.placement.buildKey = null;
      const prev = s.placement.prevPaused;
      if (typeof prev !== "undefined") {
        s.paused = !!prev;
        delete s.placement.prevPaused;
      } else {
        s.paused = false;
      }
      return s;
    });
  }

  function tryPlaceAt(x: number, y: number) {
    const s = get(store);
    if (!s.started || !s.placement.active) return;
    if (s.map.occupied[y][x]) {
      log("Эта клетка уже занята.");
      return;
    }
    const buildKey = s.placement.buildKey!;
    const def = BUILDINGS[buildKey];
    const cost = currentCost(s, buildKey);
    if (!canAfford(s, cost)) {
      log("Недостаточно ресурсов для: " + def.name);
      return;
    }

    store.update((u) => {
      spend(u, cost);
      u.counts[buildKey] += 1;
      addRates(u, def.resource, def.baseRate);
      if (def.fixedPopGain) {
        u.resources.pop = (u.resources.pop || 0) + def.fixedPopGain;
      }
      placeBuildingAt(u, buildKey, x, y);
      return u;
    });

    // Журналируем затраты в удобном для чтения виде
    const parts: string[] = [];
    if (cost.wood) parts.push("🌲 " + cost.wood);
    if (cost.stone) parts.push("🪨 " + cost.stone);
    if (cost.food) parts.push("🍖 " + cost.food);
    if (cost.gold) parts.push("🪙 " + cost.gold);
    if (cost.pop) parts.push("👥 " + cost.pop);
    log(
      "Построено: " +
        def.name +
        (parts.length ? " (стоимость: " + parts.join(", ") + ")" : "")
    );
    if (def.fixedPopGain) log("Население увеличено на +" + def.fixedPopGain);

    const prevPaused = get(store).placement.prevPaused;
    leavePlacementMode();
    if (typeof prevPaused !== "undefined" && !prevPaused) {
      const st = get(store);
      if (!st.won && !st.loops.tick) startLoops();
      resume();
    }
    refreshMissionFlags();
    checkWin();
  }

  // Быстрые прокси-методы для UI
  function build(key: BuildingKey) {
    const s = get(store);
    if (!s.started) return;
    enterPlacementMode(key);
  }

  function onTileClick(x: number, y: number) {
    const s = get(store);
    if (!s.started) return;
    if (!s.placement.active) return;
    tryPlaceAt(x, y);
  }

  function isTileSelectable(x: number, y: number): boolean {
    const s = get(store);
    return !!(s.placement.active && !s.map.occupied[y][x]);
  }

  // Публичные хелперы для UI
  function getCurrentCostFor(key: BuildingKey) {
    return currentCost(get(store), key);
  }

  // Чистая функция: вычисляет возможность постройки для переданного состояния
  function canBuildNowState(s: GameState, key: BuildingKey): boolean {
    const def = BUILDINGS[key];
    if (def.single && s.counts[key] >= 1) return false;
    return s.started && canAfford(s, currentCost(s, key));
  }

  function canBuildNow(key: BuildingKey): boolean {
    return canBuildNowState(get(store), key);
  }

  // Горячая клавиша (Esc) для отмены выбора клетки (если UI захочет это повесить)
  function cancelPlacement() {
    if (get(store).placement.active) {
      leavePlacementMode();
      log("Выбор клетки отменён.");
    }
  }

  // Публичное API
  const api = {
    subscribe: store.subscribe,
    // lifecycle
    startGame,
    restart,
    pause,
    resume,
    setSpeed,
    // settings
    setSetting,
    applySettings,
    previewStartInfo,
    // build/placement
    build,
    enterPlacementMode,
    leavePlacementMode,
    onTileClick,
    tryPlaceAt,
    cancelPlacement,
    isTileSelectable,
    // helpers
    getCurrentCostFor,
    canBuildNowState,
    canBuildNow,
    log,
  };

  // Инициализируем миссии/время для стартового экрана
  applySettings();

  return api;
}

export const game = createGameStore();
