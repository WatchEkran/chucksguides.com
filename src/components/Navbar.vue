<script>
export default {
  mounted() {
    const observer = new IntersectionObserver(([e]) => {
      this.$refs.nav.classList.toggle('sticky', !e.isIntersecting)
    }, { threshold: 1})

    observer.observe(this.$refs.threshold)
  }
}
</script>

<template lang="pug">
div(ref="threshold")

nav(ref="nav")
  .content.flex.center
    a.nav-item(href="#dcs")
      img.dcs(src="/src/assets/img/dcs.webp")
      | DCS#[br]World
    a.nav-item(href="#il2-gb")
      img(src="/src/assets/img/il2-gb.webp")
      | IL-2:Great#[br]Battles
    a.patreon-button(href="https://www.patreon.com/chucksguides")
      img(src="/src/assets/img/patreon.webp")
      | Become a Patron
</template>

<style lang="stylus" scoped>
  nav
    background-color: #779faa
    z-index: 1

    .nav-item
      padding: 1em 1em
      text-decoration: none
      color: white
      display: flex
      align-items: center
      font-size: 1.1em
      text-transform: uppercase
      transition: all 150ms ease-out

      &:hover
        color: white
        background-color: #2a879e

      img
        height: 40px
        margin-right: 0.5em
        border-radius: 50%
        transition: height 200ms ease-out

      &.dcs
        background-color: black
</style>