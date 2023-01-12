<script>
export default {
  props: {
    currentPage: {type: Number, required: true},
    pageCount: {type: Number, required: true}
  }
}
</script>

<template lang="pug">
.navbar {{ currentPage }} / {{ pageCount }}
</template>

<style lang="stylus" scoped>
.navbar
  height: 30px
  background-color: black
  color: white
  display: flex
  align-items: center
  justify-content: center
</style>