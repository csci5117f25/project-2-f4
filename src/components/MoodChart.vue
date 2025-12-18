<template>
  <Line v-if="moodData && labels" :data="chartData" :options="options" />
</template>

<script setup>
import { computed } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const props = defineProps({
  moodData: Array,
  labels: Array
})

console.log('this is the labels', props.labels)
console.log('this is the data', props.moodData)

// Use computed so it updates when props change
const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: 'Mood Level',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      data: props.moodData,
      fill: true,
      tension: 0,
      spanGaps: false
    }
  ]
}))

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top'
    },
    title: {
      display: true,
      text: 'Weekly Mood Chart'
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 5,
      ticks: {
        stepSize: 1
      },
      title: {
        display: true,
        text: 'Mood Level (1-5)'
      }
    },
    x: {
      title: {
        display: true,
        text: 'date'
      }
    }
  }
}
</script>
