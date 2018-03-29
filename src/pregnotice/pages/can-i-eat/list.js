var util = require('../../util/util.js')
let api = require('../../util/api.js')
let app = getApp()
Page({
  data: {
    feeds: [],
    limit: 20,
    loadTimes: 0,
    allLoaded: false,
    listId: null,
    category: ['主食', '蔬菜菌类', '水果', '零食小吃', '肉蛋禽', '饮品', '豆/奶制品', '加工食品', '水产海鲜', '调味品', '坚果类', '补品草药'],
    foodBasePath: '../discovery/eat/food/food?id='
  },
  onLoad: function (options) {
    this.setData({
      listId: options.id || 1
    })
    this.updateData()
      // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.category[this.data.listId - 1]
    })
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
      title: `${this.data.category[this.data.listId - 1]} - 孕妇能不能吃`,
      content: `帮你解读怀孕、哺乳、坐月子、婴幼儿各阶段的饮食宜忌及食物能不能吃`,
      url: `../can-i-eat/list?id=${this.data.listId}&sharedBy=${app.globalData.userInfo.userId || 0}`
    }
  },
  updateData: function () {
    // 请求数据
    var that = this
    api.fetchListData({
      url: 'food/product',
      data: {
        category: this.data.listId
      },
      that,
      success: function (data) {
        that.setData({
          feeds: that.data.feeds.concat(data)
        })
      }
    })
  }
})
