<template>
  <div
    :class="{ opened: open }"
    class="drawer"
  >
    <!-- CLOSE BTN -->
    <span @click="close" class="close-btn">
      <icon
        name="times"
        scale="2"
      />
    </span>

    <!-- CONTENT -->
    <div class="dep-details">
      <div class="dep-info">
        <!-- DETAILS -->
        <div
          :class="congressman.favorabilidade"
          class="dep-details-name"
        >
          <div
            :class="congressman.favorabilidade"
            class="picture"
          >
            <img :src="congressman.urlFoto">
          </div>
          <h3 class="name">
            {{ congressman.nome }}
          </h3>
        </div>

        <div class="dep-details-info">
          <div class="col-left">
            <p><strong>{{ congressman.siglaPartido }}</strong></p>
          </div>
          <div class="vhr" />
          <div class="col-right">
            <p><strong>{{ congressman.estado || 'SP' }}</strong></p>
            <p><strong>{{ congressman.posicao || 'Governo' }}</strong></p>
          </div>
        </div>

        <span
          :class="congressman.favorabilidade"
          class="label"
        >
          {{ textFavorabilidade }}
        </span>
      </div>

      <!-- LAST POSTS -->
      <div class="dep-posts">
        <h4>Últimas Declarações</h4>
        <hr noshade="noshade">

        <congressman-posts :user="congressman" />
      </div>
    </div>
  </div>
</template>




<script>
  import CongressmanPosts from './Posts.vue'

  export default {
    components: {
      CongressmanPosts,
    },
    props: {
      congressman: {
        type: Object,
      },
      open: {
        type: Boolean,
        default: false,
      },
    },
    data: function() {
      return {
        favorabilidadeTexts: {
          afavor: 'A Favor',
          concordante: 'Concordante',
          centro: 'Neutro',
          discordante: 'Discordante',
          contra: 'Contra',
        },
      }
    },
    computed: {
      textFavorabilidade() {
        return this.favorabilidadeTexts[this.congressman.favorabilidade]
      },
    },
    methods: {
      close() {
        this.$set(this.congressman, 'selected', false)
        this.$emit('hideDetails')
      },
    },
  }
</script>

<style>
  .drawer {
    color: white;
    position: absolute;
    top: -1px;
    right: -31vw;
    width: 30vw;
    height: 100%;
    background-color: black;
    /*background-color: rgba(0, 0, 0, .5);*/
    border-top: 1px solid #525252;
    border-left: 1px solid #525252;
    transition: right .2s;

  }

  .drawer.opened {
    right: 0;
  }

  .drawer h4 {
    text-align: center;
    text-transform: uppercase;
    font-size: 1.45em;
    font-weight: normal;
    color: #c9c9c9;
    margin: 1.5em 0 0;
  }

  .close-btn {
    position: absolute;
    top: 1em;
    right: 1em;
    cursor: pointer;
  }

  .dep-details {
    min-width: 100%;
    max-width: 100%;
    height: 100%;
    padding: 2em 1.5em .5em;
    display: inline-block;
    overflow: scroll;
  }

  .dep-info {
    min-width: 100%;
    display: -webkit-flex;
    display: -moz-flex;
    display: -ms-flex;
    display: -o-flex;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
  }

  .vhr {
    width: 1px;
    min-height: 100%;
    background-color: white;
    opacity:0.4;
    margin: 0 1em;
  }

  .dep-details-name, .dep-details-info {
    display: -webkit-flex;
    display: -moz-flex;
    display: -ms-flex;
    display: -o-flex;
    display: flex;
    flex-direction: row;
  }

  .dep-details-name {
    margin-top: 1.5em;
    align-items: center;
    background-color: transparent;
  }

  .dep-details-name .picture {
    border-radius: 100%;
    border: 5px solid;
    overflow: hidden;
    width: 75px;
    height: 75px;
    background: url(/assets/no-user-image-square.jpg);
    background-size: 100%;
  }

  .dep-details-name .picture img {
    display: block;
    margin: -2px 0 0 -2px;
    width: calc(100% + 4px);
  }

  .dep-details-name h3 {
    margin: 0 0.6em;
    color: white;
    text-transform: capitalize;
    font-weight: 900;
    font-size: 1.6em;
    max-width: 7em;
  }

  .dep-details-info {
    margin-top: 1em;
  }
  .dep-details-info div {
    flex-grow: 1;
  }
  .dep-details .col-left {
    text-align: right;
  }
  .dep-details .col-right {
    text-align: left;
  }
  .dep-details-info p {
    margin: 0;
    color: #bababa;
  }
  .dep-details .col-left p {
    font-size: 2em;
  }

  .dep-details .label {
    font-weight: 700;
    color: white;
    padding: 3px 6px;
    border-radius: 4px;
    font-size: .9em;
    margin-top: 2em;
  }

  .dep-details .line-chart {
    text-align: center;
  }

  .dep-details hr {
    opacity: 0.4;
    margin: 1.5em 3em;
  }

  .drawer u {
    text-decoration: none;
  }

</style>
