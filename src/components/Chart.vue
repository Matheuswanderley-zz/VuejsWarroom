<template>
  <div class="chart-wrapper">
    <!-- IF -->
    <div
      v-if="(chartData && chartData.length)"
      class="chart-inner"
    >
      <!-- CHART COMPONENT -->
      <v-congress-chart
        :chart-data="chartData"
        :chart-options="chartOptions"
        @seat-mouseenter="showSummary"
        @seat-mouseleave="hideSummary"
        @seat-click="showDetals"
      />

      <div
        v-if="(isSeatHovered && chartOptions.layout === 'congress')"
        class="summary-wrapper"
      >
        <congressman-summary :congressman="seatHovered" />
      </div>
    </div>

    <!-- ELSE -->
    <div
      v-else
      class="loading"
    >
      <icon
        name="circle-notch"
        spin
        scale="6"
      />
      <p>Carregando</p>
    </div>
  </div>
</template>




<script>
  import CongressmanSummary from './Congressman/Summary'
  import axios from 'axios'


  export default {
    components: {
      CongressmanSummary,
    },
    props: [ 'chartData' ],
    data: function() {
      return {
        chartOptions: {
          selector: 'congress',
          mapParam: 'favorabilidade',
          layout: 'congress',
          aligned: true,
          cornerRadius: 2,
          innerRadiusCoef: 0.605,
          margin: '0 0 0 0',
          transition: 'middleEdges',
          viewCongress: {
            mapParam: 'favorabilidade',
            margin: 0,
          },
          custom: [
            {
              name: 'parties',
              groupParam: 'siglaPartido',
              mapParam: 'favorabilidade',
              cornerRadius: 2,
              map: [
                { h: 10, w: [1, 1, 1, 1, 1] },
                { h: 7, w: [1, 1, 1, 1, 1] },
                { h: 7, w: [2, 1, 1, 1, 1, 1, 1, 1, 1] },
                { h: 5, w: [1, 1, 1, 1, 1, 1, 1, .7, .7, .7, .7] },
              ],
            },
            {
              name: 'states',
              groupParam: 'siglaUf',
              mapParam: 'favorabilidade',
              cornerRadius: 2,
              map: [
                { h: 9, w: [1, 1, 1, 1] },
                { h: 7, w: [1, 1, 1, .8, .8, .8] },
                { h: 5, w: [1, 1, 1, 1, 1, .8, .8, .8] },
                { h: 5, w: [1, 1, 1, 1, 1, 1, .8, .8, .8] },
              ],
            },
          ],
          viewGrid: {
            mapParam: 'favorabilidade',
            cornerRadius: 2,
          },
          enter: {
            fromCenter: false,
            smallToBig: false,
          },
          exit: {
            toCenter: false,
            bigToSmall: false,
          },
        },
        /* COMP PROPS */
        isSeatHovered: false,
        seatHovered: null,
        seatSelected: null,
      }
    },
    computed: {
      btnCongressSelected() {
        return this.chartOptions.layout === 'congress'
      },
      btnPartiesSelected() {
        return this.chartOptions.layout === 'parties'
      },
    },
    mounted() {
      this.$root.$on('viewChanged', (val) => {
        if (this.chartOptions.layout === val) return
        this.chartOptions.layout = val
      })

      this.$root.$on('searching', this.searchCongressmen)
    },
    methods: {
      showSummary(dep) {
        this.isSeatHovered = true
        this.seatHovered = dep.data
      },
      hideSummary(dep) {
        this.isSeatHovered = false
        this.seatHovered = null
      },
      showDetals(dep) {
        if (this.seatSelected) {
          this.$set(this.seatSelected, 'selected', false)
        }
        this.seatSelected = dep.data
        this.$set(dep.data, 'selected', true)
        this.$emit('showDetals', dep.data)
      },
      searchCongressmen(val) {
        this.chartData.forEach(seat => {
          if (seat.nome.toUpperCase().includes(val.toUpperCase())) {
            this.$set(seat, 'noMatch', false)
          } else {
            this.$set(seat, 'noMatch', true)
          }
        })
      },
    },
  }
</script>

<style>

  @-webkit-keyframes popout {
    0% {
      stroke-width: 0px;
      opacity: .2;
    }
    12.5% {
      stroke-width: 2px;
      opacity: .4;
    }
    25% {
      stroke-width: 4px;
      opacity: .6;
    }
    37.5% {
      stroke-width: 6px;
      opacity: .8;
    }
    50% {
      stroke-width: 8px;
      opacity: 1;
    }
    62.5% {
      stroke-width: 4px;
      opacity: .8;
    }
    75% {
      stroke-width: 3px;
      opacity: .6;
    }
    87.5% {
      stroke-width: 2px;
      opacity: .4;
    }
    100% {
      stroke-width: 1px;
      opacity: .2;
    }
  }
  .chart-wrapper {
    position: relative;
    flex-grow: 1;
    display: -webkit-flex;
    display: -moz-flex;
    display: -ms-flex;
    display: -o-flex;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 3vh 0vw 0 9vw;
  }

  .loading, .chart-inner {
      height: 62vh;
  }

  .chart-inner {
    position: relative;
    flex-grow: 1;
    color: #c9c9c9;
    display: -webkit-flex;
    display: -moz-flex;
    display: -ms-flex;
    display: -o-flex;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .chart {
    width: 100%;
    height: 100%;
  }

  .seat {
    cursor: pointer;
    stroke-width: 0px;
    transition: opacity .3s, stroke-width .3s, fill .3s;
  }

  .seat.no-match {
    /*clip-path: circle(3px at center)*/
    clip-path: inset(4px 4px 4px 4px);
    opacity: .3!important;
  }

  .chart-wrapper .seat:hover,
  .chart-wrapper .seat.selected {
    stroke-width: 3px;
    stroke: #ffde00;
  }


  .chart-wrapper .seat.changed {
    -webkit-animation-name: popout;
    -webkit-animation-duration: 1s;
    -webkit-animation-iteration-count: 10;
  }

  .contra {
    color: #ff014f;
    background-color:#ff014f;
    fill: #ff014f;
    stroke: #ff014f;
  }

  .discordante {
    color: #f86786;
    background-color:#f86786;
    fill: #f86786;
    stroke: #f86786;
  }

  .centro {
    color: #9b9b9b;
    background-color:#9b9b9b;
    fill: #9b9b9b;
    stroke: #9b9b9b;
  }

  .concordante {
    color: #4db9ed;
    background-color:#4db9ed;
    fill: #4db9ed;
    stroke: #4db9ed;
  }

  .afavor {
    color: #0072d2;
    background-color:#0072d2;
    fill: #0072d2;
    stroke: #0072d2;
  }

  .title {
    fill: #c9c9c9;
    font-weight: 500;
  }

  .btns {
    text-align: center;
    margin: 10px;
  }

  .chart-wrapper .summary-wrapper {
    width: 36.9vw;
    height: 18.4vw;
    border-radius: 19vw 19vw 0 0;
    position: absolute;
    z-index: 1;
    top: 11.8vw;
    left: 50%;
    margin-left: -.8vw;
    transform: translate(-50%, 0);
    overflow: hidden;
  }
  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
    padding: 2.4vh 0.5vw 5vw 10vw;
  }
</style>
