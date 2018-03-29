// pages/recipe/categroy.js
let api = require('../../util/api.js')
Page({
  data: {
    type: 1,
    res: []
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      type: options.type ? parseInt(options.type) : 1
    })
    this.updateData()
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
  onShareAppMessage () {
    return {
      title: '孕妇食谱大全 - ' + (this.data.type === 1 ? '对症食疗' : '食补营养'),
      content: '',
      url: `../recipe/category?type=${this.data.type}`
    }
  },
  updateData () {
    var that = this
    api.fetchData({
      url: 'food/case',
      that,
      data: {
        type: that.data.type
      },
      success: function (res) {
        that.setData({
          res
        })
        let title = (that.data.type === 1 ? '对症食疗' : '食补营养')
        wx.setNavigationBarTitle({
          title
        })
      }
    })
  }
})
