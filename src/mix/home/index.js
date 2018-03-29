let util = require('../../pregnotice/util/util.js')
let api = require('../../pregnotice/util/api.js')

let today = util.pregDateFormat.getFormatDate()

let network = require('../../modules/network/network')
let router = require('../../modules/router/index')
let tool = require('../../modules/tools/index')

let CIData = require('../../modules/CIData/index')

let isLoading = false

const audioPlayer = require('../../modules/audioPlayer/index')

Page({
  data: {
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
        page: '/pregnotice/pages/can-i-eat/index'
      },
      {
        name: '症状百科',
        icon: util.STATIC_BASE_URL + 'jiankang.png',
        page: '/pregnotice/pages/symptom/index'
      },
      {
        name: '胎教音乐',
        icon: util.STATIC_BASE_URL + 'yinyue.png',
        page: '/pregnotice/pages/music/list'
      },
      {
        name: '饮食助手',
        icon: util.STATIC_BASE_URL + 'shipu.png',
        page: '/pregnotice/pages/recipe/home'
      },
      {
        name: '起名测名',
        icon: util.STATIC_BASE_URL + 'name.png',
        page: '/pregnotice/pages/name/index',
        label: 'new'
      }
    ],
    toolboxLite: [
      {
        name: '能不能吃',
        icon: util.STATIC_BASE_URL + 'meishi.png',
        page: '/pregnotice/pages/can-i-eat/index'
      },
      {
        name: '症状百科',
        icon: util.STATIC_BASE_URL + 'jiankang.png',
        page: '/pregnotice/pages/symptom/index'
      },
      {
        name: '饮食助手',
        icon: util.STATIC_BASE_URL + 'shipu.png',
        page: '/pregnotice/pages/recipe/home'
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
    pregdateRangeEnd: util.pregDateFormat.calPregdate(),
    // weex
    cat_activity: [],
    flash_pics1: [],
    topic_tags: [],
    recommend_course: [],
    isFirst: true,
    lastDate: null,
    ifAudioHome: false,
    isPlay: false,
    playlist: [],
    songIndex: 0,
    poster: '',
    anim: {},
    anim_played: false
  },
  onLoad: function (options) {

    console.log('传入参数：',options)

    var self = this
    setTimeout(function () {
      network.checkLoginState(function (res) {
        if (res.ret === 1) {
          console.log('首页 成功')
          self.loginSuccess()
        } else {
          console.log('首页 失败')
        }
      }, true);

      self.data.isFirst = false;
    }, 1);


    audioPlayer.stateChangeHandler = function (e) {
      self.setData({
        isPlay: e
      })
    }

    audioPlayer.indexChangeHandler = function (e) {
      self.changeIndex(e)
    }


    global.weex = { a: 1 }

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
      curDietIndex,
    })

    // 注册
    // wx.navigateToMiniProgram({
    //   appId: 'wxeb490c6f9b154ef9', //固定为此 appid，不可改动
    //   extraData: {
    //     encrypt_card_id:"CzYZhj3KbxPkJPrH03REqSDAGTGowKg22ARjgL6Z9dO4lWgd7wsN11p19q1JJGGg",
    //     outer_str:"wyeth_mini",
    //     biz:"MjM5MDQxNDI3NA%3D%3D"
    //   }, // 包括 encrypt_card_id, outer_str, biz三个字段，须从 step3 中获得的链接中获取参数
    //   success: function () {
    //     console.log("login success")
    //   },
    //   fail: function () {
    //     console.log("login fail")

    //   },
    //   complete: function () {
    //     console.log("login complete")

    //   }
    // })

  },
  onReady: function () { },
  onShow: function () {

    let self = this

    if (!this.data.isFirst) {
      let animation = wx.createAnimation({
        timingFunction: 'ease',
      })
      animation.right(0).step({ duration: 800 }).right('-70rpx').step({ delay: 300, duration: 500 })
      setTimeout(function () {
        self.setData({
          anim: animation.export()
        })
      }, 300)

      CIData.sendEvent('trackPageView', { url: "/pages/home" })
    }


    if (!this.data.isFirst && (this.data.lastDate !== new Date().getDate() || getApp().globalData.needSyncData)) {
      this.refreashData()
    }

  },
  loginSuccess: function () {

    var self = this
    let pregdate = getApp().globalData.pregdate//wx.getStorageSync('pregdate')
    if (!pregdate) {
      wx.showModal({
        title: '请设置预产期',
        showCancel: false,
        content: '设置预产期后，孕期提醒就能为您提供基于您当前孕周的定制化内容和工具',
        confirmText: '去设置',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pregnotice/pages/set-pregdate/index'
            })
          }
        }
      })
    } else {
      self.refreashData()
    }
  },
  refreashData: function () {
    this.data.isFirst = false

    let globalData = getApp().globalData

    let pregdate = globalData.pregdate

    this.updateData()
  },
  onHide: function () { },
  onUnload: function () { },
  onShareAppMessage() {
    return this.data.shareMsg
  },
  onPullDownRefresh() {
    console.log('下拉刷新')
    this.refreashData()

    setTimeout(function () {
      wx.stopPullDownRefresh()
    }, 2000);
  },
  stopEvent: function () {
  },
  showAudioCenter: function () {
    var self = this
    this.setData({
      ifAudioHome: true,
    })

    if (!isLoading) {
      this.requestPlaylist()
    } else {
      this.loadPlaylist()
    }
  },
  closeAudioCenter: function () {
    var self = this
    this.setData({
      ifAudioHome: false,
    })
  },
  audioStart: function () {
    if (this.data.isPlay) {
      audioPlayer.pause()
      CIData.sendEvent('smart_control', { state: "pause" })

    } else {
      CIData.sendEvent('smart_control', { state: "play" })

      this.playIndex(0)
    }
  },
  audioRefresh: function () {
    CIData.sendEvent('smart_refresh', {})

    this.requestPlaylist()
  },
  clickSong: function (e) {
    let item = e.currentTarget.dataset.item
    console.log('clickSong:', item)

    CIData.sendEvent('smart_click', { cid:  item.id})

    let index = e.currentTarget.dataset.index

    if (audioPlayer.songIndex === index && this.data.isPlay) {
      this.setData({
        ifAudioHome: false,
      })

      getApp()._params = { id: audioPlayer.songPlay.id }
      router.push({ url: '/pages/course/courseAudio' })
    } else {
      this.playIndex(index)
    }
  },
  playIndex: function (index) {
    audioPlayer.autoPlay = true;
    audioPlayer.songIndex = index;
    audioPlayer.play();

    this.changeIndex(index)
  },
  changeIndex: function (index) {
    let poster = this.data.playlist[index].poster

    var self = this
    this.setData({
      songIndex: index,
      poster: poster
    })
  },
  requestPlaylist: function () {
    let id_array = [];
    for (let song in audioPlayer.playlist) {
      id_array.push(audioPlayer.playlist[song].id);
    }

    var self = this;
    isLoading = true;
    network.getPlayList(JSON.stringify(id_array), function (res) {
      self.isLoading = false;
      if (res.ret === 1 && res.data) {
        if (
          audioPlayer.songPlay &&
          audioPlayer.songPlay.src &&
          audioPlayer.songPlay.src.length > 0
        ) {
          res.data.unshift(audioPlayer.songPlay);
        }
        audioPlayer.songIndex = 0
        audioPlayer.playlist = res.data;

        self.loadPlaylist()
      }
    });
  },
  loadPlaylist: function () {
    var self = this
    for (let i = 0; i < audioPlayer.playlist.length; i++) {
      let item = audioPlayer.playlist[i]
      item.audio_time = tool.timeFormit(item.audio_duration)

      if (item.img && item.img.indexOf('?') !== -1) {
        item.poster = item.img.substring(0, item.img.indexOf('?'))
      } else {
        item.poster = item.img
      }
    }

    self.setData({
      songIndex: audioPlayer.songIndex,
      playlist: audioPlayer.playlist,
      songIndex: audioPlayer.songIndex
    })

    self.changeIndex(audioPlayer.songIndex);
  },
  onActivityClick: function (e) {
    let item = e.currentTarget.dataset.item
    console.log('onActivityClick:', item)

    CIData.sendEvent('home_activity', { id: item.link })

    getApp()._params = { id: item.link }
    router.push({ url: '/pages/course/courseSeries' })
  },
  onTagClick: function (e) {
    let item = e.currentTarget.dataset.item

    console.log('onTagClick:', item)

    CIData.sendEvent('home_tag', { tid: item.id })

    getApp()._params = {
      type: 0,
      tag: item
    }

    router.switchTab({
      url: "/pages/index", success: function (res) {

      }, fail: function (err) {
        console.log(err)
      }
    });
  },
  onStageClick: function (e) {
    let index = e.currentTarget.dataset.index
    let item = e.currentTarget.dataset.item

    console.log('onStageClick:', index)

    CIData.sendEvent('home_stage', { id: item.id })

    getApp()._params = {
      type: 0,
      stage: index,
      tag: 0
    }

    router.switchTab({
      url: "/pages/index", success: function (res) {

      }, fail: function (err) {
        console.log(err)
      }
    });
  },
  clickMore: function () {
    console.log('跳转 全部页')


    CIData.sendEvent('home_more', { type: 'noparam' })


    getApp()._params = {
      type: 1,
      tag: 0
    }

    router.switchTab({
      url: "/pages/index", success: function (res) {

      }, fail: function (err) {
        console.log(err)
      }
    });
  },
  onClassClick: function (e) {
    let item = e.currentTarget.dataset.item

    console.log('onClassClick:', item)

    CIData.sendEvent('home_course', { id: item.id })


    tool.courseRoute(item)
  },
  getData: function () {
    let globalData = getApp().globalData
    let userInfo = globalData.userInfo

    var self = this
    network.getMiniHomePageData({}, function (res) {

      if (res.ret === 1) {

        getApp().globalData.needSyncData = false

        self.data.lastDate = new Date().getDate()


        if (!self.anim_played) {
          let animation = wx.createAnimation({
            timingFunction: 'ease'
          })
          animation.right(0).step({ duration: 800 }).right('-70rpx').step({ delay: 300, duration: 500 })
          self.anim_played = true
          setTimeout(function () {
            self.setData({
              anim: animation.export()
            })
          }, 300)
        }

        CIData.sendEvent('trackPageView', { url: "/pages/home" })

        CIData.recActionExpose_array(res.data.recommend_course);

        let data = res.data.preg_data

        let tags = res.data.index_tags.concat(res.data.top_tags)

        self.setData({
          flash_pics1: res.data.flash_pics1,
          topic_tags: tags,
          index_tags: res.data.index_tags,
          cat_activity: res.data.new_cat_activity,
          recommend_course: res.data.recommend_course,
          feeds: data,
          shareMsg: {
            title: `${self.data.pregtoday}准妈妈提醒`,
            desc: `${data.baby.description}`,
            path: `/mix/home/index?sharedBy=${userInfo.id || 0}`
          }
        })
      }
    })
  },
  updateData: function () {
    // 根据全局预产期变量pregdate，更新数据
    let globalData = getApp().globalData

    let pregdate = globalData.pregdate
    let userInfo = globalData.userInfo
    let that = this
    this.setData({
      preg: globalData.preg,
      userInfo,
      pregdate,
      pregtoday: util.pregDateFormat.calPregweek(pregdate),
      percent: util.pregDateFormat.calPregweek(pregdate, 'per'),
      lastDays: util.pregDateFormat.calPregweek(pregdate, 'day'),
      pregweek: util.pregDateFormat.calPregweek(pregdate, 'week')
    })

    this.getData()
  },
  handlePopup: function (e) { // 首页上部宝宝信息点击查看详情

    let tempName = e.currentTarget.dataset.template

    if (tempName === 'momChange') {
      CIData.sendEvent('home_pregnotice', { event: 'momChange' })

      wx.navigateTo({
        url: "/pregnotice/pages/mom-weekly/index"
      })
      return
    }

    let globalData = getApp().globalData
    let userInfo = globalData.userInfo

    let that = this
    if (tempName == 'mask') {
      that.setData({
        maskHidden: true,
        curTemplate: '',
        shareMsg: {
          title: `${that.data.pregtoday}准妈妈提醒`,
          desc: `${that.data.feeds.baby.description}`,
          path: `../home/index?sharedBy${userInfo.id || 0}`
        }
      })
      return false
    }
    that.setData({
      curTemplate: tempName,
      maskHidden: false
    })

    if (!this.data.feeds) {
      return
    }

    switch (tempName) {
      case 'bchao': // B超图解读
        CIData.sendEvent('home_pregnotice', { event: 'avatar' })

        that.setData({
          curTempData: {
            pregweek: that.data.pregweek,
            img: that.data.feeds.baby.pic,
            text: that.data.feeds.baby.description
          },
          shareMsg: {
            title: `${that.data.pregtoday}B超图解读`,
            desc: `${that.data.feeds.baby.description}`,
            path: `../home/index?sharedBy${userInfo.id || 0}`
          }
        })
        break
      case 'babySize': // 宝宝大小（水果）
        CIData.sendEvent('home_pregnotice', { event: 'babySize' })

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
            path: `../home/index?sharedBy${userInfo.id || 0}`
          }
        })
        break
      case '3dVideo': // 3D胎儿视频
        CIData.sendEvent('home_pregnotice', { event: '3dVideo' })

        that.setData({
          curTempData: {
            pregweek: that.data.pregweek,
            videoUrl: that.data.feeds.baby.video
          },
          shareMsg: {
            title: `${that.data.pregtoday}3D胎宝宝`,
            desc: `${that.data.feeds.baby.description}`,
            path: `../home/index?sharedBy${userInfo.id || 0}`
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
            path: `../home/index?sharedBy${userInfo.id || 0}`
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
            path: `../home/index?sharedBy${userInfo.id || 0}`
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
  videoErrorCallback(e) {
    console.log('视频错误信息：', e.detail.errMsg)
  },
  clearCache(e) {
    try {
      wx.clearStorageSync()
    } catch (e) {
      // Do something when catch error
    }
  }
})
