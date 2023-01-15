<script>
import GuideOutline from './GuideOutline.vue'
import GuidePage from './GuidePage.vue'
import aircraftData from '/src/aircraft-data'
import { getPageNumberFromHash, setPageTitle } from '../../utils.js'
import urlJoin from 'url-join'
import IntersectionObserver from './IntersectionObserver.vue'
import GuideCss from './GuideCss.vue'
import GuideNavbar from './GuideNavbar.vue'

export default {
  components: { GuideNavbar, GuideCss, IntersectionObserver, GuideOutline, GuidePage },
  props: {
    game: { type: String, required: true },
    designation: { type: String, required: true },
  },
  data() {
    return {
      visiblePageElements: [],
      currentPage: 1,
      currentZoom: 1,
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

    const wrapperWidth = this.pagesWrapper.clientWidth
    const wrapperHeight = this.pagesWrapper.clientHeight
    const pageWidth = this.pagesWrapper.children[1].clientWidth
    const pageHeight = this.pagesWrapper.children[1].clientHeight
    const widthScale = wrapperWidth / pageWidth
    const heightScale = wrapperHeight / pageHeight

    this.currentZoom = Math.min(widthScale, heightScale)

    this.currentPage = getPageNumberFromHash(this.$route.hash)
    this.scrollToCurrentPage()
  },
  watch: {
    '$route.hash'() {
      this.currentPage = getPageNumberFromHash(this.$route.hash)
    },
    currentPage() {
      this.$router.replace({ hash: `#page${this.currentPage}` })
    },
  },
  computed: {
    aircraft() {
      return aircraftData[this.game][this.designation]
    },
    assetsUrl() {
      const { path, hash } = this.aircraft
      return urlJoin(import.meta.env.VITE_ASSETS_BASE_URL, path, hash)
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
    setCurrentPageAndScrollIntoView(pageNumber) {
      this.currentPage = pageNumber
      this.scrollToCurrentPage()
    },
    scrollToCurrentPage() {
      document.getElementById(`page${this.currentPage}`).scrollIntoView()
    },
  },
}
</script>

<template lang="pug">
GuideCss(:base-url="assetsUrl")

template(v-if="pagesWrapper")
  // Triggers when the page crosses the horizontal center of the viewport. Used to set the current page.
  intersection-observer(
    :root="pagesWrapper"
    root-margin="-50% 0% -50% 0%"
    :elements="[...pagesWrapper.children]"
    @intersect-in="setCurrentPage"
  )
  // Triggers when the page is in or close to the viewport. Used to preload and render the pages.
  intersection-observer(
    :root="pagesWrapper"
    root-margin="50% 0% 50% 0%"
    :elements="[...pagesWrapper.children]"
    @intersect-in="addVisiblePage"
    @intersect-out="removeVisiblePage"
  )

#guide
  GuideNavbar#navbar(
    :current-page="currentPage"
    :page-count="aircraft.pageCount"
    v-model:currentZoom="currentZoom"
    @page-change="setCurrentPageAndScrollIntoView"
  )
  GuideOutline#outline(:base-url="assetsUrl")
  h1(style="position: absolute; z-index: 1") Current Page: {{ currentPage }}, Scroll Direction: {{ scrollDirection }}
  #pages(ref="pages")
    GuidePage(
      v-for="pageNumber in 10"
      :page-number="pageNumber"
      :base-url="assetsUrl"
      :should-fetch-page="visiblePageNumbers.includes(pageNumber)"
      :is-visible="visiblePageNumbers.includes(pageNumber)"
      :zoom="currentZoom"
    )
</template>

<style lang="stylus">
#guide
  display: grid
  grid-template-areas: "navbar navbar"\
                       "sidebar pages"
  height: 100vh
  grid-template-columns: 300px 1fr

#navbar
  grid-area: navbar
#outline
  grid-area: sidebar

#pages
  grid-area: pages
</style>
