let api = require('../../util/api.js')
var util = require('../../util/util.js')
Page({
  data: {
    feeds: [],
    inputVal: '',
    initInputVal: '',
    placeholder: '输入食物名，搜索能不能吃',
    inputTyping: false,
    searching: false,
    loadTimes: 0,
    searchTimes: 0,
    allLoaded: false
  },
  onLoad: function (options) {
    this.setData({
      initInputVal: options.q !== undefined ? options.q : ''
    })
    if (options.q !== undefined) this.updateData()
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
  updateData: function () {
    if (this.data.allLoaded) return false
    // 请求数据
    let searchTimes = this.data.searchTimes
    this.setData({
      searching: true,
      feeds: {},
      searchTimes: searchTimes + 1
    })
    var that = this
    api.fetchData({
      url: 'food/product/search',
      data: {
        q: this.data.inputVal
      },
      that,
      success: function (data) {
        that.setData({
          feeds: data,
          searching: false
        })
      }
    })
  },
  doSearch: function (e) {
    wx.reportAnalytics('can_i_eat_search', {
      search_val: e.detail.value.inputVal
    })
    let inputVal = e.detail.value.inputVal
    if (!inputVal || this.data.inputVal === inputVal) return false
    this.setData({
      inputVal,
      allLoaded: this.data.inputVal === inputVal
    })
    this.updateData()
  },
  inputFocus: function (e) {
    this.setData({
      inputTyping: true
    })
  },
  inputBlur: function (e) {
    this.setData({
      inputTyping: false
    })
  }
})
