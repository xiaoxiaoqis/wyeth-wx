<template>
  <OHSPage style="background-color: #ffffff">

    <OHSSearchTab :hintText="hintText" @onClick="onSearchClick"></OHSSearchTab>

    <list id="allList" class="all-list" loadmoreoffset="50"
          @loadmore="onloading" @scroll="onScroll" >

        <OHSTagGroup :enable="enable" :typeTags="tags1"
                     :stageTags="tags2" ref="tagGroup" :hotTags="tags3" :initSelect="select"
                     @onTagChange="onTagChange"></OHSTagGroup>


      <OBlock1 a="1" :height="16" bgColor="#eeeeee"></OBlock1>

      <OHSClassList :items="items" @onItemClick="onItemClick"></OHSClassList>

      <div :style="loadStyle">
        <text @click="onMoreClick" :style="loadTextStyle">{{loading_txt}}</text>
      </div>

    </list>

  </OHSPage>
</template>

<script>
import API from "../lib/api";

import Base from "../mixins/base";
import network from "../modules/network/network";
import router from "../modules/router/index";
import CIData from "../modules/CIData";
import store from "../modules/store/index";
import { courseRoute } from "../modules/tools";

import OHSTagGroup from "../components-proj/all/tagGroup";
import OHSClassList from "../components-proj/all/classList/ohs-classlist.vue";
import OBlock from "../components/OBlock";
import OHSPage from "../components-proj/comm/page/ohs-page.vue";
import OHSSearchTab from "../components-proj/search/searchTab";

module.exports = {
  config: {
    navigationBarTitleText: "探索"
  },
  a: 1,
  mixins: [Base],
  preload($route) {
    let type = 0;
    let stage = 0;
    let tag = 0;
    if ($route.params.type) {
      type = parseInt($route.params.type);
    }
    if ($route.params.stage) {
      stage = parseInt($route.params.stage);
    }
    if ($route.params.tag) {
      tag = $route.params.tag.id;
    }
    let s =
      "getCourse." + type + "." + stage + "." + tag + "." + "1" + "." + "5";
    return [s];
  },
  components: {
    OHSTagGroup: OHSTagGroup.weexComponent,
    OHSClassList: OHSClassList,
    OBlock1: OBlock.weexComponent,
    OHSPage: OHSPage.weexComponent,
    OHSSearchTab: OHSSearchTab.weexComponent
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
      hintText: "母乳喂养",
      loading_txt: "正在努力加载...",
      keepAlive: true,
      scrollTop: 0,
      allList: {},
      emptyHotTag: true,
      enable: true,
      fontSize: "30px",
      fontColor: "red",
      num: 40,
      tt: "ttt"
    };
  },
  computed: {
    mStyle() {
      return {
        color: "blue",
        fontSize: "40px"
      };
    },
    tags3() {
      let t = [];
      for (let i = 0; i < this.tags.length; i++) {
        t.push(this.tags[i].name);
      }
      return t;
    },
    params() {
      console.log("params computed");
      let s = this.select;
      return {
        type: s[0],
        time: s[1],
        tag: this.tags[s[2]].id,
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
    console.log("###all this.$route.params", this.$route.params);

    this.init();

    this.$apply();

    let CIData = require("../modules/CIData/index");
    CIData.sendEvent("trackPageView", { url: "/pages/all" });

    let updated = false;
    let type = this.$route.params.type;
    let stage = this.$route.params.stage;
    let tag = this.$route.params.tag;
    if (type != null) {
      updated = true;
      type = parseInt(type);
      this.select[0] = type;
    }
    if (stage != null) {
      updated = true;
      stage = parseInt(stage);
      this.select[1] = stage + 1;
    }
    if (tag != null && typeof tag === "object") {
      updated = true;
      let a = [];
      a.push(this.tags[0]);
      a.push(tag);
      a.push(...this.tags.slice(1, this.tags.length));
      this.tags = a;
      this.select[2] = 1;
    }
    this.$apply();
    let self = this;
    if (updated) {
      if (this.$refs.tagGroup) {
        this.$refs.tagGroup.setSelect(this.select);
      }
    }
  },
  onShow() {},
  onShareAppMessage(options) {
    return {
      title: "探索",
      path: `/pages/index`
    };
  },
  mounted() {
    console.log("###mounted this.$route.params", this.$route.params);
  },
  updated() {
    this.allList = document.querySelector("#allList");
  },
  activated() {
    if (this.allList) {
      this.allList.scrollTop = this.scrollTop;
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
      let a = Math.random();
      if (a < 0.5) {
        this.hintText = "大脑发育";
      } else {
        this.hintText = "母乳喂养";
      }
      let self = this;
      console.log("----------- all params", this.$route.params);
      this.select = [0, 0, 0];
      let type = this.$route.params.type;
      let stage = this.$route.params.stage;
      let tag = this.$route.params.tag;
      if (type != null) {
        type = parseInt(type);
        this.select[0] = type;
      }
      if (stage != null) {
        stage = parseInt(stage);
        this.select[1] = stage + 1;
      }
      if (tag != null && typeof tag === "object") {
        let a = [];
        a.push(this.tags[0]);
        a.push(tag);
        a.push(...this.tags.slice(1, this.tags.length));
        this.tags = a;
        this.select[2] = 1;
      }
      this.fetchTag();
      this.fetch(this.params, 0, function() {
        self.isLoading = false;
        self.$apply();
      });

      //      store.getItem('search_tags', function(data) {
      //        if (data.result === 'failed') {
      //          self.search_tags=[]
      //        } else {
      //          self.search_tags=JSON.parse(data.data)
      //        }
      //      })
      if (this.$refs.tagGroup) {
        this.$refs.tagGroup.setSelect(this.select);
      }
    },
    fetchTag() {
      let self = this;
      network.getAllHotTag(function(res) {
        if (res.ret === 1) {
          let data = res.data;
          let arr = data.map(function(k) {
            return { id: k.id, name: k.name };
          });
          if (self.emptyHotTag) {
            self.tags.push(...arr);
            self.emptyHotTag = false;
          }
        }
        self.$apply();
      });
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
      self.$apply();
      network.getCourse(
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

            CIData.recActionExpose_array(data);

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
    onSearchClick() {
      this.$router.push({
        name: "search",
        params: { hint: this.hintText, nokeep: true },
        success: function() {
          console.log("### onSearchClick success");
        }
      });
      //      this.$router.push({
      //        name: 'courseSeries',
      //        params: {
      //        	id: '508'
      //        }
      //      });
    },
    onTagChange(select) {
      console.log("### onTagChange", select);
      this.page = 1;
      let a = [];
      a.push(...select);
      this.select = a;
      this.$apply();
      console.log("params", this.params);

      let self = this;
      if (self.isLoading === false) {
        self.isLoading = true;
        this.fetch(this.params, 0, function() {
          self.isLoading = false;
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
      if (this.allList) {
        this.scrollTop = this.allList.scrollTop;
      }
    }
  }
};
</script>

<style scoped>
.all-list {
  position: absolute;
  top: 78px;
  left: 0px;
  right: 0px;
  bottom: 0px;

  display: flex;
  flex-direction: column;
}
</style>
