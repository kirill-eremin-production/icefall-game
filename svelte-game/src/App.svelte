<script lang="ts">
  import TopBar from "./lib/TopBar.svelte";
  import BuildPanel from "./lib/BuildPanel.svelte";
  import MissionsLogPanel from "./lib/MissionsLogPanel.svelte";
  import MapGrid from "./lib/MapGrid.svelte";
  import StartModal from "./lib/Modals/StartModal.svelte";
  import WinModal from "./lib/Modals/WinModal.svelte";
  import LoseModal from "./lib/Modals/LoseModal.svelte";
  import { game } from "./lib/Game";
  import { onMount } from "svelte";

  let lost = false;
  $: lost = $game.started && !$game.won && $game.timeLeft <= 0;

  function onKey(e: KeyboardEvent) {
    if (e.key === "Escape") {
      game.cancelPlacement();
    }
  }

  onMount(() => {
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });
</script>

<div class="container">
  <TopBar />

  <!-- Left fixed build menu -->
  <aside class="left-fixed">
    <section class="panel">
      <h2>Строительство</h2>
      <BuildPanel />
    </section>
  </aside>

  <!-- Right fixed missions and collapsible log -->
  <aside class="right-fixed">
    <section class="panel">
      <h2>Задания</h2>
      <MissionsLogPanel />
    </section>
  </aside>

  <section class="panel">
    <h2>Карта поселения</h2>
    <MapGrid />
    <div class="legend">
      <span><b>🏛️</b> Ратуша</span>
      <span><b>🪓</b> Лесопилка</span>
      <span><b>⛏️</b> Каменоломня</span>
      <span><b>🌾</b> Ферма</span>
      <span><b>🏠</b> Дом</span>
      <span><b>🪙</b> Золотой рудник</span>
    </div>
  </section>
</div>

{#if !$game.started}
  <StartModal />
{/if}

{#if $game.won}
  <WinModal />
{/if}

{#if lost}
  <LoseModal />
{/if}

<style>
  .container {
    max-width: 720px;
    margin: 0 auto;
    padding-top: 70px;
  }

  .panel {
    background: linear-gradient(180deg, #1b2146, #131837);
    border: 1px solid #2a3165;
    border-radius: 14px;
    padding: 10px;
    box-shadow:
      0 10px 25px rgba(0, 0, 0, 0.25),
      inset 0 0 40px rgba(124, 148, 255, 0.04);
  }

  .panel h2 {
    margin: 0 0 12px 0;
    font-size: 16px;
    font-weight: 700;
    color: var(--accent);
    letter-spacing: 0.4px;
  }

  .legend {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 8px;
    font-size: 12px;
    color: var(--muted);
  }

  .legend span b {
    font-size: 14px;
    margin-right: 6px;
  }

  /* Fixed side panels */
  .left-fixed {
    position: fixed;
    left: 10px;
    top: 76px;
    z-index: 1000;
  }

  .right-fixed {
    position: fixed;
    right: 10px;
    top: 76px;
    width: 280px;
    max-height: calc(100vh - 96px);
    overflow: auto;
    z-index: 1000;
  }

  .left-fixed .panel,
  .right-fixed .panel {
    margin: 0;
  }

  /* BuildPanel overrides when placed in the left sidebar */
  .left-fixed :global(.build-list) {
    grid-template-columns: 1fr;
  }

  .left-fixed :global(.build) {
    padding: 8px;
  }
  .left-fixed :global(.build .subtitle) {
    font-size: 11px;
  }
  .left-fixed :global(.build .cost) {
    font-size: 11px;
  }

  /* Responsive adjustments */
  @media (max-width: 900px) {
    .left-fixed,
    .right-fixed {
      position: static;
      width: auto;
      max-height: none;
    }
    .container {
      padding-left: 20px;
      padding-right: 20px;
    }
  }
</style>
