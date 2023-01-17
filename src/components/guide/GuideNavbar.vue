<script>
export default {
  props: {
    currentPage: { type: Number, required: true },
    pageCount: { type: Number, required: true },
    currentZoom: { type: Number, required: true },
  },
  methods: {
    selectAllText(e) {
      e.target.select()
    },
    emitPageChange(e) {
      this.$emit('page-change', e.target.value)
    },
    emitZoomChange(e) {
      this.$emit('update:current-zoom', parseFloat(e.target.value))
    }
  }
}
</script>

<template lang="pug">
.navbar
  .page-picker.flex
    input.currentPage(:value="currentPage" @click="selectAllText" @change="emitPageChange")
    .pageCount / {{ pageCount }}

  .zoom-level.flex
    button
      .material-symbols-outlined zoom_out
    input.currentZoom(:value="currentZoom" @click="selectAllText" @change="emitZoomChange")
    button
      .material-symbols-outlined zoom_in
</template>

<style lang="stylus" scoped>
.navbar
  background-color: black
  color: white
  display: flex
  align-items: center
  justify-content: center

input
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

.zoom-level
  margin-left: 2em

button
  cursor: pointer
  border: none
  background: none
  color: white
</style>
