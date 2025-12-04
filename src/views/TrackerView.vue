<script setup>
  import Habit from '../components/individualHabit.vue'
  import Countdown from '../components/countdownComponent.vue'
  import { ref, watch, toRaw, onMounted } from 'vue';

  import {db} from '../firebase_config'
  import { doc, setDoc, getDoc } from "firebase/firestore";

  import { useCurrentUser } from 'vuefire'
  const user = useCurrentUser()

  let existingJournal = {};
  const habitList = ref([]);

  async function loadHabits() {
    if (!user.value) return;
    const docRef = doc(db, 'users', user.value.uid, 'settings', 'habits');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      habitList.value = docSnap.data().habitList || [];
    } else {
      // Default habits if none are set
      habitList.value = [
        { name: "Workout", type: "checkbox" },
        { name: "NYT Wordle", type: "checkbox" },
        { name: "Call Mom", type: "checkbox" }
      ];
    }

    // Initialize completedHabits based on habit types
    const habitsObj = {};
    habitList.value.forEach(habit => {
      if (habit.type === 'checkbox') {
        habitsObj[habit.name] = false;
      } else if (habit.type === 'stars') {
        habitsObj[habit.name] = 0;
      } else if (habit.type === 'text') {
        habitsObj[habit.name] = '';
      }
    });
    completedHabits.value = habitsObj;
  }

  async function setupJournal () {
    if (!user.value) return;
    await loadHabits();

    const todaysDate = new Date().toISOString().split('T')[0];
    const docRef = doc(db, "users", user.value.uid, "journals", todaysDate);
    const existingJournalRef = await getDoc(docRef);

    if (existingJournalRef.exists()) {
      existingJournal = existingJournalRef.data();
      rating.value = existingJournal.rating;

      completedHabits.value = {
        ...completedHabits.value,
        ...existingJournal.habits
      };

      document.getElementById('journalentry').value = existingJournal['journalentry'];
    } else {
      console.log("No such document!");
    }
  }

  const rating = ref(-1);
  const completedHabits = ref({})

  async function updateJournalEntry() {
    if (!user.value) return
    let journal = {}
    journal['rating'] = rating.value;
    journal['habits'] = toRaw(completedHabits.value);
    journal['journalentry'] = document.getElementById('journalentry').value;

    console.log(journal);
    const todaysDate = new Date().toISOString().split('T')[0];
    await setDoc(doc(db, "users", user.value.uid, "journals", todaysDate), journal);
  }




  watch(rating, async() => {
    updateJournalEntry();
  })

  watch(completedHabits, () => {
    updateJournalEntry()
  }, { deep: true })

  onMounted(() => {
    setupJournal()
  });


</script>


<template>
  <div class="min-h-screen bg-base-200 pt-20 px-4 pb-8">
    <div class="max-w-2xl mx-auto space-y-6">

      <!-- Countdown Card -->
      <div class="card bg-base-100 shadow-lg">
        <div class="card-body items-center text-center">
          <Countdown />
        </div>
      </div>

      <!-- Main Journal Card -->
      <div class="card bg-base-100 shadow-lg">
        <div class="card-body">
          <h1 class="card-title text-3xl font-bold mb-4">What's on your mind?</h1>

          <!-- Mood Section -->
          <div class="form-control">
            <label class="label">
              <span class="label-text text-lg font-semibold">Mood</span>
            </label>
            <div class="rating rating-lg">
              <input type="radio" name="rating-1" class="mask mask-star-2 bg-orange-400" aria-label="1 star" :value="1" v-model="rating"/>
              <input type="radio" name="rating-1" class="mask mask-star-2 bg-orange-400" aria-label="2 star" :value="2" v-model="rating"/>
              <input type="radio" name="rating-1" class="mask mask-star-2 bg-orange-400" aria-label="3 star" :value="3" v-model="rating"/>
              <input type="radio" name="rating-1" class="mask mask-star-2 bg-orange-400" aria-label="4 star" :value="4" v-model="rating"/>
              <input type="radio" name="rating-1" class="mask mask-star-2 bg-orange-400" aria-label="5 star" :value="5" v-model="rating"/>
            </div>
          </div>

          <div class="divider"></div>

          <!-- Habits Section -->
          <div class="form-control">
            <label class="label">
              <span class="label-text text-lg font-semibold">Daily Habits</span>
            </label>
            <div class="flex flex-wrap gap-4 mt-2">
              <Habit
                v-for="habit in habitList"
                :key="habit.name"
                :title="habit.name"
                :type="habit.type"
                v-model="completedHabits[habit.name]"
              />
            </div>
          </div>

          <div class="divider"></div>

          <!-- Journal Entry Section -->
          <div class="form-control">
            <label class="label">
              <span class="label-text text-lg font-semibold">Journal Entry</span>
            </label>
            <textarea
              id="journalentry"
              class="textarea textarea-bordered textarea-lg w-full h-40"
              placeholder="What happened today? How are you feeling?"
              @change="updateJournalEntry()"
            ></textarea>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
