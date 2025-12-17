<script setup>
import { ref, onMounted } from "vue";
import { db } from "../firebase_config";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useCurrentUser } from "vuefire";
import Swal from "sweetalert2";
import { requestNotificationPermission } from "../useMessaging";

const user = useCurrentUser();
const habits = ref([]);
const notificationToken = ref(null);
const notificationsEnabled = ref(false);

// Habit types
const habitTypes = [
  { value: "checkbox", label: "Yes/No (Checkbox)" },
  { value: "stars", label: "Rating (Stars)" },
  { value: "text", label: "Text Entry" },
];

onMounted(async () => {
  if (!user.value) return;

  // Load habits
  const habitsRef = doc(db, "users", user.value.uid, "settings", "habits");
  const habitsSnap = await getDoc(habitsRef);
  if (habitsSnap.exists()) {
    habits.value = habitsSnap.data().habitList || [];
  }

  // Check notification status
  const notifRef = doc(db, "users", user.value.uid, "settings", "notifications");
  const notifSnap = await getDoc(notifRef);
  if (notifSnap.exists() && notifSnap.data().enabled) {
    notificationsEnabled.value = true;
    notificationToken.value = notifSnap.data().fcmToken;
    console.log("FCM Token:", notificationToken.value);
  }
});

function addHabit() {
  Swal.fire({
    title: "New Habit Created!",
    text: "Configure your habit below",
    icon: "success",
    timer: 2000,
    showConfirmButton: false,
  });

  habits.value.push({
    name: "",
    type: "checkbox",
  });
}

function removeHabit(index) {
  habits.value.splice(index, 1);
}

async function saveHabits() {
  if (!user.value) return;
  const docRef = doc(db, "users", user.value.uid, "settings", "habits");
  await setDoc(docRef, { habitList: habits.value });

  Swal.fire({
    title: "Success!",
    text: "Your habits have been saved successfully.",
    icon: "success",
    confirmButtonText: "OK",
  });
}

async function enableNotifications() {
  try {
    const token = await requestNotificationPermission();
    if (token) {
      notificationToken.value = token;
      notificationsEnabled.value = true;

      // Save token to Firestore for this user
      if (user.value) {
        const docRef = doc(db, "users", user.value.uid, "settings", "notifications");
        await setDoc(docRef, { fcmToken: token, enabled: true });
      }

      Swal.fire({
        title: "Notifications Enabled!",
        text: "You will now receive push notifications.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } else {
      Swal.fire({
        title: "Permission Denied",
        text: "Please allow notifications in your browser settings.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  } catch (error) {
    console.error("Error enabling notifications:", error);
    Swal.fire({
      title: "Error",
      text: "Failed to enable notifications. Make sure you have added the VAPID key.",
      icon: "error",
      confirmButtonText: "OK",
    });
  }
}


async function disableNotifications() {
  notificationsEnabled.value = false;
  notificationToken.value = null;

  if (user.value) {
    const docRef = doc(db, "users", user.value.uid, "settings", "notifications");
    await setDoc(docRef, { fcmToken: null, enabled: false });
  }

  Swal.fire({
    title: "Notifications Disabled",
    text: "You will no longer receive push notifications.",
    icon: "info",
    confirmButtonText: "OK",
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Preview -->
            <div class="divider">Preview</div>
            <div class="flex items-center gap-4">
              <span class="font-semibold">{{ habit.name || "Habit Name" }}</span>

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
              <input
                v-if="habit.type === 'text'"
                type="text"
                placeholder="Text entry..."
                class="input input-bordered input-sm"
                disabled
              />
            </div>
          </div>
        </div>

        <!-- Add Habit Button -->
        <button @click="addHabit" class="btn btn-outline btn-primary w-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add New Habit
        </button>
      </div>

      <div class="card-actions justify-end mt-6">
        <button @click="saveHabits" class="btn btn-primary">Save Changes</button>
      </div>

      <!-- Notification Settings Section -->
      <div class="divider mt-8">Notification Settings</div>

      <div class="card bg-base-200">
        <div class="card-body">
          <h3 class="font-semibold text-lg mb-2">Push Notifications</h3>
          <p class="text-sm text-base-content/70 mb-4">
            Enable push notifications to receive reminders and updates about your habits.
          </p>

          <div v-if="notificationsEnabled" class="alert alert-success">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Notifications are enabled!</span>
            <button @click="disableNotifications" class="btn btn-primary">
              Turn off notifications
            </button>
          </div>

          <button v-else @click="enableNotifications" class="btn btn-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            Enable Push Notifications
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
