var openapi = {
  /*
  wx.login(OBJECT)
  调用接口获取登录凭证（code）进而换取用户登录态信息，包括用户的唯一标识（openid） 及本次登录的 会话密钥（session_key）等。用户数据的加解密通讯需要依赖会话密钥完成。
  
  注：调用 login 会引起登录态的刷新，之前的 sessionKey 可能会失效。
  
  OBJECT参数说明：
  
  参数名	类型	必填	说明
  success	Function	否	接口调用成功的回调函数
  fail	Function	否	接口调用失败的回调函数
  complete	Function	否	接口调用结束的回调函数（调用成功、失败都会执行）
  success返回参数说明：
  
  参数名	类型	说明
  errMsg	String	调用结果
  code	String	用户登录凭证（有效期五分钟）。开发者需要在开发者服务器后台调用 api，使用 code 换取 openid 和 session_key 等信息
  */
  login: function (obj) {
    wx.login(obj)
  },
  /*
  wx.getUserInfo(OBJECT)
  获取用户信息，withCredentials 为 true 时需要先调用 wx.login 接口。
  
  需要用户授权 scope.userInfo
  
  OBJECT参数说明：
  
  参数名	类型	必填	说明	最低版本
  withCredentials	Boolean	否	是否带上登录态信息	1.1.0
  lang	String	否	指定返回用户信息的语言，zh_CN 简体中文，zh_TW 繁体中文，en 英文。默认为en。	1.3.0
  success	Function	否	接口调用成功的回调函数
  fail	Function	否	接口调用失败的回调函数
  complete	Function	否	接口调用结束的回调函数（调用成功、失败都会执行）
  注：当 withCredentials 为 true 时，要求此前有调用过 wx.login 且登录态尚未过期，此时返回的数据会包含 encryptedData, iv 等敏感信息；当 withCredentials 为 false 时，不要求有登录态，返回的数据不包含 encryptedData, iv 等敏感信息。
  
  success返回参数说明：
  
  参数	类型	说明
  userInfo	OBJECT	用户信息对象，不包含 openid 等敏感信息
  rawData	String	不包括敏感信息的原始数据字符串，用于计算签名。
  signature	String	使用 sha1( rawData + sessionkey ) 得到字符串，用于校验用户信息，参考文档 signature。
  encryptedData	String	包括敏感数据在内的完整用户信息的加密数据，详细见加密数据解密算法
  iv	String	加密算法的初始向量，详细见加密数据解密算法
  */
  getUserInfo: function (obj) {
    wx.getUserInfo(obj)
  },
  setNavigationBarTitle: function (obj) {
    wx.setNavigationBarTitle(obj)
  },
  /*
  wx.requestPayment(OBJECT)
  发起微信支付。
  
  Object参数说明：
  
  参数	类型	必填	说明
  timeStamp	String	是	时间戳从1970年1月1日00:00:00至今的秒数,即当前的时间
  nonceStr	String	是	随机字符串，长度为32个字符以下。
  package	String	是	统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=*
  signType	String	是	签名算法，暂支持 MD5
  paySign	String	是	签名,具体签名方案参见小程序支付接口文档;
  success	Function	否	接口调用成功的回调函数
  fail	Function	否	接口调用失败的回调函数
  complete	Function	否	接口调用结束的回调函数（调用成功、失败都会执行）
  了解更多信息，请查看微信支付接口文档
  
  回调结果：
  
  回调类型	errMsg	说明
  success	requestPayment:ok	调用支付成功
  fail	requestPayment:fail cancel	用户取消支付
  fail	requestPayment:fail (detail message)	调用支付失败，其中 detail message 为后台返回的详细失败原因
  */
  requestPayment: function (obj) {
    if (typeof (obj) === "string") {
      obj = JSON.parse(obj)
    }

    if (typeof (obj) !== "object") {
      console.error('requestPayment 参数错误：', obj)
      return
    }

    wx.requestPayment({
      timeStamp: obj.timeStamp.toString(),
      nonceStr: obj.nonceStr,
      package: obj.package,
      signType: obj.signType,
      paySign: obj.paySign,
      success: function (res) {
        console.log('requestPayment success:', res)
        obj.success && obj.success(res)
      },
      fail: function (errMsg) {
        console.log('requestPayment fail:', errMsg)
        obj.fail && obj.fail({ ret: -1, msg: errMsg })
      },
      complete: function (errMsg) {
        console.log('requestPayment complete:', errMsg)
        obj.complete && obj.complete({ ret: -1, msg: errMsg })
      }
    })
  },
  navigateToMiniProgram: function (obj) {
    wx.navigateToMiniProgram(obj)
  }
}

module.exports = openapi
