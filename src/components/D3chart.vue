<template>
  <div class="chart-wrapper">
    <!-- CHART COMPONENT -->
    <v-congress-chart
      :chart-data="chartData"
      :chart-options="chartOptions"
      @seatMouseenter="showSummary"
      @seatMouseleave="hideSummary"
      @seatClick="showDetals"
    />
    <div
      v-if="isSeatHovered"
      class="details"
    >
      <p>{{ seatHovered.nome }}</p>
    </div>
  </div>
</template>




<script>
  import io from 'socket.io-client'
  import deputados from '../assets/mocks/deputados'


  //const socket = io.connect('http://127.0.0.1:4001/');

  // socket.on('connect', function() {
  // socket.emit('deputados', 'im connected')
  //})
  export default {
    data: function() {
      return {
        // deputados: [],
        chartData: deputados,
        chartOptions: {
          selector: 'congress',
          mapParam: 'favorabilidade',
          groupParam: 'siglaPartido',
          layout: 'congress',
          aligned: true,
          cornerRadius: 2,
          innerRadiusCoef: 0.605,
          margin: '0',
          viewCongress: {
            margin: 0,
          },
          viewParties: {
            cornerRadius: 100,
          },
          enter: {
            fromCenter: false,
            smallToBig: true,
          },
          exit: {
            toCenter: false,
            bigToSmall: true,
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
    beforeMount: function() {
      // fetch('http://127.0.0.1:4001/deputados')
      // .then(response => {
      // this.deputados = response.data
      //console.log('>>>', response.data)
      // })
    },
    created() {
      //socket.on('deputados', data => {
      //this.deputados = data
      // })
    },
    methods: {
      getComments() {
        socket.emit('deputados')
      },
      setLayout(type) {
        if (this.chartOptions.layout === type) return
        return this.chartOptions.layout = type
      },
      showSummary(dep) {
        console.log(dep)
        this.isSeatHovered = true
        this.seatHovered = dep.data
      },
      hideSummary(dep) {
        this.isSeatHovered = false
        this.seatHovered = null
      },
      showDetals(dep) {
        this.isSeatSelected = true
        this.seaSelected = dep.data
      },
      hideDetals(dep) {
        this.isSeatSelected = false
        this.seaSelected = null
      },
    },
  }
</script>

<style>
  .chart-wrapper {
    width: 100%;
    height: 100%;
    color: #c9c9c9;
  }

  .chart {
    width: 90%;
    height: 74%;
  }

  .seat {
    cursor: pointer;
    /*transition: all 2000ms ease-out;*/
  }

  .seat.contra {
    fill: #ff014f
  }

  .seat.discordante {
    fill: #f86786
  }

  .seat.centro {
    fill: #9b9b9b
  }

  .seat.concordante {
    fill: #4db9ed
  }

  .seat.afavor {
    fill: #0072d2
  }

  .title {
    fill: #c9c9c9;
    font-weight: 500;
  }

  .btns {
    text-align: center;
    margin: 10px;
  }

  .btns button {
    background-color: #878787;
    border-radius: 3px;
    padding: 5px 10px;
    margin: 10px;
  }

  .btns button.selected {
    background-color: white;
  }
</style>
