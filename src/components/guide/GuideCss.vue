<script>
import urlJoin from 'url-join'

export default {
  props: {
    baseUrl: { type: String, required: true },
  },
  data: () => ({
    css: '',
  }),
  async created() {
    const response = await fetch(this.guideCssUrl)
    const rawCss = await response.text()
    // Look for the string 'url(${font}.woff` and add the base URL in front of ${font}
    this.css = rawCss.replace(/(?<=url\()(\S+)(?=\.woff)/g, `${this.baseUrl}/$1`)
  },
  computed: {
    guideCssUrl() {
      return urlJoin(this.baseUrl, 'guide.css')
    },
  },
}
</script>

<template lang="pug">
// Workaround for Vue not directly supporting style tags: https://stackoverflow.com/a/68660717/135318
component(is="style") {{ css }}
</template>
