<script>
import GuideOutline from './GuideOutline.vue'

export default {
  components: { GuideOutline },
  props: {
    guideUrl: { type: String, required: true }
  }
}
</script>

<template lang="pug">
#sidebar
  GuideOutline(:guide-url="guideUrl")
</template>

<style lang="stylus" scoped>
#sidebar
  background-color: #2f3236
  overflow: auto
</style>
