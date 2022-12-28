<script>
export default {
  props: {
    src: { type: String, required: true }
  }
}
</script>

<template lang="pug">
img(:src="src" loading="lazy" decoding="async")
</template>
