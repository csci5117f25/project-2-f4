<script setup>
const props = defineProps({ title: {
    type: String,
    required: true
  }})
const emit = defineEmits(['complete-habit'])
</script>


<template>
  <div id="habit1" class="habit">
    <p>{{ props.title }}</p>
    <input type="checkbox" class="checkbox" @click="emit('complete-habit')"/>
  </div>
</template>


<style scoped>
h1 {
  font-size: 36px;
  margin: 5px auto;
}

h2 {
  font-size: 20px;
  margin: 10px 0 0 0;
}

.habit {
  text-align: center;
  display: inline-block;
  margin: 5px;
}
</style>
