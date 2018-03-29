let api = require('../../util/api.js')
let app = getApp()
let globalData = app.globalData
const ImgLoader = require('../../components/img-loader/img-loader.js')
Page({
  data: {
    list: [],
    limit: 20,
    loadTimes: 0,
    urlType: 'url2',
    allLoaded: false,
    platform:''
  },
  onLoad: function (options) {
    this.setData({
      platform: options.platform
    })
    this.updateData()
  },
  imageOnLoad (err, data) {
    const list = this.data.list.map(item => {
      if (item.image === data.src) { item.loaded = true }
      return item
    })
    this.setData({ list })
  },
  updateData: function () {
    var that = this
    api.fetchListData({
      url: 'goods/list',
      data: { group: 2},
      that,
      success: function (data) {
        data.forEach(function (ele) {
          ele.loaded = false
        }, this)
        that.setData({
          list: that.data.list.concat(data)
        })
        that.imgLoader = new ImgLoader(that, that.imageOnLoad.bind(that))
        that.data.list.forEach(item => {
          that.imgLoader.load(item.image)
        })
      }
    })
  }
})
