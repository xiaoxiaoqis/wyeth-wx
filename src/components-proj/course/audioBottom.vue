<template>
  <div class="miniPlayer-bg">
    <div class="miniPlayer-shadow"></div>
    <div id="miniPlayer">
      <!--封面-->
      <div class="miniPlayer-state-bg" @click="start">
        <image class="miniPlayer-state" :src="stateIcon"/>
      </div>

      <!-- 进度条 -->
      <Progress class="miniPlayer-progress"  :currentTime="currentTime" :duration="duration" :rate="rate" :progressWidth="581" :scheduleLeft="128"
            ></Progress>
      <text class="miniPlayer-songname" :lines="1">{{ (classlist.title || '无音频') }}</text>
    </div>
  </div>
</template>

<script>
import Base from "../../mixins/base";

import CIData from "../../modules/CIData";

import event from "../../modules/event";

import audioPlayer from "../../modules/audioPlayer";

import Progress from "../../components/progress";

export default {
  mixins: [Base],
  components: {
    Progress: Progress.weexComponent
  },
  props: {
    classlist: {
      type: Object,
      required: true
    },
    songSelected: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      isAudioPlay: false,
      currentTime: 0,
      duration: 0,
      rate: 0,
      audoPlay: false,
      isStart: false,
      from_time: 0,
      images: {
        stop: require("/assets/stop.png"),
        play: require("/assets/play.png")
      }
    };
  },
  created() {
    console.log("!!!!!!!!! audioBottom created:", this.isStart);

    var self = this;

    event.addEventListener('isAudioPlay', function (res) {
      self.isAudioPlay = res
    })
    event.addEventListener("stateChange", function(state) {
      console.log("!!!:", self.isStart);
      self.$apply();
    });

    event.addEventListener("progressChange", function(res) {
//      console.log("progressChange");
      if (res.status === 1 && self.isStart) {
        self.rate = res.currentPosition / res.duration;
        self.currentTime = res.currentPosition;
        self.duration = res.duration;

        self.$apply();
      }
    });
  },
  computed: {
    stateIcon() {
      console.log('stateIcon',this.isStart , this.isAudioPlay)
      return this.isStart && this.isAudioPlay
        ? this.images.stop
        : this.images.play;
    },
    isEqual() {
      this.isStart = audioPlayer.checkSongEq(this.classlist);
      return this.isStart;
    }
  },
  watch: {
    songSelected(section) {
      console.log("songSelected");
      this.forceJump(section.start);
    }
  },
  methods: {
//    progressStart: function(rate) {
//      console.log("!!!!progressStart");
//      this.from_time = 0;
//      if (this.isStart) {
//        this.from_time = audioPlayer.audio.currentTime;
//      }
//    },
//    progressEnd: function(rate) {
//
//      CIData.sendEvent("audio_jump", {
//        cid: audioPlayer.songPlay.id,
//        from: this.from_time,
//        to: rate * this.duration
//      });
//    },
//    progressChange: function(rate) {
//      console.log("!!! progressChange:", rate, this.isStart);
//      this.rate = rate;
//      if (!this.isStart) {
//        audioPlayer.autoPlay = true;
//        audioPlayer.songPlay = this.classlist;
//        audioPlayer.play();
//        this.isStart = true;
//      }
////      else{
//        audioPlayer.progressChange(rate);
////      }
//    },
    start: function() {
      console.log("audioBottom start");
      if (this.isStart) {
        audioPlayer.start();
      } else {
        this.forcePlay();
      }
    },
    forcePlay: function(songIndex) {
      console.log('audioBottom forcePlay')
      if (!this.isStart) {
        this.isStart = true;
        this.addToPlaylist();
      } else if (!audioPlayer.isPlay) {
        audioPlayer.play();
      }
    },
    forceJump: function(point) {
      console.log('audioBottom forceJump')
      if (!this.isStart) {
        this.classlist.point = point;
        this.addToPlaylist();
      } else {
//        audioPlayer.play();
        audioPlayer.forceJump(point);
      }
    },
    addToPlaylist: function() {
      console.log('audioBottom addToPlaylist')
      audioPlayer.autoPlay = true;
      audioPlayer.songIndex = audioPlayer.addToPlaylist(this.classlist);
      audioPlayer.play();

      CIData.recActionTransact(audioPlayer.songPlay)

      this.isStart = true;

      this.$apply();
    }
  }
};
</script>

<style lang="sass" scoped>
  @import './audioBottom.scss'
</style>
