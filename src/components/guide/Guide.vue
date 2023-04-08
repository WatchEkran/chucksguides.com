<script>
import GuideOutline from './GuideOutline.vue'
import GuidePage from './GuidePage.vue'
import siteConfig from '/src/site-config.json'
import { getPageNumberFromHash, setPageTitle } from '../../utils.js'
import urlJoin from 'url-join'
import IntersectionObserver from './IntersectionObserver.vue'
import GuideNavbar from './GuideNavbar.vue'
import GuideSidebar from './GuideSidebar.vue'

export default {
  components: { GuideSidebar, GuideNavbar, IntersectionObserver, GuideOutline, GuidePage },
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
    const { designation, name } = this.aircraftData
    setPageTitle(name ? `${designation} ${name}` : designation)
  },
  mounted() {
    this.pagesWrapper = this.$refs.pages

    const wrapperWidth = this.pagesWrapper.clientWidth
    const wrapperHeight = this.pagesWrapper.clientHeight
    const pageWidth = this.pagesWrapper.querySelector('.pf').clientWidth
    const pageHeight = this.pagesWrapper.querySelector('.pf').clientHeight
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
    aircraftData() {
      return siteConfig.guides[this.game][this.designation]
    },
    cssUrl() {
      return urlJoin(this.aircraftData.guideUrl, 'guide.css')
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
link(rel="stylesheet" :href="cssUrl")

//- component(is="style")
//-   | .pf { width: calc(960px * {{ currentZoom }}); height: calc(540px * {{ currentZoom }}) }
//-   | .pc { transform: scale({{ currentZoom }}) }

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
    :page-count="aircraftData.pageCount"
    v-model:currentZoom="currentZoom"
    @page-change="setCurrentPageAndScrollIntoView"
  )

  GuideSidebar(:guide-url="aircraftData.guideUrl")

  #pages(ref="pages")
    a(:href="aircraftData.pdfUrl") Download PDF

    GuidePage(
      v-for="pageNumber in 20"
      :page-number="pageNumber"
      :guide-url="aircraftData.guideUrl"
      :should-fetch-page="visiblePageNumbers.includes(pageNumber)"
      :is-visible="visiblePageNumbers.includes(pageNumber)"
    )
</template>

<style lang="stylus">
#guide
  display: grid
  grid-template-areas: "navbar navbar"\
                       "sidebar pages"
  height: 100vh
  grid-template-columns: 300px 1fr
  grid-template-rows: 40px 1fr

#navbar
  grid-area: navbar
#outline
  grid-area: sidebar

#pages
  grid-area: pages
  overflow: auto
</style>
