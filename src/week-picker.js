import { arrayFrom } from './common'

const ONE_DAY = 86400000

const now = new Date()
const nowTime = now.getTime()
const nowDate = now.getDate()

const dayNames = ['日', '一', '二', '三', '四', '五', '六']
const hourRange = arrayFrom(9, 19).map(h => String(h).padStart(2, '0'))
const minuteRange = arrayFrom(0, 59, 15).map(m => String(m).padStart(2, '0'))

Component({
  data: {
    ranges: []
  },

  ready() {
    this._init()
  },

  methods: {
    _init() {
      const ranges = [
        this._dayRange(),
        this._hourRange(),
        this._minuteRange()
      ]
      this.setData({ ranges })
    },

    _dayRange() {
      const range = [
        `今天 (${nowDate} 日)`,
        `明天 (${nowDate + 1} 日)`
      ]

      for (let i = 2; i < 7; ++i) {
        const date = new Date(nowTime + ONE_DAY * i)
        range.push(`周${dayNames[date.getDay()]} (${date.getDate()} 日)`)
      }

      return range
    },

    _hourRange() {
      return hourRange
    },

    _minuteRange() {
      return minuteRange
    },

    handleChange({ detail: { value }}) {
      const [dateDiff, hourIndex, minuteIndex] = value

      const date = new Date(nowTime + ONE_DAY * dateDiff)
      const hour = hourRange[hourIndex]
      const minute = minuteRange[minuteIndex]

      date.setHours(hour, minute, 0, 0)
      this.triggerEvent('change', { value: date })
    }
  }
})