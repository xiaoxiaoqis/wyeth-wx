<template>
  <OHSFullPage class="courseSeries">
    <scroller class="courseSeries-scroller" @loadmore="loadmore">
      <div v-if="showType === 0 || showType === 1">
        <image class="courseSeries-poster" :src="courseCat.img"/>
        <OBlock1 :width="750" :height="15" bgColor="rgba(0,0,0,0)"></OBlock1>

        <div v-if="showType === 0">
          <ClassHeaderPrice :classInfo="classInfo" @clickLike="clickLike" @clickCollect="clickCollect"></ClassHeaderPrice>
        </div>

        <div v-if="showType === 1">
          <Usercell :userInfo='teacherInfo' @clickConcern='clickConcern'></Usercell>
          <text class='courseSerise-teacher-desc'>{{teacherInfo.teacher_desc}}</text>
        </div>

        <OBlock2 :width="750" :height="24" bgColor="#EFEFF4"></OBlock2>

        <panel title="主要课程" :paddingLeft="12" :paddingRight="34" :titlePaddingLeft="10" :extraPaddingRight="27"
               :titleSize="29" :extraSize="25" :imgBg = "'http://wyeth-course.nibaguai.com/wyeth/image/header_bg.png'" :imgLeftWitdh="8" titleColor="#af730c" extraColor="#666666" :imgLeftHeight="38" :imgRightWitdh="28" :imgRightHeight="28" :imgLeft="require('assets/line.png')" :noextra="true"></panel>
        <list class="classlist">

          <OHSClassList :items="classList" @onItemClick="onItemClick"></OHSClassList>
          <!--<OHSClasscell v-for="(item,i) in classList" :key="i" @click="onItemClick(item)" :obj="item"></OHSClasscell>-->
        </list>

        <!--<OBlock3 :width="750" :height="100" bgColor="#EFEFF4"></OBlock3>-->
        <!--<button class='courseSeries-button' v-if="accessType < 3" @click='submit' :disabled='buttonStyles[accessType].buttonEnable' :style='buttonStyles[accessType].buttonImage'>{{buttonStyles[accessType].buttonTitle}}</button>-->
        <!--<InviteButton @clickInvitation="clickInvitation"></InviteButton>-->
      </div>

      <div v-if="showType === 2" style="background-color:#ECECEC;flex-direction:column">
        <div class="courseSeries-waterfall-poster" :style="{backgroundImage:'url(' + courseCat.img + ')'}">
          <text class="courseSeries-waterfall-num">已有{{courseCat.number || 0}}人参加</text>
        </div>

        <!--<text>waterfall</text>-->
        <courseWaterFall :items="classList" @onItemClick="onItemClick"></courseWaterFall>

        <div class="waterfall-footer">
          <text class="waterfall-footer-text" @click = "loadmore">{{loading_txt}}</text>
        </div>

        <text class="courseSeries-waterfall-text">“魔栗妈咪学院”版权归属育儿网所有，相关课程内容由育儿网提供。平台相关内容不作为医学诊断参考，如情况严重，建议及时就医。</text>

        <!-- <OBlock :width="750" :height="100" bgColor="#EFEFF4"></OBlock>
            <button class='courseSeries-button' @click='submit' :style='buttonStyles[3].buttonImage'>{{buttonStyles[3].buttonTitle}}</button> -->
      </div>

      <OBlock3 :width="750" :height="100" bgColor="#ECECEC"></OBlock3>
    </scroller>


    <div class="courseSeries-button" v-if="accessType < 3 && done" @click='submit'
         :style='buttonStyles[accessType].buttonImage'>
      <text class="courseSeries-button-text">{{buttonStyles[accessType].buttonTitle}}</text>
    </div>

  </OHSFullPage>
</template>

<script>
import Base from "../../mixins/base";
import config from "../../config.json";
import CIData from "../../modules/CIData";

import event from "../../modules/event";
import network from "../../modules/network/network";
import { courseRoute } from "../../modules/tools";
import { WxShare } from "../../modules/WxSDK";

import OBlock from "../../components/OBlock";
import OSlider from "../../components/OSlider";
import panel from "../../components/panel";
import Usercell from "../../components/usercell";

import courseWaterFall from "../../components-proj/course/courseWaterFall.vue";

import ClassHeaderPrice from "../../components-proj/course/classHeaderPrice.vue";

//  import { InviteButton } from '../../components-proj/other'
//  import OHSClasscell from '../../components-proj/all/classCell'
//  import CourseCardCell from '../../components-proj/course/courseCardCell'
import OHSFullPage from "../../components-proj/comm/page/ohs-fullpage.vue";

