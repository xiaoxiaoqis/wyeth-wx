let util = require('../../util/util.js')
let api = require('../../util/api.js')
let app = getApp()

Page({
  data: {
    pregweek: 0,
    pregweekActive: 0,
    pregweekRang: [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
    res: {},
    maskHidden: true,
    curReportDetail: {}
  },
  onLoad: function (options) {
    let pregdate = app.globalData.pregdate
    let pregweek = util.pregDateFormat.calPregweek(pregdate, 'week')
    this.setData({
      pregweek,
      pregweekActive: pregweek - 12
    })
    this.updateData()
  },
  onReady: function () {},
  onShow: function () {

  },
  onHide: function () {},
  onUnload: function () {},
  updateData: function () {
    // 请求「发现」数据
    let that = this
    let pregdate = this.data.pregdate
    let week = this.data.pregweekRang[this.data.pregweekActive]
    api.fetchData({
      url: 'preg/check/report',
      data: {
        week
      },
      that,
      success: function (data) {
        that.setData({
          res: data
        })
      }

    })
  },
  toggleReportDetail: function (e) {
    let data = e.currentTarget.dataset.name || 'report'
    let index = e.currentTarget.dataset.index || 1
    this.setData({
      curReportDetail: this.data.res[data][index],
      maskHidden: !this.data.maskHidden
    })
  },
  toggleReportByWeek: function (e) {
    let pregweekActive = e.detail.value || this.data.pregweekActive
    this.setData({
      pregweekActive
    })
    this.updateData()
  }
})
