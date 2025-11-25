<template>
  <h2 class="text-3xl underline pb-5">Past Journals</h2>

  <div v-if="loading" class="text-sm text-base-content/70">Loading journals…</div>
  <div v-else-if="journals.length === 0" class="text-sm text-base-content/70">No journals yet.</div>

  <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
    <PastJournalCard
      v-for="journal in journals"
      :key="journal.id"
      :date="journal.id"
      :journalEntry="journal.journalentry"
      :rating="journal.rating"
      :habits="journal.habitsArray"
      readonly
    />
  </div>
</template>

<script setup>
import PastJournalCard from "@/components/PastJournalCard.vue";
import { useCurrentUser } from "vuefire";
import { db } from "../firebase_config";
import { ref, onMounted, watch } from "vue";
import { collection, getDocs } from "firebase/firestore";

const user = useCurrentUser();
const journals = ref([]);

function objectToArray(habits = {}) {
  return Object.entries(habits).map(([name, done]) => ({ name, done }));
}

async function getJournals() {
  if (!user.value) {
    journals.value = [];
    return;
  }

  const colRef = collection(db, "users", user.value.uid, "journals");
  const snap = await getDocs(colRef);
  const items = [];
  snap.forEach((doc) => {
    const data = doc.data();
    items.push({ id: doc.id, ...data });
  });

  items.sort((a, b) => (a.id < b.id));

  journals.value = items.map((j) => ({
    id: j.id,
    journalentry: j.journalentry ?? "",
    rating: j.rating ?? 0,
    habitsArray: objectToArray(j.habits ?? {}),
  }));
}

onMounted(() => {
  if (user.value) getJournals();
});

watch(user, (u) => {
  if (u) getJournals();
  else journals.value = [];
});
</script>