import API from "../../lib/api";

import OHSClassList from "../../components-proj/all/classList/ohs-classlist.vue";

export default {
  config: {
    navigationBarTitleText: "课程"
  },
  mixins: [Base],
  preload($route) {
    return ["getCourseSeries." + $route.params.id];
  },
  components: {
    //      OSlider: OSlider.weexComponent,
    OHSFullPage: OHSFullPage.weexComponent,
    OBlock1: OBlock.weexComponent,
    OBlock2: OBlock.weexComponent,
    OBlock3: OBlock.weexComponent,
    //      InviteButton: InviteButton.weexComponent,
    //      OHSClasscell: OHSClasscell.weexComponent,
    //      LikeButton: LikeButton.weexComponent,
    //      CollectButton: CollectButton.weexComponent,
    //      CourseDetail: CourseDetail.weexComponent,
    ClassHeaderPrice: ClassHeaderPrice.weexComponent,
    panel: panel.weexComponent,
    Usercell: Usercell.weexComponent,
    //      CourseCardCell: CourseCardCell,
    OHSClassList: OHSClassList,
    courseWaterFall: courseWaterFall
  },
  data() {
    return {
      // graySkin: true,
      done: false,
      courseCat: {},
      teacherInfo: {},
      classInfo: {},
      classList: [],
      userInfo: {},
      buttonStyles: [
        {
          buttonEnable: false,
          buttonTitle: "0MQ 购买",
          buttonImage:
            "background-image: linear-gradient(to right, #e7c25f, #e4be5b,#cea03f,#c69735);"
        },
        {
          buttonEnable: false,
          buttonTitle: "一键订阅",
          buttonImage:
            "background-image: linear-gradient(to right, #e7c25f, #e4be5b,#cea03f,#c69735);"
        },
        {
          buttonEnable: true,
          buttonTitle: "已订阅",
          buttonImage:
            "background-image: linear-gradient(to right,#dddddd,#dddddd);"
        },
        {
          buttonEnable: true,
          buttonTitle: "报名更多课程",
          buttonImage:
            "background-image: linear-gradient(to right, #e7c25f, #e4be5b,#cea03f,#c69735);"
        }
      ],
      padding: this.rpx(24),
      refreshing: false,
      columnCount: 2,
      columnGap: this.rpx(20),
      columnWidth: "auto",
      contentOffset: "0",
      showHeader: true,
      showScrollbar: false,
      scrollable: true,
      course_id: 0,
      loading_txt: "",
      page: 1,
      page_size: 10,
      isLoading: false
    };
  },
  computed: {
    accessType: function() {
      if (parseInt(this.courseCat.purchased) === 1) {
        // 可阅读
        if (parseFloat(this.courseCat.price) > 0) {
          // 已购买
          return 3;
        } else {
          // 免费课
          return this.userInfo.is_subscribed ? 2 : 1;
        }
      } else {
        // 待购买
        return 0;
      }
    },
    showType: function() {
      /* show_type
         0:系列型   1:专家型   2:多图型   3:介绍型
         */
      let tmp = parseInt(this.courseCat.show_type);
      if (tmp === 3) {
        //          window.location.replace = window.location.origin + "/mobile/cat?id=" + this.courseCat.id
      }

      console.log("##showType=", tmp, this.courseCat.show_type);
      return tmp;
    }
  },
  created() {
    let self = this;
    let course_id = this.$route.params.id;
    if (course_id) {
      self.course_id = course_id;
    }

    network.getCourseSeries(
      { cid: self.course_id, page: self.page, page_size: self.page_size },
      function(res) {
        if (res.ret === 1) {
          let data = res.data;

          self.courseCat = data.courseCat || {};
          self.teacherInfo = data.teacher_info || {};
          self.classList = data.courses || [];

          CIData.recActionExpose_array(data.courses);

          self.userInfo = data.userInfo;
          self.buttonStyles[0].buttonTitle = self.courseCat.price + "MQ 购买";

          self.classInfo =
            parseInt(self.courseCat.show_type) === 0
              ? self.courseCat
              : self.classList[0];
          self.classInfo.type = 2;
          self.done = true;

          if (data.courses.length < self.page_size) {
            self.loading_txt = "正在加载中...";
          } else {
            self.loading_txt = "";
          }
          self.page = self.page + 1;
        }
        self.$apply();
      }
    );
  },
  onShow() {},
  onShareAppMessage(options) {
    let params = { id: this.course_id };
    return {
      title: this.classInfo.title,
      path: `/pages/course/courseSeries?params=${JSON.stringify(params)}`
    };
  },
  methods: {
    loadmore: function(e) {
      if (this.showType !== 2) {
        return;
      }
      let self = this;
      if (self.isLoading === false) {
        self.isLoading = true;

        self.loading_txt = "正在加载中...";
        network.getCourseSeries(
          {
            cid: self.course_id,
            page: self.page,
            page_size: self.page_size
          },
          function(res) {
            if (res.ret === 1) {
              let data = res.data.courses;
              if (data.length < self.page_size) {
                self.loading_txt = "暂无更多数据";
              } else {
                self.loading_txt = "";
              }

              CIData.recActionExpose_array(data);

              self.classList.push(...data);

              self.page = self.page + 1;
            } else {
              self.loading_txt = "加载失败，请重试";
            }

            self.isLoading = false;
            self.$apply();
          },
          true
        );
      }
    },
    clickLike: function(e) {
      console.log("点击喜欢");

      if (e.class_id === this.classInfo.id) {
        this.classInfo.isLike = e.isLike;
        if (e.isLike) {
          this.classInfo.likeNum = parseInt(this.classInfo.likeNum) + 1;
        } else {
          this.classInfo.likeNum = parseInt(this.classInfo.likeNum) - 1;
        }
      }
    },
    clickCollect: function(e) {
      console.log("点击收藏");

      if (e.class_id === this.classInfo.id) {
        this.classInfo.isSave = e.isSave;
        if (e.isSave) {
          this.classInfo.saveNum = parseInt(this.classInfo.saveNum) + 1;
        } else {
          this.classInfo.saveNum = parseInt(this.classInfo.saveNum) - 1;
        }
      }
    },
    onItemClick: function(item) {
      console.log("this.classList", this.classList);
      courseRoute(item, { otherClass: this.classList });
    },
    submit: function() {
      if (this.buttonStyles[this.accessType].buttonEnable) {
        return;
      }
      if (this.accessType) {
        // 订阅
        this.clickSubscribe();
      } else {
        // 购买
        this.clickBuy();
      }
    },
    clickBuy: function() {
      var self = this;
      network.createOrderMQ(this.courseCat.id, 1, function(res) {
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
        self.$apply();
      });
    },
    clickSubscribe: function() {
      var self = this;
      network.signCat(this.courseCat.id, function(res) {
        if (res.ret === 1) {
          event.sendEvent("toast", { type: "success", text: "订阅成功" });
          self.userInfo.is_subscribed = 1;
        }
        self.$apply();
      });
    },
    clickConcern: function(e) {
      if (e.teacher_id === this.teacherInfo.teacher_id) {
        this.teacherInfo.concern = e.concern;
      }
    },
    clickInvitation: function() {
      console.log("点击邀请");
      this.$router.push({
        name: "invitation",
        params: { classInfo: this.classInfo, teacherInfo: this.teacherInfo }
      });
    }
  }
};
</script>

