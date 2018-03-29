var api = require('../../util/api.js')
let app = getApp()
Page({
  data: {
    activeIndex: 0,
    fill: ['#fbe25d', '#ffafc4', '#A5D547', '#B05DB2', '#74B24C', '#FF6F5D', '#A173FF', '#FFAA70', '#3F78B2'],
    symptoms: {}
  },
  onLoad: function (options) {
    this.updateData()
  },
  onReady: function () {},
  onShow: function () {

  },
  onHide: function () {},
  onUnload: function () {},
  onShareAppMessage () {
    return {
      title: '症状百科 - 最全的孕期症状及疾病应对指南',
      content: '',
      url: `../symptom/index?sharedBy=${app.globalData.userInfo.userId || 0}`
    }
  },
  updateData: function () {
    // 请求「发现」数据
    var that = this
    api.fetchData({
      url: 'case',
      data: {},
      that,
      success: function (data) {
        that.setData({
          symptoms: data
        })
        for (var i = 0; i < data.length; i++) {
          if (data[i].selected == 1) {
            that.setData({
              activeIndex: i
            })
          }
        }
      }
    })
  },
  changeNav: function (e) {
    let id = parseInt(e.currentTarget.dataset.id)
    if (typeof (id) !== undefined) {
      this.setData({
        activeIndex: id
      })
    }
  }
})
