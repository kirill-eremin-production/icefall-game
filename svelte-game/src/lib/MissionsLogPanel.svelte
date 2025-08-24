<script lang="ts">
  import { game } from "./Game";
</script>

<div class="missions">
  {#each $game.missions as m (m.id)}
    <div class="mission" class:done={m.done}>
      <div class="text">{m.text}</div>
      <div class="status">{m.done ? "Готово" : "В процессе"}</div>
    </div>
  {/each}
  <details class="details-log">
    <summary>Журнал</summary>
    <div class="log">
      {#each $game.log as line, i (i)}
        <p>{line}</p>
      {/each}
    </div>
  </details>
</div>

<style>
  .missions {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .mission {
    background: #121633;
    border: 1px solid #2b3266;
    border-radius: 10px;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  .mission .text { font-size: 14px; }

  .mission .status {
    font-size: 12px;
    font-weight: 800;
    color: var(--muted);
  }

  .mission.done {
    border-color: #3ba86b;
    box-shadow: inset 0 0 20px rgba(60,200,120,0.12);
  }

  .mission.done .status { color: var(--accent-2); }

  .details-log { margin-top: 8px; }
  .details-log summary {
    cursor: pointer;
    color: var(--muted);
    user-select: none;
    font-weight: 700;
  }
  .details-log .log { margin-top: 8px; }

  .log {
    height: 120px;
    overflow: auto;
    background: #0f1330;
    border: 1px solid #2b3266;
    border-radius: 10px;
    padding: 10px;
    font-size: 12px;
  }

  .log p { margin: 0 0 4px 0; color: #b2c3ff; }
</style>
