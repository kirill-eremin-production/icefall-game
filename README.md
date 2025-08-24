Резюме анализа текущей структуры
- Код всей игры находится в одном файле [index.html](index.html), логика изолирована в IIFE. Основные подсистемы реализованы прямыми манипуляциями DOM и несколькими интервалами:
  - Игровой цикл и таймеры: [javascript.startLoops()](index.html:1208), [javascript.tick()](index.html:1093), [javascript.startTimer()](index.html:1191), [javascript.stopLoops()](index.html:1213)
  - Отрисовка/синхронизация UI: [javascript.refreshUI()](index.html:1118), [javascript.renderCosts()](index.html:1106), [javascript.renderMissions()](index.html:1174)
  - Экономика/стоимости: [javascript.currentCost()](index.html:904), [javascript.canAfford()](index.html:920), [javascript.spend()](index.html:930), [javascript.addRates()](index.html:938), константы [javascript.BUILDINGS()](index.html:635), [javascript.COST_SCALE()](index.html:693), [javascript.TIME_PRESETS()](index.html:694)
  - Задания: [javascript.generateMissions()](index.html:703), [javascript.checkMissions()](index.html:1056), [javascript.checkWin()](index.html:1083)
  - Карта/размещение построек: [javascript.initMapTiles()](index.html:751), [javascript.enterPlacementMode()](index.html:943), [javascript.leavePlacementMode()](index.html:975), [javascript.onTileClick()](index.html:997), [javascript.placeBuildingAt()](index.html:793)
- Сильные стороны: простота, нет внешних зависимостей, наглядная логика.
- Потенциальные узкие места при масштабировании:
  - Ручная синхронизация состояния и DOM (двойные циклы: игровой и UI) → риск «рассинхрона» и сложно расширять экранные состояния.
  - Глобальный мутабельный state, сложнее тестировать и вводить новые подсистемы (например, бафы/дебафы, дерево технологий, события).
  - Монолитный файл затрудняет модульность и переиспользуемость.

Рекомендация по стеку для долгосрочного расширения
- Основной выбор: Svelte + TypeScript + Vite
  - Почему Svelte:
    - Реактивность «из коробки» без лишней церемонии: UI сам обновляется при изменении стора, отпадает необходимость в ручном [javascript.refreshUI()](index.html:1118)/[javascript.renderCosts()](index.html:1106)/[javascript.renderMissions()](index.html:1174).
    - Очень низкий бойлерплейт и высокая читаемость — удобно быстро добавлять новые экраны/панели/механики.
    - Svelte stores позволяют оформить единый источник истины (gameStore), а derived-сторы красиво считать производные (стоимости, доходы, выполненность миссий) вместо ручных апдейтов.
  - Почему TypeScript:
    - Типизация домена (ресурсы, здания, задания) резко снижает количество ошибок на росте кода и ускоряет рефакторинги.
  - Почему Vite:
    - Молниеносная сборка/горячая перезагрузка, простой конфиг, легко подключать ESLint/Prettier/Vitest.
  - UI-слои и игровая логика отделяются: логика в чистых TS-модулях, UI — в Svelte-компонентах. Это даст возможность безболезненно перейти на Canvas/WebGL-рендер позже (PixiJS) сохраняя UI в Svelte.

Альтернативы (когда рассматривать)
- Vue 3 + Pinia: если важны DevTools/экосистема Vue и знакомство команды с Vue. По усилиям близко к Svelte, чуть больше «церемонии».
- PixiJS (рендер) + Svelte (UI): если планируется тяжёлый 2D-рендер, анимации, спрайты, партиклы; менять только рендер карты, UI оставить реактивным.
- Phaser 3: если игра станет «игровым движком» со сценами/камерой/физикой; для текущей стратегии с UI-ориентированным управлением избыточен.

