<script setup>
const props = defineProps({
  title: String,
  modelValue: Boolean
})
const emit = defineEmits(['update:modelValue'])
</script>


<template>
  <div id="habit1" class="habit">
    <p>{{ props.title }}</p>
    <input type="checkbox" class="checkbox" :checked="modelValue" @change="emit('update:modelValue', $event.target.checked)" />
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
