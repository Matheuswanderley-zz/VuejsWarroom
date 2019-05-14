// let d3 = Object.assign({},
//     require('d3-selection'))
const d3 = require('d3')
const _ = require('lodash')

const Congress = function() {

  /* OPTIONS */
  let opts = {
    width: null,
    height: null,
    aligned: false,
    cornerRadius: 0,
    layout: 'congress',
    innerRadiusCoef: 0.4,
    transition: 'random',

    viewCongress: {
      mapParam: '',
      margin: 0,
    },

    viewGrid: {
      mapParam: '',
      groupParam: '',
      margin: 0,
      map: [
        { h: 10, w: [1, 1, 1, 1, 1] },
        { h: 7, w: [1, 1, 1, 1, 1] },
        { h: 7, w: [2, 1, 1, 1, 1, 1, 1, 1, 1] },
        { h: 5, w: [1, 1, 1, 1, 1, 1, 1, .7, .7, .7, .7] },
      ],
      outerMg: 25,
      textSz: 14,
      textMg: 10,
      textFont: 'Montserrat',
      seatPad: 2,
      gridMB: 20,
      cornerRadius: 0,
    },
    /* animations */
    enter: {
      'smallToBig': true,
      'fromCenter': true,
    },
    update: {
      'animate': true,
    },
    exit: {
      'bigToSmall': true,
      'toCenter': true,
    },
    customLayouts: {},
  }

  let dispatch
  const events = [
    'click', 'dblclick', 'mousedown',
    'mouseenter', 'mouseleave', 'mousemove',
    'mouseout', 'mouseover', 'mouseup',
    'touchcancel', 'touchend', 'touchmove',
    'touchstart',
  ]

  /* generate seats list with cartesian and polar coordinates for each seat */
  function parliamentViewPositions() {
    const seats = []
    const { maxSeatNumber, nRows, b } = calcMaxSeatNumber(opts)
    const rowWidth = (opts.outerParliamentRadius - opts.innerParliementRadius) / nRows
    const seatsToRemove = maxSeatNumber - opts.nSeats
    let k = 0
    for (let i = 0; i < nRows; i++) {
      const rowRadius = opts.innerParliementRadius + rowWidth * (i + 0.5)
      const rowSeats = opts.aligned
        ? Math.ceil(opts.nSeats / nRows)
        : Math.floor(Math.PI * (b + i))
          - Math.floor(seatsToRemove / nRows)
          - (seatsToRemove % nRows > i ? 1 : 0)

      const anglePerSeat = Math.PI / rowSeats
      for (let j = 0; j < rowSeats; j++) {
        if (k >= opts.nSeats) break
          const s = {}
        s.polar = {
          rw: rowWidth,
          r: rowRadius,
          teta: -Math.PI + anglePerSeat * (j + 0.5),
        }
        s.rotation = 180 / (rowSeats - 1) * j
        s.cartesian = {
          x: s.polar.r * Math.cos(s.polar.teta),
          y: s.polar.r * Math.sin(s.polar.teta),
        }
        seats.push(s)
        k++
      }
    }
    /* sort the seats by angle */
    seats.sort((a, b) => a.polar.teta - b.polar.teta || b.polar.r - a.polar.r)

    return seats
  }

  function calcMaxSeatNumber() {
    let nRows = 0
    let maxSeatNumber = 0
    let b = 0.5
    const a = opts.innerRadiusCoef / (1 - opts.innerRadiusCoef)
    while (maxSeatNumber < opts.nSeats) {
      nRows++
      b += a
      /* NOTE: the number of seats available in each row depends on the total number
      of rows and floor() is needed because a row can only contain entire seats. So,
      it is not possible to increment the total number of seats adding a row. */
      maxSeatNumber = series(function(i) {
        return Math.floor(Math.PI * (b + i))
      }, nRows-1)
    }
    return { maxSeatNumber, nRows, b }
  }

  function groupAndSort(d, groupParam) {
      const totalGrouped = _.countBy(d, groupParam)
      return _.chain(totalGrouped)
        .map((c, k) => {
          return { group: k, count: c }
        })
        .sortBy('count')
        .value()
        .reverse()
  }

  function calculateGridSeatSize(sortedGroups, gridBoundingBoxes) {
      const numItems = sortedGroups[0] && sortedGroups[0].count || 0
      const rectWidth = gridBoundingBoxes[0][1][0] - gridBoundingBoxes[0][0][0]
      const rectHeight = gridBoundingBoxes[0][1][1] - gridBoundingBoxes[0][0][1]

      const tableRatio = rectWidth / rectHeight
      const columns = Math.ceil(Math.sqrt(numItems * tableRatio))
      // const rows = Math.ceil(columns / tableRatio)

      return rectWidth / columns
  }

  function calcGridBoundingBoxes(layout) {

    const { outerMg, textSz, textMg, gridMB, map } = layout
    const { width, height } = opts
    const nmRows = map.length
    const rowSlices = map.reduce((a, b) => a + b.h, 0)
    const offsetTop = textSz + textMg
    const totalH = height - gridMB -
      outerMg * (nmRows - 1) - offsetTop * nmRows

    let accY = 0
    const gridBoundingBoxes = []

    map.forEach((row, i) => {
      const cols = row.w
      const nmCols = cols.length
      const colSlices = cols.reduce((a, b) => a + b, 0)
      const totalW = width - outerMg * (nmCols - 1)

      const rowHeight = totalH / rowSlices * row.h
      const mgTop = i ? outerMg : 0
      const y = accY + mgTop + offsetTop
      let x = 0
      cols.forEach((cell, i) => {
        const mgleft = i ? outerMg : 0
        const colWidth = totalW / colSlices * cell
        const x1 = x + mgleft
        const x2 = x1 + colWidth
        const y1 = y
        const y2 = y + rowHeight
        gridBoundingBoxes.push([[x1, y1], [x2, y2]])
        x = x2
      })
      accY = y + rowHeight
    })

    return gridBoundingBoxes
  }

  function calcGridPositions(layout) {
    const { 
      gridBoundingBoxes: boxes,
      sortedGroups: groups,
      gridSeatSize: seatSize,
    } = layout.conf
    const positions = {}
    boxes.forEach((box, i) => {
      if (!groups[i]) return
      const g = groups[i]
      const seats = []
      const numSeats = groups[i].count
      const x1 = box[0][0]
      const y1 = box[0][1]
      const x2 = box[1][0]
      let x = x1
      let y = y1
      let k = 0
      while (k < numSeats) {
        seats.push({
          x: x + layout.seatPad,
          y: y + layout.seatPad,
          size: seatSize - layout.seatPad * 2 })
        x += seatSize
        if (x >= x2 - 1) {
          x = x1
          y += seatSize
        }
        k++
      }
      g.idx = 0
      g.seats = seats
      positions[g.group] = g
    })
    return positions
  }

  function countSeats(d) {
    if (!d.length) return 0
    if (!d[0].seats) return d.length
    let nSeats = 0
    d.forEach(p => {
      nSeats += (typeof p.seats === 'number')
        ? Math.floor(p.seats)
        : p.seats.length
    })
    return nSeats
  }

  function seatGridPosition(seat, layout) {
    const { gridPositions } = layout.conf
    const box = gridPositions[seat.data[layout.groupParam]]
    const seatPos = box.seats[box.idx]
    box.idx++
    return seatPos
  }

  function bindPositions(seats, data, layout) {
    /* fill the seat objects with data of its groupedParam and of itself if existing */
    const { name } = layout
    let seatIndex = 0
    if (!data.length || !data[0].seats) {
      // Congressman list merge strategy
      seats.forEach(function(s, i) {
        s.data = data[i]
        if (!s.layouts) s.layouts = {}
        if (!s.layouts[name]) s.layouts[name] = {}
        s.layouts[name].pos = seatGridPosition(s, layout)
        seatIndex++
      })

    } else {
      // Grouped params merge strategy
      let gridIndex = 0
      seats.forEach(function(s) {
        let grid = data[gridIndex]
        const nSeatsInGrid = typeof grid.seats === 'number' ? grid.seats : grid.seats.length
        if (seatIndex >= nSeatsInGrid) {
          gridIndex++
          seatIndex = 0
          grid = data[gridIndex]
        }

        /* set grid data */
        s.grid = grid
        s.data = typeof grid.seats === 'number' ? null : grid.seats[seatIndex]
        seatIndex++
      })

    }
  }

  /*function bindGridPositions(seats, gridBoundingBoxes, sortedGroups) {
    gridBoundingBoxes.forEach((box, i) => {
      const numSeats = sortedGroups[i].count
      const x1 = box[0][0]
      const y1 = box[0][1]
      const x2 = box[1][0]
      const y2 = box[1][1]
      let x = x1
      let y = y1
      let k = 0
      while (k < numSeats) {
        seats.push({
          x: x + opts.seatPad,
          y: y + opts.seatPad,
          size: squareSize - opts.seatPad * 2 })
        x += squareSize
        if (x >= x2 - 1) {
          x = x1
          y += squareSize
        }
        k++
      }
    })
  }*/

  function series(s, n) {
    let r = 0
    for (let i = 0; i <= n; i++) {
      r+=s(i)
    }
    return r
  }

  function getLayout() {
    return opts.customLayouts[opts.layout] 
      || opts.viewCongress
  }


  /* CLASS MODEL */
  return {
    data: [],

    layouts: {
      congress: 'renderCongress',
      parties: 'renderParties',
      map: 'renderMap',
    },

    width(value) {
      if (!arguments.length) return opts.width
      opts.width = parseFloat(value)
      return this
    },

    // Read only
    height() {
      return opts.height
    },

    innerRadiusCoef(value) {
      if (!arguments.length) return opts.innerRadiusCoef
      opts.innerRadiusCoef = parseFloat(value)
      return this
    },

    aligned(value) {
      if (!arguments.length) return opts.aligned
      opts.aligned = !!value
      return this
    },

    cornerRadius(value) {
      if (!arguments.length) return opts.cornerRadius
      opts.cornerRadius = parseFloat(value)
      return this
    },

    mapParam(value, layout) {
      if (!layout || !opts.customLayouts[layout]) {
        opts.viewCongress.mapParam = value
      }
      opts.customLayouts[layout].mapParam = value
      return this
    },

    groupParam(value, layout) {
      if (!layout || !opts.customLayouts[layout]) {
        opts.viewCongress.groupParam = value
      }
      opts.customLayouts[layout].groupParam = value
      return this
    },

    layout(type) {
      if (!arguments.length) return opts.layout
      opts.layout = type
      return this
    },

    transition(type) {
      if (!arguments.length) return opts.transition
      opts.transition = type
      return this
    },

    enter: {
      smallToBig(value) {
        if (!arguments.length) return opts.enter.smallToBig
        opts.enter.smallToBig = value
        return this.enter
      },
      fromCenter(value) {
        if (!arguments.length) return opts.enter.fromCenter
        opts.enter.fromCenter = value
        return this.enter
      },
    },

    update: {
      animate(value) {
        if (!arguments.length) return opts.update.animate
        opts.update.animate = value
        return this.update
      },
    },

    exit: {
      bigToSmall(value) {
        if (!arguments.length) return opts.exit.bigToSmall
        opts.exit.bigToSmall = value
        return this.exit
      },
      toCenter(value) {
        if (!arguments.length) return opts.exit.toCenter
        opts.exit.toCenter = value
        return this.exit
      },
    },

    transitions: {
      random(max) {
        return () => Math.random() * max
      },

      linear(interval) {
        return (d, i, t) => {
          const l = t.length
          return i * (interval / l)
        }
      },

      middleEdges(interval) {
        return (d, i, t) => {
          const l = t.length, h = l / 2, q = h / 2, tq = q + h
          return (i <= h ? i <= q
            ? i : h - i : i <= tq
            ? i - h : l - i) * (interval / l * 4)
        }
      },

      none(interval) {
        return () => interval
      },
    },

    on(type, callback) {
      this._parliamentDispatch().on(type, callback)
      return this
    },

    off() {
      d3.dispatch(...events, null)
      dispatch = null
      return this
    },

    bindEvents() {
      this.off()
      /* squares catch mouse and touch events */
      for (const evt in this._parliamentDispatch()._) {
        const that = this
        ;(evt => {
          this.$seats.on(evt, e => that._parliamentDispatch().call(evt, that, e))
        })(evt)
      }
      return this
    },

    svgInstance() {
      return typeof this.$el === 'string'
        ? d3.select(this.$el)
        : this.$el
    },



    init(data = [], config = {}, selector) {
      this.$el = selector || config.selector || 'svg'
      this.setOptions(config, true)

      this.$svg = this.svgInstance()
      this.cacheMapParam(data)
      this.data = this.calculate(data)
      this.createElements()
      this.bindEvents()
      return this
    },

    setOptions(config, init) {
      if (Array.isArray(config.custom) && init) {
        config.custom.forEach((l, i) => {
          const defOpts = _.merge({}, opts.viewGrid)
          if (!l.name) l.name = `custom-${i}`
          if (l.map) delete defOpts.map
          opts.customLayouts[l.name] = 
            _.merge({}, defOpts, l)
        })
        delete config.custom
      }
      opts = _.merge({}, opts, config)
      return this
    },

    cacheMapParam(data) {
      this.__old__ = _.map(data, opts.mapParam)
      return this
    },

    createElements() {
      const svg = this.$svg
      let container = this.$svg.select('.parliament')
      if (container.empty()) {
        container = svg.append('g')
        container.classed('parliament', true)
      }
      container.attr(
        'transform',
        `translate(${opts.width / 2}, ${opts.outerParliamentRadius})`
      )

      this.$container = container

      this.$placeholders = this.$container
        .selectAll('.seat')
        .data(this.data)

      this.$seats = this.$placeholders.enter().append('rect')
      this.$titles = {}
      for (const l in opts.customLayouts) {
        const layout = opts.customLayouts[l]
        const $title = this.$container
          .selectAll(`.title.title-${layout.name}`)
          .data(layout.conf.sortedGroups)
          .enter().append('text')
          .attr('class', `title title-${layout.name}`)
        this.$titles[layout.name] = $title
      }

      return this
    },

    calculate(data) {

      // if user did not provide, fill the svg:
      opts.width = opts.width
        ? opts.width
        : this.$svg.node().getBoundingClientRect().width

      opts.height = opts.height
        ? opts.height
        : this.$svg.node().getBoundingClientRect().height

      opts.halfW = opts.width
        ? opts.width / 2
        : this.$svg.node().getBoundingClientRect().width/2

      opts.outerParliamentRadius = Math.min(opts.width / 2, opts.halfW)
      opts.innerParliementRadius = opts.outerParliamentRadius * opts.innerRadiusCoef

      /***
      * compute number of seats and rows of the parliament */
      opts.nSeats = countSeats(data)

      const seats = parliamentViewPositions()


      for (const n in opts.customLayouts) {
        const layout = opts.customLayouts[n]
        layout.conf = {}
        layout.conf.sortedGroups = groupAndSort(data, layout.groupParam)
        layout.conf.gridBoundingBoxes = calcGridBoundingBoxes(layout)
        layout.conf.gridSeatSize = calculateGridSeatSize(
          layout.conf.sortedGroups,
          layout.conf.gridBoundingBoxes
        )
        layout.conf.gridPositions = calcGridPositions(layout)
        bindPositions(seats, data, layout)
      }
      return seats
    },

    recalculate(data) {
      this.data = this.calculate(data)
      return this
    },

    updateChart(data) {
      const layout = getLayout()
      this.$seats
        .attr('class', (d, i) => {
          const classes = [
            this._seatClasses(d),
            d.data[layout.mapParam] !== this.__old__[i] ? 'changed' : '',
          ]
          return classes.join(' ')
        })
      this.cacheMapParam(data)
    },

    render(type) {
      const refresh = type === 'refresh'
      const renderFunc = opts.layout === 'congress' ?
        'renderCongress' : 'renderGrid'
      this[renderFunc](refresh)
      return this

    },

    renderCongress(refresh) {

      const seatX = d => d.cartesian.x - seatRadius(d) / 2
      const seatY = d =>d.cartesian.y - seatRadius(d) / 2
      const seatRadius = d => {
        let r = 0.7 * d.polar.rw
        if (d.data && typeof d.data.size === 'number') {
          r *= d.data.size
        }
        return r
      }
      const seatRotation = d => {
        return 'rotate(' + d.rotation + ' ' + d.cartesian.x + ' ' + d.cartesian.y + ')'
      }
      const seatTransform = d => {
        return `${seatRotation(d)} translate(${seatX(d)}, ${seatY(d)})`
      }

      const transition = this.transitions[
        opts.viewCongress.transition || opts.transition
      ] || this.transitions.random

      // Update artributes
      this.$seats
        .attr('class', this._seatClasses)

        if (!refresh) {
          this.$seats
            .attr('x', 0)
            .attr('y', 0)
            .style('opacity', opts.enter.smallToBig ? 0 : 1)
            .attr('width', opts.enter.smallToBig ? 0 : seatRadius)
            .attr('height', opts.enter.smallToBig ? 0 : seatRadius)
            .attr('rx', opts.cornerRadius)
            .attr('ry', opts.cornerRadius)
        }
        this.$seats
          .transition().duration(transition(1500))
          .ease(d3.easeSin)
          .attr('transform', seatTransform)
          .attr('width', seatRadius)
          .attr('height', seatRadius)
          .attr('rx', opts.cornerRadius)
          .attr('ry', opts.cornerRadius)

        this.$container
          .selectAll('.title')
          .transition()
          .duration(300)
          .style('opacity', 0)
    },

    renderGrid(refresh) {

      const layout = opts.customLayouts[opts.layout]
      if (!layout) throw Error(`Unknown layout (${opts.layout})`)
      const lName = layout.name
      const { seatPad, textMg, textSz, textFont, cornerRadius } = layout
      const boxes = layout.conf.gridBoundingBoxes
      const ofsX = opts.width / 2
      const ofsY = opts.outerParliamentRadius
      const seatX = d => d.layouts[lName].pos.x - ofsX
      const seatY = d => d.layouts[lName].pos.y - ofsY
      const boxWidth = d => d.layouts[lName].pos.size
      const boxHeight = d => d.layouts[lName].pos.size
      const titleX = (d, i) => boxes[i][0][0] + seatPad - ofsX
      const titleY = (d, i) => boxes[i][0][1] - textMg - ofsY
      const titleContent = d => d.group.slice(0, 5)
      const seatRotation = () => 'rotate(0 0 0)'
      const seatTransform = d => {
        return `${seatRotation(d)} translate(${seatX(d)}, ${seatY(d)})`
      }

      const transition = this.transitions[
        opts.viewGrid.transition
        || opts.transition
      ] || this.transitions.random

      // Update Atributes
      this.$seats
        .attr('class', this._seatClasses)

      if (!refresh) {
        this.$seats
          .attr('x', 0)
          .attr('y', 0)
          .attr('width', boxWidth)
          .attr('height', boxHeight)
          .attr('rx', cornerRadius)
          .attr('ry', cornerRadius)
      }
      this.$seats
        .transition().duration(transition(1500))
        .ease(d3.easeSin)
        .attr('transform', seatTransform)
        .attr('width', boxWidth)
        .attr('height', boxHeight)
        .attr('rx', cornerRadius)
        .attr('ry', cornerRadius)

      this.$titles[lName]
        .attr('x', titleX)
        .attr('y', titleY)
        .attr('font-size', textSz)
        .attr('font-family', textFont)
        .text(titleContent)
        .style('opacity', 0)

      this.$container
        .selectAll('.title')
        .transition()
        .duration(300)
        .style('opacity', 0)

        const t = this.$titles[lName]
          .transition()
          .delay(800)
          .duration(300)

        t.style('opacity', 1)
    },

    _seatClasses(d) {
      let c = 'seat '
      if (d.party) {
        c += (d.party && d.party.id) || ''
      } else {
        c += d.data[getLayout().mapParam] || ''
      }
      if (d.data.selected) {
        c += ' selected'
      }
      if (d.data.noMatch) {
        c += ' no-match'
      }
      return c.trim()
    },

    _parliamentDispatch() {
      if (!dispatch) {
        dispatch = d3.dispatch(...events)
      }
      return dispatch
    },
  }
}

export default Congress
