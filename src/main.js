// import './assets/main.css'
import '/src/style.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VCalendar from "v-calendar";
import 'v-calendar/style.css'
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale } from 'chart.js'
ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale)

//           login imports
import { VueFire, VueFireAuth } from 'vuefire'
import { getAuth } from 'firebase/auth'
import { firebaseApp } from './firebase_config.js'

///           end of login imports

const app = createApp(App)
const auth = getAuth(firebaseApp)

app.use(router)


//                       login
app.use(VueFire, {
  firebaseApp,
  modules: [
    VueFireAuth({ auth })
  ]
})

////                     end of login
app.use(VCalendar);

app.mount('#app')
