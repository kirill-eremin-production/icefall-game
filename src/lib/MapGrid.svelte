<script lang="ts">
  import { game, ICONS } from "./Game";

  // Reactive helpers to build grid ranges from store
  $: rows = Array.from({ length: $game.map.h }, (_, i) => i);
  $: cols = Array.from({ length: $game.map.w }, (_, i) => i);

  function onTileClick(x: number, y: number) {
    game.onTileClick(x, y);
  }
</script>

<div class="map" class:selecting={$game.placement.active}>
  {#each rows as y}
    {#each cols as x}
      <div
        class="tile"
        class:selectable={game.isTileSelectable(x, y)}
        class:occ={$game.map.occupied[y][x]}
        style="grid-column: {x + 1}; grid-row: {y + 1}"
        on:click={() => onTileClick(x, y)}
        aria-label={`Клетка ${x + 1}:${y + 1}`}
      />
    {/each}
  {/each}

  {#each $game.built as b (b.x + ":" + b.y)}
    <div
      class="bld"
      data-type={b.key}
      style="grid-column: {b.x + 1}; grid-row: {b.y + 1}"
      title={b.key}
    >
      {ICONS[b.key]}
    </div>
  {/each}
</div>

<style>
  /* Map (visual buildings) */
  .map {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-template-rows: repeat(12, 1fr);
    gap: 4px;
    background: #0f1330;
    border: 1px solid #2b3266;
    border-radius: 12px;
    padding: 8px;
    width: 100%;
    margin: 0 auto;
    box-shadow: inset 0 0 40px rgba(124, 148, 255, 0.06);
    overflow: hidden;
  }

  /* Выбор клетки для строительства */
  .map.selecting {
    box-shadow:
      inset 0 0 0 2px #2e5fff,
      inset 0 0 40px rgba(124, 148, 255, 0.12);
  }

  .tile {
    background: linear-gradient(180deg, #121633, #0e1230);
    border: 1px solid #1f2550;
    border-radius: 6px;
    position: relative;
    /* Make the map a square and center it */
    aspect-ratio: 1 / 1;
  }

  .tile.selectable {
    cursor: crosshair;
    outline: 2px dashed #2e5fff;
    outline-offset: -2px;
    background: linear-gradient(180deg, #141a45, #10163a);
  }

  .tile.selectable:hover {
    background: linear-gradient(180deg, #18205a, #121a44);
    filter: brightness(1.05);
  }

  .tile.occ {
    opacity: 0.95;
  }

  .bld {
    display: grid;
    place-items: center;
    font-size: 18px;
    user-select: none;
    border-radius: 8px;
    transition:
      transform 0.12s ease,
      filter 0.2s ease;
    animation: pop-in 160ms ease-out;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
    /* allow клики по плиткам даже если иконка здания поверх */
    pointer-events: none;
  }

  .bld:hover {
    transform: translateY(-1px) scale(1.02);
    filter: brightness(1.05);
  }

  .bld[data-type="townHall"] {
    font-size: 22px;
  }

  @keyframes pop-in {
    from {
      transform: scale(0.85);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  /* Responsive adjustments for map width */
  @media (max-width: 900px) {
    .map {
      width: min(92vmin, 640px);
    }
  }
</style>
