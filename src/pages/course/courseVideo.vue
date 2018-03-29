<template>
  <OHSPage>
    <scroller class="courseVideo-scroller" id="courseVideo" v-show="!graySkin">

      <VideoPlayer :access="!accessType" :videoInfo="classlist" :classInfo="classInfo" @stateChange="stateChange"></VideoPlayer>
      <ClassHeader :classInfo="classInfo" @clickLike="clickLike" @clickCollect="clickCollect" @clickTag="clickTag"></ClassHeader>

      <OBlock1 :width="750" :height="25" bgColor="#ffffff"></OBlock1>
      <Usercell :userInfo="userInfo" @clickConcern="clickConcern"></Usercell>
      <OBlock2 :width="750" :height="25" bgColor="#ffffff"></OBlock2>

      <OBlock3 :marginLeft="15" :marginRight="15" :width="720" :height="2" bgColor="#eeeeee"></OBlock3>
      <text class="courseVideo-content-text">{{classInfo.course_desc}}</text>

      <OBlock4 v-if="otherClass.length > 0" :width="750" :height="24" bgColor="#eeeeee"></OBlock4>
      <OtherClass v-if="otherClass.length > 0" :items="otherClass" title="相关课程"></OtherClass>

      <OBlock5 v-show="classInfo.guide && classInfo.guide.length > 0" :width="750" :height="24" bgColor="#eeeeee"></OBlock5>
            <panel title='课程详情' :paddingLeft='12' :paddingRight='34' :titlePaddingLeft='10' :extraPaddingRight='27'
              :titleSize='29' :extraSize='25' :imgLeftWitdh='8' titleColor='#af730c' extraColor='#666666'
              :imgLeftHeight='38' :imgRightWitdh='28' :imgRightHeight='28' :imgLeft="require('/assets/line.png')"
              :noextra='true'></panel>
      <import src="../../modules/wxParse/wxParse.wxml"/> 
      <div class="wxParse" v-show="classInfo.guide && classInfo.guide.length > 0">
        <template is="wxParse" data="{{wxParseData:article.nodes}}"></template>
      </div>
      
      <OBlock6 v-if="broadcast1.length > 0" :width="750" :height="24" bgColor="#eeeeee"></OBlock6>
      <OSlider1 v-if="broadcast1.length > 0" :items="broadcast1" :width="750" :interval="3000" :autoPlay="true"
                :height="200" :showIndicator="false"></OSlider1>

      <OBlock7 v-if="recomClass.length > 0" :width="750" :height="24" bgColor="#eeeeee"></OBlock7>
      <CourseRecommend :recommendList="recomClass"></CourseRecommend>

      <OBlock8 v-if="broadcast2.length > 0" :width="750" :height="24" bgColor="#eeeeee"></OBlock8>
      <OSlider2 v-if="broadcast2.length > 0" :items="broadcast2" :width="750" :interval="3000" :autoPlay="true"
                :height="360" :showIndicator="false"></OSlider2>

      <OBlock9 v-if="broadcast2.length > 0" :width="750" :height="70" bgColor="#eeeeee"></OBlock9>

      <OBlock10 v-if="accessType" :width="750" :height="115" bgColor="#eeeeee"></OBlock10>

      <!--<InviteButton v-show="!isPlay" @clickInvitation="clickInvitation"></InviteButton>-->
    </scroller>

    <button v-if="accessType" class='course-button' @click='clickBuy'>{{classInfo.price}}MQ 购买</button>

  </OHSPage>
</template>

<script>
import WxParse from "../../modules/wxParse/wxParse";

import API from "../../lib/api";
import Base from "../../mixins/base";

import network from "../../modules/network/network";
import { WxShare } from "../../modules/WxSDK";

import VideoPlayer from "../../components-proj/course/videoPlayer.vue";
import ClassHeader from "../../components-proj/course/classHeader.vue";
import OtherClass from "../../components-proj/course/otherClass.vue";
import CourseRecommend from "../../components-proj/course/courseRecommend.vue";
// import CourseDetail from '../../components-proj/course/courseDetail.vue'

import config from "../../config.json";
import event from "../../modules/event/index";
import InviteButton from "../../components-proj/other/inviteButton.vue";
import OHSPage from "../../components-proj/comm/page/ohs-page.vue";
import OBlock from "../../components/OBlock";
import Usercell from "../../components/usercell";
import OSlider from "../../components/OSlider";

import CIData from "../../modules/CIData";
import panel from "../../components/panel";

