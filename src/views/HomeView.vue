<script setup>
import LoginView from "./LoginView.vue";
import TrackerView from "./TrackerView.vue";
import { useCurrentUser } from "vuefire";
const user = useCurrentUser();
</script>

<template>
  <LoginView v-if="!user"/>
  <TrackerView v-else/>
</template>
