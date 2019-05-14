const d3 = Object.assign({},
    require('d3-selection'))
import congressChart from './d3-congress'

const Congress = {
  install(Vue) {
    Vue.component('v-congress-chart', {
      props: {
        chartData: {
          type: Array,
          default: function() {
            return []
          },
        },
        chartOptions: {
          type: Object,
          default: function() {
            return {}
          },
        },
      },
      data() {
        return {
          selector: this.chartOptions.selector || 'congress',
        }
      },
      computed: {
        width() {
          return this.$el.parentElement.clientWidth -
            this.horizontalMargin
        },
        height() {
          return this.$el.parentElement.clientHeight -
            this.verticalMargin
        },
        horizontalMargin() {
          return this.normMargin[1] + this.normMargin[3]
        },
        verticalMargin() {
          return this.normMargin[0] + this.normMargin[2]
        },
        styleMargin() {
          return this.normMargin
            .reduce((a, b) => a + ` ${b}px`)
        },
        normMargin() {
          const margin = this.chartOptions.margin || 0
          const ms =  (Array.isArray(margin)
              ? margin
              : Number.isFinite(margin)
              ? [margin] : margin.split(' '))
            .map(m => parseFloat(m))
          return [
            ms[0],
            ('undefined' !== typeof ms[1] ? ms[1] : ms[0]),
            ('undefined' !== typeof ms[2] ? ms[2] : ms[0]),
            ('undefined' !== typeof ms[3] ? ms[3]
              : 'undefined' !== typeof ms[1] ? ms[1] : ms[0]),
          ]
        },
        styling() {
          return {
            margin: this.styleMargin,
          }
        },
      },

      watch: {
        chartData: {
          handler() {
            this.updateChart()
          },
          deep: true,
        },
        chartOptions: {
          handler() {
            this.refreshChart()
          },
          deep: true,
        },
      },
      mounted() {
        this.initalizeChart()
      },
      methods: {
        setEventListeners() {
          this.chart
            .on('click', d => this.$emit('seat-click', d))
            .on('mouseover', d => this.$emit('seat-mouseover', d))
            .on('mouseenter', d => this.$emit('seat-mouseenter', d))
            .on('mouseleave', d => this.$emit('seat-mouseleave', d))
            .on('mousemove', d => this.$emit('seat-mousemove', d))
            .on('mouseout', d => this.$emit('seat-mouseout', d))
            .on('mouseover', d => this.$emit('seat-mouseover', d))
        },

        /**
         * Generate a new Congress Chart
         * @memberOf Chart
         */
        initalizeChart() {
          const svg = d3.select(`#${this.selector}`)
                        .attr('width', this.width)
                        .attr('height', this.height)
          this.chart = congressChart()
          this.chart.init(this.chartData, this.chartOptions, svg)
          this.chart.render()
          this.setEventListeners()
        },
        /**
         * Redraw the Chart when the data is recycled
         * @memberOf Chart
         */
        refreshChart() {
          this.chart
            .setOptions(this.chartOptions)
            .render('refresh')
        },
        updateChart() {
          this.chart
            .updateChart(this.chartData)
        },
      },
      template:
        `<svg
          :style="styling"
          :id='this.chartOptions.selector'></svg>`,
    })
  },
}

export default Congress

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(Congress)
}