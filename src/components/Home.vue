<script>
import Navbar from './Navbar.vue'
import AircraftCards from './AircraftCards.vue'
import siteConfig from '../site-config.json'

const DcsModern = [
    siteConfig.guides.dcs['a-10c'],
]

export default {
  components: { Navbar, AircraftCards },
  DcsModern,
}
</script>

<template lang="pug">
.banner Chuck's Guides
Navbar

.content
  h1#dcs DCS
  h2 Jets - Modern
  AircraftCards(:list="$options.DcsModern")
</template>

<style lang="stylus">
@import url('https://fonts.googleapis.com/css2?family=Barlow:wght@500;700&display=swap')

body
  margin: 0
  background-color: rgba(0, 0, 0, 5%)
  font-family: 'Barlow', sans-serif
</style>

<style lang="stylus" scoped>
.banner
  background: rgba(0, 0, 0, 90%) url('/src/assets/img/banner.webp')
  background-size: cover
  background-position-y: 64%
  font-size: 4em
  color: white
  text-transform: uppercase
  display: flex
  align-items: center
  justify-content: center
  height: 3em
</style>
