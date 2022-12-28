<script>
import urlJoin from 'url-join'

export default {
  props: {
    pageNumber: { type: Number, required: true },
    baseUrl: { type: String, required: true }
  },
  data: () => ({
    pageHtml: undefined,
    isFetched: false,
    isVisible: false,
  }),
  mounted() {
    this.$emit('mounted', this.$refs.root)
  },
  methods: {
    async fetchPage() {
      if (!this.isFetched) {
        const data = await fetch(urlJoin(this.baseUrl, `${this.pageNumber}.page.html`))
        const rawHtml = await data.text()

        const wrapper = document.createElement('div')
        wrapper.innerHTML = rawHtml

        const img = wrapper.querySelector('img')
        img.setAttribute('src', urlJoin(this.baseUrl, img.getAttribute('src')))
        img.loading = 'lazy'
        img.decoding = 'async'

        console.log('setting pageHtml to', wrapper)

        this.pageHtml = wrapper.querySelector('.pc').innerHTML
      }
    }
  }
}
</script>

<template lang="pug">
.pf.w0.h0(ref="root" :id="`page${pageNumber}`" v-html="isVisible ? pageHtml : ''")
</template>

<style lang="stylus">
.pf
  width: 960px
  height: 540px
  
.anchor
  transform: translateY(-20vh)
  background-color: red
  width: 100%
  height: 1px
</style>
