let api = require('../../util/api.js')
let app = getApp()
let globalData = app.globalData
Page({
  data: {
    maskHidden: true,
    sexList: [{name: '1', value: '男宝宝', checked: true}, {name: '2', value: '女宝宝'}],
    sex: 1,
    urlType: 'url2',
    shareImg: '',
    man: [],
    woman: [],
    newName: '',
    shareMsg: {}
  },
  onReady: function () {
    // 登陆请求
    let that = this
    if (!globalData.userInfo) {
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
  },
  // 分享信息设置
  onShareAppMessage: function () {
    return this.data.shareMsg
  },
  // 处理蒙层
  handelMask: function (e) {
    let that = this
    let template = e.currentTarget.dataset.template
    that.setData({
      maskHidden: !that.data.maskHidden,
      template
    })
    if (template === 'share') {
      let id = e.currentTarget.dataset.id
      that.fetchSingleData(id, 'share')
      that.setData({
        shareMsg: {
          title: '给宝宝起了个名，好听吗？',
          path: '../name/single-rate?nameId=' + id + '&shareBy=' + globalData.userInfo.userId
        }
      })
    }
  },
  nameNav: function (e) {
    let id = e.currentTarget.dataset.id
    this.fetchSingleData(id, 'nav')
  },
  // 获取单个数据
  fetchSingleData: function (id, type) {
    let that = this
    api.fetchData({
      url: 'service/alternate/name/' + id,
      data: {},
      that,
      success: function (res) {
        that.setData({
          shareImg: res.constellation.image,
          shareName: res.name
        })
        console.log(type)
        if (type === 'nav') {
          wx.navigateTo({
            url: '../name/detail?surname= &name=' + res.name + '&word= &sex=' + res.gender + '&pregdate=' + (res.birth.split(' ')[0]) + '&isTest=true&from=alternative'
          })
        }
      }
    })
  },
  // 监听新增名字
  bindNewname: function (e) {
    this.setData({
      newName: e.detail.value
    })
  },
  // 监听性别
  bindSexChange: function (e) {
    this.setData({
      sex: e.detail.value
    })
  },
  // 错误提醒
  showToast: function (hint) {
    wx.showToast({
      title: hint,
      image: '../../image/wrong.png',
      duration: 1000
    })
  },
  // 重复校验
  verfiyRepeat: function (data, gender) {
    let list = this.data.woman
    list.forEach((el) => {
      return el.name === ''
    })
  },
  // 获取数据
  updateData: function () {
    let that = this
    api.fetchData({
      url: 'service/alternate/name',
      data: {user_id: globalData.userInfo.userId},
      that,
      success: function (res) {
        res.man.forEach((el) => {
          el.score = el.score ? el.score + '分' : '暂无打分'
        })
        res.woman.forEach((el) => {
          el.score = el.score ? el.score + '分' : '暂无打分'
        })
        that.setData({
          man: res.man,
          woman: res.woman,
          shareMsg: {
            title: '选择恐惧症了，快来帮帮我~',
            path: '../name/rater?shareBy=' + globalData.userInfo.userId
          }
        })
      }
    })
  },
  // 新增名字
  addName: function () {
    let that = this
    let parmas = {
      name: that.data.newName,
      birth: globalData.pregdate,
      user_id: globalData.userInfo.userId,
      gender: that.data.sex
    }
    let repeat = false
    var i = /[0-9]+/
    var str = /[A-Za-z]/
    var spec = /[,.<>{}~!@#$%^&*]/
    let hint = ''
    if (parmas.gender > 1) {
      this.data.woman.forEach((el) => {
        repeat = repeat || el.name === parmas.name
      })
    } else {
      this.data.man.forEach((el) => {
        repeat = repeat || el.name === parmas.name
      })
    }
    if (!parmas.name) {
      hint = '名字不能为空哦~'
      that.showToast(hint)
    } else if (parmas.name.split('').length < 2) {
      hint = '至少要两个字哦~'
      that.showToast(hint)
    } else if (parmas.name.split('').length > 6) {
      hint = '名字不能超过六个字哦'
      that.showToast(hint)
    } else if (i.test(parmas.name) || str.test(parmas.name) || spec.test(parmas.name)) {
      hint = '只支持中文哦~'
      that.showToast(hint)
    } else if (repeat) {
      hint = '不要重复添加同一名字哦'
      that.showToast(hint)
    } else {
      api.postData({
        url: 'service/alternate/name',
        data: parmas,
        that,
        success: function (res) {
          wx.showToast({
            title: '成功加入备选库',
            icon: 'success',
            duration: 1000,
            success: function () {
              that.setData({
                maskHidden: true,
                newName: ''
              })
            }
          })
          that.updateData()
        },
        fail: function (res) {
          console.log(res)
        }
      })
    }
  },
  // 删除名字
  removeName: function (e) {
    let that = this
    wx.showModal({
      title: '提示',
      content: '确定要删除该名字吗',
      success: function (res) {
        if (res.confirm) {
          api.postData({
            url: 'service/alternate/name/delete/' + e.currentTarget.dataset.id,
            data: {},
            that,
            success: function (res) {
              that.updateData()
              wx.showToast({
                title: '删除成功'
              })
            },
            fail: function (res) {
              console.log(res)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})
