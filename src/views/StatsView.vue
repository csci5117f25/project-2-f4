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
 

        <div class="stats stats-vertical lg:stats-horizontal shadow-lg w-full">
          <div class="stat">
            <div class="stat-title">Average Mood</div>
            <div class="stat-value text-primary">{{ averageRating }}</div>
            <div class="stat-desc">
              <div class="flex gap-1 mt-2">
                <div
                  v-for="i in 5"
                  :key="i"
                  :class="[
                    'mask mask-star w-5 h-5',
                    i <= Math.round(averageRating) ? 'bg-orange-400' : 'bg-gray-300'
                  ]"
                ></div>
              </div>
            </div>
          </div>

          <div class="stat">
            <div class="stat-title">Current Streak</div>
            <div class="stat-value text-secondary">{{ currentStreak }}</div>
            <div class="stat-desc">{{ currentStreak === 1 ? 'day' : 'days' }} in a row</div>
          </div>

          <div class="stat">
            <div class="stat-title">Longest Streak</div>
            <div class="stat-value text-accent">{{ longestStreak }}</div>
            <div class="stat-desc">{{ longestStreak === 1 ? 'day' : 'days' }} total</div>
          </div>

          <div class="stat">
            <div class="stat-title">Total Journals</div>
            <div class="stat-value">{{ journals.length }}</div>
            <div class="stat-desc">{{ journals.length === 1 ? 'entry' : 'entries' }}</div>
          </div>
        </div>

        <div class="card bg-base-100 shadow-lg">
          <div class="card-body">
            <h2 class="card-title text-2xl mb-4">Habit Completion Rates</h2>
            <div v-if="habitStats.length === 0" class="text-center py-8 text-base-content/70">
              No habit data yet
            </div>
            <div v-else class="space-y-4">
              <div v-for="habit in habitStats" :key="habit.name" class="flex flex-col sm:flex-row sm:items-center gap-2">
                <div class="flex-1">
                  <div class="flex items-center justify-between mb-1">
                    <span class="font-medium">{{ habit.name }}</span>
                    <span class="text-sm text-base-content/70">{{ habit.completed }}/{{ habit.total }}</span>
                  </div>
                  <progress
                    class="progress progress-primary w-full"
                    :value="habit.percentage"
                    max="100"
                  ></progress>
                </div>
                <div class="badge badge-lg badge-primary">{{ habit.percentage }}%</div>
              </div>
            </div>
          </div>
        </div>

        <div class=" rounded mx-auto max-w-xl p-6 flex flex-col items-center justify-center space-y-4">
                <h3 v-if="activeHabitName" class="text-lg font-bold">{{ activeHabitName }}</h3>
                    <div class="relative perspective overflow-hidden">
                    <motion.div
                        v-if="activeHabitName"
                        :key="activeHabitName"
                        :initial="{ rotateY: 90, opacity: 0 }"
                        :animate="{ rotateY: 0, opacity: 1 }"
                        :exit="{ rotateY: -90, opacity: 0 }"
                        :transition="{ duration: 0.6, easing: 'ease-in-out' }"
                        class="relative"
                    >
                        <VCalendar
                        is-expanded
                        :attributes="habitCalendars[activeHabitName] ?? []"
                        class="bg-base-100 border border-base-300 shadow-lg rounded-box p-4"
                        />
                    </motion.div>

                <div v-else class="p-4 text-gray-500">Loading calendar…</div>

                </div>

                <div class="flex gap-2 ">
                    <button @click="prevHabit" class="px-3 py-2 bg-gray-200 rounded">Prev Habit</button>
                    <button @click="nextHabit" class="px-3 py-2 bg-gray-200 rounded">Next Habit</button>
                </div>
        </div>


        <div class="bg-base-100 rounded mx-auto max-w-xl">
            <div class="flex items-center justify-center gap-3 pt-6">
                <button @click="prevMonth" class="px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 ">←</button>
                <h2 class="text-lg font-bold">{{ currentMonthLabel }}</h2>
                <button @click="nextMonth" class="px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 ">→</button>
            </div>
            <div class="card shadow-lg p-6 ">
                <div class="h-96">
                    <Line :data="moodChartData" :options="moodChartOptions" />
                </div>
            </div>
        </div>


      </template>

    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useCurrentUser, useCollection } from 'vuefire';
import { db } from '../firebase_config';
import { collection } from 'firebase/firestore';
import { Line } from 'vue-chartjs'
import { motion } from "motion-v"

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


