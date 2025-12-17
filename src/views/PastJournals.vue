<template>
    <div class="min-h-screen bg-base-200 pt-20 px-4 pb-8">
        <div v-if="journals.length === 0" class="text-sm text-base-content/70"></div>

        <div v-else class="flex justify-center mt-24">
            <!-- Desktop -->
            <div class="hidden md:block">
            <VCalendar
                is-expanded
                :attributes="calendarAttributes"
                :columns="3"
                :rows="4"
                @dayclick="onDateSelected"
                class="bg-base-100 border border-base-300 shadow-lg rounded-box p-8"
            />
            </div>

            <div class="block md:hidden">
            <VCalendar
                is-expanded
                :attributes="calendarAttributes"
                :columns="1"
                :rows="1"
                @dayclick="onDateSelected"
                class="bg-base-100 border border-base-300 shadow-lg rounded-box p-4"
            />
            </div>


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
    </div>  
</template>

<script setup>
import PastJournalCard from "@/components/PastJournalCard.vue";
import { useCurrentUser, useCollection } from 'vuefire'
import { db } from "../firebase_config";
import { ref, computed } from "vue";
import { collection } from "firebase/firestore";
import 'v-calendar/style.css'

const user = useCurrentUser();

function objectToArray(habits = {}) {
  return Object.entries(habits).map(([name, done]) => ({ name, done }));
}

const journalsSource = computed(() =>
  user.value ? collection(db, "users", user.value.uid, "journals") : null
);

const journalsCollection = useCollection(journalsSource);

const journals = computed(() =>
  (journalsCollection.value ?? []).map(j => ({
    id: j.id,
    journalentry: j.journalentry ?? "",
    rating: j.rating ?? 0,
    habitsArray: objectToArray(j.habits ?? {}),
  }))
);

const open = ref(false)
const selectedJournal = ref(null)

function openModal(journal) {
  selectedJournal.value = journal
  open.value = true
}


function onDateSelected(event) {
  // Cally emits { detail: { value: "YYYY-MM-DD" } }
//   const selectedDate = event.currentTarget.value; // "YYYY-MM-DD"
    const selectedDate = event.date.toISOString().split("T")[0];

    console.log("Selected date:", selectedDate);
    const journal = journals.value.find(j => j.id === selectedDate);
    if (journal) {
        openModal(journal);
    }
}

function toCalendarDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d) 
}


const calendarAttributes = computed(() =>
  journals.value.map((j) => ({
    key: j.id,
    dates: toCalendarDate(j.id),
    dot: true, 
    customData: j,
  }))
);
</script>

<style>

.vc-dot {
  width: 0.6rem;
  height: 0.6rem;
}

</style>
