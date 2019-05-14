<template>
  <div id="app">
    <app-sound-toggler
      :is-on="sound"
      @sound-toggled="toggleSound"
    />
    <app-header :options-enabled="dataLoaded" />
    <div class="content">
      <div class="col col-left">
        <app-votes :summary="data.summary" />
        <app-chart
          :chart-data="data.congressmen"
          @showDetals="openDetails"
        />
      </div>

      <div class="col col-right">
        <app-total-votes
          :summary="data.summary"
          class="side-bar"
        />
      </div>

      <!-- DRAWER -->
      <congressman-details
        :congressman="congressmanSelected"
        :open="detailsOpened"
        @hideDetails="closeDetails"
      />
    </div>
  </div>
</template>

<script>
  import SoundToggler from './components/soundToggler.vue'
  import Header from './components/Header.vue'
  import Votes from './components/Votes.vue'
  import TotalVotes from './components/TotalVotes.vue'
  import Chart from './components/Chart.vue'
  import CongressmanDetails from './components/Congressman/Details.vue'

  import io from 'socket.io-client'
  import deputadosDin from './assets/mocks/deputados-din'


  // Create alert sound
  const audio = new Audio('./assets/ding.wav')

  /*const socket = io.connect('http://127.0.0.1:4001/')
    socket.on('connect', function() {
    socket.emit('deputados', 'im connected')
  })*/


  export default {
    name: 'App',
    components: {
      appSoundToggler: SoundToggler,
      appHeader: Header,
      appVotes: Votes,
      appTotalVotes: TotalVotes,
      appChart: Chart,
      CongressmanDetails,
    },
    data: function() {
      return {
        detailsOpened: false,
        congressmanSelected: {},
        sound: false,
        dataLoaded: false,
        data: {},
      }
    },
    created() {
      const mockUpdate = () => {
        deputadosDin()
          .then(data => {
            this.dataLoaded = true
            if (this.data.summary) {
              this.data.summary = data.summary
              this.data.congressmen.forEach((d, i) => {
                d.favorabilidade = data.congressmen[i].favorabilidade
              })
              this.$root.$emit('newData')
            } else {
              this.data = Object.assign({}, this.data, data)
            }
            this.notify()
            setTimeout(mockUpdate, 4000)
          })

      }
      // TESTIND DATA UPDATING
      mockUpdate()
      // END

      /*socket.on('deputados', data => {
      this.data = Object.assign({}, this.data, data)
     })*/
    },
    beforeMount: function() {
      // fetch('http://127.0.0.1:4001/deputados')
      // .then(response => {
      // this.deputados = response.data
      //console.log('>>>', response.data)
      // })

    },
    methods: {
      toggleSound() {
        this.sound = !this.sound
      },
      getComments() {
        socket.emit('deputados')
      },
      notify() {
        if (!this.sound || !audio) return
        const promise = audio.play()
        if (promise) {
          promise.then(_ => {
          }).catch(error => {
          })
        }
      },
      openDetails(dep) {
        this.congressmanSelected = dep
        this.detailsOpened = true
      },
      closeDetails() {
        this.detailsOpened = false
      },
    },
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Montserrat:300,400,500,700');

  * {
    box-sizing: border-box;
  }

  /* DEV */
  html {
    width: 1440px;
    overflow: scroll;    
  }

  body, html {
    height: 100%;
    margin: 0;
  }
  body {
    overflow: hidden;
    background: black url(assets/background.jpg) no-repeat center center fixed;
    /*background: black url(assets/offset-4.jpg) no-repeat center center fixed; */
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
  }

  #app {
    min-height: 100%;
    color: white;
    font-family: 'Montserrat', Helvetica, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .content {
    position: relative;
    display: -webkit-flex;
    display: -moz-flex;
    display: -ms-flex;
    display: -o-flex;
    display: flex;
    height: 87vh;
  }

  .col {
    display: -webkit-flex;
    display: -moz-flex;
    display: -ms-flex;
    display: -o-flex;
    display: flex;
    flex-grow: 1;
    height: 100%;
  }

  .col-left {
    min-height: 100%;
    flex-direction: column;
  }

  .col-right {
    max-width: 32.5vw;
  }

  .side-bar {
    flex-grow: 1;
  }

  @media only screen and (min-width: 1600px) {
    #app {
      font-size: 1.3em;
    }
  }

</style>
