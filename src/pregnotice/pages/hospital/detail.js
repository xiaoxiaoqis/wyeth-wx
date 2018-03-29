let api = require('../../util/api.js')
let app = getApp()
let globalData = app.globalData

Page({
  data: {
    id: 1,
    limit: 20,
    loadTimes: 0,
    allLoaded: false,
    userInfo: globalData.userInfo,
    shareMsg: {},
    baseUrl: 'http://www.ladybirdedu.com/pregnotice/images/wx-static/',
    img: 'http://www.ladybirdedu.com//pregnotice/images/wx-static/top.png',
    detail: {},
    reportList: [],
    scrollTop: 0,
    btnClass: 'scroll-inactive'
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      id: options.id || 1
    })
    this.updateData()
  },
  onShareAppMessage: function () {
    return this.data.shareMsg
  },
  // 监听scroll
  scroll (e) {
    this.setData({
      btnClass: e.detail.scrollTop > 100 ? 'scroll-active' : 'scroll-inactive'
    })
  },
  // 滚动至顶部
  top () {
    this.setData({
      scrollTop: 0
    })
  },
  // 切换全文
  toggleFull: function (e) {
    let list = this.data.reportList
    let i = e.target.dataset.index
    if (list[i].hint) {
      list[i].hint = 0
      list[i].contentText = list[i].content
    } else {
      list[i].hint = 1
      list[i].contentText = list[i].content.substring(0, 50)
    }
    this.setData({
      reportList: this.data.reportList
    })
  },
  // 图片预览
  preview: function (e) {
    console.log(e)
    wx.previewImage({
      current: '',
      urls: e.target.dataset.src
    })
  },
  // 获取内页d数据
  updateData: function () {
    var that = this
    api.fetchData({
      url: 'index.php/mua/hospital',
      data: {id: that.data.id},
      that,
      success: function (data) {
        console.log(data)
        that.setData({
          detail: data,
          shareMsg: {
            title: `${data.name}`,
            desc: `建档动态：${data.filing.state}`,
            path: `../hospital/detail?shareBy=${that.data.userInfo.userId || 0}&id=${that.data.id}`
          }
        })
        wx.setNavigationBarTitle({
          title: data.name
        })
      }
    })
    that.getListData()
  },
  // 获取报告列表
  getListData: function () {
    var that = this
    api.fetchListData({
      url: 'index.php/mua/hospital/create_doc/list',
      data: {hospital_id: that.data.id},
      that,
      success: function (data) {
        let len = that.data.reportList.length
        that.data.reportList.splice(len, 0, ...data)
        that.setData({
          reportList: that.data.reportList
        })
        // 设置item初始值
        that.data.reportList.forEach(function (ele, index) {
          ele.hint = 0
          ele.long = false,
          ele.contentText = ele.content
          ele.time = that.convertStamp(ele.time)
          if (ele.content.length > 50) {
            ele.long = true
            ele.hint = 1
            ele.contentText = ele.content.substring(0, 50)
          }
        }, this)
        that.setData({
          reportList: that.data.reportList
        })
      }
    })
  },
  // 转换时间戳
  convertStamp (old) {
    let now = new Date()
    let oldDate = old.split(' ').slice(0, 1).join()
    let diff = now.getTime() - Date.parse(new Date(old))
    let hourC = diff / (1000 * 60 * 60)
    let minC = diff / (1000 * 60)
    let result = ''
    if (diff < 0) return
    if (this.getYday(now, -1) === oldDate) {
      result = '昨天'
    } else if (hourC >= 24) {
      result = oldDate
    } else if (hourC >= 1 && hourC < 24) {
      result = parseInt(hourC) + '小时前'
    } else if (minC >= 1) {
      result = '' + parseInt(minC) + '分钟前'
    } else result = '刚刚'
    return result
  },
  // 获取n天后的日期
  getYday (now, i) {
    now.setDate(now.getDate() + i)
    let m = now.getMonth() + 1
    let cm = m > 9 ? m : '0' + m
    let d = now.getDate()
    let y = now.getFullYear()
    return y + '-' + cm + '-' + d
  }
})
