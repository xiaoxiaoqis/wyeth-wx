let util = require('../../util/util.js')
let api = require('../../util/api.js')
let app = getApp()
let globalData = app.globalData
let today = util.pregDateFormat.getFormatDate()
Page({
  data: {
    userInfo: globalData.userInfo,
    toolboxActive: -1,
    theme: 'purple',
    pregdate: '',
    pregweek: '',
    pregtoday: '',
    percent: 0,
    lastDays: 0,
    feeds: {},
    icons: {
      momWeekly: util.STATIC_BASE_URL + 'mom-weekly.png',
      fetal: util.STATIC_BASE_URL + '3d-fetal.png'
    },
    toolbox: [
      {
        name: '能不能吃',
        icon: util.STATIC_BASE_URL + 'meishi.png',
        page: '../can-i-eat/index'
      },
      {
        name: '症状百科',
        icon: util.STATIC_BASE_URL + 'jiankang.png',
        page: '../symptom/index'
      },
      {
        name: '胎教音乐',
        icon: util.STATIC_BASE_URL + 'yinyue.png',
        page: '../music/list'
      },
      {
        name: '饮食助手',
        icon: util.STATIC_BASE_URL + 'shipu.png',
        page: '../recipe/home'
      },
      {
        name: '起名测名',
        icon: util.STATIC_BASE_URL + 'name.png',
        page: '../name/index',
        label: 'new'
      }
    ],
    toolboxLite: [
      {
        name: '能不能吃',
        icon: util.STATIC_BASE_URL + 'meishi.png',
        page: '../can-i-eat/index'
      },
      {
        name: '症状百科',
        icon: util.STATIC_BASE_URL + 'jiankang.png',
        page: '../symptom/index'
      },
      {
        name: '饮食助手',
        icon: util.STATIC_BASE_URL + 'shipu.png',
        page: '../recipe/home'
      }
    ],
    toView: ['breakfast', 'lunch', 'supper'],
    curTipIndex: 0,
    curDietIndex: 0,
    dietName: ['早', '午', '晚', '加'],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    curTemplate: '',
    curTempData: {},
    shareMsg: {},
    maskHidden: true,
    pregdateRangeStart: today,
    pregdateRangeEnd: util.pregDateFormat.calPregdate()
  },
  onLoad: function (options) {
    // 检查是否登录、是否有预产期
    // let check = setInterval(() => {
    // let pregdate = wx.getStorageSync('pregdate')
    // let userInfo = wx.getStorageSync('userInfo')
    // if (!pregdate && userInfo) {
    //   clearInterval(check)
    //   setTimeout(() => {
    //     wx.showModal({
    //       title: '请设置预产期',
    //       showCancel: false,
    //       content: '设置预产期后，孕期提醒就能为您提供基于您当前孕周的定制化内容和工具',
    //       confirmText: '去设置',
    //       success: function (res) {
    //         if (res.confirm) {
    //           wx.navigateTo({
    //             url: '../set-pregdate/index'
    //           })
    //         }
    //       }
    //     })
    //   }, 500)
    // }
    // }, 100)
    let pregdate = wx.getStorageSync('pregdate')
    if (!pregdate) {
      wx.showModal({
        title: '请设置预产期',
        showCancel: false,
        content: '设置预产期后，孕期提醒就能为您提供基于您当前孕周的定制化内容和工具',
        confirmText: '去设置',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../set-pregdate/index'
            })
          }
        }
      })
    }
    let time = new Date().getHours()
    let curDietIndex
    if (time < 10) {
      curDietIndex = 0
    } else if (time > 9 && time < 14) {
      curDietIndex = 1
    } else if (time > 13) {
      curDietIndex = 2
    }
    this.setData({
      curDietIndex
    })
  },
  onReady: function () {},
  onShow: function () {
    let pregdate = globalData.pregdate
    let userInfo = globalData.userInfo
    let needSyncData = globalData.needSyncData
    if (needSyncData || pregdate != this.data.pregdate || (userInfo && this.data.userInfo ? userInfo.userId != this.data.userInfo.userId : userInfo != this.data.userInfo)) {
      this.updateData()
      globalData.needSyncData = false
    }
  },
  onHide: function () {},
  onUnload: function () {},
  onShareAppMessage () {
    return this.data.shareMsg
  },
  updateData: function () {
    // 根据全局预产期变量pregdate，更新数据
    let pregdate = globalData.pregdate
    let userInfo = globalData.userInfo
    let that = this
    this.setData({
      userInfo,
      pregdate,
      pregtoday: util.pregDateFormat.calPregweek(pregdate),
      percent: util.pregDateFormat.calPregweek(pregdate, 'per'),
      lastDays: util.pregDateFormat.calPregweek(pregdate, 'day'),
      pregweek: util.pregDateFormat.calPregweek(pregdate, 'week')
    })

    // 根据预产期（怀孕多少天）从接口请求首页数据
    api.fetchData({
      url: 'home',
      data: {},
      that,
      success: function (data) {
        that.setData({
          feeds: data,
          shareMsg: {
            title: `${that.data.pregtoday}准妈妈提醒`,
            desc: `${data.baby.description}`,
            path: `../home/index?sharedBy${that.data.userInfo.userId || 0}`
          }
        })
      }
    })
  },
  handlePopup: function (e) { // 首页上部宝宝信息点击查看详情
    let tempName = e.currentTarget.dataset.template
    let that = this
    if (tempName == 'mask') {
      that.setData({
        maskHidden: true,
        curTemplate: '',
        shareMsg: {
          title: `${that.data.pregtoday}准妈妈提醒`,
          desc: `${that.data.feeds.baby.description}`,
          path: `../home/index?sharedBy${that.data.userInfo.userId || 0}`
        }
      })
      return false
    }
    that.setData({
      curTemplate: tempName,
      maskHidden: false
    })
    switch (tempName) {
      case 'bchao': // B超图解读
        that.setData({
          curTempData: {
            pregweek: that.data.pregweek,
            img: that.data.feeds.baby.pic,
            text: that.data.feeds.baby.description
          },
          shareMsg: {
            title: `${that.data.pregtoday}B超图解读`,
            desc: `${that.data.feeds.baby.description}`,
            path: `../home/index?sharedBy${that.data.userInfo.userId || 0}`
          }
        })
        break
      case 'babySize': // 宝宝大小（水果）
        that.setData({
          curTempData: {
            pregweek: that.data.pregweek,
            weight: that.data.feeds.fruit.weight,
            height: that.data.feeds.fruit.height,
            fruit: that.data.feeds.fruit.fruit,
            fruitImg: that.data.feeds.fruit.pic,
            tip: that.data.feeds.fruit.content,
            sizeText: that.data.feeds.fruit.describe
          },
          shareMsg: {
            title: `${that.data.pregtoday}宝宝到底有多大`,
            desc: `${that.data.feeds.fruit.content}`,
            path: `../home/index?sharedBy${that.data.userInfo.userId || 0}`
          }
        })
        break
      case '3dVideo': // 3D胎儿视频
        that.setData({
          curTempData: {
            pregweek: that.data.pregweek,
            videoUrl: that.data.feeds.baby.video
          },
          shareMsg: {
            title: `${that.data.pregtoday}3D胎宝宝`,
            desc: `${that.data.feeds.baby.description}`,
            path: `../home/index?sharedBy${that.data.userInfo.userId || 0}`
          }
        })
        break
      case 'todayTips':
        that.setData({
          curTempData: {
            todayTips: that.data.feeds.notice.list
          },
          shareMsg: {
            title: `${that.data.pregtoday}贴心小提醒`,
            desc: `${that.data.feeds.notice.list}`,
            path: `../home/index?sharedBy${that.data.userInfo.userId || 0}`
          }
        })
        break
      case 'drinkTips':
        that.setData({
          curTempData: {
            drinkTips: that.data.feeds.helper.water
          },
          shareMsg: {
            title: `${that.data.pregtoday}孕妇喝水建议`,
            desc: `${that.data.feeds.helper.water.notice}`,
            path: `../home/index?sharedBy${that.data.userInfo.userId || 0}`
          }
        })
        break
      default:
        break
    }
  },
  scrollHandler: function (e) {
    let pregdate = this.data.pregdate
    if (e.detail.scrollTop > 70) {
      wx.setNavigationBarTitle({
        title: util.pregDateFormat.calPregweek(pregdate)[2]
      })
    } else {
      wx.setNavigationBarTitle({
        title: '孕期提醒'
      })
    }
  },
  changeTip: function (e) {
    let type = e.currentTarget.dataset.type
    let curTipIndex = this.data.curTipIndex
    let max = this.data.feeds.notice.list.length - 1
    type === 'next' ? (curTipIndex == max ? curTipIndex = 0 : curTipIndex++) : (curTipIndex == 0 ? curTipIndex = max : curTipIndex--)
    this.setData({
      curTipIndex
    })
  },
  dietChange: function (e) {
    wx.reportAnalytics('index_diet_change', {
      diet_index: e.detail.current
    })
    this.setData({
      curDietIndex: e.detail.current
    })
  },
  videoErrorCallback (e) {
    console.log('视频错误信息：', e.detail.errMsg)
  },
  clearCache (e) {
    try {
      wx.clearStorageSync()
    } catch (e) {
    // Do something when catch error
    }
  }
})
