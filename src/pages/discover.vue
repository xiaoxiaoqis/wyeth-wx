<template>
  <OHSPage>
    <list class="discover-list" ref="list" loadmoreoffset="10" @loadmore="loadmore">

      <image class="bg" :src="require('/assets/mine_bg.png')"/>
      <div class="pageheader">
        <div class="userInfo">
          <image class="avatar" :src="userInfo.avatar"/>
          <div class="content">
            <text class="name">{{userInfo.nickname}}</text>
            <text class="date">预产期{{userInfo.pregdate}}</text>
          </div>
        </div>
        <image class="button" :src="require('/assets/mine_setting.png')" @click="clickSetting()"/>
      </div>

      <Calendar :sign="sign" @choseDay="choseDay"></Calendar>

       <div v-if="false" class="reward">
        <div class="header">
          <image class="icon" :src="require('/assets/discover_gift.png')"/>
          <div class="text">
            <text class="title">MQ专享魔栗转转乐</text>
            <text class="subtitle">{{currentMonth}}月大礼上线啦，0元拿好货</text>
          </div>
        </div>
        <div class="button" @click="gotoExchange()">
          <text class="title">前往抽奖</text>
        </div>
      </div>

      <Tabs :value="tab1" @onTabChange="onTabChange" class="tabs">
        <Tab1 label="我的足迹" value="one" style="position: static;">
          <OHSClassList :items="networkParam[0].itemList" @onItemClick="onItemClick"></OHSClassList>
          <text :style="loadingStyle">{{footer_text}}</text>
        </Tab1>
        <Tab2 label="我的关注" value="two"  style="position: static;">
            <OHSDynamticList :items="networkParam[1].itemList" @onItemClick="onItemClick"></OHSDynamticList>
            <text :style="loadingStyle">{{footer_text}}</text>
        </Tab2>
      </Tabs>

    </list>
  </OHSPage>
</template>

<script>
import config from "../config.json";
import Base from "../mixins/base";
import router from "../modules/router/index";
import network from "../modules/network/network";
import { courseRoute } from "../modules/tools";

import OHSPage from "../components-proj/comm/page/ohs-page.vue";
import Calendar from "../components/calendar/calendar.vue";

import OHSClassList from "../components-proj/all/classList/ohs-classlist.vue";
import OHSDynamticList from "../components-proj/all/dynamticlist/dynamticlist.vue";

import OTabs from "../components/OTab1";
import OTab from "../components/OTab1/o-tab";

