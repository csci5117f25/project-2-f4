<script setup>
import topBar from './components/topBar.vue'
import { RouterView } from 'vue-router'
import { useCurrentUser } from 'vuefire'
const user = useCurrentUser()
</script>

<template>
  <topBar v-if="user"/>

  <RouterView />
</template>
