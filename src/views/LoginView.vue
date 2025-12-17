<script setup>
import { useCurrentUser } from "vuefire";
import { signIn } from "../useAuth";
import { useRouter } from "vue-router";

const user = useCurrentUser();
const router = useRouter();

async function getStarted() {
  if (user.value) {
    router.push("/tracker");
  } else {
    await signIn();
    if (user.value) router.push("/tracker");
  }
}
</script>

<template>
  <div class="min-h-screen bg-base-200 pt-16">

    <div class="hero min-h-[80vh]">
      <div class="hero-content text-center">
        <div class="max-w-2xl">
          <img src="../../logo.png">
          <h1 class="text-5xl font-bold">Track Your Habits,<br/>Transform Your Life</h1>
          <p class="py-6 text-lg text-base-content/70">
            Build better habits, track your mood, and journal your thoughts.
            Stay consistent with daily check-ins and watch your progress over time.
          </p>
          <button @click="getStarted" class="btn btn-primary btn-lg">
            Get Started
          </button>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="bg-base-100 py-16 px-4">
      <div class="max-w-5xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-12">Everything you need to build better habits</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">

          <div class="card bg-base-200">
            <div class="card-body items-center text-center">
              <div class="text-4xl mb-4">✓</div>
              <h3 class="card-title">Habit Tracking</h3>
              <p class="text-base-content/70">Check off your daily habits and build streaks that keep you motivated.</p>
            </div>
          </div>

          <div class="card bg-base-200">
            <div class="card-body items-center text-center">
              <div class="text-4xl mb-4">⭐</div>
              <h3 class="card-title">Mood Journal</h3>
              <p class="text-base-content/70">Rate your mood daily and write journal entries to reflect on your day.</p>
            </div>
          </div>

          <div class="card bg-base-200">
            <div class="card-body items-center text-center">
              <div class="text-4xl mb-4">📊</div>
              <h3 class="card-title">Past Journals</h3>
              <p class="text-base-content/70">Look back at your history and see how far you've come.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
