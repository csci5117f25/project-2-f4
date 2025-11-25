<template>
    <div class="card bg-base-100 shadow-md w-96">
        <div class="card-body">
            <div class="flex items-start justify-between">
                <div>
                    <h2 class="text-2xl font-bold">
                        Journal — <span class="text-sm text-base-content/60">{{ date }}</span>
                    </h2>
                    <div class="pt-2 flex items-center gap-2">
                        <h3 class="font-semibold">Mood rating:</h3>
                        <div class="flex items-center">
                            <div
                                v-for="i in 5"
                                :key="i"
                                :class="[
                                'mask mask-star w-5 h-5 mr-1',
                                i <= rating ? 'bg-yellow-400' : 'bg-gray-300',
                                ]"
                                :aria-hidden="true"
                            ></div>
                        </div>
                        <span class="ml-2 text-sm text-base-content/60">{{ rating }} / 5</span>
                    </div>
                </div>
            </div>

            <div class="mt-4">
                <h4 class="font-medium">Habits:</h4>
                <ul class="mt-2 space-y-2">
                    <li v-for="(h, idx) in habits" :key="idx" class="flex items-center gap-3">
                        <input type="checkbox" class="checkbox" :checked="h.done" :disabled="readonly" />
                        <span :class="h.done ? 'line-through text-base-content/60' : ''">{{ h.name }}</span>
                    </li>
                </ul>
            </div>

            <div class="mt-4">
                <h4 class="font-medium">Journal Entry:</h4>
                <p class="mt-2 text-sm text-base-content/80 whitespace-pre-wrap">{{ journalEntry }}</p>
            </div>

            <button
                v-if="!readonly"
                @click="$emit('view')"
                class="btn btn-secondary"
            >View</button>

        </div>
    </div>
</template>

<script setup>
import { ref, defineProps } from "vue";
const props = defineProps({
  date:  String,
  journalEntry:String,
  rating: Number,
  habits: Array,
  readonly: Boolean
});
const open = ref(false)

</script>
