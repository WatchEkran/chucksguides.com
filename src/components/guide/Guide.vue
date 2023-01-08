<script>
import GuideOutline from './GuideOutline.vue'
import GuidePage from './GuidePage.vue'
import aircraftData from '/src/aircraft-data'

export default {
  components: { GuideOutline, GuidePage },
  props: {
    game: { type: String, required: true },
    aircraft: { type: String, required: true },
  },
  data() {
    return {
      intersectionObserver: new IntersectionObserver(this.updateVisiblePages),
      visiblePageElements: new Set(),
      currentPage: undefined,
      scrollDirection: 'down',
      scrollTop: 0,
      layoutCss: undefined,
      pages: [],
    }
  },
  mounted() {
    // Save the direction that the user is scrolling in.
    this.$refs.pages.addEventListener('scroll', (e) => {
      this.scrollDirection = e.target.scrollTop > this.scrollTop ? 'down' : 'up'
      this.scrollTop = e.target.scrollTop
    })
  },
  computed: {
    aircraftData() {
      return aircraftData[this.game][this.aircraft]
    },
    cssPath() {
      return this.aircraftData.cssPath
    },
  },
  methods: {
    updateVisiblePages(entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.visiblePageElements.add(entry.target)
        } else {
          this.visiblePageElements.delete(entry.target)
        }
      })

      this.setCurrentPage()
    },
    setCurrentPage() {
      this.visiblePageElements.forEach((element) => {
        if (element.getBoundingClientRect().top < this.$refs.pages.clientHeight / 2) {
          this.currentPage = element.id
        }
      })
    },
    observePage(element) {
      this.intersectionObserver.observe(element)
    },
  },
}
</script>

<template lang="pug">
link(rel="stylesheet" :href="cssPath")

#guide
  //GuideOutline(:path="hashPath")
  #pages(ref="pages")
    GuidePage(v-for="pageNumber in 20" :page-number="pageNumber" :base-url="assetsUrl" @mounted="observePage")
    //GuidePage(v-for="pageNumber in aircraftData.pageCount" :page-number="pageNumber" :base-url="assetsUrl" @mounted="observePage")
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
