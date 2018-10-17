import { arrayFrom } from './common'
import { dateCount } from './common/date'

const rangeNames = ['year', 'month', 'date', 'hour', 'minute']
const columnNames = ['FullYear', 'Month', 'Date', 'Hours', 'Minutes']

Component({
  properties: {
    startAt: {
      type: String,
      value: '2000/01/01 00:00',
      observer() {
        this._initStartAt()
      }
    },

    endAt: {
      type: String,
      value: '2099/12/31 23:59',
      observer() {
        this._initEndAt()
      }
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
      this._value = Array(5).fill(0)
      this._initStartAt()
      this._initEndAt()
    },

    _initStartAt() {
      this._startAt = new Date(this.data.startAt)

      this._startAtYear = this._startAt.getFullYear()
      this._startAtMonth = this._startAt.getMonth() + 1
      this._startAtDate = this._startAt.getDate()
      this._startAtHour = this._startAt.getHours()
      this._startAtMinute = this._startAt.getMinutes()
    },

    _initEndAt() {
      this._endAt = new Date(this.data.endAt)

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
      )
    },

    _monthRange(sameAsStart, sameAsEnd) {
      return arrayFrom(
        sameAsStart ? this._startAtMonth : 1,
        sameAsEnd ? this._endAtMonth : 12,
        this.data.monthRange
      )
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
    },

    _hourRange(sameAsStart, sameAsEnd) {
      return arrayFrom(
        sameAsStart ? this._startAtHour : 0,
        sameAsEnd ? this._endAtHour : 23,
        this.data.hourStep
      )
    },

    _minuteRange(sameAsStart, sameAsEnd) {
      return arrayFrom(
        sameAsStart ? this._startAtMinute : 0,
        sameAsEnd ? this._endAtMinute : 59,
        this.data.minuteStep
      )
    },

    value() {
      const { _value } = this
      const { ranges } = this.data

      const [year, month, date, hour, minute] =
        _value.map((v, i) => ranges[i][v])

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
    this._init()
    this._initRanges()
  }
})
