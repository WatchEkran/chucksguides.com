<script>
export default {
  props: {
    src: { type: String, required: true }
  },
  computed: {
    avif() {
      return new URL('/src/assets/aircraft/dcs/A-10C.jpg?as=avif&width=500', import.meta.url)
      //return require('/src/assets/aircraft/dcs/a-10c.jpg?as=avif&width=500')
    }
  }
}
</script>

<template lang="pug">
picture
  source(:srcset="avif" type="image/avif")
  source(srcset="/src/assets/aircraft/dcs/a-10c.jpg?as=avif&width=500" type="image/webp")
  img(src="/src/assets/aircraft/dcs/a-10c.jpg")
</template>
