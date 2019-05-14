<template>
  <div>{{ animatedNumber }}</div>
</template>

<script>
  import {TweenLite, Elastic} from 'gsap/TweenMax'

  export default {
    props: {
      value: {
        type: Number,
        default: 0,
      },
    },
    data: function() {
      return {
        tweenedNumber: 0,
      }
    },
    computed: {
      animatedNumber() {
        return this.tweenedNumber.toFixed(0)
      },
    },
    watch: {
      value(newValue) {
        TweenLite.to(this.$data, 1, { tweenedNumber: newValue })
      },
    },
  }
</script>

<style scoped>
</style>