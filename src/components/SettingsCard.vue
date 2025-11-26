<script setup>
import { ref, onMounted } from 'vue';
import { db } from '../firebase_config';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useCurrentUser } from 'vuefire';
import Swal from 'sweetalert2';

const user = useCurrentUser();
const habits = ref([]);

// Habit types
const habitTypes = [
  { value: 'checkbox', label: 'Yes/No (Checkbox)' },
  { value: 'stars', label: 'Rating (Stars)' },
  { value: 'text', label: 'Text Entry' }
];

onMounted(async () => {
  if (!user.value) return;
  const docRef = doc(db, 'users', user.value.uid, 'settings', 'habits');
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    habits.value = docSnap.data().habitList || [];
  }
});

function addHabit() {
  Swal.fire({
    title: 'New Habit Created!',
    text: 'Configure your habit below',
    icon: 'success',
    timer: 2000,
    showConfirmButton: false
  });

  habits.value.push({
    name: '',
    type: 'checkbox'
  });
}

function removeHabit(index) {
  habits.value.splice(index, 1);
}

async function saveHabits() {
  if (!user.value) return;
  const docRef = doc(db, 'users', user.value.uid, 'settings', 'habits');
  await setDoc(docRef, { habitList: habits.value });

  Swal.fire({
    title: 'Success!',
    text: 'Your habits have been saved successfully.',
    icon: 'success',
    confirmButtonText: 'OK'
  });
}
</script>

<template>
  <div class="card bg-base-100 shadow-lg">
    <div class="card-body">
      <h2 class="card-title text-2xl mb-4">Customize Your Habits</h2>

      <div class="space-y-4">
        <!-- Existing habits -->
        <div v-for="(habit, index) in habits" :key="index" class="card bg-base-200">
          <div class="card-body p-4">
            <div class="flex gap-4 items-start">
              <!-- Habit Name -->
              <div class="form-control flex-1">
                <label class="label">
                  <span class="label-text">Habit Name</span>
                </label>
                <input
                  v-model="habit.name"
                  type="text"
                  placeholder="e.g., Workout, Meditate"
                  class="input input-bordered w-full"
                />
              </div>

              <!-- Tracking Type -->
              <div class="form-control flex-1">
                <label class="label">
                  <span class="label-text">Tracking Type</span>
                </label>
                <select v-model="habit.type" class="select select-bordered w-full">
                  <option v-for="type in habitTypes" :key="type.value" :value="type.value">
                    {{ type.label }}
                  </option>
                </select>
              </div>

              <!-- Remove Button -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text opacity-0">Remove</span>
                </label>
                <button @click="removeHabit(index)" class="btn btn-error btn-square">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Preview -->
            <div class="divider">Preview</div>
            <div class="flex items-center gap-4">
              <span class="font-semibold">{{ habit.name || 'Habit Name' }}</span>

              <!-- Checkbox Preview -->
              <input v-if="habit.type === 'checkbox'" type="checkbox" class="checkbox" disabled />

              <!-- Stars Preview -->
              <div v-if="habit.type === 'stars'" class="rating">
                <input type="radio" class="mask mask-star-2 bg-orange-400" disabled />
                <input type="radio" class="mask mask-star-2 bg-orange-400" disabled />
                <input type="radio" class="mask mask-star-2 bg-orange-400" disabled />
                <input type="radio" class="mask mask-star-2 bg-orange-400" disabled />
                <input type="radio" class="mask mask-star-2 bg-orange-400" disabled />
              </div>

              <!-- Text Preview -->
              <input v-if="habit.type === 'text'" type="text" placeholder="Text entry..." class="input input-bordered input-sm" disabled />
            </div>
          </div>
        </div>

        <!-- Add Habit Button -->
        <button @click="addHabit" class="btn btn-outline btn-primary w-full">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add New Habit
        </button>
      </div>

      <div class="card-actions justify-end mt-6">
        <button @click="saveHabits" class="btn btn-primary">Save Changes</button>
      </div>
    </div>
  </div>
</template>
