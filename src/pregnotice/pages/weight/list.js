// pages/weight/add.js
const util = require('../../util/util.js')
const api = require('../../util/api.js')
let app = getApp()
let today = util.pregDateFormat.getFormatDate()
console.log(today)
Page({
  data: {
    userInfo: app.globalData.userInfo,
    initWeightNum: 50.0,
    weightNum: null,
    rulerScrollLeft: 0,
    weightRange: [],
    lastRecordDaysAgo: 0,
    recordDate: today,
    isAddMode: false,
    today: today,
    pregweekNow: '',
    pregweek: '',
    pregdate: '',
    pregdateRangeStart: '',
    pregdateRangeEnd: '',
    showWeightRuler: false,
    showYunQianEditor: false,
    animation: 'animate-slideFromBottom',
    yunqianWeight: '',
    yunqianHeight: '',
    yunqianWeightLegal: true,
    yunqianHeightLegal: true,
    btnConfirmText: ['保存', '正在保存', '保存成功', '失败，重新保存'],
    btnConfirmIcon: ['', 'waiting_circle', 'success_circle', ''],
    btnConfirmStatus: 0,
    res: []
  },
  onLoad (options) {
    let that = this
    let pregdate = app.globalData.pregdate
    this.setData({
      pregdate: pregdate,
      pregweekNow: util.pregDateFormat.calPregweek(pregdate),
      pregweek: util.pregDateFormat.calPregweek(pregdate),
      pregdateRangeStart: util.pregDateFormat.calLastPeriod(pregdate),
      pregdateRangeEnd: pregdate
    })
    if (!app.globalData.userInfo) {
      app.askForWxLogin(() => {
        that.updateData()
        setTimeout(() => {
          that.setData({
            userInfo: app.globalData.userInfo
          })
        }, 500)
      }, () => {
        wx.navigateBack()
      })
    } else {
      that.updateData()
    }
    // 设置体重记录区间为30kg~150kg
    let weightRange = []
    for (let i = 300; i < 1501; i++) {
      weightRange.push(i / 10)
    }
    this.setData({
      weightRange,
      weightNum: this.data.initWeightNum,
      isAddMode: !!(typeof options.add !== 'undefined' && options.add === 'true')
    })
  },
  onReady (e) {
    // 页面渲染完成
  },
  onShow () {
    // 页面显示
    let userInfo = app.globalData.userInfo
    if (userInfo && (userInfo && this.data.userInfo ? userInfo.userId != this.data.userInfo.userId : userInfo != this.data.userInfo)) {
      this.updateData()
    }
    this.setData({
      userInfo
    })
  },
  onHide () {
    // 页面隐藏
  },
  onUnload () {
    // 页面关闭
  },
  updateData () {
    let that = this
    this.setData({
      res: {}
    })
    api.fetchData({
      url: 'home/weight',
      data: {},
      that,
      success (data) {
        if (data.length == 0) {
          that.setData({
            res: data,
            showYunQianEditor: true
          })
          return false
        }
        let lastRecordDate = data[0].date
        // for (var i = 0; i < data.length; i++) {
        //   data[i].bmi = data[i].bmi.toFixed(1)
        // }
        that.setData({
          res: data,
          initWeightNum: data[0].weight
        })
        if (that.data.isAddMode) that.toggleWeightRuler()
        that.setData({
          isAddMode: false
        })
        if (data[data.length - 1].height == 0) {
          that.setData({
            showYunQianEditor: true
          })
        }
        // that.toggleYunQianEditor()
      }
    })
  },
  setWeight (e) {
    let weightNum = ((e.detail.scrollLeft) / 150 + 30).toFixed(1)
    let that = this
    that.setData({
      weightNum
    })
  },
  adjustRuler (e) {
    this.setData({
      rulerScrollLeft: this.data.weightNum
    })
  },
  changeDate (e) {
    let recordDate = e.detail.value
    this.setData({
      recordDate,
      pregweek: util.pregDateFormat.calPregweek(this.data.pregdate, '', recordDate)
    })
  },
  toggleWeightRuler (e) {
    let showWeightRuler = !this.data.showWeightRuler
    this.setData({
      showWeightRuler,
      btnConfirmStatus: 0
    })
  },
  saveWeight (e) {
    let that = this
    let type = e.currentTarget.dataset.type
    let data = {
      weight: type === 'yunqian' ? that.data.yunqianWeight : that.data.weightNum,
      height: type === 'yunqian' ? that.data.yunqianHeight : '',
      date: that.data.recordDate,
      day: type === 'yunqian' ? 0 : 280 - util.pregDateFormat.calPregweek(that.data.pregdate, 'day', that.data.recordDate)
    }
    that.setData({
      btnConfirmStatus: 1
    })
    api.postData({
      url: 'home/weight',
      data,
      that,
      success (res) {
        that.setData({
          btnConfirmStatus: 2,
          showWeightRuler: false,
          showYunQianEditor: false
        })
        that.updateData()
        setTimeout(function () {
          that.setData({
            btnConfirmStatus: 0,
            recordDate: that.data.today,
            pregweek: that.data.pregweekNow
          })
        }, 500)
      },
      fail (res) {
        that.setData({
          btnConfirmStatus: 3
        })
      }
    })
  },
  yunqianWValidation (e) {
    let val = e.detail.value
    let reg = /^[0-9]{1,3}(\.[0-9]?)?$/
    this.setData({
      yunqianWeightLegal: reg.test(val),
      yunqianWeight: val
    })
  },
  yunqianHValidation (e) {
    let val = e.detail.value
    let reg = /^[0-9]{1,3}(\.[0-9]?)?$/
    this.setData({
      yunqianHeightLegal: reg.test(val),
      yunqianHeight: val
    })
  },
  // 处理（删除）体重历史记录或修改孕前体重和身高
  handleWeightHistoryItem (e) {
    let that = this
    let id = e.currentTarget.dataset.id
    let day = e.currentTarget.dataset.day
    wx.showActionSheet({
      itemList: e.currentTarget.dataset.isYunqian ? ['修改孕前身高体重'] : ['删除该条体重记录'],
      itemColor: e.currentTarget.dataset.isYunqian ? '#000' : '#fe5d5d',
      success (res) {
        if (res.cancel) return false
        if (e.currentTarget.dataset.isYunqian) {
          // 设置身高和孕前体重
          that.toggleYunQianEditor()
        } else {
          // 删除体重数据
          let data = {
            id,
            day
          }
          api.postData({
            url: 'home/weight/del',
            data,
            that,
            success (res) {
              that.updateData()
              wx.showToast({
                title: '已删除'
              })
            },
            fail (res) {
              wx.showToast({
                title: '删除失败'
              })
            }
          })
        }
      }
    })
  },
  toggleYunQianEditor (e) {
    let that = this
    let length = this.data.res.length
    this.setData({
      yunqianWeight: that.data.res[length - 1].weight,
      yunqianHeight: that.data.res[length - 1].height,
      showYunQianEditor: !that.data.showYunQianEditor
    })
  }
})
