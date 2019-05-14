<template>
  <form
    class="search-bar"
    action="#"
    @submit.prevent=""
  >
    <label
      :data-state="state"
      for="search"
    >
      <input
        v-model="search"
        type="text"
        placeholder="Deputados"
        @keyup="emitSearch"
        @change="emitSearch"
        @click="state='open'"
        @keyup.esc="close"
        @blur="close"
      >
      <!-- <input type="text" placeholder="Search" @click="state='open'"/> -->
      <icon
        name="search"
        aria-hidden="true"
        @click=""
      />
    </label>
  </form>
</template>


<script>
  import _ from 'lodash'
  export default {
    data: function() {
      return {
        state: 'close',
        search: '',
      }
    },
    methods: {
      close() {
        return this.state = this.search.length ? 'open' : 'close'
      },
      emitSearch: _.debounce(function() {
        return this.$root.$emit('searching', this.search)
      }, 300),
    },
  }
</script>

<style>
  .search-bar form {
    flex-grow: 1;
  }
  .search-bar label {
    position: relative;
    display: inline-block;
    background-color: transparent;
    padding: 0;
    transition: all .5s ease;
    border-radius: 0;
    border: 1px solid rgba(255, 255, 255, 0);
  }
  .search-bar label::after {
    content: '';
    display: block;
    height: 1px;
    width: 80%;
    background-color: white;
    transition: all .3s ease 0.3s;
  }
  .search-bar label input {
    transition: width .5s ease, opacity 0.3s ease 0.3s;
    opacity: 1;
    width: 180px;
    height: 25px;
    padding-right: 35px;
    border: 0;
    font-size: 1.1em;
    background-color: transparent;
    outline: none;
    color: #c8c8c8;
    text-transform: uppercase;
  }
  .search-bar label svg {
    position: absolute;
    top: 11px;
    right: 11px;
    color: white;
    cursor: pointer;
  }
  .search-bar label[data-state="close"] {
    border-radius: 30px;
    padding: 5px 5px;
    transition: all .5s ease;
    border: 1px solid rgba(255, 255, 255, .8);

  }
  .search-bar label[data-state="close"]::after {
    width: 0%;
    transition: all 0.3s ease;
  }
  .search-bar label[data-state="close"] svg {
    pointer-events: none;
  }
  .search-bar label[data-state="close"] input {
    width: 28px;
    height: 25px;
    padding-right: 0;
    opacity:0;
    cursor: pointer;
    transition: opacity 0.3s ease, width .5s ease;
    -webkit-appearance:none
  }


</style>