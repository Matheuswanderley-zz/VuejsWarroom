<template>
  <div class="flex-grid">
    <span
      v-for="btn in buttons"
      :class="{ selected: btn.value === view, disabled: !optionsEnabled }"
      @click="viewChanged(btn.value)"
    >
      <img
        :src="btn.src"
        alt=""
      >
    </span>
  </div>
</template>

<script>
export default {
  props: {
    optionsEnabled: {
      type: Boolean,
      default: true,
    },
  },
  data: function(){
    return {
      view: 'congress',

      buttons: [
        {
          src: 'assets/icon-congress.png',
          value: 'congress',
        },
        {
          src: 'assets/icon-flag.png',
          value: 'parties',
        },
        {
          src: 'assets/icon-map.png',
          value: 'states',
        },
      ],
    }
  },

  created() {
    this.$root.$emit('viewChanged', this.view)
  },

  methods: {
    viewChanged(value) {
      if (!this.optionsEnabled) return
      this.view = value
      this.$root.$emit('viewChanged', value)
    },
  },
}
</script>

<style scoped>
  .flex-grid {
    flex-grow: 1;
    display: -webkit-flex;
    display: -moz-flex;
    display: -ms-flex;
    display: -o-flex;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top: 12px;
  }

  span {
    margin: 0 .5em;
    cursor: pointer;
    padding: .3em;
    border-radius: 2px;
    border: 1px solid rgba(255, 255, 255, .0);
    opacity: .5;
  }
  span:hover, span.selected {
    /*background-color: rgba(255, 255, 255, .3);*/
    border-color: rgba(255, 255, 255, .7);
    opacity: 1;
  }

  span.disabled {
    opacity: .2;
    cursor: default;
  }

  span.disabled:hover, span.disabled.selected {
    /*background-color: rgba(255, 255, 255, .3);*/
    border-color: rgba(255, 255, 255, 0);
    opacity: .2;
  }

  img {
    display: block;
    height: 1.6em;
  }
</style>