<template>
  <OHSPage style="background-color: #ffffff">


    <list id = "historyList" class="history-list" loadmoreoffset = "50"
          @loadmore = "onloading" @scroll = "onScroll" >

      <OHSClassList :items="items"></OHSClassList>

      <div :style="loadStyle">
        <text @click="onMoreClick" :style="loadTextStyle">{{loading_txt}}</text>
      </div>

    </list>

  </OHSPage>
</template>

<script>
import API from "../../lib/api";

import Base from "../../mixins/base";
import network from "../../modules/network/network";
import router from "../../modules/router/index";

import OButton from "../../components/OButton";
import OHSClassList from "../../components-proj/all/classList/ohs-classlist.vue";
import OBlock from "../../components/OBlock";
import OHSPage from "../../components-proj/comm/page/ohs-page.vue";
import store from "../../modules/store/index";
import OText from "../../components/OText/o-text.vue";
import { courseRoute } from "../../modules/tools";

module.exports = {
  mixins: [Base],
  components: {
    OButton: OButton.weexComponent,
    OText: OText,
    OText1: OText,
    OText2: OText,
    OText3: OText,
    OHSClassList: OHSClassList,
    OBlock1: OBlock.weexComponent,
    OHSPage: OHSPage.weexComponent
  },
  data() {
    return {
      items: [],
      page: 1,
      texts: ["a", "b", "c"],
      tags1: ["最新", "推荐", "热门"],
      tags2: ["不限", "孕期", "0-12月", "12-24月", "24+月"],
      tags: [{ id: 0, name: "热门标签" }],
      page_size: 5,
      select: [0, 0, 0],
      showLoading: "hide",
      isLoading: false,
      refreshing: false,
      search_tags: [],
      hintText: "测试",
      loading_txt: "正在努力加载...",
      keepAlive: true,
      scrollTop: 0,
      historyList: {},
      emptyHotTag: true,
      enable: true,
      fontSize: "30px",
      fontColor: "red",
      num: 40,
      tt: "ttt"
    };
  },
  onShareAppMessage(options) {
    return {
      title: '我的足迹',
      path: `/pages/mine/history`
    }
  },
  computed: {
    params() {
      console.log("params computed");
      return {
        page: this.page,
        page_size: this.page_size
      };
    },
    loadStyle() {
      return {
        width: this.rpx(750, true),
        alignItems: "center",
        height: this.rpx(80, true),
        justifyContent: "center",
        marginBottom: this.rpx(30, true)
      };
    },
    loadTextStyle() {
      return {
        color: "#888888",
        fontSize: this.rpx(24, true)
      };
    }
  },
  created() {
    API.setNavigationBarTitle({ title: "我的足迹" });

    this.init();
  },
  updated() {
    this.historyList = document.querySelector("#historyList");
  },
  activated() {
    if (this.historyList) {
      this.historyList.scrollTop = this.scrollTop;
    }
  },
  methods: {
    onTag1Select(index) {
      console.log("onTag1Select", index);
    },
    test() {
      console.log("xxx test");
    },
    init() {
      let self = this;

      this.fetch(this.params, 0, function() {
        self.isLoading = false;
      });
    },
    depend() {
      console.log("info--depend");
      let type = 0;
      let stage = 0;
      let tag = 0;
      if (this.$route.params.type) {
        type = parseInt(this.$route.params.type);
      }
      if (this.$route.params.stage) {
        stage = parseInt(this.$route.params.stage);
      }
      if (this.$route.params.tag) {
        tag = this.$route.params.tag.id;
      }
      let s =
        "getCourse." + type + "." + stage + "." + tag + "." + "1" + "." + "5";
      return [s];
    },
    resolve() {
      let type = 0;
      let stage = 0;
      let tag = 0;
      if (this.$route.params.type) {
        type = parseInt(this.$route.params.type);
      }
      if (this.$route.params.stage) {
        stage = parseInt(this.$route.params.stage);
      }
      if (this.$route.params.tag) {
        tag = this.$route.params.tag.id;
      }
      let s =
        "getCourse." + type + "." + stage + "." + tag + "." + "1" + "." + "5";
      let data = this.store(s).data;
      this.items = [];
      this.items.push(...data);
      //      this.items = data
      if (data.length < this.page_size) {
        console.log("---暂无更多数据---");
        this.loading_txt = "暂无更多数据";
      }
      this.page = 2;
    },
    fetch(params, tag, callback) {
      let self = this;
      if (tag > 0) {
      } else {
        self.page = 1;
      }
      console.log("### self.loading_txt=", self.loading_txt);
      self.loading_txt = "正在努力加载...";
      console.log("### self.loading_txt=", self.loading_txt);
      self.enable = false;
      network.getTraceCourse(
        params,
        function(res) {
          if (res.ret === 1) {
            let data = res.data;
            console.log("### data=", data);
            if (data.length < self.page_size) {
              self.loading_txt = "暂无更多数据";
            } else {
              self.loading_txt = "加载更多";
            }

            if (tag > 0) {
              // 加载更多
              self.items.push(...data);
            } else {
              // 刷新数据
              self.items = data;
            }
            self.page = self.page + 1;
            if (callback) {
              callback();
            }
          } else {
            self.loading_txt = "暂无更多数据";
          }
          self.enable = true;
          self.$apply();
        },
        true
      );
    },
    onMoreClick() {
      let self = this;
      if (self.isLoading === false) {
        console.log("### onloading");
        self.isLoading = true;
        self.$apply();
        this.fetch(this.params, 1, function() {
          self.isLoading = false;
          self.$apply();
        });
      }
    },
    onloading(event) {
      let self = this;
      if (self.isLoading === false) {
        console.log("onloading");
        self.isLoading = true;
        this.$apply();
        this.fetch(this.params, 1, function() {
          self.isLoading = false;
          self.$apply();
        });
      }
    },
    onItemClick(item) {
      console.log("### onItemClick item=", item);
      courseRoute(item);
      this.keepAlive = true;
    },
    onScroll(ev) {
      if (this.historyList) {
        this.scrollTop = this.historyList.scrollTop;
      }
    }
  }
};
</script>

<style scoped>
.history-list {
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;

  display: flex;
  flex-direction: column;
}
</style>
