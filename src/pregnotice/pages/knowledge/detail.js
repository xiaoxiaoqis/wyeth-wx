var app = getApp()
var util = require('../../util/util.js')
Page({
  data: {
    pregdate: app.globalData.pregdate,
    res: {}
  },
  onLoad: function (options) {
    console.log(this.fetchData)
    this.fetchData()
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {

  },
  fetchData () {
    let that = this
    // console.log('mom', this.pregdate)
    let data = {
      pregdate: this.data.pregdate
    }
    wx.showToast({
      title: '正在加载',
      icon: 'loading',
      duration: 10000
    })
    wx.request({
      url: util.API_BASE_URL + '/knowledge/mother/diversity',
      data,
      that,
      success (res) {
        that.setData({
          res: res.data.data
        })
        wx.hideToast()
      },
      fail () {

      }

    })
  }
})
