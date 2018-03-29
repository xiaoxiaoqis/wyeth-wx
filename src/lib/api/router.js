function checkData(obj){
  let params = {}
  let url = ""
  console.log("router:",typeof(obj))
  if(typeof(obj) === "object"){
    url = obj.url + '?'
    if(obj.params){
      Object.keys(obj.params).map(function (key) {
        url = url + '&' + key + '=' + obj.params[key]
      })
    }

    obj.success && (params.success = obj.success)
    obj.fail && (params.fail = obj.fail)
    obj.complete && (params.complete = obj.complete)

  }else if(typeof(obj) == "string"){
    url = obj
  }

  if(url && url.length > 0){
    params.url = url

    console.log('router push ',params)
    
    return params
  }else{
    console.error('router push error')
    
    return false
  }
}
// wx.navigateTo 和 wx.redirectTo 不允许跳转到 tabbar 页面，只能用 wx.switchTab 跳转到 tabbar 页面
var router = {
  /*
  wx.navigateTo(OBJECT)
  保留当前页面，跳转到应用内的某个页面，使用wx.navigateBack可以返回到原页面。
  
  OBJECT 参数说明：
  
  参数	类型	必填	说明
  url	String	是	需要跳转的应用内非 tabBar 的页面的路径 , 路径后可以带参数。参数与路径之间使用?分隔，参数键与参数值用=相连，不同参数用&分隔；如 'path?key=value&key2=value2'
  success	Function	否	接口调用成功的回调函数
  fail	Function	否	接口调用失败的回调函数
  complete	Function	否	接口调用结束的回调函数（调用成功、失败都会执行）
  */
  push:function (obj) {
    let params = checkData(obj)
    if(params){
      wx.navigateTo(params)
    }
  },
  /*
  wx.redirectTo(OBJECT)
  关闭当前页面，跳转到应用内的某个页面。
  
  OBJECT 参数说明：
  
  参数	类型	必填	说明
  url	String	是	需要跳转的应用内非 tabBar 的页面的路径，路径后可以带参数。参数与路径之间使用?分隔，参数键与参数值用=相连，不同参数用&分隔；如 'path?key=value&key2=value2'
  success	Function	否	接口调用成功的回调函数
  fail	Function	否	接口调用失败的回调函数
  complete	Function	否	接口调用结束的回调函数（调用成功、失败都会执行）
  */
  replace: function () {
    let params = checkData(obj)
    if(params){
      wx.redirectTo(params)
    }
  },
  /*
  wx.navigateBack(OBJECT)
  关闭当前页面，返回上一页面或多级页面。可通过 getCurrentPages()) 获取当前的页面栈，决定需要返回几层。
  
  OBJECT 参数说明：
  
  参数	类型	默认值	说明
  delta	Number	1	返回的页面数，如果 delta 大于现有页面数，则返回到首页。
  */
  pop: function (delta) {
    wx.navigateBack({delta:delta})
  },
  /*
  wx.reLaunch(OBJECT)
  基础库 1.1.0 开始支持，低版本需做兼容处理
  
  关闭所有页面，打开到应用内的某个页面。
  
  OBJECT 参数说明：
  
  参数	类型	必填	说明
  url	String	是	需要跳转的应用内页面路径 , 路径后可以带参数。参数与路径之间使用?分隔，参数键与参数值用=相连，不同参数用&分隔；如 'path?key=value&key2=value2'，如果跳转的页面路径是 tabBar 页面则不能带参数
  success	Function	否	接口调用成功的回调函数
  fail	Function	否	接口调用失败的回调函数
  complete	Function	否	接口调用结束的回调函数（调用成功、失败都会执行
  */
  reLaunch: function (obj){
    wx.reLaunch(obj)
  },
  /*
  wx.switchTab(OBJECT)
  跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
  
  OBJECT 参数说明：
  
  参数	类型	必填	说明
  url	String	是	需要跳转的 tabBar 页面的路径（需在 app.json 的 tabBar 字段定义的页面），路径后不能带参数
  success	Function	否	接口调用成功的回调函数
  fail	Function	否	接口调用失败的回调函数
  complete	Function	否	接口调用结束的回调函数（调用成功、失败都会执行
  */
  switchTab: function (obj){
    wx.switchTab(obj)
  }
}

module.exports = router
