<template>
  <div class="min-h-screen bg-base-200 pt-20 px-4 pb-8">
    <div class="max-w-6xl mx-auto space-y-6">

      <div class="card bg-base-100 shadow-lg">
        <div class="card-body">
          <h1 class="card-title text-3xl font-bold">Your Analytics</h1>
          <p class="text-base-content/70">Track your progress and discover patterns</p>
        </div>
      </div>

      <div v-if="journals.length === 0" class="card bg-base-100 shadow-lg">
        <div class="card-body text-center py-12">
          <h2 class="text-2xl font-semibold mb-2">No Data Yet</h2>
          <p class="text-base-content/70">Start journaling to see your analytics!</p>
        </div>
      </div>

      <template v-else>
        <div class="flex items-center justify-between mb-4">
            <button @click="prevMonth">⬅️</button>
            <h2 class="text-xl font-bold">{{ currentMonthLabel }}</h2>
            <button @click="nextMonth">➡️</button>
        </div>

        <Line :data="moodChartData" :options="moodChartOptions" />



      </template>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useCurrentUser, useCollection } from 'vuefire';
import { db } from '../firebase_config';
import { collection } from 'firebase/firestore';
import { Line } from 'vue-chartjs'

const user = useCurrentUser();

const journalsSource = computed(() =>
  user.value ? collection(db, "users", user.value.uid, "journals") : null
);
const journalsCollection = useCollection(journalsSource);

const journals = computed(() =>
  (journalsCollection.value ?? [])
    .map(j => ({
      id: j.id,
      date: j.id, 
      rating: j.rating ?? 0,
      habits: j.habits ?? {},
      journalentry: j.journalentry ?? ""
    }))
    .sort((a, b) => a.date.localeCompare(b.date)) 
);

console.log("journs", journals);

const currentMonth = ref(new Date());
const journalsForMonth = computed(() => {
  const month = currentMonth.value.getMonth();
  const year = currentMonth.value.getFullYear();
  return journals.value.filter(j => {
    const d = new Date(j.date);
    return d.getMonth() === month && d.getFullYear() === year;
  });
});

const moodChartData = computed(() => { 
    return { 
        labels: journalsForMonth.value.map(j => j.date),  
        datasets: [{ 
            label: 'Mood Rating', 
            data: journalsForMonth.value.map(j => j.rating ? Number(j.rating) : null), 
            borderColor: 'rgba(75, 192, 192, 1)', 
            backgroundColor: 'rgba(75, 192, 192, 0.2)', 
            spanGaps: false 
        }] 
    }; 
});
console.log("mooddata", moodChartData);

const moodChartOptions = {
  responsive: true,
  scales: {
    y: {
      min: 1,
      max: 5,
      ticks: {
        stepSize: 1
      }
    }
  }
};

const currentMonthLabel = computed(() =>
  currentMonth.value.toLocaleString('default', { month: 'long', year: 'numeric' })
);

function prevMonth() {
  currentMonth.value = new Date(
    currentMonth.value.getFullYear(),
    currentMonth.value.getMonth() - 1,
    1
  );
}

function nextMonth() {
  currentMonth.value = new Date(
    currentMonth.value.getFullYear(),
    currentMonth.value.getMonth() + 1,
    1
  );
}

</script>
