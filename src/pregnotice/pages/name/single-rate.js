let app = getApp()
let globalData = app.globalData
let api = require('../../util/api.js')
Page({
  data: {
    urlType: 'url2',
    star: {
      stars: [0, 1, 2, 3, 4]
    },
    bannedClick: false,
    detail: {},
    intro: '',
    detailIntro: '',
    constellation: {},
    extraName: ''
  },
  onLoad: function (options) {
    this.setData({
      nameId: options.nameId,
      shareBy: options.shareBy
    })
  },
  onReady: function () {
    this.updateData()
  },
  select: function (e) {
    let that = this
    if (!that.data.bannedClick) {
      var key = e.currentTarget.dataset.key
      that.setData({
        'detail.key': key
      })
      api.postData({
        url: 'service/alternate/name/' + that.data.nameId,
        data: {score: (key * 2).toString(), user_id: that.data.shareBy},
        that,
        success: function (res) {
          wx.showToast({
            title: '评分成功',
            icon: 'success',
            duration: 1000
          })
          that.setData({
            bannedClick: true
          })
        },
        fail: function (res) {
          console.log(res)
        }
      })
    }
  },
  bindInputChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      extraName: e.detail.value
    })
  },
  showToast: function (hint) {
    wx.showToast({
      title: hint,
      image: '../../image/wrong.png',
      duration: 1000
    })
  },
  addExtraName: function () {
    let that = this
    let name = that.data.extraName
    var i = /[0-9]+/
    var str = /[A-Za-z]/
    var spec = /[,.<>{}~!@#$%^&*]/
    let hint = ''
    if (!name) {
      hint = '名字不能为空哦~'
      that.showToast(hint)
    } else if (name.split('').length < 2) {
      hint = '至少要两个字哦~'
      that.showToast(hint)
    } else if (name.split('').length > 6) {
      hint = '名字不能超过六个字哦'
      that.showToast(hint)
    } else if (i.test(name) || str.test(name) || spec.test(name)) {
      hint = '只支持中文哦~'
      that.showToast(hint)
    } else {
      api.postData({
        url: 'service/alternate/name/' + that.data.nameId,
        data: {name, user_id: that.data.shareBy},
        that,
        success: function (res) {
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 1000
          })
        },
        fail: function (res) {
          console.log(res)
        }
      })
    }
  },
  updateData: function (options) {
    let that = this
    api.fetchData({
      url: 'service/alternate/name/' + that.data.nameId,
      data: {},
      that,
      success: function (res) {
        let info = {
          name: res.name,
          birth: res.birth,
          key: 0,
          id: res.id
        }
        let dateArray = res.birth.split(' ')[0].split('-')
        let sex = res.gender === 1 ? '小男生' : '小公主'
        let intro = dateArray[0] + '年' + dateArray[1] + '月' + dateArray[2] + '日' + res.constellation.name + '座的' + sex
        that.setData({
          intro,
          detail: info,
          constellation: res.constellation
        })
      }
    })
  }
})
