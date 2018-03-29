let api = require('../../util/api.js')
let app = getApp()
let globalData = app.globalData

Page({
  data: {
    list: [],
    limit: 20,
    loadTimes: 0,
    allLoaded: false,
    page: 1,
    userInfo: globalData.userInfo,
    loadType: 'list',
    search: {
      distArray: ['北京市', '朝阳', '海淀', '丰台', '东城', '西城', '昌平', '大兴', '房山', '通州', '顺义', '石景山', '门头沟', '密云', '怀柔', '平谷', '延庆'],
      index: 0,
      inputTyping: false,
      inputVal: ''
    }
  },
  onLoad: function () {
    this.updateData()
  },
  bindPickerChange (e) {
    this.setData({
      'search.index': e.detail.value,
      urlType: 'url2',
      allLoaded: false,
      page: 1,
      list: [],
      loadType: 'dist'
    })
    this.updateData()
  },
  showInput (e) {
    this.setData({
      'search.inputTyping': true
    })
  },
  hideInput (e) {
    this.setData({
      'search.inputTyping': false
    })
  },
  doSearch (e) {
    this.setData({
      'search.inputVal': e.detail.value,
      urlType: 'url2',
      loadType: 'search',
      allLoaded: false,
      page: 1,
      list: []
    })
    this.updateData()
  },
  onShareAppMessage () {
    return this.data.shareMsg
  },
  updateData () {
    var that = this
    var dist = that.data.search.distArray[that.data.search.index] === '北京市' ? '' : that.data.search.distArray[that.data.search.index]
    var url = 'index.php/mua/hospital/list'
    if (that.data.loadType === 'dist') {
      url = 'service/hospital/list'
    } else if (that.data.loadType === 'search') {
      url = 'search'
    }
    api.fetchListData({
      url: url,
      data: {district: dist, type: 'hospital', q: that.data.search.inputVal},
      that,
      success: function (data) {
        that.setData({
          list: that.data.list.concat(data),
          shareMsg: {
            title: `生产医院`,
            path: `../hospital/list?shareBy=${that.data.userInfo.userId || 0}`
          }
        })
      }
    })
  }
})
