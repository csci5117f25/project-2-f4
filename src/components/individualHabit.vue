<script setup>
const props = defineProps({
  title: String,
  type: {
    type: String,
    default: 'checkbox'
  },
  modelValue: [Boolean, Number, String]
})
const emit = defineEmits(['update:modelValue'])
</script>


<template>
  <div id="habit1" class="habit">
    <p>{{ props.title }}</p>

    <!-- Checkbox type -->
    <input
      v-if="type === 'checkbox'"
      type="checkbox"
      class="checkbox"
      :checked="modelValue"
      @change="emit('update:modelValue', $event.target.checked)"
    />

    <!-- Stars type -->
    <div v-else-if="type === 'stars'" class="rating">
      <input
        type="radio"
        :name="`rating-${title}`"
        class="mask mask-star-2 bg-orange-400"
        :value="1"
        :checked="modelValue === 1"
        @change="emit('update:modelValue', 1)"
      />
      <input
        type="radio"
        :name="`rating-${title}`"
        class="mask mask-star-2 bg-orange-400"
        :value="2"
        :checked="modelValue === 2"
        @change="emit('update:modelValue', 2)"
      />
      <input
        type="radio"
        :name="`rating-${title}`"
        class="mask mask-star-2 bg-orange-400"
        :value="3"
        :checked="modelValue === 3"
        @change="emit('update:modelValue', 3)"
      />
      <input
        type="radio"
        :name="`rating-${title}`"
        class="mask mask-star-2 bg-orange-400"
        :value="4"
        :checked="modelValue === 4"
        @change="emit('update:modelValue', 4)"
      />
      <input
        type="radio"
        :name="`rating-${title}`"
        class="mask mask-star-2 bg-orange-400"
        :value="5"
        :checked="modelValue === 5"
        @change="emit('update:modelValue', 5)"
      />
    </div>

    <!-- Text type -->
    <input
      v-else-if="type === 'text'"
      type="text"
      class="input input-bordered input-sm"
      :value="modelValue"
      @input="emit('update:modelValue', $event.target.value)"
      placeholder="Enter text..."
    />
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
