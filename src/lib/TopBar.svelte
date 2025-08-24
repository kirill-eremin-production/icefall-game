<script lang="ts">
  import { game, format, formatTimeSecToMMSS } from "./Game";

  function setSpeed(m: 1 | 2 | 3) {
    game.setSpeed(m);
  }
  function pause() {
    game.pause();
  }
  function resume() {
    game.resume();
  }
</script>

<header class="topbar">
  <div class="hud">
    <div class="hud-res">
      <span class="chip">
        <span class="lbl">Дерево</span> 🌲 <b>{format($game.resources.wood)}</b>
        <span class="rateTop"
          >+{format($game.rates.wood * ($game.timeSpeed || 1))}/с</span
        >
      </span>
      <span class="chip">
        <span class="lbl">Камень</span> 🪨
        <b>{format($game.resources.stone)}</b>
        <span class="rateTop"
          >+{format($game.rates.stone * ($game.timeSpeed || 1))}/с</span
        >
      </span>
      <span class="chip">
        <span class="lbl">Еда</span> 🍖 <b>{format($game.resources.food)}</b>
        <span class="rateTop"
          >+{format($game.rates.food * ($game.timeSpeed || 1))}/с</span
        >
      </span>
      <span class="chip">
        <span class="lbl">Золото</span> 🪙 <b>{format($game.resources.gold)}</b>
        <span class="rateTop"
          >+{format($game.rates.gold * ($game.timeSpeed || 1))}/с</span
        >
      </span>
      <span class="chip">
        <span class="lbl">Жители</span> 👥 <b>{format($game.resources.pop)}</b>
        <span class="rateTop"
          >+{format($game.rates.pop * ($game.timeSpeed || 1))}/с</span
        >
      </span>
    </div>

    <div style="display:flex; align-items:center; gap:8px;">
      <div class="timer small">
        ⏱ <span>{formatTimeSecToMMSS($game.timeLeft)}</span>
      </div>
      <div class="seg" aria-label="Скорость времени">
        <button
          class="seg-btn"
          class:active={$game.timeSpeed === 1}
          on:click={() => setSpeed(1)}>x1</button
        >
        <button
          class="seg-btn"
          class:active={$game.timeSpeed === 2}
          on:click={() => setSpeed(2)}>x2</button
        >
        <button
          class="seg-btn"
          class:active={$game.timeSpeed === 3}
          on:click={() => setSpeed(3)}>x3</button
        >
      </div>
      <button
        class="btn sm"
        on:click={pause}
        disabled={!$game.started || $game.paused}>Пауза</button
      >
      <button
        class="btn sm"
        on:click={resume}
        disabled={!$game.started || !$game.paused}>Продолжить</button
      >
    </div>
  </div>
</header>

<style>
  header.topbar {
    position: fixed;
    top: 8px;
    left: 50%;
    transform: translateX(-50%);
    width: min(1100px, calc(100% - 20px));
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin: 0;
    background: linear-gradient(180deg, #252b53, #1a1f41);
    border: 1px solid #2b3266;
    border-radius: 12px;
    padding: 6px 10px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.25), inset 0 0 20px rgba(92,200,255,0.06);
    z-index: 1001;
  }

  .hud {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .hud-res {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    align-items: center;
  }

  .timer {
    background: linear-gradient(180deg, #252b53, #1a1f41);
    border: 1px solid #2b3266;
    padding: 10px 14px;
    border-radius: 10px;
    font-weight: 700;
    color: var(--text);
    box-shadow: inset 0 0 20px rgba(92,200,255,0.06);
  }

  .timer.small { padding: 6px 10px; font-size: 14px; }

  .chip {
    background: #121633;
    border: 1px solid #2b3266;
    color: var(--text);
    padding: 4px 8px;
    border-radius: 999px;
    font-weight: 700;
    font-size: 12px;
    line-height: 1;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .rateTop { color: #8bb9ff; font-weight: 700; margin-left: 4px; }

  .chip .lbl { font-weight: 700; font-size: 11px; color: var(--muted); letter-spacing: 0.3px; margin-right: 4px; }

  /* Speed segmented control */
  .seg {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    background: #121633;
    border: 1px solid #2b3266;
    border-radius: 10px;
    padding: 2px;
  }

  .seg-btn {
    background: transparent;
    border: 0;
    color: var(--text);
    padding: 4px 10px;
    border-radius: 8px;
    font-weight: 800;
    font-size: 12px;
    cursor: pointer;
    line-height: 1;
  }

  .seg-btn.active {
    background: linear-gradient(180deg, #2a70ff, #224dcc);
    border: 1px solid #2e5fff;
  }

  /* Use global .btn base; only compact modifier is local here */
  .btn.sm { padding: 6px 8px; font-size: 12px; border-radius: 8px; }
</style>