export default {
  config: {
    navigationBarTitleText: "课程"
  },
  mixins: [Base],
  preload($route) {
    return ["course." + $route.params.id];
  },
  components: {
    Usercell: Usercell.weexComponent,
    VideoPlayer: VideoPlayer.weexComponent,
    ClassHeader: ClassHeader.weexComponent,
    OtherClass: OtherClass.weexComponent,
    CourseRecommend: CourseRecommend.weexComponent,
    //    CourseDetail: CourseDetail.weexComponent,
    OSlider1: OSlider.weexComponent,
    OSlider2: OSlider.weexComponent,
    InviteButton: InviteButton.weexComponent,
    OHSPage: OHSPage.weexComponent,
    OBlock1: OBlock.weexComponent,
    OBlock2: OBlock.weexComponent,
    OBlock3: OBlock.weexComponent,
    OBlock4: OBlock.weexComponent,
    OBlock5: OBlock.weexComponent,
    OBlock6: OBlock.weexComponent,
    OBlock7: OBlock.weexComponent,
    OBlock8: OBlock.weexComponent,
    OBlock9: OBlock.weexComponent,
    OBlock10: OBlock.weexComponent,
    panel: panel.weexComponent
  },
  data() {
    return {
      graySkin: false,
      isPlay: false,
      classInfo: {},
      userInfo: {},
      classlist: {},
      otherClass: [],
      recomClass: [],
      broadcast1: [],
      broadcast2: [],
      courseId: 0
    };
  },
  created() {
    var self = this;
    let courseId = this.$route.params.id;
    if (courseId) {
      self.courseId = courseId;
    }
    network.getCourseDetail(self.courseId, function(res) {
      if (res.ret === 1) {
        let data = res.data;
        self.classInfo = data.classInfo || {};
        self.userInfo = data.userInfo || {};
        self.classlist = data.classlist || {};

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
  onShareAppMessage(options) {
    let params = { id: this.courseId };
    return {
      title: this.classInfo.title,
      path: `/pages/course/courseVideo?params=${JSON.stringify(params)}`
    };
  },
  mounted() {},
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
    depend() {
      return ["course." + this.$route.params.id];
    },
    resolve() {
      if (this.graySkin) {
        this.graySkin = false;
        event.sendEvent("graySkin", { show: false });
      }

      let date = new Date();
      console.log(
        "resolve" + (date.getSeconds() * 1000 + date.getMilliseconds())
      );

      let data = this.store("course." + this.$route.params.id).data;

      this.classInfo = data.classInfo || {};
      this.userInfo = data.userInfo || {};
      this.classlist = data.classlist || {};
      this.otherClass = data.otherClass || [];
      this.recomClass = data.recomClass || [];
      this.broadcast1 = data.broadcast1 || [];
      this.broadcast2 = data.broadcast2 || [];

      if (document.querySelector("#courseVideo")) {
        document.querySelector("#courseVideo").scrollTop = 0;
      }

      if (data.mq) {
        event.sendEvent("toast", { type: "success", text: "完成任务" });
      }

      // 分享设置
      var self = this;
      let title = self.classInfo.title ? self.classInfo.title : "魔栗妈咪学院";
      let desc = self.classInfo.course_desc ? self.classInfo.course_desc : "";
      let img = self.classInfo.img ? self.classInfo.img : "";
      let link =
        config.host +
        "/mobile/index?defaultPath=/courseVideo/" +
        self.classInfo.id;
      WxShare.share(
        title,
        desc,
        img,
        link,
        function() {
          console.log("分享成功");
          network.shareCourse(self.classInfo.id, function() {});
          // CIData.push([
          //   "trackEvent",
          //   "wyeth",
          //   "share",
          //   "cid",
          //   self.classInfo.id
          // ]);
        },
        function() {
          console.log("分享失败");
        }
      );
    },
    stateChange: function(e) {
      this.isPlay = e;
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
.courseVideo-scroller {
  position: absolute;
  left: 0px;
  top: 0px;
  right: 0px;
  bottom: 0px;
}
#courseVideo {
  background-color: #ffffff;
  position: absolute;
  left: 0;
  right: 0;
  bottom: -100px;
  top: 0px;
}

#courseVideo .courseVideo-content-text {
  position: relative;
  width: inherit;
  background-color: #ffffff;
  margin-bottom: 20px;
  padding: 20px 40px;
  font-size: 30px;
  text-align: left;
  color: #565656;
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