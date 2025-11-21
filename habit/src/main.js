import './assets/main.css'
import '/src/style.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'


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

app.mount('#app')
