var api = require('../../util/api.js')
let app = getApp()
Page({
  data: {
    catagory: {},
    hot: {},
    category: ['主食', '蔬菜菌类', '水果', '零食小吃', '肉蛋禽', '饮品', '豆/奶制品', '加工食品', '水产海鲜', '调味品', '坚果类', '补品草药'],
    imgUrlBase: 'http://www.ladybirdedu.com//pregnotice/images/wx-static/',
    foodBasePath: '../can-i-eat/food/food?id=',
    catagoryBaseUrl: '../can-i-eat/list/list?id=',
    inputShowed: false,
    inputVal: '',
    placeholder: '输入食物名，搜索能不能吃',
    platform:''
  },
  onLoad: function (options) {
    this.setData({
      platform: options.platform
    })
  },
  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onShareAppMessage () {
    return {
      title: '孕妇能不能吃？',
      content: `帮你解读怀孕、哺乳、坐月子、婴幼儿各阶段的饮食宜忌及食物能不能吃`,
      url: `../can-i-eat?sharedBy=${app.globalData.userInfo.userId || 0}`
    }
  }
})
