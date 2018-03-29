const API_BASE_URL = 'https://api.ladybirdedu.com/v1/'
const STATIC_BASE_URL = 'http://www.ladybirdedu.com/pregnotice/images/wx-static/'
let pregDateFormat = {
  getFormatDate: function (d) { // 获取当前日期，如2016-9-28
    d = d || new Date()
    let [year, month, day] = [
      new Date(d).getFullYear(),
      new Date(d).getMonth() < 9 ? '0' + (new Date(d).getMonth() + 1) : (new Date(d).getMonth() + 1),
      new Date(d).getDate() < 10 ? '0' + new Date(d).getDate() : new Date(d).getDate()
    ]
    return year + '-' + month + '-' + day
  },
  calPregdate (lastPeriod, periodCycle) {
    // 计算预产期,lastPeriod 末次月经时间,periodCycle 月经周期天数
    let delta, startDate, result
    delta = periodCycle ? (periodCycle - 28) : 0
    console.log('delta', delta)
    startDate = lastPeriod || this.getFormatDate(Date.now() - 4 * 7 * 24 * 3600 * 1000)
    result = new Date(new Date(startDate).getTime() + (delta + 279) * 24 * 3600 * 1000)
    return this.getFormatDate(result)
  },
  /** 通过预产期计算孕周及天数
   *   date:为需要知道的日期，默认为今天
   */
  calPregweek (pregdate, type, date) {
    let diff, day, week, percent
    date = this.getFormatDate(date)
    pregdate = pregdate || date

    if(new Date(Date.parse(pregdate)) >= new Date()){
      // 孕期
      diff = 280 - Math.floor((new Date(pregdate).getTime() - new Date(date).getTime()) / (24 * 3600 * 1000))
      day = diff % 7
      week = parseInt(diff / 7)
      percent = diff / 280 * 100
      switch (type) {
        case 'week':
      // 返回孕周
          return week + 1
        case 'day':
      // 返回剩余天数
          return Math.abs(280 - diff)
        case 'per':
      // 返回已过天数占整个孕期的百分比
          return percent
        default:
      // 返回「孕X周Y天」
          return '孕' + (week === 0 ? '' : week + '周') + (day === 0 ? (week === 0 ? "0天整" :'整') : (day + '天'))
      }
    }else{
      // 育儿
      diff =  Math.floor((new Date(date).getTime() - new Date(pregdate).getTime()) / (24 * 3600 * 1000))
      day = diff % 7
      week = parseInt(diff / 7)
      percent = diff / 280 * 100
      switch (type) {
        case 'week':
      // 返回孕周
          return week + 1
        case 'day':
      // 返回剩余天数
          return diff
        case 'per':
      // 返回已过天数占整个孕期的百分比
          return percent
        default:
      // 返回「孕X周Y天」
          return (week === 0 ? '' : week + '周') + (day === 0 ? (week === 0 ? "0天整" :'整') : (day + '天'))
      }
    }    


  },
  calLastPeriod (pregdate, periodCycle) { // 通过预产期计算末次月经时间
    pregdate = pregdate || this.getFormatDate()
    let delta = periodCycle ? (periodCycle - 28) : 0
    console.log('deltaLastPeriod', delta, periodCycle)
    let result = new Date(new Date(pregdate).getTime() - (279 + delta) * 24 * 3600 * 1000)
    return this.getFormatDate(result)
  }
}

module.exports = {
  pregDateFormat,
  API_BASE_URL,
  STATIC_BASE_URL
}
