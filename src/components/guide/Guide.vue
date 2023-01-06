<script>
import urlJoin from 'url-join'
import GuideOutline from './GuideOutline.vue'
import GuidePage from './GuidePage.vue'
import { aircraftLookup } from '../../aircraft-data.js'
import { getAssetUrl } from '../../utils'

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
      visibleElements: new Set(),
      currentPage: undefined,
      scrollDirection: 'down',
      scrollTop: 0,
      layoutCss: undefined,
    }
  },
  async created() {
    // const path = await this.aircraftData.cssPath()
    // console.log('path', path)
    console.log(this.aircraftData.cssPath)
    // this.layoutCss = await path
  },
  mounted() {
    this.$refs.pages.addEventListener('scroll', (e) => {
      this.scrollDirection = e.target.scrollTop > this.scrollTop ? 'down' : 'up'
      this.scrollTop = e.target.scrollTop
    })
  },
  computed: {
    layoutCssUrl() {
      return this.aircraftData.cssPath
    },
    aircraftData() {
      return aircraftLookup[this.game][this.aircraft]
    },
    assetsUrl() {
      return urlJoin(import.meta.env.VITE_ASSETS_BASE_URL, this.aircraftData.path)
    }
  },
  methods: {
    setPreloadPages(entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.visibleElements.add(entry.target)
        } else {
          this.visibleElements.delete(entry.target)
        }
      })

      this.setCurrentPage()
    },
    setCurrentPage() {
      this.visibleElements.forEach((element) => {
        if (element.getBoundingClientRect().top < this.$refs.pages.clientHeight / 2) {
          this.currentPage = element.id
        }
      })
    },
    observePage(element) {
      this.intersectionObserver.observe(element)
    }
  }
}
</script>

<template lang="pug">
link(rel="stylesheet" :href="layoutCssUrl" v-if="layoutCss")

#guide
  GuideOutline(:path="aircraftData.path")
  #pages(ref="pages")
    GuidePage(v-for="pageNumber in 20" :page-number="pageNumber" :base-url="assetsUrl" @mounted="observePage")
    //-GuidePage(v-for="pageNumber in aircraftData.pageCount" :page-number="pageNumber" :base-url="assetsUrl" @mounted="observePage")
</template>

<style lang="stylus">
#guide
  position: relative
  display: flex
  height: 100vh

#pages
  flex: 1
  overflow: auto
</style>
