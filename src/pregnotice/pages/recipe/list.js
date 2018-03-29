// pages/recipe/type.js
let api = require('../../util/api.js')
let app = getApp()
Page({
  data: {
    id: 1,
    res: [],
    type: 1,
    typeName: '',
    title: ''
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    console.log(options)
    let type = options.type ? parseInt(options.type) : 1
    let id = options.id ? parseInt(options.id) : 1
    let typeName = options.typeName || ''
    let title = typeName
    let preStr = type === 2 ? '补充' : '缓解'
    if (type === 1 && id === 17) {
      title = typeName + '食谱'
    } else {
      title = preStr + typeName
    }
    this.setData({
      id,
      type,
      typeName,
      title
    })
    this.updateData()
    wx.setNavigationBarTitle({
      title: this.data.title
    })
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
      title: `孕妇${this.data.typeName}的食谱`,
      content: '',
      url: `../recipe/list?id=${this.data.id}&sharedBy${app.globalData.userInfo.userId || 0}`
    }
  },
  updateData () {
    var that = this
    api.fetchData({
      url: 'food/case/' + that.data.id,
      data: {
        type: this.data.type
      },
      that,
      success: function (data) {
        data.forEach((el, i, arr) => {
          el.tagStr = el.tag.join('，')
        })
        that.setData({
          res: data
        })
      }
    })
  }
})
