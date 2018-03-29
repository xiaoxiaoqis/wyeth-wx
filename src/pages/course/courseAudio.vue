<template>
  <OHSFullPage>
    <scroller id="courseAudio" class="courseAudio-scroller" @appear="onappear" @disappear="ondisappear">
      <OBlock1 :width="750" :height="24" bgColor="RGBA(0,0,0,0)"></OBlock1>
      <Introduction :userInfo="userInfo" :classInfo="classInfo" @clickConcern="clickConcern" @clickLike="clickLike" @clickCollect="clickCollect" @clickTag="clickTag"></Introduction>

      <OBlock2 v-show="otherClass.length > 0" :width="750" :height="24" bgColor="#eeeeee"></OBlock2>
      <OtherClass v-show="otherClass.length > 0" :items="otherClass" title="相关课程"></OtherClass>

      <OBlock8 v-show = "classlist.chapter && classlist.chapter.length > 0" :width = "750" :height = "24" bgColor =
        "#eeeeee"></OBlock8>
      <chapterlist v-show = "classlist.chapter &&  classlist.chapter.length > 0" :classlist = "classlist" :songSelected = "songSelected" @clickSectionCell = "clickSectionCell"></chapterlist>

      <OBlock9 v-show="classInfo.guide && classInfo.guide.length > 0" :width="750" :height="24" bgColor="#eeeeee"></OBlock9>

      <panel title='课程详情' :paddingLeft='12' :paddingRight='34' :titlePaddingLeft='10' :extraPaddingRight='27'
              :titleSize='29' :extraSize='25' :imgLeftWitdh='8' titleColor='#af730c' extraColor='#666666'
              :imgLeftHeight='38' :imgRightWitdh='28' :imgRightHeight='28' :imgLeft="require('/assets/line.png')"
              :noextra='true'></panel>
      <import src="../../modules/wxParse/wxParse.wxml"/> 
      <div class="wxParse" v-show="classInfo.guide && classInfo.guide.length > 0">
        <template is="wxParse" data="{{wxParseData:article.nodes}}"></template>
      </div>

      <OBlock3 v-show="broadcast1.length > 0" :width="750" :height="24" bgColor="#eeeeee"></OBlock3>
      <OSlider1 v-show="broadcast1.length > 0" :items="broadcast1" :width="750" :interval="3000" :autoPlay="true"
                :height="200" :showIndicator="false"></OSlider1>

      <OBlock4 v-show="recomClass.length > 0" :width="750" :height="24" bgColor="#eeeeee"></OBlock4>
      <CourseRecommend :recommendList="recomClass"></CourseRecommend>

      <OBlock5 v-show="broadcast2.length > 0" :width="750" :height="24" bgColor="#eeeeee"></OBlock5>
      <OSlider2 v-show="broadcast2.length > 0" :items="broadcast2" :width="750" :interval="3000" :autoPlay="true"
                :height="360" :showIndicator="false"></OSlider2>

      <OBlock6 v-show="broadcast2.length > 0" :width="750" :height="70" bgColor="#eeeeee"></OBlock6>

      <OBlock7 :width="750" :height="115" bgColor="#eeeeee"></OBlock7>


      <AudioBottom :classlist="classlist" :songSelected="songSelected"></AudioBottom>
    </scroller>

    <button v-if="accessType" class='course-button' @click='clickBuy'>{{classInfo.price}}MQ 购买</button>
    <!--<AudioBottom v-else :classlist="classlist"></AudioBottom>-->



  </OHSFullPage>
</template>

<script>
import WxParse from "../../modules/wxParse/wxParse";

import API from "../../lib/api";
import Base from "../../mixins/base";

import network from "../../modules/network/network";
import { WxShare } from "../../modules/WxSDK";

import AudioBottom from "../../components-proj/course/audioBottom.vue";
import Introduction from "../../components-proj/course/introduction.vue";
import Classlist from "../../components-proj/course/classlist.vue";
import chapterlist from "../../components-proj/course/chapterlist.vue";
import OtherClass from "../../components-proj/course/otherClass.vue";
import CourseRecommend from "../../components-proj/course/courseRecommend.vue";

import OBlock from "../../components/OBlock/index";
import config from "../../config.json";

import OHSFullPage from "../../components-proj/comm/page/ohs-fullpage.vue";

import OSlider from "../../components/OSlider/index";
import event from "../../modules/event";
import CIData from "../../modules/CIData";
import panel from "../../components/panel";

