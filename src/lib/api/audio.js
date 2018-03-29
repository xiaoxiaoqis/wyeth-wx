var audio = {
  /*
  wx.getBackgroundAudioPlayerState(OBJECT)
  获取后台音乐播放状态。

  OBJECT参数说明：

  参数	类型	必填	说明
  success	Function	否	接口调用成功的回调函数
  fail	Function	否	接口调用失败的回调函数
  complete	Function	否	接口调用结束的回调函数（调用成功、失败都会执行）
  */
  getBackgroundAudioPlayerState: function (obj){
    wx.getBackgroundAudioPlayerState(obj)
  },
  /*
  wx.playBackgroundAudio(OBJECT)
  使用后台播放器播放音乐，对于微信客户端来说，只能同时有一个后台音乐在播放。当用户离开小程序后，音乐将暂停播放；当用户点击“显示在聊天顶部”时，音乐不会暂停播放；当用户在其他小程序占用了音乐播放器，原有小程序内的音乐将停止播放。

  OBJECT参数说明

  参数	类型	必填	说明
  dataUrl	String	是	音乐链接，目前支持的格式有 m4a, aac, mp3, wav
  title	String	否	音乐标题
  coverImgUrl	String	否	封面URL
  success	Function	否	接口调用成功的回调函数
  fail	Function	否	接口调用失败的回调函数
  complete	Function	否	接口调用结束的回调函数（调用成功、失败都会执行）
  */
  playBackgroundAudio: function(obj){
    wx.playBackgroundAudio(obj)
  },
  /*
  wx.pauseBackgroundAudio()
  暂停播放音乐。


  */
  pauseBackgroundAudio: function (obj) {
    wx.pauseBackgroundAudio(obj)
  },
  /*
  wx.seekBackgroundAudio(OBJECT)
  控制音乐播放进度。

  OBJECT参数说明

  参数	类型	必填	说明
  position	Number	是	音乐位置，单位：秒
  success	Function	否	接口调用成功的回调函数
  fail	Function	否	接口调用失败的回调函数
  complete	Function	否	接口调用结束的回调函数（调用成功、失败都会执行）
  */
  seekBackgroundAudio: function (obj) {
    wx.seekBackgroundAudio(obj)
  },
  /*
  wx.stopBackgroundAudio()
  停止播放音乐。
  */
  stopBackgroundAudio: function () {
    wx.stopBackgroundAudio()
  },
  /*
  wx.onBackgroundAudioPlay(CALLBACK)
  监听音乐播放。
  */
  onBackgroundAudioPlay: function (callback){
    wx.onBackgroundAudioPlay(callback)
  },
  /*
  wx.onBackgroundAudioPause(CALLBACK)
  监听音乐暂停。
  */
  onBackgroundAudioPause: function (callback){
    wx.onBackgroundAudioPause(callback)
  },
  /*
  wx.onBackgroundAudioStop(CALLBACK)
  监听音乐停止。
  */
  onBackgroundAudioStop: function (callback){
    wx.onBackgroundAudioStop(callback)
  }
}

module.exports = audio
