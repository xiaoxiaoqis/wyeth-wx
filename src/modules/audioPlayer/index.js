
const API = require('../../lib/api')
const event = require('../event/index')
const CIData = require('../CIData/index')
const network = require('../network/network')


const validate = require('../validate/index')


import wekit from 'wekit'
let audioPlayer = new wekit.Vue({
  data(){
    return {
      isPlay: false,
      autoPlay: false,      //加载完成后是否自动播放
      songIndex: 0,
      playlist: [],
      songPlay: {
        poster: '',
        title: '',
        author: '',
        src: '',
        detail: {}
      },
      audio: {
        currentTime: 0
      },
      mode: [
        {
          index: 0,
          name: '顺序播放',
        },
        {
          index: 1,
          name: '随机播放',
        },
        {
          index: 2,
          name: '单曲循环',
        }
      ],
      modeIndex: 0,
      handleId:null,
      stateChangeHandler:null,
      indexChangeHandler:null,
    }
  },
  created() {
    var self = this
    API.onBackgroundAudioPlay(function () {
      // self.onplay()
    })

    API.onBackgroundAudioPause(function () {
      // self.onpause()
    })

    API.onBackgroundAudioStop(function () {
      self.onend()
    })

    var timer = setInterval(() => {
      if (self.isPlay) {
        self.getAudioState(function (res) {

          self.audio.currentTime = res.currentPosition
          event.sendEvent('progressChange', res)
        })
      }
    }, 1000);

    this.getAudioState(function (res){
      if(res.ret === 1 && res.status === 1){
        self.isPlay = true
        event.sendEvent('isAudioPlay', true)
      }
    })
  },
  methods:{

    setCourseListen: function (song) {
      this.clearCourseListen()
      var self = this
      this.handleId = setInterval(function () {
        network.courseListenAdd(song.id, function (res) {
        })
      }, 60000)
    },
    clearCourseListen: function () {
      if (this.handleId) {
        clearInterval(this.handleId)
        this.handleId = null
      }
    },
    onplay: function () {

      if (validate.checkRegister()) {
        return
      }

      console.log('播放开始')
      this.isPlay = true
      event.sendEvent('isAudioPlay', true)
      event.sendEvent('stateChange', true)

      this.stateChangeHandler && this.stateChangeHandler(true)

      CIData.sendEvent('audio_play',{cid:this.songPlay.id,play_time:this.audio.currentTime})

      this.setCourseListen(this.songPlay)
    },
    onpause: function () {
      console.log('播放暂停')
      this.isPlay = false
      event.sendEvent('isAudioPlay', false)
      event.sendEvent('stateChange', false)

      this.stateChangeHandler && this.stateChangeHandler(false)

      CIData.sendEvent('audio_pause',{cid:this.songPlay.id,pause_time:this.audio.currentTime})

      this.clearCourseListen()

    },
    onend: function () {
      console.log('播放停止')
      this.isPlay = false
      event.sendEvent('isAudioPlay', false)
      event.sendEvent('stateChange', false)

      this.stateChangeHandler && this.stateChangeHandler(false)

      this.clearCourseListen()

      this.next()
    },
    next: function () {
      console.log('audio next')
      if (this.songIndex >= this.playlist.length - 1) {
        return
      }

      this.songIndex++

      this.indexChangeHandler && this.indexChangeHandler(this.songIndex)

      this.play()
    },
    checkSongEq: function (song) {

      console.log('this.songPlay:',this.songPlay,song)
      if (!this.songPlay || !song) {
        return false
      }
      if (this.songPlay.src == song.src && this.songPlay.title == song.title && (!this.songPlay.start || this.songPlay.start == song.start)) {
        return true
      } else {
        return false
      }
    },
    checkSongChange: function () {
      if (this.playlist.length == 0 || this.songIndex < 0 || this.songIndex > this.playlist.length - 1) {
        return
      }

      console.log('checkSongChange ')
      let song_tmp = this.playlist[this.songIndex]

      if (this.checkSongEq(song_tmp)) {
        // 确保正在播放
        if (!this.isPlay) {
          this.play()
        }
      } else {
        this.songPlay = song_tmp


        if (this.audio.src != this.songPlay.src) {
          this.audio.src = this.songPlay.src
        }

        if (this.autoPlay) {
          this.play()
          this.seek(this.songPlay.start)
        }
      }
    },
    changeMode: function () {
      if (this.modeIndex >= this.mode.length - 1) {
        this.modeIndex = 0
      } else {
        this.modeIndex++
      }
    },
    play: function (audio) {

      if (validate.checkRegister()) {
        return
      }

      console.log('audio play')
      if (audio) {
        this.songPlay = audio
      }else{
        this.songPlay = this.playlist[this.songIndex]
      }

      if (!this.songPlay) {
        return
      }
      console.log('API.playBackgroundAudio')
      let self = this
      API.playBackgroundAudio({
        dataUrl: this.songPlay.src,
        title: this.songPlay.title,
        coverImgUrl: this.songPlay.img,
        complete: function (e) {
          console.log('playBackgroundAudio complete',e)
          self.onplay()
        }
      })
    },
    forceJump: function (time){
      time = parseFloat(time)
      API.seekBackgroundAudio({
        position: time,
        success(e){
          console.log('seekBackgroundAudio success',e)
        },
        fail(e){
          console.log('seekBackgroundAudio fail',e)
        },
        complete(e){
          console.log('seekBackgroundAudio complete',e)
        }
      })
    },
    pause: function () {
      let self = this
      API.pauseBackgroundAudio({
        complete(e){
          console.log('pauseBackgroundAudio complete',e)
          self.onpause()
        }
      })
    },
    seek: function (time) {
      time = parseFloat(time)
      API.seekBackgroundAudio({
        position: time
      })
    },
    stop: function () {
      API.stopBackgroundAudio()
    },
    start: function (callback) {
      console.log('audio start isPlay=',this.isPlay);
      if (this.isPlay) {
        this.pause()
      } else {
        this.play()
      }
    },
    getAudioState: function (callback) {
      var self = this
      API.getBackgroundAudioPlayerState({
        success: function (res) {
          // console.log("getAudioState:", res)

          if (!self.songPlay.detail && res.status === 1) {
            self.songPlay.detail = res
          }

          // status	播放状态（2：没有音乐在播放，1：播放中，0：暂停中）
          // var status = res.status
          // var dataUrl = res.dataUrl
          // var currentPosition = res.currentPosition
          // var duration = res.duration
          // var downloadPercent = res.downloadPercent

          res.ret = 1
          callback && callback(res)

        },
        fail: function (error) {
          var res = {
            ret: -1,
            msg: error
          }

          callback && callback(res)
        },
        complete: function () {

        }
      })
    },
    progressChange: function (percent, callback) {
      if (!this.songPlay.detail) {
        var self = this
        this.getAudioState(function (res) {
          console.log("xxxxx:", res)
          if (res.ret === 1 && res.status === 1) {
            self.songPlay.detail = res
            var time = self.songPlay.detail.duration * percent
            self.seek(time)

            if (callback)
              callback()
          }

        })
      } else {
        var time = this.songPlay.detail.duration * percent
        console.log("xxxxx:", this.songPlay.detail, percent)

        this.seek(time)

        callback && callback()
      }
    },
    addToPlaylist: function (song) {
      console.log('addToPlaylist:', index)
      let index = this.findSong(song)
      if (index >= 0) {
        this.songIndex = index
        return index
      } else {
        this.playlist.unshift(song)
        this.songIndex = 0
        return 0
      }
    },
    findSong: function (song) {
      if (!song || !this.playlist || !this.playlist.length === 0) {
        return -1
      }

      for (let i = 0; i < this.playlist.length; i++) {
        let tmp = this.playlist[i]
        if (song.src === tmp.src && song.title === tmp.title) {
          console.log('找到相同歌曲：', i)
          return i
        }
      }
    }
  }
})

module.exports = audioPlayer
