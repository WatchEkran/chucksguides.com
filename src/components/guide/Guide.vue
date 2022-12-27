<script setup>
import urlJoin from 'url-join'
import { aircraftLookup } from '../../aircraft-list.js'
import GuideOutline from './GuideOutline.vue'
import GuidePage from './GuidePage.vue'

const props = defineProps({
  game: { type: String, required: true },
  aircraft: { type: String, required: true },
})

const aircraftData = aircraftLookup[props.game][props.aircraft]
const assetsUrl = urlJoin(import.meta.env.VITE_ASSETS_BASE_URL, aircraftData.href)
</script>

<template lang="pug">
#guide
  GuideOutline(:base-url="assetsUrl")
  #pages
    GuidePage(v-for="pageNumber in aircraftData.pageCount" :page-number="pageNumber" :base-url="assetsUrl")
</template>

<style>
@import '/aircraft/dcs/a-10c/warthog.css';
</style>

<style lang="stylus">
#guide
  display: flex
  height: 100vh

#pages
  flex: 1
</style>
