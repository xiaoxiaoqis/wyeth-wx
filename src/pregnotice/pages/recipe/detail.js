// pages/recipe/categroy.js
let api = require('../../util/api.js')
let app = getApp()
let like = require('../../components/likeAndShare/index.js')

Page({
  data: {
    id: 1,
    likeShare: {},
    res: []
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      id: options.id || 1
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
      title: `孕妇食谱推荐 - ${this.data.res.name}`,
      content: `共${this.data.res.step.length + 1}步，${this.data.res.tag.join('、')}，食材准备：${this.data.res.preparation}`,
      url: `../recipe/detail?id=${this.data.id}&sharedBy${app.globalData.userInfo.userId || 0}`
    }
  },
  doLike: function () {
    let that = this
    like.postLike({
      data: { type: 3, id: that.data.id},
      that
    })
  },
  updateData () {
    var that = this
    api.fetchData({
      url: 'food/' + that.data.id,
      that,
      data: {},
      success: function (data) {
        console.log(data)
        let likeShare = {
          isLove: data.is_love !== '0',
          count: parseInt(data.loves)
        }
        that.setData({
          res: data,
          likeShare
        })
        wx.setNavigationBarTitle({
          title: data.name
        })
      }
    })
  }
})
