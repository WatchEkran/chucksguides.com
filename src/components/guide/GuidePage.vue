<script>
import urlJoin from 'url-join'
import LoadingIndicator from './LoadingIndicator.vue'

export default {
  components: { LoadingIndicator },
  props: {
    pageNumber: { type: Number, required: true },
    baseUrl: { type: String, required: true },
    shouldFetchPage: { type: Boolean, required: true },
    isVisible: { type: Boolean, required: true },
    zoom: { type: Number, required: true },
  },
  data: () => ({
    pageHtml: undefined,
    isFetched: false,
    isLoading: false,
    errorMessage: '',
    timer: undefined,
    initialHeight: 960,
    initialWidth: 540,
  }),
  watch: {
    shouldFetchPage() {
      if (this.shouldFetchPage) {
        this.timer = setTimeout(this.fetchPage, 100)
      } else {
        clearTimeout(this.timer)
      }
    },
  },
  computed: {
    zoomStyle() {
      return {
        width: `${this.initialHeight * this.zoom}px`,
        height: `${this.initialWidth * this.zoom}px`,
      }
    },
  },
  methods: {
    async fetchPage() {
      if (this.isFetched) {
        return
      }

      this.isFetched = true
      this.isLoading = true
      const url = urlJoin(this.baseUrl, `${this.pageNumber}.page.html`)

      const response = await fetch(url)
      this.isLoading = false

      if (response.ok) {
        const rawHtml = await response.text()
        // Create an in-memory element so that we can edit the page HTML.
        const wrapper = document.createElement('div')
        wrapper.innerHTML = rawHtml
        // Change the image src and make it lazy loading and async decoding.
        const img = wrapper.querySelector('img')
        img.setAttribute('src', urlJoin(this.baseUrl, img.getAttribute('src')))
        //img.loading = 'lazy'
        //img.decoding = 'async'
        // Return just the .pc (page content), there's some metadata in the HTML that we don't need.
        this.pageHtml = wrapper.querySelector('.pc').outerHTML
      } else {
        this.errorMessage = response.statusText
      }
    },
  },
}
</script>

<template lang="pug">
.pf.w0.h0(ref="page" :id="`page${pageNumber}`" :data-page-number="pageNumber" :style="zoomStyle")
  LoadingIndicator(v-if="isLoading")

  .loading-error(v-else-if="errorMessage")
    .material-symbols-outlined cloud_off
    .error-message {{ errorMessage }}

  .wrapper(v-else-if="isVisible" v-html="pageHtml")
</template>

<style lang="stylus">
.wrapper
  display: contents

.pf
  width: 960px
  height: 540px
  display: flex
  align-items: center
  justify-content: center

.anchor
  transform: translateY(-20vh)
  background-color: red
  width: 100%
  height: 1px

.loading-error
  text-align: center
</style>