<style scoped>
.courseSeries-scroller {
  position: absolute;
  left: 0px;
  top: 0px;
  right: 0px;
  bottom: 0px;
}

.courseSeries {
  background-color: #ffffff;
}

.courseSeries .courseSeries-poster {
  width: 750px;
  height: 335px;
}

.courseSeries .courseSerise-teacher-desc {
  position: relative;
  width: inherit;
  background-color: #ffffff;
  padding: 20px 40px;
  font-size: 30px;
  text-align: left;
  color: #565656;
  border-top-width: 1px;
  border-top-color: #eeeeee;
  border-top-style: solid;
}

.courseSeries .courseSeries-button {
  position: fixed;
  bottom: 0px;
  width: 750px;
  justify-content: center;
  align-items: center;
  border-radius: 0%;
  height: 100px;
}
.courseSeries-button-text {
  position: relative;
  line-height: 100px;
  text-align: center;
  color: white;
  font-size: 32px;
}

.courseSeries-waterfall-num {
  position: absolute;
  left: 0px;
  bottom: 0px;
  margin: 20px 27px;
  font-size: 25px;
  color: rgba(188, 133, 65, 1);
  line-height: 30px;
}

.courseSeries-waterfall {
  margin: 0 24px;
}

.courseSeries-waterfall-cell {
  width: 340px;
  padding-bottom: 23px;
}

.waterfall-footer {
  position: relative;
  width: 750px;
  height: 80px;
  justify-content: center;
  align-items: center;
}

.waterfall-footer-text {
  text-align: center;
  color: #888888;
  font-size: 24px;
}

.courseSeries-waterfall-poster {
  width: 750px;
  height: 470px;
  background-size: cover;
  background-repeat: no-repeat;
}

.courseSeries-waterfall-text {
  margin: 70px 40px;
  font-size: 24px;
  color: #666666;
}
</style>
