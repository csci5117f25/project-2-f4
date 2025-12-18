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

    
  </div>
</template>
