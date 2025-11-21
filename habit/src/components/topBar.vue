<script setup>

import { useCurrentUser } from 'vuefire'
import { useRouter, useRoute } from 'vue-router'
import { onMounted, watch } from 'vue'
import { signIn , logOut} from '../useAuth'

const user = useCurrentUser()
const router = useRouter()
const route = useRoute()

async function login() {
  await signIn().catch(err => console.log(err))
  if (user.value) router.replace('/tracker')
}

async function logout() {
  await logOut().catch(err => console.log(err))
  router.replace('/')
}

function maybeRedirect() {
  if (user.value && route.path === '/') {
    router.replace('/tracker')
  }
}

onMounted(maybeRedirect)
watch([user, () => route.path], maybeRedirect)
</script>

<template lang="pug">
header
  div(style="display:flex; justify-content:flex-end; width:100%")
    button(v-if="!user" @click="login") Login
    button(v-else @click="logout") Logout
</template>
