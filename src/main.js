// import './assets/main.css'
import '/src/style.css'
import { createApp } from 'vue'
import App from './App.vue'
import VCalendar from 'v-calendar'
import 'v-calendar/style.css'
import router from './router'


//           login imports

import { VueFire, VueFireAuth } from 'vuefire'
import { getAuth } from 'firebase/auth'
import { firebaseApp } from './firebase_config.js'

///           end of login imports

const app = createApp(App)
app.use(VCalendar, {})
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

app.mount('#app')
