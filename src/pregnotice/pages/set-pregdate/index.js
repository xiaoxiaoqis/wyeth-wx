const network = require('../../../modules/network/network')

let util = require('../../util/util.js')
let api = require('../../util/api.js')
let app = getApp()
let today = util.pregDateFormat.getFormatDate()
Page({
  data: {
    isCalculate: false, // false为直接设置，true为计算
    pregweek: '',
    pregdate: '',
    lastDays: '',
    percent: '',
    lastPeriod: '',
    periodCycleOptions: [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35],
    periodCycle: 8,
    lastPeriodStart: util.pregDateFormat.calLastPeriod(),
    lastPeriodEnd: today,
    pregdateRangeStart: today,
    pregdateRangeEnd: util.pregDateFormat.calPregdate(today),
    disabled: false,
    loading: false
  },
  onLoad: function (options) {
    var _pregdate = app.globalData.pregdate || util.pregDateFormat.calPregdate()
    this.updateData(_pregdate)
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
  bindpregdateChange: function (e) {
    var __pregdate = e.detail.value
    this.updateData(__pregdate)
  },
  bindLastPeriodChange: function (e) {
    this.setData({
      lastPeriod: e.detail.value
    })
    this.updateDataByPeriod()
  },
  bindPeriodCycleChange: function (e) {
    this.setData({
      periodCycle: e.detail.value
    })
    this.updateDataByPeriod()
  },
  updateData: function (_pregdate) {
    let pregdate = _pregdate || util.pregDateFormat.calPregdate()
    let pregweek = util.pregDateFormat.calPregweek(_pregdate)
    let lastDays = util.pregDateFormat.calPregweek(_pregdate, 'day')
    let percent = util.pregDateFormat.calPregweek(_pregdate, 'per')
    let lastPeriod = util.pregDateFormat.calLastPeriod(_pregdate, this.data.periodCycleOptions[this.data.periodCycle])
    this.setData({
      pregweek: pregweek,
      pregdate: pregdate,
      lastDays: lastDays,
      percent: percent,
      lastPeriod: lastPeriod
    })
  },
  updateDataByPeriod: function () {
    let _pregdate = util.pregDateFormat.calPregdate(this.data.lastPeriod, this.data.periodCycleOptions[this.data.periodCycle])
    this.updateData(_pregdate)
  },
  changeTab: function (e) {
    var targetCal = e.currentTarget.dataset.cal
    if (typeof targetCal !== 'undefined') {
      targetCal = JSON.parse(targetCal)
    }
    this.setData({
      isCalculate: targetCal
    })
  },
  setpregdate: function () {
    let that = this
    let pregdate = that.data.pregdate
    let userInfo = app.globalData.userInfo
    this.setData({
      loading: true
    })
    if (userInfo) {
      network.setPregdate(pregdate,function (res) {
        if(res.ret === 1){
          setLocalPregdate()
          
          api.postData({
            url: 'user/info',
            data: {
              pregdate
            },
            that,
            success () {
            },
            fail () {
            }
          })

        }else{
          console.log('设置失败')
        }
      })

    } else {
      setLocalPregdate()
    }
    function setLocalPregdate () {
      wx.setStorage({
        key: 'pregdate',
        data: pregdate,
        success: function () {
          app.updateGlobalPregdate(pregdate)
          wx.showToast({
            title: '设置成功',
            icon: 'success',
            duration: 500
          })
          that.setData({
            loading: false
          })
          setTimeout(() => {
            wx.navigateBack()
          }, 510)
        }
      })
    }
  }
})
