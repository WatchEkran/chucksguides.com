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
      pagesWrapper: undefined,
    }
  },
  created() {
    const { designation, name } = this.aircraft
    setPageTitle(name ? `${designation} ${name}` : designation)
  },
  mounted() {
    this.pagesWrapper = this.$refs.pages
    this.scrollToPage(this.$route.hash)
  },
  watch: {
    '$route.hash'() {
      this.scrollToPage(this.$route.hash)
    }
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
    scrollToPage(pageId) {
      if (pageId) {
        this.$refs.pages.querySelector(pageId).scrollIntoView()
      } else {
        this.$refs.pages.scrollTo(0, 0)
      }
    },
  },
}
</script>

<template lang="pug">
link(rel="stylesheet" :href="cssUrl")

template(v-if="pagesWrapper")
  intersection-observer(
    :root="pagesWrapper"
    root-margin="-50% 0% -50% 0%"
    :elements="[...pagesWrapper.children]"
    @intersect-in="setCurrentPage"
  )
  intersection-observer(
    :root="pagesWrapper"
    root-margin="50% 0% 50% 0%"
    :elements="[...pagesWrapper.children]"
    @intersect-in="addVisiblePage"
    @intersect-out="removeVisiblePage"
  )

#guide
  GuideOutline(:base-url="assetsUrl")
  h1(style="position: absolute; z-index: 1") Current Page: {{ currentPage }}, Scroll Direction: {{ scrollDirection }}
  #pages(ref="pages")
    GuidePage(
      v-for="pageNumber in aircraft.pageCount"
      :page-number="pageNumber"
      :base-url="assetsUrl"
      :should-fetch-page="visiblePageNumbers.includes(pageNumber)"
      :is-visible="visiblePageNumbers.includes(pageNumber)"
    )
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
