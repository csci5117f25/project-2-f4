<script setup>
import topBar from './components/topBar.vue'
import bottomBar from './components/bottomBar.vue'
import { RouterView } from 'vue-router'
import { useCurrentUser } from 'vuefire'
const user = useCurrentUser()
</script>

<template>
  <topBar class="pc-only" v-if="user"/>
  <RouterView />
  <bottomBar class="mobile-only" v-if="user"/>
</template>

<style scoped>
.mobile-only {
  display: none;
}

.pc-only {
  display: flex;
}

@media (max-width: 768px) {
  .mobile-only {
    display: flex;
  }

  .pc-only {
    display: none;
  }
}
</style>
