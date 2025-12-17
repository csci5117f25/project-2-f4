// import './assets/main.css'
import '/src/style.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

//           login imports

import { VueFire, VueFireAuth } from 'vuefire'
import { getAuth } from 'firebase/auth'
import { firebaseApp } from './firebase_config.js'

///           end of login imports

router.afterEach((to) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }

  if (to.meta.icon) {
    let link = document.querySelector("link[rel~='icon']")
    link.href = to.meta.icon
  }
})

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
