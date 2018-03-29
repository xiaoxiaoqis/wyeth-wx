let api = require('../../util/api.js')
let like = require('../../components/likeAndShare/index.js')
let app = getApp()
let globalData = app.globalData
let WxParse = require('../../components/wxParse/wxParse.js')

Page({
  data: {
    res: {},
    id: 1,
    likeShare: {}
  },
  onLoad: function (options) {
    this.setData({
      id: options.id || 1
    })
    this.updateData()
  },
  doLike: function () {
    let that = this
    like.postLike({
      data: {type: 1, id: that.data.id},
      that
    })
  },
  onShareAppMessage () {
    return {
      title: this.data.res.title,
      url: `../article/article?id=${this.data.id}&sharedBy=${globalData.userInfo.userId || 0}`
    }
  },
  updateData: function () {
    var that = this
    api.fetchData({
      url: 'knowledge/article/' + that.data.id,
      data: {},
      that,
      success: function (data) {
        let res = data,
          likeShare = {
            isLove: res.is_love !== '0',
            count: parseInt(res.loves)
          }
        let article = data.content
        that.setData({
          res,
          likeShare
        })
        WxParse.wxParse('article', 'html', article, that, 0)
      }
    })
  }
})
