var app = getApp()
var globalData = app.globalData
Page({
  data: {
    userInfo: null,
    pregdate: '',
    pregtoday: ''
  },
  onLoad: function (options) {
    this.updateData()
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    if (this.data.pregdate != globalData.pregdate) {
      this.updateData()
    }
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  updateData () {
    this.setData({
      userInfo: globalData.userInfo,
      pregdate: globalData.pregdate,
      pregtoday: globalData.pregtoday
    })
  },
  login () {
    let that = this
    app.askForWxLogin(() => {
      that.updateData()
    }, '', true)
  },
  askForLogin () {
    let that = this
    app.askForWxLogin(() => {
      that.updateData()
    })
  },
  logout () {
    let that = this
    app.askForLogout(() => {
      that.updateData()
    })
  }
})
