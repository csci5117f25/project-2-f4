<script setup>
import { useCurrentUser } from "vuefire";
import { useRouter, useRoute } from "vue-router";
import { onMounted, watch } from "vue";
import { signIn, logOut } from "../useAuth";

const user = useCurrentUser();
const router = useRouter();
const route = useRoute();

async function login() {
  await signIn().catch((err) => console.log(err));
  if (user.value) router.replace("/tracker");
}

async function logout() {
  await logOut().catch((err) => console.log(err));
  router.replace("/");
}

function maybeRedirect() {
  if (user.value && route.path === "/") {
    router.replace("/tracker");
  }
}

onMounted(maybeRedirect);
watch([user, () => route.path], maybeRedirect);
</script>

<template>
  <div class="navbar bg-base-100 shadow-sm fixed bottom-0 left-0 right-0 z-50 w-full">
    <!-- <div class="navbar-start pl-8">
      <RouterLink to="/" class="btn btn-ghost text-xl">Habit Tracker</RouterLink>
    </div> -->

    <div class="navbar-center flex items-center gap-6">
      <RouterLink to="/" class="btn btn-ghost p-0">
        <img src="../../public/home.png" alt="Home" class="h-10 w-10" />
      </RouterLink>
      <RouterLink to="/past-journals" class="btn btn-ghost p-0">
        <img src="../../public/previousjournals.png" alt="Previous Journals" class="h-10 w-10" />
      </RouterLink>
      <RouterLink to="/analytics" class="btn btn-ghost px-2 text-xs">
        <img src="../../public/analytics.png" alt="Analytics" class="h-10 w-10" />
      </RouterLink>
      <RouterLink to="/settings" class="btn btn-ghost p-0">
        <img src="../../public/settings.png" alt="Settings" class="h-10 w-10" />
      </RouterLink>
    </div>

    <div class="navbar-end gap-2">
      <button v-if="!user" @click="login()" class="btn btn-primary">Login</button>
      <div v-else class="flex gap-6 items-center">
        <!-- <p>Welcome, {{ user.displayName }}!</p> -->

        <button @click="logout()" class="btn btn-secondary">Logout</button>
      </div>
    </div>
  </div>
</template>
