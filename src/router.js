import { createRouter, createWebHistory } from 'vue-router'
import Home from './components/Home.vue'
import Guide from './components/guide/Guide.vue'
import NotFound from './components/NotFound.vue'
import aircraftData from './aircraft-data'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Home', component: Home },
    {
      path: '/aircraft/:game/:designation',
      component: Guide,
      props: true,
      beforeEnter({ params }) {
        const aircraft = aircraftData?.[params.game]?.[params.designation]

        if (!aircraft) {
          return {
            name: 'NotFound',
            // preserve current path and remove the first char to avoid the target URL starting with `//`
            params: { pathMatch: this.$route.path.substring(1).split('/') },
            // preserve existing query and hash if any
            query: this.$route.query,
            hash: this.$route.hash,
          }
        }
      },
    },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
  ],
})

export default router
