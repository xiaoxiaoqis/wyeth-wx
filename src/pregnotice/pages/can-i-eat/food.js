let api = require('../../util/api.js')
let app = getApp()
let like = require('../../components/likeAndShare/index.js')
Page({
  data: {
    id: null,
    food: {},
    likeShare: {},
    eatStatusColor: {
      '0': '#11cd6e',
      '1': '#eb4f38',
      '2': '#ea8010'
    },
    loading: true
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
    // wx.setNavigationBarTitle({
    //   title: this.data.food.name
    // })
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
  doLike: function () {
    console.log('点赞')
    let that = this
    like.postLike({
      data: { type: 4, id: that.data.id},
      that
    })
  },
  onShareAppMessage () {
    return {
      title: `孕妇能不能吃${this.data.food.name}`,
      content: `${this.data.food.know[0].type_name},${this.data.food.know[0].description}`,
      url: `../can-i-eat/food?id=${this.data.id}&sharedBy=${app.globalData.userInfo.userId || 0}`
    }
  },
  updateData: function () {
    // 请求「发现」数据
    var that = this
    api.fetchData({
      url: 'food/product/' + this.data.id,
      data: {},
      that,
      success: function (data) {
        let likeShare = {
          isLove: data.is_love !== '0',
          count: parseInt(data.loves)
        }
        that.setData({
          food: data,
          loading: false,
          likeShare
        })
        wx.setNavigationBarTitle({
          title: that.data.food.name
        })
      }
    })
  }
})