module.exports = {
  config: {
    navigationBarTitleText: "我的"
  },
  mixins: [Base],
  preload($route) {
    return ["getDiscover"];
  },
  components: {
    OHSPage: OHSPage.weexComponent,
    Calendar,
    OHSDynamticList: OHSDynamticList,
    OHSClassList: OHSClassList,
    Tabs: OTabs.weexComponent,
    Tab1: OTab.weexComponent,
    Tab2: OTab.weexComponent
  },
  data() {
    return {
      footer_text: "正在加载中...",
      isLoading: false,
      tab1: "one",
      date: null,
      currentMonth:((new Date()).getMonth()+1),
      userInfo: {},
      networkParam: [
        {
          url: "getTraceCourse",
          page: 2,
          page_size: 10,
          itemList: []
        },
        {
          url: "getUserDynamic",
          page: 2,
          page_size: 5,
          itemList: []
        }
      ],
      sign: {},
      exchangeInfo: {
        left_times: 0,
        mq: 0,
        hd_url: "",
        draw_bg: ""
      }
    };
  },
  created() {
    let CIData = require("../modules/CIData/index");
    CIData.sendEvent("trackPageView", { url: "/pages/mine" });

    this.init();
  },
  onShareAppMessage(options) {
    return {
      title: "我的",
      path: `/pages/discover`
    };
  },
  computed: {
    loadingStyle() {
      return {
        alignSelf: "stretch",
        height: this.rpx(80, true),
        fontSize: this.rpx(24, true),
        alignItems: "center",
        justifyContent: "center",
        color: "#888888",
        listview: {},
        offset: 0,
        list: {}
      };
    }
  },
  methods: {
    init() {
      this.userInfo = getApp().globalData.userInfo;

      // 获取抽奖地址
      var self = this;
      network.getChance(function(res) {
        if (res.ret === 1) {
          self.exchangeInfo = res.data;
        }
      });

      network.getDiscover(function(res) {
        if (res.ret === 1) {
          self.resolve(res.data);
        }
      });
    },
    depend() {
      return ["getDiscover"];
    },
    resolve(data) {
      this.sign = data.sign;
      this.networkParam[0].itemList = data.my_trace;
      this.networkParam[1].itemList = this.dealDataSource(data.my_attention);
    },
    loadmore: function(e) {
      let index = this.tab1 === "one" ? 0 : 1;

      if (!this.isLoading && (index || !this.date)) {
        let params = this.networkParam[index];

        this.footer_text = "正在加载中...";

        this.isLoading = true;

        let self = this;
        network.getRequest(
          config.api[params.url],
          {
            page: params.page,
            page_size: params.page_size
          },
          function(res) {
            if (res.ret === 1) {
              let data = res.data;
              if (data.length === null || data.length < 1) {
                self.footer_text = "暂无更多数据";
              } else {
                self.footer_text = "";
              }

              if (index === 1) {
                data = self.dealDataSource(data);
              }

              if (params.page < 2) {
                params.itemList = data;
              } else {
                params.itemList.push(...data);
              }

              params.page = params.page + 1;
            } else {
              self.footer_text = "暂无更多数据";
            }
            self.isLoading = false;

          },
          true
        );
      }
    },
    choseDay(date) {
      this.date = date;

      if (this.date) {
        let params = this.networkParam[0];

        let self = this;

        self.isLoading = true;

        network.getTraceCourseByDate(
          date,
          function(res) {
            if (res.ret === 1) {
              let data = res.data;

              self.footer_text = "";

              params.page = 2;

              params.itemList = data;

              if (data.length > 0) {
                self.footer_text = "暂无更多数据";
              } else {
                self.footer_text = "当天没有学习记录哦~";
              }
            } else {
              self.footer_text = "当天没有学习记录哦~";
            }

            self.isLoading = false;
          },
          false
        );
      } else {
        this.tab1 = "one";
        this.networkParam[0].page = 1;
        this.loadmore();
      }
    },
    onItemClick(item) {
      courseRoute(item);
    },
    onPicItemClick(item) {
      this.jump("cmsPageInfo", { item });
    },
    dealDataSource: function(dataSource) {
      console.log("DataSource:", dataSource);

      for (let i = 0; i < dataSource.length; i++) {
        let item = dataSource[i];
        if (parseInt(item["type"])) {
          // CMS
          item["avatar"] = item["author_avatar"] || "";
          item["name"] = item["account_id"] || "";
          item["date"] = item["showed"] || "";
          item["img"] = item["img"] || "";
          item["title"] = item["title"] || "";
          item["author"] = item["category_name"] || "";
        } else {
          // 课程动态
          item["avatar"] = item["teacher_avatar"] || "";
          item["name"] = item["teacher_name"] || "";
          item["date"] = item["start_day"] + " " + item["start_time"];
          item["img"] = item["img"] || "";
          item["title"] = item["title"] || "";
          item["author"] = item["teacher_name"] || "";
          item["desc"] = item["desc"] || "";
        }
      }
      return dataSource;
    },
    gotoExchange() {
      getApp().globalData.exchangeInfo = this.exchangeInfo;

      router.push({ url: "/mix/webview/index" });
    },
    onTabChange(v) {
      this.tab1 = v;
      console.log("##onTabChange tab1", v);
    },
    clickSetting() {
      router.push({ url: "/pregnotice/pages/set-pregdate/index" });
    }
  }
};
</script>

<style lang="sass" scoped>
  @import './scss/discover.scss'
</style>
