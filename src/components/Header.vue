<template>
  <header>
    <img
      src="assets/logo.png"
      alt=""
      class="logo"
    >
    <div class="nav-right item">
      <h1 class="title">
        {{ title }}
      </h1>
      <search-bar />
      <view-selector :options-enabled="optionsEnabled" />
    </div>
  </header>
</template>




<script>
import ViewSelector from './ViewSelector.vue'
import SearchBar from './SearchBar.vue'

export default {
  components: {
    ViewSelector,
    SearchBar,
  },
  props: ['optionsEnabled'],
  data: function() {
    return {
    title : 'Intenção de votos do congresso',
    }
  },
}
</script>
<style scoped>

header {
  box-sizing: border-box;
  overflow: hidden;
  height: 12.6vh;
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  align-items: center;
  padding: 0 2.4%;
}

.item {
  flex-grow: 1;
}

img {
  width: 58px;
  height: 58px;
  margin-top: 20px;
}

.nav-right {
    border-bottom: 1px solid #525252;
    height: 100%;
    margin: 0 2.5%;
    padding-top: 0.6em;
    display: -webkit-flex;
    display: -moz-flex;
    display: -ms-flex;
    display: -o-flex;
    display: flex;
    align-items: center;

}

.title {
  text-transform: uppercase;
  margin: 0;
  padding: 0 .6em 0 .2em;
  font-weight: 900;
  font-size: 2.6em;
  color: #ffffff;
}

</style>
