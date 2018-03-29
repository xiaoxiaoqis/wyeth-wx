// pages/recipe/categroy.js
let util = require('../../util/util.js')
let api = require('../../util/api.js')
let app = getApp()

Page({
  data: {
    pregdate: '',
    pregtoday: '',
    pregweek: '',
    foldTip: true,
    toViewRaw: '',
    toView: '',
    combine: 1,
    icons: ['morning', 'rest', 'atnoon', 'afternoon', 'evening'],
    time: ['7:00 ~ 9:00', '10:00 ~ 11:00', '11:00 ~ 13:00', '14:00 ~ 16:00'],
    res: {}
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    let that = this
    let pregdate = app.globalData.pregdate
    let pregtoday = util.pregDateFormat.calPregweek(pregdate)
    let pregweek = util.pregDateFormat.calPregweek(pregdate, 'week')
    let time = new Date().getHours()
    let toView = options.toView
    let combine = options.combine || 1
    if (!toView) {
      if (time < 10) {
        toView = 'breakfast'
      } else if (time > 9 && time < 14) {
        toView = 'lunch'
      } else if (time > 13 && time < 20) {
        toView = 'supper'
      } else if (time > 19) {
        toView = 'supper'
      }
    }
    this.setData({
      combine,
      pregdate,
      pregtoday,
      pregweek,
      toViewRaw: toView
    })
    wx.setNavigationBarTitle({
      title: that.data.pregtoday + '饮食安排'
    })
    this.updateData()
  },
  onShareAppMessage () {
    console.log(this.data.res.point)
    return {
      title: `${this.data.pregtoday}营养配餐`,
      content: `今日配餐要点：${this.data.res.point.content.nutrition},${this.data.res.point.content.work},${this.data.res.point.content.description}`,
      url: `../recipe/home?sharedBy${app.globalData.userInfo.userId || 0}&month=${Math.ceil(this.data.pregweek / 4)}`
    }
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  updateData () {
    var that = this
    let month = (this.data.pregweek - (this.data.pregweek % 4)) / 4 + 1
    api.fetchData({
      url: 'food',
      data: {
        month,
        combine: that.data.combine
      },
      that,
      success (data) {
        that.setData({
          res: data
        })

        setTimeout(() => {
          that.setData({
            toView: that.data.toViewRaw
          })
        }, 50)
      }
    })
  },
  toggleTipFold: function () {
    this.setData({
      foldTip: !this.data.foldTip
    })
  },
  taptap: function (e) {
    console.log(e)
  }
})
