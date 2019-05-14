<template>
  <div class="sidebar">
    <div class="component votes-need">
      <p>{{ votesNeed }}</p>

      <!-- VOTES NEEDED -->
      <votes-needed
        class="total-votes"
        :votes="summary.necessarios"
      />
    </div>
    <hr noshade="noshade">

    <div class="component votes-need align-votes">
      <p>{{ aproveChance }}</p>

      <span
        v-if="withPercent"
        class="total-votes total-percent"
        v-html="withPercent"
      >
      </span>
      <span
        v-else
        class="no-prob"
      >
        Intenções de voto insuficientes
      </span>
    </div>

    <hr noshade="noshade">

    <div class="component votes-need align-votes">
      <p>EVOLUÇÃO</p>

      <!-- EVENTS CHART -->
        <events-chart class="sidebar-chart-wrapper"
          :gradient="true"
          :start-color="'#1077cd'"
          :end-color="'#f86786'"
        />

    </div>
  </div>
</template>




<script>

import VotesNeeded from './VotesNeeded.vue'
import EventsChart from './Charts/LineChart.vue'

export default {
  components: {
    VotesNeeded,
    EventsChart,
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
        votesNeed: 'VOTOS NECESSARIOS',
        aproveChance: 'CHANCE DE APROVAÇÃO',

        /* CHART DATA */
        events: {},
    }
  },
  computed: {
    withPercent() {
      if (isNaN(this.summary.probabilidade)) return null
      const prob = Math.round(this.summary.probabilidade)
      return `${prob < 1 ? '<small>&lt;</small>1' : prob}%`
    },
    eventsData() {
    }
  },
}
</script>
<style scoped>

.sidebar {
  display: flex;
  min-width: 100%;
  flex-direction: column;
  padding: 1vh 5.3vw 1vh 2.8vw;
}
.component {
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

hr {
  opacity:0.4; margin: 1em 0;
}

.votes-need p {
  font-size: 1.45em;
  font-weight: normal;
  color: #c9c9c9;
  margin: 1em 0 0;

}
.no-prob {
  color: #ffde00;
  line-height: 10em;
}
.total-percent{
  font-size: 7em;
  font-weight: 400;
  color: #ffde00;
  margin: 0;
}

.sidebar-chart-wrapper {
    position: relative;
    overflow: hidden;
    height: 17vh;
    max-width: 100%;
}

@media only screen and (min-width: 1600px) {
  hr {
    opacity:0.4; margin: 0.8em 0;
  }
  .sidebar {
    padding: 4.7vh 5.3vw 1vh 2.8vw;
  }
}

</style>
