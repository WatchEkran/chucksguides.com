<script>
import { setPageTitle } from '../utils.js'

export default {
  created() {
    setPageTitle('Page Not Found')
  },
}
</script>

<template lang="pug">
h1.not-found 404 Page Not Found
</template>

<style lang="stylus" scoped>
.not-found
  text-align: center
  margin-top: 2em
</style>
