let app = getApp()
let util = require('../../util/util.js')
let api = require('../../util/api.js')
Page({
  data: {
    res: {},
    week: 0
  },
  onLoad: function (options) {
    let week = options.week
    if (week) this.setData({week})
    this.updateData()
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onShareAppMessage () {
    return {
      title: `孕${this.data.week}周妈妈变化、营养要点、推荐食谱`,
      content: 'this.res.changes[0].content',
      url: `../mom-weely/index?from${app.globalData.userInfo.userId || 0}&week=${app.globalData.pregweek}`
    }
  },
  updateData () {
    let that = this
    api.fetchData({
      url: '/knowledge/mother/diversity',
      data: that.data.week ? {week} : {},
      that,
      success: function (data) {
        let week = app.globalData.pregweek
        that.setData({
          res: data,
          week
        })
        wx.setNavigationBarTitle({
          title: '孕' + week + '周'+'('+app.globalData.pregtoday+')'
        })
      }
    })
  }
})
