<script>
import urlJoin from 'url-join'
import GuideOutline from './GuideOutline.vue'
import GuidePage from './GuidePage.vue'
import { aircraftLookup } from '../../aircraft-data.js'

export default {
  components: { GuideOutline, GuidePage },
  props: {
    game: { type: String, required: true },
    aircraft: { type: String, required: true }
  },
  data() {
    return {
      preloadPages: new Set(),
      intersectionObserver: new IntersectionObserver(this.setPreloadPages, { threshold: [0] }),
    }
  },
  computed: {
    layoutCssUrl() {
      return urlJoin('/src/assets', this.aircraftData.href, 'layout.css')
    },
    aircraftData() {
      return aircraftLookup[this.game][this.aircraft]
    },
    assetsUrl() {
      return urlJoin(import.meta.env.VITE_ASSETS_BASE_URL, this.aircraftData.href)
    }
  },
  methods: {
    setPreloadPages(entries) {
      entries.forEach((entry) => {
        console.log(entry.target, entry.isIntersecting ? 'enter' : 'leave')
      })
    },
    observePage(element) {
      console.log('observing page', element)
      this.intersectionObserver.observe(element)
    }
  }
}
</script>

<template lang="pug">
link(rel="stylesheet" :href="layoutCssUrl")

#guide
  GuideOutline(:base-url="aircraftData.href")
  #pages
    //-GuidePage(v-for="pageNumber in aircraftData.pageCount" :page-number="pageNumber" :base-url="assetsUrl" @mounted="observePage")
    GuidePage(v-for="pageNumber in 20" :page-number="pageNumber" :base-url="assetsUrl" @mounted="observePage")
</template>

<style lang="stylus">
#guide
  display: flex
  height: 100vh

#pages
  flex: 1
  overflow: auto
</style>
