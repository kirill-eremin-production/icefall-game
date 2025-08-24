<script lang="ts">
  import { game } from "../Game";

  const costOptions = [
    { value: "cheap", label: "дешевые (проще)" },
    { value: "medium", label: "средние" },
    { value: "expensive", label: "дорогие (сложнее)" },
  ] as const;

  const timeOptions = [
    { value: "short", label: "мало времени (сложнее)" },
    { value: "medium", label: "средний запас времени" },
    { value: "long", label: "много времени (проще)" },
  ] as const;

  const missionOptions = [
    { value: "easy", label: "легкие задания" },
    { value: "medium", label: "средние задания" },
    { value: "hard", label: "сложные задания" },
  ] as const;

  function onStart() {
    game.startGame();
  }

  function onChangeCost(e: Event) {
    const val = (e.target as HTMLSelectElement)
      .value as (typeof costOptions)[number]["value"];
    game.setSetting("cost", val);
    game.applySettings();
  }
  function onChangeTime(e: Event) {
    const val = (e.target as HTMLSelectElement)
      .value as (typeof timeOptions)[number]["value"];
    game.setSetting("time", val);
    game.applySettings();
  }
  function onChangeMissions(e: Event) {
    const val = (e.target as HTMLSelectElement)
      .value as (typeof missionOptions)[number]["value"];
    game.setSetting("missions", val);
    game.applySettings();
  }
</script>

<div class="overlay">
  <div class="modal">
    <h3>Настройки сложности</h3>
    <div class="form">
      <div class="row">
        <label for="sel-cost">Стоимость зданий</label>
        <select
          id="sel-cost"
          on:change={onChangeCost}
          value={$game.settings.cost}
        >
          {#each costOptions as o}
            <option value={o.value} selected={o.value === $game.settings.cost}
              >{o.label}</option
            >
          {/each}
        </select>
      </div>
      <div class="row">
        <label for="sel-time">Время для выполнения заданий</label>
        <select
          id="sel-time"
          on:change={onChangeTime}
          value={$game.settings.time}
        >
          {#each timeOptions as o}
            <option value={o.value} selected={o.value === $game.settings.time}
              >{o.label}</option
            >
          {/each}
        </select>
      </div>
      <div class="row">
        <label for="sel-missions">Сложность заданий</label>
        <select
          id="sel-missions"
          on:change={onChangeMissions}
          value={$game.settings.missions}
        >
          {#each missionOptions as o}
            <option
              value={o.value}
              selected={o.value === $game.settings.missions}>{o.label}</option
            >
          {/each}
        </select>
      </div>
      <p class="hint">{game.previewStartInfo()}</p>
    </div>
    <div
      style="display:flex; gap:10px; justify-content:center; margin-top:14px;"
    >
      <button class="btn" id="btn-start" on:click={onStart}>Начать игру</button>
    </div>
  </div>
</div>

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(5, 8, 25, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    z-index: 2000;
    backdrop-filter: blur(2px);
  }

  .modal {
    background: linear-gradient(180deg, #1b2146, #151a3c);
    border: 1px solid #2a3165;
    border-radius: 16px;
    padding: 20px;
    max-width: 520px;
    width: 100%;
    text-align: center;
    box-shadow: 0 20px 40px rgba(0,0,0,0.35), inset 0 0 60px rgba(124,148,255,0.06);
  }

  .modal h3 {
    margin: 0 0 10px 0;
    font-size: 20px;
  }

  /* Start settings form */
  .form { display: flex; flex-direction: column; gap: 10px; margin-top: 8px; }
  .form .row { display: grid; grid-template-columns: 1.2fr 1fr; align-items: center; gap: 10px; }
  @media (max-width: 520px) { .form .row { grid-template-columns: 1fr; } }
  .form label { font-size: 13px; color: var(--muted); text-align: right; }
  @media (max-width: 520px) { .form label { text-align: left; } }
  .form select {
    background: #121633;
    color: var(--text);
    border: 1px solid #2b3266;
    border-radius: 8px;
    padding: 8px 10px;
    font-weight: 700;
  }
  .form .hint { margin-top: 6px; font-size: 12px; color: var(--muted); }
  /* End settings form */
</style>
