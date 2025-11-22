<script setup>
  import { onMounted } from 'vue'

  const midnightCST = new Date();
  midnightCST.setHours(24, 0, 0, 0);
//   console.log(midnightCST);

  function updateCountdown() {
    const now = new Date();
    const cstNow = new Date(now.toLocaleString("en-US", { timeZone: "America/Chicago" }));
    let diff = midnightCST - cstNow;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    document.getElementById("hh").style.setProperty("--value", hours);
    document.getElementById("mm").style.setProperty("--value", minutes);
    document.getElementById("ss").style.setProperty("--value", seconds);
  }

  onMounted(() => {
    updateCountdown();
    setInterval(updateCountdown, 1000);
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
