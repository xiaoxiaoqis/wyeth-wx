

const  types = {
  'success': {
    title: '成功',
    duration: 1500,
    icon: "success",
    image: '/assets/toast_success.png'
  },
  'fail': {
    title: '失败',
    duration: 2000,
    icon: "success",
    image: '/assets/toast_fail.png'
  },
  'loading': {
    title: '数据加载中',
    duration: 10000,
    icon: "loading",
  }
}

var toast = {
  showToast: function (obj) {

    var params = types[obj.type]

    obj = Object.assign(params,obj)

    wx.showToast(obj)
  },
  hideToast: function () {
    wx.hideToast()
  },
  showLoading: function(obj) {
    wx.showToast(Object.assign({
      title: '正在加载',
      icon: 'loading',
      duration: 10000
    }, obj))
  },
  hideLoading: function() {
    // wx.hideLoading()
    wx.hideToast()
  }
}

module.exports = toast
