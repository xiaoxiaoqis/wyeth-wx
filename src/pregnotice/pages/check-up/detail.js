let api = require('../../util/api.js')
let util = require('../../util/util.js')
let app = getApp()
let pregdate = app.globalData.pregdate
let today = util.pregDateFormat.getFormatDate()

Page({
  data: {
    id: 0,
    userInfo: app.globalData.userInfo,
    checkUp: {},
    dateStart: today,
    dateEnd: pregdate,
    processing: false
  },
  onLoad: function (options) {
    console.log(options)
    this.setData({
      id: options.id || 1,
      processing: parseInt(options.processing) || -1
    })
    this.updateData()
  },
  onReady: function () {},
  onShow: function () {
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },
  onHide: function () {},
  onUnload: function () {},
  updateData: function () {
    // 请求「发现」数据
    var that = this
    api.fetchData({
      url: 'preg/check/' + that.data.id,
      data: {},
      that,
      success: function (data) {
        let checkUp = Object.assign(data.check, {
          daysLeft: that.daysLeft(data.check.time)
        })
        console.log(checkUp)
        that.setData({
          checkUp
        })
      }
    })
  },
  daysLeft (date) {
    return Math.floor((new Date(date).getTime() - new Date().getTime()) / (24 * 3600 * 1000)) + 1
  },
  completeHandler (e) {
    let that = this
    wx.showModal({
      title: '恭喜完成本次产检',
      content: '比计划时间 ' + that.data.checkUp.time + ' 提前了 ' + that.data.checkUp.daysLeft + ' 天，下次产检时间为 ' + that.data.checkUp.next_time,
      success (res) {
        if (res.confirm) {
          api.postData({
            url: 'preg/check/confirm',
            that,
            data: {
              check_id: that.data.checkUp.id
            },
            success (res) {
              that.setData({
                id: parseInt(that.data.id) + 1
              })
              that.updateData()
              app.globalData.needSyncData = true
            }
          })
        }
      }
    })
  },
  changeCheckUpDate (e) {
    let date = e.detail.value
    let that = this
    if (date !== this.data.checkUp.time) {
      api.postData({
        url: 'preg/check/delay',
        that,
        data: {
          check_id: that.data.checkUp.id,
          date
        },
        success () {
          that.updateData()
        },
        fail () {

        }
      })
    }
  },
  login () {
    let that = this
    app.askForWxLogin(() => {
      that.updateData()
      that.setData({
        userInfo: app.globalData.userInfo
      })
    })
  }
})
