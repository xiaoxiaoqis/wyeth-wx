let app = getApp()
let api = require('../../util/api.js')
Page({
  data: {
    pregdate: app.globalData.pregdate,
    limit: 20,
    loadTimes: 0,
    allLoaded: false,
    curPlay: 0,
    loading: false,
    repeatMode: 'list',
    playState: 'pause',
    music: []
  },
  onLoad: function (options) {
    this.fetchData()
    let that = this
    wx.onBackgroundAudioPlay(function () {
      that.setData({
        playState: 'playing'
      })
    })
    wx.onBackgroundAudioPause(function () {
      that.setData({
        playState: 'pause'
      })
    })
    wx.onBackgroundAudioStop(function () {
      let [curPlay, playState, repeatMode, nextPlay] = [that.data.curPlay, that.data.playState, that.data.playState]
      if (playState === 'pause') return false
      that.setData({
        playState: 'pause'
      })
      curPlay < that.data.music.length ? nextPlay = curPlay++ : nextPlay = 0
      repeatMode === 'list' ? that.playMusic(nextPlay) : that.playMusic(curPlay)
    })
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {

  },
  fetchData () {
    let music = this.data.music
    let that = this
    api.fetchListData({
      url: 'home/preg/music',
      data: {},
      that,
      success (data) {
        that.setData({
          music: music.concat(data)
        })
      }
    })
  },
  togglePlay (e) {
    console.log('You clicked', new Date())
    let that = this
    if (that.data.playState === 'playing' && e.currentTarget.dataset.index == that.data.curPlay) {
      wx.pauseBackgroundAudio()
    } else {
      that.setData({
        playState: 'playing'
      })
      console.log('Setted playState' + e.currentTarget.dataset.index, new Date())
      that.playMusic(e.currentTarget.dataset.index)
    }
  },
  // 播放音乐方法，
  playMusic: function (index) {
    let [that, music] = [this, this.data.music[index]]
    that.setData({
      curPlay: index,
      loading: true
    })
    console.log('playMusic event emmit', new Date())
    wx.playBackgroundAudio({
      dataUrl: music.wifi,
      title: music.name,
      coverImgUrl: music.thumb,
      success: function (res) {
        console.log('success playing', new Date())
        let getDownloadPercent = setInterval(function () {
          wx.getBackgroundAudioPlayerState({
            success (res) {
              if (res.downloadPercent > 5) {
                that.setData({
                  loading: false
                })
                clearInterval(getDownloadPercent)
              }
            }
          })
        }, 100)
        // that.setData({
        //   playState: 'playing',
        //   loading: false
        // })
      },
      fail: function () {
        that.setData({
          curPlay,
          playState: 'pause'
        })
      }
    })
  },
  toggleRepeatMode: function () {
    let mode = this.data.repeatMode === 'list' ? 'single' : 'list'
    this.setData({
      repeatMode: mode
    })
  },
  onShareAppMessage () {
    return {
      title: `我正在陪宝宝听《${this.data.music[this.data.curPlay].name}》，这是宝宝胎教的100首金曲之一`,
      content: `最好听的胎教音乐，100万妈妈正在听~`,
      path: `../music/list`
    }
  }
})
