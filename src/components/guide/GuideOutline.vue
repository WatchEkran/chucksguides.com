<script>
import urlJoin from 'url-join'

export default {
  props: {
    baseUrl: { type: String, required: true },
  },
  data: () => ({
    outlineHtml: undefined,
  }),
  async created() {
    const response = await fetch(urlJoin(this.baseUrl, 'outline.html'))
    const rawHtml = await response.text()

    var wrapper = document.createElement('div')
    wrapper.innerHTML = rawHtml
    wrapper.querySelectorAll('a').forEach((anchor) => {
      const pageNumberInHex = anchor.getAttribute('href').split('pf')[1]
      const pageNumberInDecimal = parseInt(pageNumberInHex, 16)
      anchor.setAttribute('href', `#page${pageNumberInDecimal}`)
    })

    this.outlineHtml = wrapper.innerHTML
  },
  methods: {
    handleClick(e) {
      e.preventDefault()
      if (e.target.hash) {
        this.$router.replace({ hash: e.target.hash })
      }
    }
  }
}
</script>

<template lang="pug">
#sidebar
  #outline(v-html="outlineHtml" @click="handleClick")
</template>

<style lang="stylus" scoped>
#sidebar
  position: unset
  width: 300px

#outline
  background-color: black
  & a
    white-space: normal
</style>
