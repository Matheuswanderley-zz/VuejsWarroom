<template>
  <div
    class="sound-button"
    @click="toggle"
  >
    <icon
      :name="soundStatus.name"
      :class="{ active: isOn }"
      scale="2"
    />
  </div>
</template>

<script>

export default {
  props: {
    isOn: {
      type: Boolean,
      default: false,
    },
  },
  data: function() {
    return {
      soundStatuses: {
        on: { name: 'volume-up' },
        off: { name: 'volume-mute' },
      },
    }
  },
  computed: {
    soundStatus() {
      return this.isOn
        ? this.soundStatuses.on
        : this.soundStatuses.off
    },
  },
  methods: {
    toggle() {
      this.$emit('sound-toggled')
    },
  },
}
</script>

<style scoped>
  .sound-button {
    width: 60px;
    height: 50px;
    border-radius: 3px;
    border: 1px solid #b0b0b0;
    display: -webkit-flex;
    display: -moz-flex;
    display: -ms-flex;
    display: -o-flex;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 4vh;
    right: -40px;
    opacity: 0;

    transition: right .15s, opacity .15s;
  }
  .sound-button:hover {
    right: -5px;
    opacity: 1;
  }
  .fa-icon {
    color: #fff;
    opacity: .5;
  }
  .fa-icon.active {
    opacity: 1;
  }
</style>