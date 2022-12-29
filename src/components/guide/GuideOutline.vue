<script>
import { getAssetUrl } from '../../utils'

export default {
  props: {
    path: { type: String, required: true },
  },
  data: () => ({
    outlineHtml: undefined,
  }),
  async created() {
    const response = await fetch(getAssetUrl(this.path, 'outline.html'))
    const rawHtml = await response.text()

    var wrapper = document.createElement('div')
    wrapper.innerHTML = rawHtml
    wrapper.querySelectorAll('a').forEach((anchor) => {
      const pageNumberInHex = anchor.getAttribute('href').split('pf')[1]
      const pageNumberInDecimal = parseInt(pageNumberInHex, 16)
      anchor.setAttribute('href', `#page${pageNumberInDecimal}`)
    })

    this.outlineHtml = wrapper.innerHTML
  }
}
</script>

<template lang="pug">
#sidebar
  #outline(v-html="outlineHtml")
</template>

<style lang="stylus" scoped>
#sidebar
  position: unset
  width: 300px

#outline a
  white-space: normal
</style>
