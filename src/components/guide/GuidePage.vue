<script>
import urlJoin from 'url-join'

export default {
  props: {
    pageNumber: { type: Number, required: true },
    baseUrl: { type: String, required: true },
    shouldFetchPage: { type: Boolean, required: true },
    isVisible: { type: Boolean, required: true }
  },
  data: () => ({
    pageHtml: undefined,
    isFetched: false,
  }),
  mounted() {
    this.$emit('mounted', this.$refs.root)
  },
  watch: {
    shouldFetchPage() {
      if (this.shouldFetchPage) {
        this.fetchPage()
      }
    },
  },
  methods: {
    async fetchPage() {
      if (this.isFetched) {
        return
      }

      this.isFetched = true
      const url = urlJoin(this.baseUrl, `${this.pageNumber}.page.html`)
      const data = await fetch(url)
      const rawHtml = await data.text()

      const wrapper = document.createElement('div')
      wrapper.innerHTML = rawHtml

      const img = wrapper.querySelector('img')
      img.setAttribute('src', urlJoin(this.baseUrl, img.getAttribute('src')))
      img.loading = 'lazy'
      img.decoding = 'async'

      //this.pageHtml = wrapper.querySelector('.pc').innerHTML
      this.pageHtml = wrapper.querySelector('.pc').outerHTML
    },
  },
}
</script>

<template lang="pug">
.pf.w0.h0(ref="root" :id="`page${pageNumber}`" v-html="isVisible ? pageHtml : ''" :data-page-number="pageNumber")
</template>

<style lang="stylus">
.pf
  width: calc(960px * 1.5) !important
  height: calc(540px * 1.5) !important

.pc
  transform: scale(1.5)

.anchor
  transform: translateY(-20vh)
  background-color: red
  width: 100%
  height: 1px
</style>
