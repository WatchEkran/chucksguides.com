<script>
import GuideOutline from './GuideOutline.vue'
import GuidePage from './GuidePage.vue'
import aircraftData from '/src/aircraft-data'
import { setPageTitle } from '../../utils.js'
import urlJoin from 'url-join'
import IntersectionObserver from './IntersectionObserver.vue'

export default {
  components: { IntersectionObserver, GuideOutline, GuidePage },
  props: {
    game: { type: String, required: true },
    designation: { type: String, required: true },
  },
  data() {
    return {
      visiblePageElements: [],
      currentPage: undefined,
      scrollDirection: 'down',
      pageElements: [],
      pagesElement: undefined,
    }
  },
  created() {
    const { designation, name } = this.aircraft
    setPageTitle(name ? `${designation} ${name}` : designation)
  },
  mounted() {
    this.pagesElement = this.$refs.pages
  },
  computed: {
    aircraft() {
      return aircraftData[this.game][this.designation]
    },
    assetsUrl() {
      const { path, hash } = this.aircraft
      return urlJoin(import.meta.env.VITE_ASSETS_BASE_URL, path, hash)
    },
    cssUrl() {
      return urlJoin(this.assetsUrl, 'guide.css')
    },
    visiblePageNumbers() {
      return this.visiblePageElements.map((element) => parseInt(element.dataset.pageNumber))
    },
  },
  methods: {
    addVisiblePage({ target }) {
      this.visiblePageElements.push(target)
    },
    removeVisiblePage({ target }) {
      this.visiblePageElements = this.visiblePageElements.filter((visible) => visible !== target)
    },
    setCurrentPage({ target, boundingClientRect }) {
      this.currentPage = parseInt(target.dataset.pageNumber)
      this.scrollDirection = boundingClientRect.y < 0 ? 'up' : 'down'
    },
    observePage(element) {
      this.pageElements.push(element)
    },
  },
}
</script>

<template lang="pug">
link(rel="stylesheet" :href="cssUrl")

template(v-if="pagesElement")
  intersection-observer(
    :root="pagesElement"
    root-margin="-50% 0% -50% 0%"
    :elements="pageElements"
    @intersect-in="setCurrentPage"
  )
  intersection-observer(
    :root="pagesElement"
    root-margin="50% 0% 50% 0%"
    :elements="pageElements"
    @intersect-in="addVisiblePage"
    @intersect-out="removeVisiblePage"
  )

#guide
  //GuideOutline(:path="hashPath")
  h1(style="position: absolute; z-index: 1") Current Page: {{ currentPage }}, Scroll Direction: {{ scrollDirection }}
  #pages(ref="pages")
    GuidePage(
      v-for="pageNumber in 20"
      :page-number="pageNumber"
      :base-url="assetsUrl"
      @mounted="observePage"
      :should-fetch-page="visiblePageNumbers.includes(pageNumber)"
      :is-visible="visiblePageNumbers.includes(pageNumber)"
    )
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
