<script setup>
  import Habit from '../components/individualHabit.vue'
  import Countdown from '../components/countdown.vue'
  import { ref, watch, toRaw } from 'vue';

  const habitList = [
    "Workout",
    "NYT Wordle",
    "Call Mom"
  ]

  const rating = ref(-1);
  const completedHabits = ref(
    Object.fromEntries(habitList.map(h => [h, false]))
  )

  function updateJournalEntry() {
    let journal = {}
    journal['rating'] = rating.value;
    journal['habits'] = toRaw(completedHabits.value);
    journal['journalentry'] = document.getElementById('journalentry').value;
    
    console.log(journal);
  }
  
  function toggleHabit(habitName) {
    completedHabits.value[habitName] = !completedHabits.value[habitName]
    console.log(completedHabits.value);
    updateJournalEntry()
  }

  watch(rating, async() => {
    updateJournalEntry();
  })
</script>


<template>
  <Countdown />
    
  <h1>What's on your mind?</h1>
  <h2>Mood</h2>
  <div class="rating">
    <input type="radio" name="rating-1" class="mask mask-star" aria-label="1 star" :value="1" v-model="rating"/>
    <input type="radio" name="rating-1" class="mask mask-star" aria-label="2 star" :value="2" v-model="rating"/>
    <input type="radio" name="rating-1" class="mask mask-star" aria-label="3 star" :value="3" v-model="rating"/>
    <input type="radio" name="rating-1" class="mask mask-star" aria-label="4 star" :value="4" v-model="rating"/>
    <input type="radio" name="rating-1" class="mask mask-star" aria-label="5 star" :value="5" v-model="rating"/>
  </div>

  <h2>Habits</h2>
  <Habit
      v-for="habit in habitList"
      :key="habit"
      :title="habit"
      @complete-habit="toggleHabit(habit)"
    />

  <h2>Journal Entry</h2>
  <textarea id="journalentry" class="textarea" placeholder="What happened today?" @change="updateJournalEntry()"></textarea>
</template>


<style scoped>
#countdown {
  text-align: center;
}

h1 {
  font-size: 36px;
  margin: 5px auto;
}

h2 {
  font-size: 20px;
  margin: 10px 0 0 0;
}

.habit {
  text-align: center;
  display: inline-block;
  margin: 5px;
}
</style>
