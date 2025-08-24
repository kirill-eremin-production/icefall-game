<script lang="ts">
  import { game } from "../Game";
  function restart() {
    game.restart();
  }
</script>

<div class="overlay">
  <div class="modal">
    <h3 class="danger">Поражение</h3>
    <p>Время истекло. Попробуйте ещё раз — у вас получится!</p>
    <div
      style="display:flex; gap:10px; justify-content:center; margin-top:14px;"
    >
      <button class="btn" on:click={restart}>Повторить</button>
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
</style>
