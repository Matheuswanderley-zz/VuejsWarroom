<template class="container">
  <div class="flex-grid">
    <div class="col vote">
      <p>{{ Tcontra }}</p>
      <span class="vote-negative">
        <votes-number :value="summary.contra || 0" />
      </span>
    </div>
    <div class="col vote">
      <p>{{ Tdiscordantes }}</p>
      <span class="vote-discord">
        <votes-number :value="summary.discordante || 0" />
      </span>
    </div>
    <div class="col vote">
      <p>{{ Tneutros }}</p>
      <span class="vote-neutral">
        <votes-number :value="summary.centro || 0" />
      </span>
    </div>
    <div class="col vote">
      <p>{{ Tconcordantes }}</p>
      <span class="vote-concordant">
        <votes-number :value="summary.concordante || 0" />
      </span>
    </div>
    <div class="col vote">
      <p>{{ TaFavor }}</p>
      <span class="vote-favor">
        <votes-number :value="summary.afavor || 0" />
      </span>
    </div>
  </div>
</template>




<script>
import VotesNumber from './Number'

export default {
  components: {
    VotesNumber,
  },
  props: {
    summary: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  data: function(){
    return {
      Tcontra: 'CONTRA',
      Tdiscordantes: 'DISCORDANTES',
      Tneutros: 'NEUTROS',
      Tconcordantes: 'CONCORDANTES',
      TaFavor: 'A FAVOR',
    }
  },

}
</script>
<style scoped>
  .flex-grid {
    display: flex;
    min-width: 100%;
    justify-content: space-between;
    align-items: center;
    flex-grow: 1;
    padding: 2.4vh 0.5vw 0 8vw;
  }
  .col {
    display: -webkit-flex;
    display: -moz-flex;
    display: -ms-flex;
    display: -o-flex;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #fff;
  }
  .vote {
    text-align: center;
  }
  .vote p {
    color: #c9c9c9;
  }
  .vote span {
    font-size: 3.3em;
    line-height: 0.6em;
    font-weight: 900;
  }

  .vote .vote-negative { color: #ff014f; }
  .vote .vote-discord { color: #f86786; }
  .vote .vote-neutral { color: #9b9b9b; }
  .vote .vote-concordant { color: #4db9ed; }
  .vote .vote-favor { color: #0072d2; }

</style>
