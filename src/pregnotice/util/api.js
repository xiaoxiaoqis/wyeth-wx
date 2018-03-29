const md5 = require('./md5.min.js')
// API的固定URL前置
const API_BASE_URL = 'https://api.ladybirdedu.com/v1/'
const API_BASE_URL2 = 'https://api.ladybirdedu.com/app/v1/'
const API_BASE_URL3 = 'https://m.ci123.com/box/name/sub/'
const API_KEY = 'be388cc2f961e2a96d43895f27966e73'
let app = getApp()

function globalQueryParams () {
  let globalData = getApp().globalData
  return {
    wxapp: '1',
    pregdate: globalData.pregdate,
    week: JSON.stringify(globalData.pregweek),
    user_id: globalData.userInfo ? globalData.userInfo.userId : 0
  }
}

/**
 * 处理接口请求失败的方法：调用Modal,让用户重新加载
 * @param  {Object} that 必选，Page实例，一般是页面的this对象
 * @return 调用页面的updateData()方法，须在Page定义
 */
function handleUpdateDataFail (that) {
  wx.showModal({
    title: '网络不稳定',
    content: '数据加载失败，请确认网络连接正常后再试',
    confirmText: '重新加载',
    showCancel: false,
    success: function (res) {
      if (res.confirm) {
        that.updateData()
      }
    }
  })
}
/**
 * 获取数据
 * @param  {String} url     必选，api请求接口，不需要公共BASE_URL
 * @param  {Object} data    必选，query参数，可以为空
 * @param  {Object} that    必选，page实例，调用setData方法
 * @param  {Function} success 可选，接口请求成功后调用的方法，默认返回请求获取的数据data
 * @return {Objec}         返回数据在success里面调用，如：success(data){dosomething with    data}
 */
function fetchData ({
  url,
  data,
  that,
  success
}) {
  // 切换url
  if (that.data.urlType) {
    if (that.data.urlType === 'url3') {
      url = API_BASE_URL3 + url
    } else {
      url = API_BASE_URL2 + url
    }
  } else {
    url = API_BASE_URL + url
  }
  wx.showNavigationBarLoading()
  wx.showToast({
    title: '正在加载',
    icon: 'loading',
    duration: 10000
  })
  wx.request({
    url,
    data: Object.assign(globalQueryParams(), data),
    success: function (res) {
      if (res.data.status === 'success' || res.data.state === 'success') {
        success(res.data.data)
      } else {
      // handleUpdateDataFail(that)
      }
      wx.hideToast()
      wx.hideNavigationBarLoading()
    },
    fail: function (res) {
      // handleUpdateDataFail(that)
      wx.hideNavigationBarLoading()
      wx.hideToast()
    }
  })
}
/**
 * 获取列表数据
 * @param  {String} url     必选，api请求接口，不需要公共BASE_URL
 * @param  {Object} data    必选，query参数，可以为空
 * @param  {Object} that    必选，page实例，调用setData方法
 * @param  {Function} success 可选，接口请求成功后调用的方法，默认返回请求获取的数据data
 * @param  {function} fail    可选，接口请求失败调用的方法，一般无需调用，函数内部已经处理
 * @return {Objec}         返回数据在success里面调用，如：success(data){dosomething with    data}
 */
function fetchListData ({
  url,
  data,
  that,
  success,
  fail
}) {
  // 列表加载的单次加载数限制
  let limit = that.data.limit || 20
  // loadTimes,allLoaded,loading均须要在方法调用的this（that）实例中定义
  let loadTimes = that.data.loadTimes
  let allLoaded = that.data.allLoaded
  let page = that.data.page
  if (typeof (loadTimes) === 'undefined' || typeof (allLoaded) === 'undefined') {
    console.warn('请确认该页面Page({data:{}})中已定义loadTimes和allLoaded')
    return false
  }
  if (allLoaded) return false
  if (that.data.urlType) {
    url = API_BASE_URL2 + url
  } else {
    url = API_BASE_URL + url
  }
  data = Object.assign(data, globalQueryParams(), {
    limit,
    start: loadTimes * limit,
    page
  })
  wx.showNavigationBarLoading()
  wx.request({
    url,
    data,
    success: function (res) {
      loadTimes++
      page++
      if (res.data.status === 'success') {
        let data = res.data.data
        if (data.items && Array.isArray(data.items)) {
          data = data.items
        }
        that.setData({
          loadTimes,
          page,
          allLoaded: data.length < limit
        })
        success(data)
      } else {
        // fail(res)
        console.log('success reload')
        // handleUpdateDataFail(that)
      }
      wx.hideNavigationBarLoading()
    },
    fail: function (res) {
      console.log('fail reload')
      // fail(res)
      // handleUpdateDataFail(that)
      wx.hideNavigationBarLoading()
    }
  })
}

function postData ({
  url,
  data,
  that,
  success,
  fail
}) {
  if(!app){
    app = getApp()
  }  
  app.askForWxLogin()
  if (that.data.urlType) {
    url = API_BASE_URL2 + url
  } else {
    url = API_BASE_URL + url
  }
  let time = JSON.stringify(Date.now())
  let user_id = globalQueryParams().user_id
  let md5Str = user_id + API_KEY + time
  let key = md5(md5Str)
  wx.request({
    url,
    data: Object.assign(globalQueryParams(), data, {
      time,
      key
    }),
    header: {},
    method: 'POST',
    success (res) {
      if (res.data.status === 'success') {
        success(res)
        app.globalData.needSyncData = true
      } else {
        // handleUpdateDataFail(that)
        fail(res)
      }
    },
    fail (res) {
      // handleUpdateDataFail(that)
      fail(res)
    }
  })
}

// export各接口请求处理方法
module.exports = {
  fetchData,
  fetchListData,
  postData,
  md5
}
