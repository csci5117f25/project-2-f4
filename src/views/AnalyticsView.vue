<template>
  <div class="min-h-screen bg-base-200 pt-20 px-4 pb-8">
    <div class="max-w-6xl mx-auto space-y-6">

      <!-- Header Card -->
      <div class="card bg-base-100 shadow-lg">
        <div class="card-body">
          <h1 class="card-title text-3xl font-bold">Your Analytics</h1>
          <p class="text-base-content/70">Track your progress and discover patterns</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="journals.length === 0" class="card bg-base-100 shadow-lg">
        <div class="card-body text-center py-12">
          <h2 class="text-2xl font-semibold mb-2">No Data Yet</h2>
          <p class="text-base-content/70">Start journaling to see your analytics!</p>
        </div>
      </div>

      <!-- Analytics Content -->
      <template v-else>

        <!-- Stats Overview -->
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

        <!-- Habit Completion Rates -->
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

        <!-- Best & Worst Days -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="card bg-base-100 shadow-lg">
            <div class="card-body">
              <h2 class="card-title text-xl mb-4">Best Days</h2>
              <div v-if="bestDays.length === 0" class="text-center py-4 text-base-content/70">
                No data yet
              </div>
              <div v-else class="space-y-3">
                <div v-for="day in bestDays" :key="day.date" class="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                  <div>
                    <div class="font-semibold">{{ formatDate(day.date) }}</div>
                    <div class="flex gap-1 mt-1">
                      <div
                        v-for="i in 5"
                        :key="i"
                        :class="[
                          'mask mask-star w-4 h-4',
                          i <= day.rating ? 'bg-orange-400' : 'bg-gray-300'
                        ]"
                      ></div>
                    </div>
                  </div>
                  <div class="badge badge-success">{{ day.rating }}/5</div>
                </div>
              </div>
            </div>
          </div>

          <div class="card bg-base-100 shadow-lg">
            <div class="card-body">
              <h2 class="card-title text-xl mb-4">Days to Improve</h2>
              <div v-if="worstDays.length === 0" class="text-center py-4 text-base-content/70">
                No data yet
              </div>
              <div v-else class="space-y-3">
                <div v-for="day in worstDays" :key="day.date" class="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                  <div>
                    <div class="font-semibold">{{ formatDate(day.date) }}</div>
                    <div class="flex gap-1 mt-1">
                      <div
                        v-for="i in 5"
                        :key="i"
                        :class="[
                          'mask mask-star w-4 h-4',
                          i <= day.rating ? 'bg-orange-400' : 'bg-gray-300'
                        ]"
                      ></div>
                    </div>
                  </div>
                  <div class="badge badge-warning">{{ day.rating }}/5</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Day of Week Patterns -->
        <div class="card bg-base-100 shadow-lg">
          <div class="card-body">
            <h2 class="card-title text-2xl mb-4">Average Mood by Day of Week</h2>
            <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
              <div
                v-for="day in dayOfWeekPatterns"
                :key="day.dayName"
                class="text-center p-4 bg-base-200 rounded-lg"
              >
                <div class="text-sm font-semibold mb-2">{{ day.dayName }}</div>
                <div class="text-2xl font-bold text-primary mb-2">{{ day.avgRating }}</div>
                <div class="flex justify-center gap-1">
                  <div
                    v-for="i in 5"
                    :key="i"
                    :class="[
                      'mask mask-star w-4 h-4',
                      i <= Math.round(day.avgRating) ? 'bg-orange-400' : 'bg-gray-300'
                    ]"
                  ></div>
                </div>
                <div class="text-xs text-base-content/70 mt-1">{{ day.count }} {{ day.count === 1 ? 'entry' : 'entries' }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Mood Trends (Recent 30 Days) -->
        <div class="card bg-base-100 shadow-lg">
          <div class="card-body">
            <h2 class="card-title text-2xl mb-4">Recent Mood Trend (Last 30 Days)</h2>
            <div v-if="recentRatings.length === 0" class="text-center py-8 text-base-content/70">
              No recent data
            </div>
            <div v-else class="overflow-x-auto">
              <div class="flex gap-2 min-w-max pb-4">
                <div
                  v-for="entry in recentRatings"
                  :key="entry.date"
                  class="flex flex-col items-center"
                >
                  <div class="text-xs text-base-content/70 mb-1 whitespace-nowrap">{{ formatDateShort(entry.date) }}</div>
                  <div
                    class="w-8 rounded-t-lg bg-primary transition-all hover:opacity-80"
                    :style="{ height: `${entry.rating * 20}px` }"
                    :title="`Rating: ${entry.rating}/5`"
                  ></div>
                  <div class="text-xs font-bold mt-1">{{ entry.rating }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </template>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useCurrentUser, useCollection } from 'vuefire';
import { db } from '../firebase_config';
import { collection } from 'firebase/firestore';

const user = useCurrentUser();

// Fetch all journals for the user
const journalsSource = computed(() =>
  user.value ? collection(db, "users", user.value.uid, "journals") : null
);
const journalsCollection = useCollection(journalsSource);

const journals = computed(() =>
  (journalsCollection.value ?? [])
    .map(j => ({
      id: j.id,
      date: j.id, // YYYY-MM-DD format
      rating: j.rating ?? 0,
      habits: j.habits ?? {},
      journalentry: j.journalentry ?? ""
    }))
    .sort((a, b) => a.date.localeCompare(b.date)) // Sort chronologically
);

// Calculate average mood rating
const averageRating = computed(() => {
  const ratings = journals.value.filter(j => j.rating > 0).map(j => j.rating);
  if (ratings.length === 0) return 0;
  const sum = ratings.reduce((a, b) => a + b, 0);
  return (sum / ratings.length).toFixed(1);
});

// Calculate habit completion stats
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

// Calculate current streak (consecutive days from today backwards)
const currentStreak = computed(() => {
  if (journals.value.length === 0) return 0;

  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Chicago' });

  const sortedDates = journals.value.map(j => j.date).sort().reverse();

  let streak = 0;
  let checkDate = new Date(today);

  for (let i = 0; i < 365; i++) { // Check up to a year back
    const dateStr = checkDate.toISOString().split('T')[0];
    if (sortedDates.includes(dateStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (i === 0 && dateStr === today) {
      // Today not filled yet, check yesterday
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
});

// Calculate longest streak ever
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

// Get best days (top 5 highest rated)
const bestDays = computed(() => {
  return journals.value
    .filter(j => j.rating > 0)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);
});

// Get worst days (top 5 lowest rated, but only ratings > 0)
const worstDays = computed(() => {
  return journals.value
    .filter(j => j.rating > 0)
    .sort((a, b) => a.rating - b.rating)
    .slice(0, 5);
});

// Day of week patterns
const dayOfWeekPatterns = computed(() => {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayStats = Array(7).fill(null).map((_, i) => ({
    dayName: dayNames[i],
    ratings: [],
    avgRating: 0,
    count: 0
  }));

  journals.value.forEach(journal => {
    if (journal.rating > 0) {
      const dayOfWeek = new Date(journal.date).getDay();
      dayStats[dayOfWeek].ratings.push(journal.rating);
    }
  });

  dayStats.forEach(day => {
    day.count = day.ratings.length;
    if (day.count > 0) {
      const sum = day.ratings.reduce((a, b) => a + b, 0);
      day.avgRating = (sum / day.count).toFixed(1);
    }
  });

  return dayStats;
});

// Recent ratings (last 30 days)
const recentRatings = computed(() => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  return journals.value
    .filter(j => {
      const journalDate = new Date(j.date);
      return journalDate >= thirtyDaysAgo && j.rating > 0;
    })
    .sort((a, b) => a.date.localeCompare(b.date));
});

// Format date helper
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDateShort(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
}
</script>
