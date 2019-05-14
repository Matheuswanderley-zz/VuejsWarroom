<script>
  import { Line, mixins } from 'vue-chartjs'
  import * as moment from 'moment'
  import 'moment/locale/pt-br'
  moment.locale('pt-BR')

  export default {
    extends: Line,
    props: {
      gradient: { type: Boolean },
      startColor: { type: String },
      endColor: { type: String },
    },
    data: function() {
      return {
        /* CHART OPTIONS */
        defaultOptions: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 500,
          },
          tooltips: {
            bodyFontFamily: 'Montserrat',
            footerFontColor: '#878787',
            footerFontSize: 11,
            titleMarginBottom: 10,
            footerMarginTop: 10,
            callbacks: {
              footer: (tooltipItem, data) => {
                const event = this.events[
                  tooltipItem[0] && tooltipItem[0].index
                ]
                if (!event) return ''
                return moment(event.created_at).format('DD/MM/YY HH:HH:ss')
              },
              label: (tooltipItem, data) => {
                const event = this.events[tooltipItem.index]
                if (!event) return tooltipItem.xLabel
                return ' ' + this.favorabilidades[event.favorabilidade].text
              },
              labelColor: (tooltipItem, chart) => {
                const event = this.events[tooltipItem.index]
                if (!event) return {}
                const color = this.favorabilidades[event.favorabilidade].color
                return {
                  borderColor: 'transparent',
                  backgroundColor: color,
                }
              },
            }            
          },
          legend: { display: false },
          scales: {
            yAxes: [{
              display : false,
              gridLines : {
                display : false,
              },
            }],
            xAxes: [{
              display : false,
              gridLines : {
                display : false,
              },
            }],
          },
          layout: {
            padding: {
              left: 10,
              right: 10,
              top: 10,
              bottom: 10,
            },
          },
        },

        favorabilidades: {
          contra: {
            text: 'Contra',
            color: '#ff014f',
          },
          discordante: {
            text: 'Discordante',
            color: '#f86786',
          },
          centro: {
            text: 'Neutro',
            color: '#9b9b9b',
          },
          concordante: {
            text: 'Concordante',
            color: '#4db9ed',
          },
          afavor: {
            text: 'A Favor',
            color: '#0072d2',
          },
        },   
        gradientStroke: null,
        events: Array(50).fill({ value: 0 }),        
      }
    },
    methods: {
      fetchData: function() {
        this.$api('mock-events', { limit: 50 })
          .then(({ data }) => {
            this.events = data.data
            this.render()
          })
          .catch(err => console.log(err))
      },
      render() {
        this.renderChart(this.chartData, this.options)        
      },
      setGradientLines() {
        const canvas = this.$el.querySelector('canvas')
        const ctx = canvas.getContext('2d')
        const boxH = this.$el.getBoundingClientRect().height
        this.gradientStroke = ctx.createLinearGradient(0, 0, 0, boxH)
        this.gradientStroke.addColorStop(0, this.startColor)
        this.gradientStroke.addColorStop(0.5, '#9b9b9b')
        this.gradientStroke.addColorStop(1, this.endColor)
      }
    },
    computed: {
      options() {
        return this.defaultOptions
      },
      chartData() {
        return {
          labels: this.events.map(d => `${d.nome} - ${d.siglaPartido}/${d.siglaUf}`),
          datasets: [{
            lineTension: .2,
            borderColor: this.gradientStroke || 'steelblue',
            pointBorderColor: this.gradientStroke || 'steelblue',
            pointBackgroundColor: this.gradientStroke || 'steelblue',
            pointHoverBackgroundColor: this.gradientStroke || 'steelblue',
            pointHoverBorderColor: this.gradientStroke || 'steelblue',
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 4,
            pointHitRadius: 7,
            data: this.events.map(d => d.value)
          }],
        }
      },
    },
    mounted () {
      if (this.gradient) {
        this.setGradientLines()
      }
      this.render()
      this.fetchData()
      this.$root.$on('newData', this.fetchData)
    },
  }  
</script>

<style scoped>
  
</style>