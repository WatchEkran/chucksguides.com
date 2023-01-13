<script>
export default {
  props: {
    currentPage: { type: Number, required: true },
    pageCount: { type: Number, required: true },
  },
  methods: {
    selectAllText(e) {
      e.target.select()
    },
    emitPageChange(e) {
      this.$emit('page-change', e.target.value)
    }
  }
}
</script>

<template lang="pug">
.navbar
  input.currentPage(:value="currentPage" @click="selectAllText" @change="emitPageChange")
  .pageCount / {{ pageCount }}
</template>

<style lang="stylus" scoped>
.navbar
  height: 40px
  background-color: black
  color: white
  display: flex
  align-items: center
  justify-content: center
  font-size: 1em

.currentPage
  font-size: inherit
  font-family: Barlow, sans-serif
  background-color: #3d3d3d
  color: white
  border: none
  border-radius: 3px
  width: 2em
  text-align: center

  &:focus
    outline: none

.pageCount
  margin-left: 0.3em
</style>
