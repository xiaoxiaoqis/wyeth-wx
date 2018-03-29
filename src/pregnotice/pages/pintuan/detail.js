let api = require('../../util/api.js')
let app = getApp()
let globalData = app.globalData
let WxParse = require('../../components/wxParse/wxParse.js')
// 获取活动倒计时时间
function countDown (that) {
  let end = that.data.info.end
  // let end = '2017-05-10 18:00:00'
  let endTamp = new Date(end).getTime()
  let nowTamp = new Date().getTime()
  let totalSec = endTamp - nowTamp
  if (totalSec < 0) { totalSec = 0 }
  that.setData({
    clock: dateFormat(totalSec)
  })
  setTimeout(function () {
    totalSec -= 10
    countDown(that)
  }, 10)
}
// 将时间转换为天/小时/分/秒
function dateFormat (microSec) {
  var second = Math.floor(microSec / 1000)
  var day = fillZero(Math.floor(second / (3600 * 24)))
  var hr = fillZero(Math.floor((second - day * 3600 * 24) / 3600))
  var min = fillZero(Math.floor((second - day * 3600 * 24 - hr * 3600) / 60))
  var sec = fillZero((second - day * 3600 * 24 - hr * 3600 - min * 60))
  // var micro_sec = fillZero(Math.floor((microSec % 1000) / 10));
  // var timeArray = [day,hr,min,sec,micro_sec]
  var timeArray = [day, hr, min, sec]
  return timeArray
}
// 填0
function fillZero (num) {
  return num < 10 ? '0' + num : num
}
Page({
  data: {
    userInfo: globalData.userInfo,
    title: '',
    butText: '',
    baseUrl: 'http://www.ladybirdedu.com/pregnotice/images/wx-static/',
    showClock: false,
    showIcon: false,
    showShare: false,
    maskHidden: true,
    actId: 0,
    winnerList: ['嘟噜噜', 'Soul颖子', '漂亮的宝宝',
      '稀饭泡馒头', 'Ms.king', 'Miss Feng', '💕 依 姑 娘',
      '汤家美媳妇', 'YY', '小郭', '锦瑟棉花糖',
      '喜槑', '啦啦啦啦', '婷子🍃', '🍒',
      '那时光手作食', '孕妈201', '花仙子', '哈尔'],
    imageList: [],
    info: {},
    list: [],
    finish: [],
    clock: [],
    shareMsg: {}
  },
  onLoad: function (options) {
    this.setData({
      actId: parseInt(options.act_id)
    })
    this.updateData()
  },
  onShareAppMessage: function () {
    return this.data.shareMsg
  },
  // handelMask: function() {
  //   this.setData({
  //     maskHidden: true
  //   })
  // },

  // 根据状态设置标题
  getTitle: function () {
    let info = this.data.info
    let title = this.data.title
    let remain_user = parseInt(info.limit_user) - parseInt(info.sign_user)
    if (info.is_join) {
      if (info.state) {
        if (info.state === 1) {
          title = '恭喜你！拼团成功！等待发货！'
        } else { title = '恭喜你！拼团成功！等待抽取！' }
      } else {
        if (info.is_leader) {
          title = '您已开团，还差' + remain_user + '人组团成功<br/>快喊小伙伴一起拼团吧~'
        } else { title = '您已参团，还差' + remain_user + '人组团成功<br/>快喊小伙伴一起拼团吧~' }
      }
    } else {
      if (info.is_new) {
        if (!info.sign_user) {
          title = info.limit_user + '人参团，即可组团成功<br/>快喊小伙伴一起拼团吧~'
        } else {
          if (info.state) {
            title = '团已满'
            this.data.showIcon = true
          } else { title = '仅剩' + remain_user + '个名额'; this.data.showClock = true }
        }
      } else { title = info.limit_user + '人参团，即可组团成功<br/>快喊小伙伴一起拼团吧~' }
    }
    this.setData({
      title: title,
      showClock: this.data.showClock
    })

    // 渲染html组件
    WxParse.wxParse('title', 'html', title, this, 0)
    this.getButton(title)
  },

  // 根据标题设置按钮文章
  getButton: function (title) {
    let butText = '我要当团长'
    if (title.indexOf('剩') >= 0) {
      butText = '一键参团'
    } else if (title.indexOf('您已') >= 0) {
      butText = '喊人参团'
      this.setData({
        showShare: true
      })
    }
    this.setData({
      butText: butText
    })
  },
  // 更新数据
  updateData: function () {
    var that = this
    var id = that.data.userInfo.userId
    var actId = that.data.actId
    api.fetchData({
      url: 'activity/pin',
      data: { act_id: actId, user_id: id},
      that,
      success: function (data) {
        data.info.limit_user = parseInt(data.info.limit_user)
        data.info.state = parseInt(data.info.state)
        for (var i = 0; i < data.info.limit_user; i++) {
          that.data.imageList[i] = i
        }
        // 渲染html组件
        var content = data.info.content
        WxParse.wxParse('content', 'html', content, that, 10)
        that.setData({
          info: data.info,
          list: that.data.list.concat(data.list),
          finish: that.data.finish.concat(data.finish),
          imageList: that.data.imageList,
          shareMsg: {
            title: `我0元拼了【孕期提醒】孕妇日记创意贴纸，12000份免费送`,
            desc: `快来加入我的团，上万份创意贴纸，人人有份！`,
            path: `../pintuan/detail?shareBy=${that.data.userInfo.userId || 0}`
          }
        })
        that.getTitle()
        countDown(that)
      }
    })
  },
  // 点击申请
  apply: function () {
    var that = this
    var id = that.data.userInfo.userId
    console.log(id)
    var actId = that.data.actId
    var leader = that.data.info.pinker_leader
    var group = that.data.info.group_id
    var action = (that.data.butText === '我要当团长') ? 'create' : 'join'
    if (that.data.butText === '我要当团长' || that.data.butText === '一键参团') {
      // 未登录弹出登陆提示
      if (!id) {
        wx.showModal({
          title: '未登陆',
          content: '您还没有登陆，本活动需要登陆才能参加哦~',
          confirmText: '去登陆',
          showCancel: false,
          success: function (res) {
            wx.switchTab({
              url: '../my/my'
            })
          }
        })
      } else {
        wx.request({
          url: 'https://api.ladybirdedu.com/v1/activity/pin/join',
          method: 'post',
          data: {
            user_id: id,
            act_id: actId,
            pinker_leader: leader,
            action: action,
            group: group
          },
          success: function (res) {
            wx.showToast({
              title: '申请成功',
              icon: 'success',
              duration: 10000,
              complete: function () {
                setTimeout(function () {
                  that.updateData()
                }, 1000)
              }
            })
          }
        })
      }
    }
  }
})
