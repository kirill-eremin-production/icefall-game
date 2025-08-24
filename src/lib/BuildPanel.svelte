<script lang="ts">
  import { game, BUILDINGS, type BuildingKey, type GameState } from "./Game";

  const order: BuildingKey[] = [
    "house",
    "lumberMill",
    "quarry",
    "farm",
    "goldMine",
    "townHall",
  ];

  const subtitles: Record<BuildingKey, string> = {
    house: "+3 👥",
    lumberMill: "+1 🌲/с",
    quarry: "+1 🪨/с",
    farm: "+1 🍖/с",
    goldMine: "+0.5 🪙/с",
    townHall: "Постройте, чтобы выиграть",
  };

  // include the current store value as the first arg so Svelte re-runs
  // this function whenever $game changes (ensures cost text updates)
  function costText(_state: GameState, key: BuildingKey) {
    const c = game.getCurrentCostFor(key);
    const parts: string[] = [];
    if (c.wood) parts.push("🌲 " + c.wood);
    if (c.stone) parts.push("🪨 " + c.stone);
    if (c.food) parts.push("🍖 " + c.food);
    if (c.gold) parts.push("🪙 " + c.gold);
    if (c.pop) parts.push("👥 " + c.pop);
    return parts.length ? "Стоимость: " + parts.join(" | ") : "Бесплатно";
  }

  function onBuild(key: BuildingKey) {
    game.build(key);
  }
</script>

<div class="build-list">
  {#each order as key}
    <button
      class="build"
      class:active={$game.placement.buildKey === key}
      on:click={() => onBuild(key)}
      id={"btn-" + key}
      disabled={!game.canBuildNowState($game, key)}
    >
      <div>
        <div class="title">
          {BUILDINGS[key].name}
          <span class="muted"
            >(x<span id={"cnt-" + key}>{$game.counts[key]}</span>)</span
          >
        </div>
        <div class="subtitle" class:gold={key === "townHall"}>
          {subtitles[key]}
        </div>
        <div class="cost" id={"cost-" + key}>{costText($game, key)}</div>
      </div>
    </button>
  {/each}
</div>

<style>
  .build-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  @media (max-width: 700px) {
    .build-list {
      grid-template-columns: 1fr;
    }
  }

  .build {
    background: #121633;
    border: 1px solid #2b3266;
    border-radius: 10px;
    padding: 8px;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 10px;
    align-items: center;
    color: white;
    max-width: 200px;
    cursor: pointer;
    transition: 0.3s box-shadow;
  }

  .build.active {
    box-shadow: inset 0 0 16px 2px rgba(255, 255, 255, 0.1);
  }

  .build:hover,
  .build:active {
    box-shadow: inset 0 0 16px 2px rgba(255, 255, 255, 0.1);
  }

  .build:disabled,
  .build[disabled] {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .build .title {
    font-weight: 700;
    margin-bottom: 6px;
  }

  .build .subtitle {
    font-size: 12px;
    color: var(--muted);
    margin-bottom: 6px;
  }

  .cost {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 10px;
    font-size: 12px;
    color: var(--muted);
  }

  .cost span {
    display: inline-flex;
    gap: 6px;
    align-items: center;
  }
</style>