const habitCalendars = computed(() => {
  const map = {}

  journals.value.forEach(j => {
    const dateObj = toCalendarDate(j.date)

    Object.entries(j.habits).forEach(([habit, done]) => {
      if (!done) return

      if (!map[habit]) {
        map[habit] = {
          key: `habit-${habit}`,
          dates: [],
          dot: { color: 'blue' }
        }
      }

      map[habit].dates.push(dateObj)
    })
  })

  // IMPORTANT: each habit maps to an ARRAY OF ATTRIBUTE OBJECTS
  const result = {}
  Object.entries(map).forEach(([habit, attr]) => {
    result[habit] = [attr]
  })

  return result
})




function toCalendarDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d) 
}

const averageRating = computed(() => {
  const ratings = journals.value
    .map(j => Number(j.rating))
    .filter(r => Number.isFinite(r) && r >= 1 && r <= 5)

  if (ratings.length === 0) return 0

  const sum = ratings.reduce((a, b) => a + b, 0)
  return Number((sum / ratings.length).toFixed(1))
})


const habitStats = computed(() => {
  const stats = {};

  journals.value.forEach(journal => {
    Object.entries(journal.habits).forEach(([habitName, completed]) => {
      if (!stats[habitName]) {
        stats[habitName] = { completed: 0, total: 0 };
      }
      stats[habitName].total++;
      if (completed === true || (typeof completed === 'number' && completed > 0)) {
        stats[habitName].completed++;
      }
    });
  });

  return Object.entries(stats)
    .map(([name, data]) => ({
      name,
      percentage: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
      completed: data.completed,
      total: data.total
    }))
    .sort((a, b) => b.percentage - a.percentage);
});

const currentStreak = computed(() => {
  if (journals.value.length === 0) return 0;

  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Chicago' });

  const sortedDates = journals.value.map(j => j.date).sort().reverse();

  let streak = 0;
  let checkDate = new Date(today);

  for (let i = 0; i < 365; i++) { 
    const dateStr = checkDate.toISOString().split('T')[0];
    if (sortedDates.includes(dateStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (i === 0 && dateStr === today) {
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
});

const longestStreak = computed(() => {
  if (journals.value.length === 0) return 0;

  const sortedDates = journals.value.map(j => new Date(j.date)).sort((a, b) => a - b);

  let maxStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < sortedDates.length; i++) {
    const diffDays = Math.floor((sortedDates[i] - sortedDates[i - 1]) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  return maxStreak;
});


const habitNames = computed(() => Object.keys(habitCalendars.value || {})) 
const activeHabitIndex = ref(0) 
const activeHabitName = computed(() => habitNames.value.length > 0 ? habitNames.value[activeHabitIndex.value] : null ) 

watch(habitNames, (names) => { 
    if (names.length > 0 && activeHabitName.value === null) { 
        activeHabitIndex.value = 0 
    } 
})
watch(journals, (newVal) => {
  console.log("journals updated", newVal)
})

watch(habitCalendars, (newVal) => {
  console.log("habitCalendars updated", newVal)
})

watch(habitNames, (newVal) => {
  console.log("habitNames updated", newVal)
})

watch(activeHabitName, (name) => {
  console.log(
    name,
    habitCalendars.value?.[name]?.map(a => a.dates)
  )
})


function nextHabit() {
  if (habitNames.value.length === 0) return
  activeHabitIndex.value = (activeHabitIndex.value + 1) % habitNames.value.length
}

function prevHabit() {
  if (habitNames.value.length === 0) return
  activeHabitIndex.value =
    (activeHabitIndex.value - 1 + habitNames.value.length) % habitNames.value.length
}


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
  const year = currentMonth.value.getFullYear();
  const month = currentMonth.value.getMonth();
  const days = getDaysInMonth(year, month);

  return {
    labels: days.map(d =>
      d.toLocaleDateString('default', { day: 'numeric' }) 
    ),
    datasets: [{
      label: 'Mood Rating',
      data: days.map(d => {
        d.toLocaleDateString('default', { month: 'short', day: 'numeric' })
        const entry = journalsForMonth.value.find(j => {
          const jd = new Date(j.date);
          return jd.getFullYear() === year &&
                 jd.getMonth() === month &&
                 jd.getDate() === d.getDate();
        });
        return entry ? Number(entry.rating) : null; 
      }),
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      spanGaps: false,
      tension: 0.4
    }]
  };
});

console.log("mooddata", moodChartData);

const moodChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { onClick: null } },
    layout: { padding: { top: 20  } },
    scales: {
    y: {
        min: 0,
        max: 5.5, 
        ticks: { stepSize: 1, 
                callback: function(value) { 
                    if (Number.isInteger(value) && value > 0 && value <= 5) { 
                        return value === 1 ? `${value} star` : `${value} stars`; 
                    } 
                    return '';
                }
                }
    }
    }
};

function getDaysInMonth(year, month) {
  const date = new Date(year, month, 1);
  const days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date)); 
    date.setDate(date.getDate() + 1);
  }
  return days;
}


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
