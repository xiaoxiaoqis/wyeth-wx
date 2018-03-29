<template>
<div id="videoPlayer">
<video id="myVideo" class="videoPlayer-video" :src="videoInfo.src" :poster="classInfo.img" controls webkit-playsinline bindplay="onplay" bindpause="onpause" bindended="onended" bindtimeupdate="timeupdate">
</video>
</div>
</template>

<script>
import audioPlayer from "../../modules/audioPlayer";
import network from "../../modules/network/network";
import CIData from "../../modules/CIData";
import { checkRegister } from "../../modules/validate";

let videoContext;

export default {
  props: {
    videoInfo: {
      type: Object,
      require: true
    },
    classInfo: {
      type: Object,
      require: true
    },
    access: {
      type: Boolean,
      require: false,
      default: true
    }
  },
  data() {
    return {
      isFirst: true,
      isPlay: false,
      rate: 0,
      stateImages: [require("/assets/play.png"), require("/assets/stop.png")],
      showPoster: true,
      handleId: null,
      from_time: 0,
      jumpHandleId: null,
      video: {
        currentTime: 0,
        duration: 0
      }
    };
  },
  created() {},
  mounted() {
    videoContext = wx.createVideoContext("myVideo");
  },
  computed: {},
  destroyed() {
    console.log("videoPlayer destroyed");
    this.clearCourseListen();
  },
  methods: {
    setCourseListen: function(classInfo) {
      this.clearCourseListen();
      this.handleId = setInterval(function() {
        network.courseListenAdd(classInfo.id, function(res) {});
      }, 1000);
    },
    clearCourseListen: function() {
      if (this.handleId) {
        clearInterval(this.handleId);
        this.handleId = null;
      }
    },
    clearPauseEvent: function() {
      if (this.jumpHandleId) {
        clearInterval(this.jumpHandleId);
        this.jumpHandleId = null;
      }
    },
    timeupdate: function(e) {
      if (Math.abs(this.video.currentTime - e.detail.currentTime) > 2) {
        CIData.sendEvent("video_jump", {
          cid: this.classInfo.id,
          from: this.video.currentTime,
          to: e.detail.currentTime
        });
      }
      this.video = e.detail;

      this.$apply();
    },
    onplay(e) {
      if (checkRegister()) {
        videoContext.pause();
        return;
      }

      console.log("onplay,", e);

      this.clearPauseEvent();

      this.isPlay = true;

      if (this.isFirst) {
        CIData.recActionTransact(this.classInfo);
        this.isFirst = false;
      }

      CIData.sendEvent("video_play", {
        cid: this.classInfo.id,
        play_time: this.video.currentTime
      });

      this.setCourseListen(this.classInfo);
    },
    onended(e) {
      console.log("onpause", e);

      this.isPlay = false;

      this.clearCourseListen();
    },
    onpause(e) {
      console.log("onpause", e);
      this.isPlay = false;

      let tmp = this.video.currentTime;

      this.clearPauseEvent();
      var self = this;
      this.jumpHandleId = setTimeout(function() {
        // 延时1s发送，若为进度条拖拽，会被canPlay取消掉
        CIData.sendEvent("video_pause", {
          cid: self.classInfo.id,
          pause_time: tmp
        });
      }, 1000);

      this.clearCourseListen();
    },
    onfail(e) {
      console.log("onfail");
      this.isPlay = false;
    }
  }
};
</script>

<style lang = "sass" scoped>
@import './videoPlayer.scss'
</style>
