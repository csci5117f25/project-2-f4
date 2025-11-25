<template>
    <h2 class="text-3xl underline pb-5">Past Journals</h2>
    <div v-if="journals.length === 0" class="text-sm text-base-content/70">No journals yet.</div>

    <div v-else class="flex justify-center mt-24">
        <!-- Calendar -->
        <calendar-date
        class="cally bg-base-100 border border-base-300 shadow-lg rounded-box p-6 
         w-full max-w-md sm:max-w-lg md:max-w-6xl lg:max-w-6xl mx-auto text-xl"
        @change="onDateSelected"
        >
            <svg aria-label="Previous" class="fill-current size-6" slot="previous" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M15.75 19.5 8.25 12l7.5-7.5"></path></svg>
            <svg aria-label="Next" class="fill-current size-6" slot="next" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="m8.25 4.5 7.5 7.5-7.5 7.5"></path></svg>
            <calendar-month></calendar-month>
        </calendar-date>

        <Teleport to="body">
            <dialog class="modal " :open="open">
                <PastJournalCard
                    v-if="selectedJournal"
                    :date="selectedJournal.id"
                    :journalEntry="selectedJournal.journalentry"
                    :rating="selectedJournal.rating"
                    :habits="selectedJournal.habitsArray"
                    :readonly="true"
                    @close="open = false"
                />
            </dialog>
        </Teleport>
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

const open = ref(false)
const selectedJournal = ref(null)

function openModal(journal) {
  selectedJournal.value = journal
  open.value = true
}


function onDateSelected(event) {
  // Cally emits { detail: { value: "YYYY-MM-DD" } }
  const selectedDate = event.currentTarget.value; // "YYYY-MM-DD"

  console.log("Selected date:", selectedDate);
  const journal = journals.value.find(j => j.id === selectedDate);
  if (journal) {
    openModal(journal);
  }
}
</script>

<style>
calendar-date.cally {
  font-size: 1.5rem; /* larger text */
  line-height: 2rem;
}



calendar-date.cally calendar-month {
  min-height: 50vh; /* taller calendar grid */
}


</style>