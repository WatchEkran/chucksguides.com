<script>
export default {
  props: {
    root: HTMLElement,
    rootMargin: String,
    threshold: [Array, Number],
    elements: { type: Array, required: true }
  },
  data() {
    const { root, rootMargin, threshold } = this
    return {
      intersectionObserver: new IntersectionObserver(this.emitEvents, { root, rootMargin, threshold })
    }
  },
  watch: {
    elements: {
      immediate: true,
      handler() {
        this.elements.forEach((element) => this.intersectionObserver.observe(element))
      }
    }
  },
  methods: {
    emitEvents(entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.$emit('intersectIn', entry)
        } else {
          this.$emit('intersectOut', entry)
        }
      })
    }
  },
  render() {
    return this.$slots.default?.()
  },
}
</script>
