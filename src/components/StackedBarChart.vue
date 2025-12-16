<template>
  <Bar :data="chartData" :options="options" />
</template>

<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const props = defineProps({
  labels: Array,  // ['Mon', 'Tue', 'Wed']
  habits: Object  // { callMom: [true, false, true], workOut: [true, true, false] }
})

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: 'Call Mom',
      data: props.habits.callMom?.map(v => v ? 1 : 0),
      backgroundColor: 'rgba(75, 192, 192, 0.8)',
    },
    {
      label: 'Work Out',
      data: props.habits.workOut?.map(v => v ? 1 : 0),
      backgroundColor: 'rgba(255, 99, 132, 0.8)',
    },
    {
      label: 'Meditate',
      data: props.habits.meditate?.map(v => v ? 1 : 0),
      backgroundColor: 'rgba(255, 206, 86, 0.8)',
    }
  ]
}))

const options = {
  responsive: true,
  scales: {
    x: { stacked: true },
    y: {
      stacked: true,
      ticks: { stepSize: 1 },
      max: 3  // Total number of habits
    }
  },
  plugins: {
    title: {
      display: true,
      text: 'Daily Habits Tracker'
    }
  }
}
</script>