Пошаговый план миграции (минимальные риски)
1) Декомпозиция без изменения поведения (внутри текущего кода)
   - Вынести «чистые» модули из [index.html](index.html) в отдельные файлы (на первом шаге можно без TS, просто ES-модули):
     - constants: BUILDINGS/COST_SCALE/TIME_PRESETS (источник — [javascript.BUILDINGS()](index.html:635), [javascript.COST_SCALE()](index.html:693), [javascript.TIME_PRESETS()](index.html:694))
     - economy: currentCost/canAfford/spend/addRates (источник — [javascript.currentCost()](index.html:904), [javascript.canAfford()](index.html:920), [javascript.spend()](index.html:930), [javascript.addRates()](index.html:938))
     - missions: generateMissions/checkMissions/checkWin (источник — [javascript.generateMissions()](index.html:703), [javascript.checkMissions()](index.html:1056), [javascript.checkWin()](index.html:1083))
     - loop: tick/startLoops/stopLoops/startTimer (источник — [javascript.tick()](index.html:1093), [javascript.startLoops()](index.html:1208), [javascript.stopLoops()](index.html:1213), [javascript.startTimer()](index.html:1191))
     - map: initMapTiles/enterPlacementMode/leavePlacementMode/onTileClick/placeBuildingAt (источник — [javascript.initMapTiles()](index.html:751), [javascript.enterPlacementMode()](index.html:943), [javascript.leavePlacementMode()](index.html:975), [javascript.onTileClick()](index.html:997), [javascript.placeBuildingAt()](index.html:793))
     - util: format/formatTimeSecToMMSS/log (источник — [javascript.format()](index.html:615), [javascript.formatTimeSecToMMSS()](index.html:697), [javascript.log()](index.html:897))
   - Цель: «очистить» зависимости, чтобы UI-операции были в одном месте, а доменная логика — в чистых функциях.

2) Внести TypeScript поверх модулей
   - Определить типы: Resource, BuildingKey, Resources, Rates, Mission, GameSettings, GameState.
   - Проставить строгие типы для публичных API модулей.

3) Завести Vite-проект с Svelte + TS
   - Инициализировать каркас проекта, подключить ESLint/Prettier, Vitest.
   - Временный адаптер: встраиваем существующий DOM как Svelte-компоненты без смены логики.

4) Перевести UI на реактивные компоненты
   - Компоненты: TopBar(HUD), BuildList, MissionsPanel, LogPanel, MapGrid, Modals(Start/Win/Lose).
   - Завести gameStore: основной state, действия (actions) — startGame, pause, resume, restart, build, setSpeed, placeAt, completeMission.
   - Derived-сторы: видимые стоимости, доходы с учётом скорости, прогресс миссий, форматированное время.
   - Убрать ручные вызовы [javascript.refreshUI()](index.html:1118)/[javascript.renderCosts()](index.html:1106)/[javascript.renderMissions()](index.html:1174) — их заменит реактивность.

5) Централизовать планировщик
   - Заменить «три интервала» на единый планировщик, который тикает состояние и триггерит сохранение/эффекты.
   - Для паузы — хранить флаг в store; UI просто реагирует.

6) Тесты и сохранения
   - Юнит-тесты для экономики/миссий.
   - Сохранение прогресса в localStorage, дебаг-панель.

7) Опционально: Canvas/WebGL-рендер карты
   - Если DOM-рендер карты начнёт упираться в производительность, заменить MapGrid на PixiJS-компонент, остальной UI оставить в Svelte без изменений.

Оценка трудоёмкости и рисков
- Базовая миграция на Svelte + TS (разбиение на модули, store, перенос HUD/Build/Missions/Log/Modals): 1–2 дня чистого времени.
- Перенос карты на реактивный компонент с выбором клеток: ~0.5–1 день.
- Риски низкие: логика уже достаточно модульна по смыслу, перенос в Svelte в основном устранит ручные обновления UI.

Итог
- Рекомендую Svelte + TypeScript + Vite как основной путь. Это даст:
  - явную модульность домена (экономика/миссии/цикл/карта),
  - реактивный UI без ручной синхронизации,
  - лёгкие расширения функциональности (новые здания/баффы/экраны) с минимальными правками существующего кода.
- При росте требований к визуалу — добавить PixiJS только для слоя рендера карты, не меняя остальной стек и доменную логику.