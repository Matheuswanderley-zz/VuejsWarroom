<template>
  <div class="dep-summary">
    <div
      :class="congressman.favorabilidade"
      class="dep-summary-name"
    >
      <div
        :class="congressman.favorabilidade"
        class="picture"
      >
        <img :src="congressman.urlFoto">
      </div>
      <h3
        class="name"
        v-html="formatedName"
      />
    </div>

    <div class="dep-summary-info">
      <div class="col-left">
        <p>Partido: <strong>{{ congressman.siglaPartido }}</strong></p>
        <p>Estado: <strong>{{ congressman.estado || '' }}</strong></p>
      </div>
      <div class="vhr" />
      <div class="col-right">
        <p>Bancada: <strong>{{ congressman.bancada }}</strong></p>
        <p>Posição: <strong>{{ congressman.posicao }}</strong></p>
      </div>
    </div>
  </div>
</template>




<script>
  export default {
    props: {
      congressman: {
        type: Object,
      },
    },
    data: function() {
      return {
      }
    },
    computed: {
      formatedName() {
        const parts = this.congressman.nome.split(' ')
        const lIdx = parts.length - 1
        return lIdx < 1
          ? parts[0]
          : `${parts[0]}<br />${parts[lIdx]}`
      },
    },
  }
</script>

<style>
  .dep-summary {
    display: -webkit-flex;
    display: -moz-flex;
    display: -ms-flex;
    display: -o-flex;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .vhr {
    width: 1px;
    min-height: 100%;
    background-color: white;
    opacity:0.4;
    margin: 0 1em;
  }

  .dep-summary-name, .dep-summary-info {
    display: -webkit-flex;
    display: -moz-flex;
    display: -ms-flex;
    display: -o-flex;
    display: flex;
    flex-direction: row;
  }

  .dep-summary .dep-summary-name {
    margin-top: 73px;
    height: 67px;
    align-items: center;
    border-radius: 33.5px 10px 10px 33.5px;
    border: 1px solid;
    background-color: rgba(255, 255, 255, .1);
  }

  .dep-summary .picture {
    border-radius: 100%;
    border: 5px solid;
    overflow: hidden;
    width: 67px;
    height: 100%;
    background: url(/assets/no-user-image-square.jpg);
    background-size: 100%;
  }

  .dep-summary .picture img {
    display: block;
    margin: -2px 0 0 -2px;
    width: calc(100% + 4px);
  }

  .dep-summary h3 {
    margin: 0 0.6em;
    color: white;
    text-transform: capitalize;
    font-weight: 900;
    font-size: 1.4em;
    min-width: 4em;
  }

  .dep-summary-info {
    margin-top: 2.5em;
  }
  .dep-summary-info div {
    flex-grow: 1;
  }
  .dep-summary .col-left {
    text-align: right;
  }
  .dep-summary .col-right {
    text-align: left;
  }
  .dep-summary-info p {
    margin: 0;
    color: #bababa;
  }
  .dep-summary-info p strong {
    color: white;
  }

  @media only screen and (min-width: 1600px) {
    .dep-summary h3 {
      font-size: 1em;
    }
  }
</style>
