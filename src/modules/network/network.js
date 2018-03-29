const API = require('../../lib/api')

const config = require('../../config')

const store = require('../store/index')

var network = {
  getRequest: function (url, data, callback, hideLoading) {
    return this.request('GET', url, data, callback, hideLoading)
  },
  postRequest: function (url, data, callback, hideLoading) {
    return this.request('POST', url, data, callback, hideLoading)
  },
  request: function (method, url, data, callback, hideLoading) {
    // CMS
    if (!hideLoading) {
      API.showLoading({
        title: '加载中',
      })
    }

    var self = this
    function networkResponse(response) {

      if (!hideLoading) {
        API.hideLoading()
      }

      let error = {}

      console.log('----------->请求结束   method=' + method + ',url=' + url + ',data=', data, 'response=', response)

      if (response.statusCode === 200) {
        var res = response.data
        if (!res.ret) {
          res = JSON.parse(res)
        }

        if (res.ret === 1) {
          // 请求成功
          callback && callback(res)
        } else {
          error.ret = res.ret ? res.ret : -1
          error.msg = res.msg ? res.msg : '获取数据失败'


          if (res.login_url) {

            error.msg = '正在跳转登录'


            if (url.indexOf(config.api.getLoginInfo) === -1) {
              // 跳转登录
              self.login(function () {
                self.request(method, url, data, callback, hideLoading)
              })
              return
            }
          }

          self.showError(error)

          callback && callback(error)
        }
      } else {
        error.ret = response.status ? response.status : -1
        error.msg = response.msg || '网络请求失败'
        self.showError(error)

        callback && callback(error)
      }

    }
    this.equeue(method, url, data, networkResponse)
  },
  equeue: function (method, url, data, callback) {
    url = config.host + url + '?' + config.dev


    console.log('!!!! equeue: data', data)

    if (getApp().globalData.userInfo && getApp().globalData.userInfo.user_token) {
      data = data || {}
      data.user_token = getApp().globalData.userInfo.user_token
    }

    console.log('!!!! equeue:', url, data)



    var self = this

    API.request({
      url: url,
      data: data,
      method: method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      }, // 设置请求的 header
      success: function (res) {
        callback && callback(res)
      },
      fail: function (error) {
        self.showError(error)

        callback && callback(error)
      },
      complete: function () {
        console.log('请求结束')
      }
    })
  },
  showError: function (error) {
    API.showToast({
      title: error.msg,
      type: 'fail'
    })
  },
  /***************** 登录相关 start **************/
  checkLoginState: function (block,hideToast) {
    var self = this

    var userInfo = store.getItemSync('userInfo')
    if (userInfo && userInfo.user_token) {
      self.getLoginInfo(block,hideToast)
    } else {
      var callback = function (res) {
        if (res.ret === 1) {
          // 登录成功
          block && block(res)
        } else {
          self.login(callback,hideToast)
        }
      }

      self.login(callback,hideToast)
    }
  },
  login: function (callback) {
    var self = this

    store.removeItemSync('userInfo')

    // 调用登录接口
    API.login({
      success: function (res) {
        if (res.code) {
          console.log('res',res)
          console.log('code:', res.code)
          API.getUserInfo({
            lang: 'zh_CN',
            success: function (response) {
              console.log('response:', response)

              response.code = res.code
              response.userInfo = JSON.stringify(response.userInfo)
              console.log('response', response)
              self.postRequest(config.api.login, response, function (res) {
                if (res.ret === 1) {
                  self.loginSuccess(res.data)
                }
                callback && callback(res)
              })
            }
          });
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
  },
  getLoginInfo: function (callback,hideToast) {
    var self = this
    this.postRequest(config.api.getLoginInfo, {}, function (res) {
      if (res.ret === 1 && res.data) {
        var userInfo = res.data

        self.loginSuccess(userInfo)

        callback && callback(res)

      }else{
        self.login(callback)
      }
    },hideToast)
  },
  loginSuccess: function (userInfo) {

    userInfo.userId = userInfo.preg_id
    userInfo.avatarUrl = userInfo.avatar
    userInfo.nickName = userInfo.nickname

    userInfo.user_token = userInfo.user_token || getApp().globalData.userInfo.user_token
    userInfo.crm_status = parseInt(userInfo.crm_status)

    getApp().setUserInfo(userInfo)
  },
  /***************** 登录相关 end **************/
  // 课程
  getCourse: function (params, callback) {
    this.getRequest(config.api.getCourse, params, callback)
  },
  getAllHotTag: function (callback) {
    this.getRequest(config.api.getAllHotTag, {}, callback)
  },
  getCourseDetail: function (courseId, callback) {
    this.getRequest(config.api.getCourseDetail, { course_id: courseId }, callback)
  },
  setPregdate: function (date, callback) {
    this.postRequest(config.api.setPregdate, { pregdate: date }, callback)
  },
  createMiniOrder: function (price, callback) {
    this.postRequest(config.api.createMiniOrder, { price: price }, callback)
  },
  observePro: function (params, callback) {
    this.getRequest(config.api.observePro, params, callback)
  },
  courseLike: function (params, callback) {
    params.is_like = 1
    this.getRequest(config.api.saveOrcollect, params, callback)
  },
  courseCollect: function (params, callback) {
    params.is_like = 2
    this.getRequest(config.api.saveOrcollect, params, callback)
  },
  getSearchTag: function (callback) {
    this.getRequest(config.api.getSearchTag, {}, callback)
  },
  getSearchResult: function (params, callback) {
    this.getRequest(config.api.getSearchResult, params, callback)
  },
  getCourseSearch: function (params, callback) {
    this.getRequest(config.api.getCourseSearch, params, callback)
  },
  getQuestionSearch: function (params, callback) {
    this.getRequest(config.api.getQuestionSearch, params, callback)
  },
  getTagQuestion: function (params, callback) {
    this.getRequest(config.api.getTagQuestion, params, callback)
  },
  getMiniHomePageData: function (params, callback) {
    this.getRequest(config.api.getMiniHomePageData, params, callback)
  },
  getTraceCourse: function (params, callback) {
    // ?&page=1&page_size=10
    this.getRequest(config.api.getTraceCourse, params, callback)
  },
  orderCourse: function (id, callback) {
    this.getRequest(config.api.orderCourse, { cid: id }, callback)
  },
  getCourseSeries: function (params, callback) {
    this.getRequest(config.api.getCourseSeries, params, callback)
  },
  signCat: function (cid, callback) {
    this.getRequest(config.api.signCat, { cid: cid }, callback)
  },
  createOrderMQ: function (cid, type, callback) {
    this.postRequest(config.api.createOrderMQ, { cid: cid, type: type }, callback)
  },
  getBoughtCat: function (callback, hideToast) {
    this.getRequest(config.api.getBoughtCat, {}, callback, hideToast)
  },
  payMQ: function (id, callback) {
    this.postRequest(config.api.payMQ, { trade_id: id }, callback)
  },
  createOrder: function (price, returnUrl, callback) {
    this.postRequest(config.api.createOrder, { price: price, return_url: returnUrl, channel: window.wyeth_channel }, callback)
  },
  queryOrder: function (orderNo, callback, hideToast) {
    this.postRequest(config.api.queryOrder, { order_no: orderNo }, callback, hideToast)
  },
  getOrderDetail: function (trade_id, callback) {
    this.getRequest(config.api.getOrderDetail, { trade_id: trade_id }, callback)
  },
  getPlayList: function (id_array,callback){
    this.getRequest(config.api.getPlayList, {id_array:id_array}, callback)
  },
  courseListenAdd: function (id, callback) {
    this.postRequest(config.api.courseListenAdd, { cid: id }, callback, true)
  },
  getChance: function(callback){
    this.getRequest(config.api.getChance, {}, callback, true)
  },
  getDiscover: function(callback){
    this.getRequest(config.api.getDiscover, {"platform":"1"}, callback, true)
  },
  getTraceCourseByDate: function(date,callback){
    this.getRequest(config.api.getTraceCourseByDate,{"date":date},callback,false)
  },
  getVipCard: function(callback){
    this.getRequest(config.api.getVipCard,{},callback,false)
  },
  codeDecrypt: function(code,callback){
    this.getRequest(config.api.codeDecrypt,{"encrypt_code":code},callback,false)
  },
  getWxCardMemberInfoByTicket:function(activate_ticket,code,callback){
    this.postRequest(config.api.getWxCardMemberInfoByTicket,{"activate_ticket":activate_ticket,"code":code},callback,false)
  },
  registerCrm:function(params,callback){
    this.postRequest(config.api.registerCrm,params,callback,false)
  },
  getWxCardMemberInfo:function(callback){
    this.postRequest(config.api.getWxCardMemberInfo,{},callback,false)
  }
}
module.exports = network