module.exports = {
  config: {
    navigationBarTitleText: "课程"
  },
  mixins: [Base],
  preload($route) {
    return ["course." + $route.params.id];
  },
  components: {
    OtherClass: OtherClass.weexComponent,
    CourseRecommend: CourseRecommend.weexComponent,
    OSlider1: OSlider.weexComponent,
    OSlider2: OSlider.weexComponent,
    AudioBottom: AudioBottom.weexComponent,
    Introduction: Introduction.weexComponent,
    //    Classlist: Classlist.weexComponent,
    //    InviteButton: InviteButton.weexComponent,
    OHSFullPage: OHSFullPage.weexComponent,
    OBlock1: OBlock.weexComponent,
    OBlock2: OBlock.weexComponent,
    OBlock3: OBlock.weexComponent,
    OBlock4: OBlock.weexComponent,
    OBlock5: OBlock.weexComponent,
    OBlock6: OBlock.weexComponent,
    OBlock7: OBlock.weexComponent,
    OBlock8: OBlock.weexComponent,
    OBlock9: OBlock.weexComponent,
    chapterlist: chapterlist,
    panel: panel.weexComponent
  },
  data() {
    return {
      graySkin: true,
      classInfo: {},
      userInfo: {},
      classlist: {},
      otherClass: [],
      recomClass: [],
      broadcast1: [],
      broadcast2: [],
      songlist: [],
      songSelected: {},
      currentTime: 0,
      totalTime: 0,
      progressWidth: 581,
      index: 0,
      audoPlay: false,
      course_id: 0
      // isPlay: false
    };
  },
  onShareAppMessage(options) {
    let params = { id: this.course_id };
    let a = {
      title: this.classInfo.title,
      path: `/pages/course/courseAudio?params=${JSON.stringify(params)}`
    };
    console.log("onShareAppMessage", a);
    return a;
  },
  created() {
    var self = this;
    let course_id = this.$route.params.id;
    if (course_id) {
      self.course_id = course_id;
    }
    network.getCourseDetail(self.course_id, function(res) {
      if (res.ret === 1) {
        console.log("!!!!!!!!!courseAudio created:", res.data);
        let data = res.data;
        self.classInfo = data.classInfo || {};
        self.userInfo = data.userInfo || {};

        self.classlist = data.classlist || {};
        self.classlist.img = data.classInfo.img;
        if (self.classInfo.img && self.classInfo.img.indexOf("?") !== -1) {
          self.classlist.poster = self.classInfo.img.substring(
            0,
            self.classInfo.img.indexOf("?")
          );
        } else {
          self.classlist.poster = self.classInfo.img;
        }

        self.otherClass = data.otherClass || [];
        CIData.recActionExpose_array(data.otherClass);

        self.recomClass = data.recomClass || [];
        CIData.recActionExpose_array(data.recomClass);

        self.broadcast1 = data.broadcast1 || [];
        self.broadcast2 = data.broadcast2 || [];

        WxParse.wxParse("article", "html", self.classInfo.guide, self, 0);

        self.$apply();
      }
    });
  },

  onShow() {},
  mounted() {},
  updated() {},
  computed: {
    accessType: function() {
      if (parseInt(this.classInfo.purchased) === 1) {
        // 可阅读
        return 0;
      } else {
        // 待购买
        if (parseInt(this.classInfo.purchased) === 2) {
          // 购买套课
          return 2;
        } else if (parseInt(this.classInfo.purchased) === 3) {
          // 购买单课
          return 1;
        }
      }
    }
  },
  watch: {
    $route: ["reload"]
  },
  methods: {
    init() {
      console.log("init courseAudio");
      let self = this;
      network.getDetail({ course_id: 46 }, function(res) {
        let data = res.data;
        self.classInfo = data.classInfo || {};
        self.userInfo = data.userInfo || {};

        self.classlist = data.classlist || {};
        self.classlist.img = data.classInfo.img;
        if (self.classInfo.img && self.classInfo.img.indexOf("?") !== -1) {
          self.classlist.poster = self.classInfo.img.substring(
            0,
            self.classInfo.img.indexOf("?")
          );
        } else {
          self.classlist.poster = self.classInfo.img;
        }

        self.otherClass = data.otherClass || [];
        self.recomClass = data.recomClass || [];
        self.broadcast1 = data.broadcast1 || [];
        self.broadcast2 = data.broadcast2 || [];
      });
    },
    depend() {
      return ["course." + this.$route.params.id];
    },
    resolve(data) {
      // if (this.graySkin) {
      //   this.graySkin = false
      //   event.sendEvent('graySkin', { show: false })
      // }

      // let date = new Date()
      // console.log('resolve' + (date.getSeconds() * 1000 + date.getMilliseconds()))

      // let data = this.store('course.' + this.$route.params.id).data

      this.classInfo = data.classInfo || {};
      this.userInfo = data.userInfo || {};

      this.classlist = data.classlist || {};

      this.classlist.img = data.classInfo.img;

      if (this.classInfo.img && this.classInfo.img.indexOf("?") !== -1) {
        this.classlist.poster = this.classInfo.img.substring(
          0,
          this.classInfo.img.indexOf("?")
        );
      } else {
        this.classlist.poster = this.classInfo.img;
      }

      console.log("this.classlist:", this.classlist);

      this.otherClass = data.otherClass || [];
      this.recomClass = data.recomClass || [];
      this.broadcast1 = data.broadcast1 || [];
      this.broadcast2 = data.broadcast2 || [];

      if (document.querySelector("#courseAudio")) {
        document.querySelector("#courseAudio").scrollTop = 0;
      }

      if (data.mq) {
        event.sendEvent("toast", { type: "success", text: "完成任务" });
      }

      // let songlist_tmp = []

      // let index = 0
      // let index_play = -1

      // for (let i in this.classlist) {
      //   for (let j in this.classlist[i].section) {
      //     let song_tmp = this.classlist[i].section[j]
      //     song_tmp.index = index  //生成唯一编号
      //     song_tmp.poster = this.classInfo.img  // 添加封面
      //     songlist_tmp[index] = song_tmp
      //     if (index_play < 0) {
      //       // 该歌曲是否为正在播放的歌曲
      //       index_play = audioPlayer.checkSongEq(song_tmp) ? index : -1
      //     }

      //     index++
      //   }
      // }

      // this.songlist = songlist_tmp

      // if (index_play >= 0) {
      //   this.songSelected = songlist_tmp[index_play]
      // }

      // songlist_tmp = null
      // 分享设置

      var self = this;
      var linkUrl =
        config.host +
        "/mobile/index?defaultPath=/courseAudio/" +
        self.classInfo.id;
      let title = self.classInfo.title ? self.classInfo.title : "魔栗妈咪学院";
      let desc = self.classInfo.course_desc ? self.classInfo.course_desc : "";
      let img = self.classInfo.img ? self.classInfo.img : "";
      let link = linkUrl;
      WxShare.share(
        title,
        desc,
        img,
        link,
        function() {
          console.log("分享成功");
          network.shareCourse(self.classInfo.id, function() {});
          // CIData.push(['trackEvent', 'wyeth', 'share', 'cid', self.classInfo.id])
        },
        function() {
          console.log("分享失败");
        }
      );
    },
    clickSectionCell: function(e) {
      this.songSelected = e.section;
      this.$apply();
      // this.$refs.audioBottom.forceJump(e.section.start)
    },
    onappear: function() {
      console.log("!!!!!!!!!courseAudio appear");
    },
    ondisappear: function() {
      console.log("!!!!!!!!!courseAudio ondisappear");
    },
    clickConcern: function(e) {
      if (e.teacher_id === this.userInfo.teacher_id) {
        this.userInfo.concern = e.concern;
      }
    },
    clickLike: function(e) {
      console.log("点击喜欢");

      if (e.class_id === this.classInfo.id) {
        this.classInfo.isLike = e.isLike;
        if (e.isLike) {
          CIData.recActionLike(this.classInfo);
          this.classInfo.likeNum = parseInt(this.classInfo.likeNum) + 1;
        } else {
          CIData.recActionDislike(this.classInfo);
          this.classInfo.likeNum = parseInt(this.classInfo.likeNum) - 1;
        }
      }
    },
    clickCollect: function(e) {
      console.log("点击收藏");

      if (e.class_id === this.classInfo.id) {
        this.classInfo.isSave = e.isSave;
        if (e.isSave) {
          CIData.recActionCollect(this.classInfo);
          this.classInfo.saveNum = parseInt(this.classInfo.saveNum) + 1;
        } else {
          CIData.recActionUncollect(this.classInfo);
          this.classInfo.saveNum = parseInt(this.classInfo.saveNum) - 1;
        }
      }
    },
    clickInvitation: function() {
      console.log("点击邀请");
      this.$router.push({
        name: "invitation",
        params: { classInfo: this.classInfo, teacherInfo: this.userInfo }
      });
    },
    clickTag(tag) {
      this.$router.switchTab({
        name: "all",
        params: { tag: { id: tag.id, name: tag.name }, nokeep: true }
      });
    },
    clickBuy: function() {
      // 点击购买
      console.log("clickBuy");
      if (this.accessType === 1) {
        // 购买单课
        var self = this;
        network.createOrderMQ(this.classInfo.id, 2, function(res) {
          if (res.ret === 1 && res.data && res.data.trade_id) {
            //            self.$router.push('/orderPay/' + res.data.trade_id + '/0')
            self.$router.push({
              name: "orderPay",
              params: { trade_id: res.data.trade_id, from_recharge: 0 }
            });
          } else {
            event.sendEvent("toast", {
              type: "fail",
              text: res.msg || "生成订单失败"
            });
          }
        });
      } else {
        // 购买套课
        if (this.classInfo.cid) {
          this.$router.push({
            name: "courseSeries",
            params: { id: this.classInfo.cid }
          });
          //          this.$router.push('/courseSeries/' + this.classInfo.cid)
        } else {
          event.sendEvent("toast", { type: "fail", text: "套课不存在" });
        }
      }
    }
  }
};
</script>

<style scoped>
.courseAudio-scroller {
  position: absolute;
  left: 0px;
  top: 0px;
  right: 0px;
  bottom: 0px;
}
#courseAudio {
  background-color: #ffffff;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0px;
  top: 0px;
}

introduction {
  margin: 0 0 20px 0;
}

classlist {
  margin: 0 0 20px 0;
}

.course-button {
  position: fixed;
  bottom: 0px;
  width: 750px;
  height: 100px;
  font-size: 32px;
  text-align: center;
  justify-content: center;
  align-items: center;
  border-radius: 0px;
  color: white;
  background-image: linear-gradient(
    to right,
    #e7c25f,
    #e4be5b,
    #cea03f,
    #c69735
  );
}
</style>
