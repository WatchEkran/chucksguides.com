<script>
import urlJoin from 'url-join'

export default {
  props: {
    guideUrl: { type: String, required: true },
  },
  data: () => ({
    outlineHtml: undefined,
  }),
  async created() {
    const response = await fetch(urlJoin(this.guideUrl, 'outline.html'))
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
        document.querySelector(e.target.hash).scrollIntoView(true)
      }
    }
  }
}
</script>

<template lang="pug">
#outline(v-html="outlineHtml" @click="handleClick")
</template>

<style lang="stylus">
#outline
  font-size: 0.9em

  ul
    padding: 0 1.2em

  li
    list-style-type: none
    margin: 0.7em 0

    ul
      margin-left: 1em
      padding-left: 0

  a, a:visited
    color: #e8e8e8
    text-decoration: none

  a:hover
    color: white
</style>
