<script>
import AircraftCard from './AircraftCard.vue'

export default {
  components: { AircraftCard },
  props: {
    list: { type: Array, required: true }
  }
}
</script>

<template lang="pug">
.cards
  AircraftCard(v-for="aircraft in list" v-bind="aircraft")
</template>

<style lang="stylus" scoped>
.cards
  display: grid
  grid-template-columns: repeat(auto-fit, minmax(25em, 1fr))
  grid-gap: 2em
</style>