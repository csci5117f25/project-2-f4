<script setup>
  import { onMounted, onUnmounted } from 'vue'

  const midnightCST = new Date();
  midnightCST.setHours(24, 0, 0, 0);
  let intervalId;
//   console.log(midnightCST);

  function updateCountdown() {
    const now = new Date();
    const cstNow = new Date(now.toLocaleString("en-US", { timeZone: "America/Chicago" }));
    let diff = midnightCST - cstNow;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    const hhEl = document.getElementById("hh");
    const mmEl = document.getElementById("mm");
    const ssEl = document.getElementById("ss");
    if (hhEl) hhEl.style.setProperty("--value", hours);
    if (mmEl) mmEl.style.setProperty("--value", minutes);
    if (ssEl) ssEl.style.setProperty("--value", seconds);
  }

  onMounted(() => {
  updateCountdown();
  intervalId = setInterval(updateCountdown, 1000);
    });

  onUnmounted(() => {
  clearInterval(intervalId);
    });
  </script>


<template>
  <div id="countdown">
    <span class="countdown text-2xl">
      <span style="--value:10;" aria-live="polite" aria-label="10" id="hh">10</span>
      :
      <span style="--value:24; --digits: 2;" aria-live="polite" aria-label="24" id="mm">24</span>
      :
      <span style="--value:59; --digits: 2;" aria-live="polite" aria-label="59" id="ss">59</span>
    </span>
    <p>left for today's journal</p>
  </div>
</template>


<style scoped>
#countdown {
  text-align: center;
}
</style>
