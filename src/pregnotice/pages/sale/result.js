let api = require('../../util/api.js')
let app = getApp()

Page({
  data: {
    orderInfo: {},
    orderId: '',
    id: '',
    urlType: 'url2'
  },
  onLoad: function (options) {
    this.setData({
      orderId: options.orderId,
      id: options.id
    })
    this.updateData()
  },
  backToHome: function () {
    wx.navigateBack({
      delta: 3
    })
  },
  updateData: function () {
    var that = this
    api.fetchData({
      url: 'goods/detail/' + that.data.id,
      data: {},
      that,
      success: function (data) {
        that.setData({
          orderInfo: data
        })
      }
    })
  }
})
