import { arrayFrom } from './common'
import { dateCount } from './common/date'

const rangeNames = ['year', 'month', 'date', 'hour', 'minute']
const columnNames = ['FullYear', 'Month', 'Date', 'Hours', 'Minutes']

Component({
  properties: {
    startAt: {
      type: null,
      value: '2000/01/01 00:00',
      observer() {
        this._init()
      }
    },

    endAt: {
      type: null,
      value: '2099/12/31 23:59',
      observer() {
        this._init()
      }
    },

    hourStart: {
      type: Number,
      value: 0
    },

    hourEnd: {
      type: Number,
      value: 23
    },

    minuteStep: {
      type: Number,
      value: 1
    },

    hourStep: {
      type: Number,
      value: 1
    },

    dateStep: {
      type: Number,
      value: 1
    },

    monthStep: {
      type: Number,
      value: 1
    },

    yearStep: {
      type: Number,
      value: 1
    }
  },

  data: {
    ranges: [[], [], [], [], []]
  },

  methods: {
    _init() {
      const { startAt, endAt } = this.data
      this._value = Array(5).fill(0)

      this._initStartAt(startAt)
      this._initEndAt(endAt)
      this._initRanges()

      this._inited = true
    },

    _initStartAt(startAt) {
      this._startAt = new Date(startAt)

      this._startAtYear = this._startAt.getFullYear()
      this._startAtMonth = this._startAt.getMonth() + 1
      this._startAtDate = this._startAt.getDate()
      this._startAtHour = this._startAt.getHours()
      this._startAtMinute = this._startAt.getMinutes()
    },

    _initEndAt(endAt) {
      this._endAt = new Date(endAt)

      this._endAtYear = this._endAt.getFullYear()
      this._endAtMonth = this._endAt.getMonth() + 1
      this._endAtDate = this._endAt.getDate()
      this._endAtHour = this._endAt.getHours()
      this._endAtMinute = this._endAt.getMinutes()
    },

    _initRanges() {
      const yearRange = this._yearRange()
      this.setData({ 'ranges[0]': yearRange })

      for (let i = 0; i < 4; ++i) {
        this.handleColumnChange({ detail: { column: i, value: 0 } })
      }
    },

    _isSame(column, date, compared) {
      if (column < 0) {
        return true
      }

      if (!this._isSame(column - 1, date, compared)) {
        return false
      }

      const colName = columnNames[column]
      return compared[`get${colName}`]() === date[`get${colName}`]()
    },

    _yearRange() {
      return arrayFrom(
        this._startAtYear,
        this._endAtYear,
        this.data.yearStep
      ).map(y => `${y}年`)
    },

    _monthRange(sameAsStart, sameAsEnd) {
      return arrayFrom(
        sameAsStart ? this._startAtMonth : 1,
        sameAsEnd ? this._endAtMonth : 12,
        this.data.monthRange
      )
        .map(m => String(m).padStart(2, '0'))
        .map(m => `${m}月`)
    },

    _dateRange(sameAsStart, sameAsEnd) {
      return arrayFrom(
        sameAsStart ? this._startAtDate : 1,
        sameAsEnd ? this._endAtDate : (() => {
          const value = this.value()
          return dateCount(value.getFullYear(), value.getMonth() + 1)
        })(),
        this.data.dateRange
      )
        .map(d => String(d).padStart(2, '0'))
        .map(d => `${d}日`)
    },

    _hourRange(sameAsStart, sameAsEnd) {
      const { hourStart, hourEnd } = this.data

      let head = sameAsStart ? this._startAtHour : 0
      let tail = sameAsEnd ? this._endAtHour : 23

      head = Math.max(hourStart, head)
      tail = Math.min(hourEnd, tail)

      return arrayFrom(
        head, tail,
        this.data.hourStep
      ).map(d => String(d).padStart(2, '0'))
    },

    _minuteRange(sameAsStart, sameAsEnd) {
      return arrayFrom(
        sameAsStart ? this._startAtMinute : 0,
        sameAsEnd ? this._endAtMinute : 59,
        this.data.minuteStep
      ).map(d => String(d).padStart(2, '0'))
    },

    value() {
      const { _value } = this
      const { ranges } = this.data

      const [year, month, date, hour, minute] = _value
        .map((v, i) => ranges[i][v])
        .map(s => s && s.match(/^\d+/g))

      return new Date(`${[year, month, date].join('/')} ${[hour, minute].join(':')}`)
    },

    handleColumnChange({ detail: { column, value } }) {
      this._value[column] = value
      const date = this.value()
      
      const sameAsStart = this._isSame(column, date, this._startAt)
      const sameAsEnd = this._isSame(column, date, this._endAt)

      if (column < 4) {
        const range = this[`_${rangeNames[column + 1]}Range`](sameAsStart, sameAsEnd)
        this.setData({ [`ranges[${column + 1}]`]: range})
      }
    },

    handleChange({ detail: { value }}) {
      this._value = value
      this.triggerEvent('change', { value: this.value() })
    }
  },

  ready() {
    if (!this._inited) {
      this._init()
    }
  }
})
