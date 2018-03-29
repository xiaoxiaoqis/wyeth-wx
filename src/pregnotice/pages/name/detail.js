let api = require('../../util/api.js')
let WxParse = require('../../components/wxParse/wxParse.js')
let app = getApp()
let globalData = app.globalData
Page({
  data: {
    urlType: 'url3',
    basicInfo: '',
    name: ''
  },
  onLoad: function (options) {
    this.setData({
      options
    })
  },
  onReady: function () {
    let options = this.data.options
    console.log(options)
    this.setData({
      pregdate: options.pregdate,
      babySex: options.sex < 2 ? '男宝宝' : '女宝宝',
      navTitle: options.isTest === 'true' ? '测名结果' : '起名结果',
      name: options.name ? options.surname + options.name : '',
      operateTip: options.from ? '返回备选库' : '加入备选库'
    })
    wx.setNavigationBarTitle({
      title: this.data.navTitle
    })
    let basicInfo
    if (options.isTest === 'true') {
      basicInfo = this.data.babySex + '，取名为“' + options.surname + options.name + '”，不知道这个名字怎么样？'
    } else {
      basicInfo = '宝宝姓' + options.surname + '，取个' + this.data.babySex + '的名字'
      if (options.word) {
        basicInfo = basicInfo + ',最好带' + options.word + '字'
      }
    }
    this.setData({
      basicInfo
    })
    this.updateData(options)
  },
  onShareAppMessage: function () {
    return {
      title: `起个好名，让宝宝赢在起跑线上`,
      desc: `起名测名服务上线啦！`,
      path: `../name/index?shareBy=${globalData.userInfo.userId || 0}`
    }
  },
  updateData: function (options) {
    let that = this
    let pregdate = options.pregdate.split('-')
    let parmas = {
      surname: options.surname,
      sex: options.sex,
      mingname: options.name,
      in_name: options.word,
      year: pregdate[0],
      month: pregdate[1],
      day: pregdate[2]
    }
    let url = options.isTest === 'true' ? 'examname_notice.php' : 'getname_notice.php'
    api.fetchData({
      url,
      data: parmas,
      that,
      success: function (data) {
        let name = data.match('给您推荐的名字是：<strong>') ? data.split('给您推荐的名字是：<strong>')[1].split('</strong></h4>')[0] : ''
        that.setData({
          name: options.isTest === 'true' ? that.data.name : name
        })
        let content = data
        WxParse.wxParse('content', 'html', content, that)
      }
    })
  },
  addName: function () {
    let that = this
    let parmas = {
      name: that.data.name,
      birth: that.data.pregdate,
      user_id: globalData.userInfo.userId,
      gender: that.data.options.sex
    }
    if (that.data.operateTip.match('返回')) {
      console.log(that.data.operateTip)
      wx.navigateBack({
        delta: 1
      })
    } else {
      api.postData({
        url: 'service/alternate/name',
        data: parmas,
        that,
        success: function (res) {
          wx.showModal({
            title: '加入成功',
            content: '名字已经加入到备选库啦，去看看',
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: 'alternative'
                })
              }
            }
          })
        },
        fail: function (res) {
          console.log(res)
        }
      })
    }
  }
})
