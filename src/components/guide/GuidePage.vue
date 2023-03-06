<script>
import urlJoin from 'url-join'
import LoadingIndicator from './LoadingIndicator.vue'

export default {
  components: { LoadingIndicator },
  props: {
    pageNumber: { type: Number, required: true },
    guideUrl: { type: String, required: true },
    shouldFetchPage: { type: Boolean, required: true },
    isVisible: { type: Boolean, required: true },
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
        // Add a 100ms delay before fetching the page, to prevent excessive requests if the user is scrolling quickly.
        this.timer = setTimeout(this.fetchPage, 100)
      } else {
        // Cancel the scheduled fetchPage call if the page is no longer in view.
        clearTimeout(this.timer)
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
      const url = urlJoin(this.guideUrl, `${this.pageNumber}.page.html`)

      const response = await fetch(url)
      this.isLoading = false

      if (response.ok) {
        const rawHtml = await response.text()
        this.$refs.page.innerHTML = rawHtml
      } else {
        this.errorMessage = response.statusText
      }
    },
  },
}
</script>

<template lang="pug">
.pf.w0.h0(ref="page" :id="`page${pageNumber}`" :data-page-number="pageNumber")
  LoadingIndicator(v-if="isLoading")

  .loading-error(v-else-if="errorMessage")
    .material-symbols-outlined cloud_off
    .error-message {{ errorMessage }}
</template>

<style lang="stylus" scoped>
.wrapper
  display: contents

.anchor
  transform: translateY(-20vh)
  background-color: red
  width: 100%
  height: 1px

.loading-error
  text-align: center
</style>

<style lang="stylus">
// These styles were copied over from pdf2htmlEX's base.min.css.

// Page frame, wrapper for the page contents.
.pf
  position: relative
  width: 960px
  height: 540px
  display: flex
  align-items: center
  justify-content: center
  margin: 1.5em auto
  box-shadow: 1px 1px 3px 1px #333

// Page contents.
.pc
  position: absolute
  transform-origin: 0 0
  left: 0
  top: 0

// Background frame, wrapper for the background image.
.bf
  position: absolute
  width: 100%
  height: 100%

// Content wrapper
.c
  position: absolute

// Text
.t
  position: absolute
  white-space: pre
  transform-origin: 0 100%
  unicode-bidi: bidi-override
  font-feature-settings: 'liga' 0
</style>