<template>
  <div class="total-votes">
    <span class="value">
      <votes-number :value="votes" />
    </span>
    <icon
      :name="indicator.name"
      :color="indicator.color"
      scale="3"
    />
  </div>
</template>

<script>
import VotesNumber from './Number'
export default {
  components: {
    VotesNumber,
  },
  props: {
    votes: {
      type: Number,
      default: 0,
    },
  },
  data: function() {
    return {
      indicators: {
        up: {
          name: 'caret-up',
          color: '#ff014f',
        },
        down: {
          name: 'caret-down',
          color: '#0072d2',
        },
        neutral: {
          name: 'caret-up',
          color: 'transparent',
        },
      },
    }
  },
  computed: {
    indicator() {
      const indicator = this.votes === this.oldValue
        ? this.indicators.neutral
        : this.votes > this.oldValue
          ? this.indicators.up
          : this.indicators.down

      this.oldValue = this.votes
      return indicator
    },
  },
  created() {
    this.oldValue = this.votes
  },
}
</script>

<style scoped>
  .total-votes {
    font-size: 1em;
    display: flex;
    align-items: center;
  }
  .value {
    font-size: 7em;
    font-weight: bold;
    color: #ffffff;
  }
  .fa-icon {
    margin: 0 -.85em 0 .2em;
  }
</style>