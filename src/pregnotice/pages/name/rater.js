let app = getApp()
let globalData = app.globalData
let api = require('../../util/api.js')
Page({
  data: {
    urlType: 'url2',
    options: {},
    star: {
      stars: [0, 1, 2, 3, 4]
    },
    man: [],
    woman: [],
    extraName: ''
  },
  onLoad: function (options) {
    this.setData({
      options
    })
  },
  onReady: function () {
    this.updateData()
  },
  select: function (e) {
    var key = e.currentTarget.dataset.key
    var index = e.currentTarget.dataset.index
    var gender = e.currentTarget.dataset.gender
    let list = gender > 1 ? this.data.woman : this.data.man
    if (!list[index].bannedClick) {
      if (gender > 1) {
        this.data.woman[index].key = key
        this.setData({
          woman: this.data.woman
        })
      } else {
        this.data.man[index].key = key
        this.setData({
          man: this.data.man
        })
      }
      this.submitScore(index, gender, (key * 2).toString())
    }
  },
  submitScore: function (idx, sex, score) {
    let that = this
    let nameId = sex > 1 ? that.data.woman[idx].id : that.data.man[idx].id
    api.postData({
      url: 'service/alternate/name/' + nameId,
      data: {score, user_id: that.data.options.shareBy},
      that,
      success: function (res) {
        wx.showToast({
          title: '评分成功',
          icon: 'success',
          duration: 1000
        })
        if (sex > 1) {
          that.data.woman[idx].bannedClick = true
          that.setData({
            woman: that.data.woman
          })
        } else {
          that.data.man[idx].bannedClick = true
          that.setData({
            man: that.data.man
          })
        }
      },
      fail: function (res) {
        console.log(res)
      }
    })
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
        url: 'service/alternate/name/NY7yM7WA',
        data: {name: name, user_id: that.data.options.shareBy},
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
  updateData: function () {
    let that = this
    let options = that.data.options
    api.fetchData({
      url: 'service/alternate/name',
      data: {user_id: options.shareBy},
      that,
      success: function (res) {
        res.man.forEach((el) => {
          el.key = 0
          el.bannedClick = false
        })
        res.woman.forEach((el) => {
          el.key = 0
          el.bannedClick = false
        })
        that.setData({
          man: res.man,
          woman: res.woman
        })
      }
    })
  }
})
