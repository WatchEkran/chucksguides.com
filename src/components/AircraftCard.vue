<script>
import urlJoin from 'url-join'
import LazyImage from './LazyImage.vue'

export default {
  components: { LazyImage },
  props: {
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    path: { type: String, required: true },
  },
  computed: {
    imageUrl() {
      const url = urlJoin('/src/assets', this.path, 'image.webp')
      return new URL(url, import.meta.url).path
    }
  }
}
</script>

<template lang="pug">
router-link.card(:to="path")
  LazyImage.image(:src="imageUrl")
  .name
    .title {{ title }}
    .subtitle {{ subtitle }}
</template>

<style lang="stylus" scoped>
.card
  position: relative
  background-size: contain
  text-decoration: none
  border-radius: 3px
  transition: all 150ms ease-out
  box-shadow: 0 1px 20px 1px rgba(0 0 0 30%)

  &:hover
    transform: scale(1.05)

  .image
    width: 100%
    display: block
    pointer-events: none
    border-radius: 3px

  .name
    position: absolute
    left: 0.4em
    bottom: 0.4em
    font-size: max(3.5vmin, 1.5em)
    color: white
    text-shadow: 2px 2px 2px black
    text-transform: uppercase
</style>
