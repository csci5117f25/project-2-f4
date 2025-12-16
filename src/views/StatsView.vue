<template>
  <div class="container mx-auto p-4">
    <h1 class="text-4xl font-bold mt-15">Statistics</h1>
    <MoodChart
      class="w-md h-md"
      v-if="labels.length > 0 && data.length > 0"
      :labels="labels"
      :moodData="data"
    />
    <p v-else>Loading mood data...</p>
    <!-- <StackedBarChart class="w-md h-md mt-10" /> -->
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import MoodChart from "../components/MoodChart.vue";
// import StackedBarChart from "../components/StackedBarChart.vue";
import { useCurrentUser } from "vuefire";
import { getDocs, collection, query } from "firebase/firestore";
import { db } from "../firebase_config";

const user = useCurrentUser();

// Create reactive variables
const labels = ref([]);
const data = ref([]);

async function getMoodData() {
  console.log("getMoodData was ran");
  if (!user.value) {
    console.log("No user found");
    return;
  }

  const q = query(collection(db, "users", user.value.uid, "journals"));
  const journalSnapshot = await getDocs(q);

  // Clear arrays first
  labels.value = [];
  data.value = [];

  journalSnapshot.forEach((doc) => {
    labels.value.push(doc.id);
    if (doc.data().rating !== -1) {
      data.value.push(doc.data().rating);
    } else {
      data.value.push(null);
    }
  });

  console.log("labels:", labels.value);
  console.log("data:", data.value);
}


// honestly this function could just sort the habits data into its own buckets
async function getCheckboxData() {

  if (!user.value) {
    console.log("No user found");
    return;
  }

  const q = query(collection(db, "users", user.value.uid, "journals"));
  const journalSnapshot = await getDocs(q);

  journalSnapshot.forEach((doc) => {
    console.log('this is the doc', doc)
    console.log('this is the habits ', doc.data().habits)

    const habitsMap = doc.data().habits
    console.log('habitsMap: ', habitsMap)

    Object.entries(habitsMap).forEach(([habitName, habitValue]) => {
      console.log(`${habitName}:`, habitValue);
    });

    // const habitsQuery = query(collection(db, 'users', user.value.uid, 'journals', doc.id, 'habits'))
    // const habits = getHabits(habitsQuery)
    // console.log('habits', habits)
    // habits.forEach((doc) => {
    //   console.log('doc.id = ', doc.id)
    //   console.log('doc.data() = ', doc.data())

    //   // if (doc.data() === true || doc.data() === false) {

    //   // }
    // })
  });
}
// Wait for component to mount and user to be available
onMounted(() => {
  if (user.value) {
    getMoodData();
    getCheckboxData();
  }
});

// Also watch for when user becomes available
import { watch } from "vue";
watch(user, (newUser) => {
  if (newUser) {
    getMoodData();
  }
});
</script>
