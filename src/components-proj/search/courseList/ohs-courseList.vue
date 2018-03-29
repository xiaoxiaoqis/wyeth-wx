<template>

  <list  id = "listview" class = "list-container" loadmoreoffset = "10" @scroll = "onScroll" @loadmore = "onloading">
    <div v-for = "(obj,index) in courses" @click = "onItemClick(obj)">
      <div style = "flex-direction: column;align-items: stretch;background-color: white">
        <div class = "ohs-classcell-container">
          <div class = "ohs-classcell-cover-group">
            <image class = "ohs-classcell-cover-img"
                   :src = "obj.img"/>
            <image class = "ohs-classcell-cover-vedio" v-show = "obj.review_type&&obj.review_type==2"  :src =
              "require('/assets/video.png')"/>
          </div>
          <div class = "ohs-classcell-txt-group">
            <text class = "ohs-classcell-title" :lines = "1">{{obj.title}}</text>
            <div class = "ohs-classcell-techer-layout">
              <image class = "ohs-classcell-usericon" :src = "require('/assets/icon.png')"/>
              <text class = "ohs-classcell-name" :lines = "1">{{obj.teacher_name}}</text>
              <text class = "ohs-classcell-hospital" :lines = "1">{{obj.teacher_hospital}}</text>
            </div>
            <div class = "ohs-classcell-time-layout"  v-show = "!obj.isOutdate">
              <image class = "ohs-classcell-time-img" :src = "require('/assets/clock.png')"/>
              <text class = "ohs-classcell-time" :lines = "1">{{obj.start_day+' '+obj.start_time}}</text>
            </div>
            <div class = "ohs-classcell-extra-wrap" v-show = "obj.isOutdate">
              <image class = "ohs-classcell-tag-img" :src = "require('/assets/tag.png')"/>
              <text class = "ohs-classcell-extra"  v-if = "obj.tag" :lines = "1">{{obj.tag}}</text>
            </div>
            <div class = "ohs-classcell-extra-layout">
              <div class = "ohs-classcell-hot-wrap">
                <image class = "ohs-classcell-hot-img" :src = "require('/assets/hot.png')"/>
                <text class = "ohs-classcell-hot" :lines = "1">{{obj.hot}}</text>
              </div>
              <div class = "ohs-classcell-extra-wrap" v-show = "!obj.isOutdate">
                <image class = "ohs-classcell-tag-img" :src = "require('/assets/tag.png')"/>
                <text class = "ohs-classcell-extra" v-if = "obj.tag" :lines = "1">{{obj.tag}}</text>
              </div>
            </div>
          </div>
        </div>
        <OBlock a = "1" :marginLeft = "20" :height = "1" bgColor = "#eeeeee"></OBlock>
      </div>
    </div>
    <text  :style = "loadingStyle" @click="onloading">{{footer_text}}</text>
  </list>

</template>

<script>
// 其它用法与vue相同
import CIData from "../../../modules/CIData"

import OBlock from "../../../components/OBlock";
import Base from "../../../mixins/base";
import network from "../../../modules/network/network";
import config from "../../../config.json";

export default {
  mixins: [Base],
  components: {
    OBlock: OBlock.weexComponent
  },
  props: {
    keyword: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      url: "getCourseSearch",
      page: 1,
      items: [],
      footer_text: "正在加载中..."
    };
  },
  watch: {
    keyword(val) {
      this.page = 1;
      this.fetch(false);
    }
  },
  computed: {
    loadingStyle() {
      return {
        display: "flex",
        alignSelf: "stretch",
        height: this.rpx(80, true),
        fontSize: this.rpx(24, true),
        alignItems: "center",
        justifyContent: "center",
        color: "#888888"
      };
    },
    params() {
      return {
        keyword: this.keyword
      };
    },
    courses() {
      let num2str = function(num) {
        if (num > 10000) {
          let n = num / 10000;
          return n.toFixed(1) + "万";
        }
        return num;
      };

      for (let i = 0; i < this.items.length; i++) {
        let item = this.items[i];
        item.hot = num2str(item.hot);
        if (!item.start_day) {
          break;
        }
        var t = item.start_day + " " + item.start_time;

        let reg = new RegExp("[-: /]", "g");
        let arr = t.split(reg);
        arr[1] = arr[1] - 1;
        let time = new Date(arr[0], arr[1], arr[2], arr[3], arr[4]);
        var now = Date.parse(new Date());
        if (now < time) {
          item.isOutdate = false;
        } else {
          item.isOutdate = true;
        }
      }
      return this.items;
    }
  },

  created() {
    let self = this;
    setTimeout(function() {
      self.fetch(false);
    }, 0);
  },
  mounted() {},
  updated() {
    this.list = document.querySelector("#listview");
  },
  activated() {
    if (this.list) {
      this.list.scrollTop = this.offset;
    }
  },
  methods: {
    fetch(more) {
      let self = this;
      let p = Object.assign(this.params, {
        page: this.page
      });
      self.footer_text = "正在加载中...";
      network.getRequest(
        config.api[this.url],
        p,
        function(res) {
          console.log("xxx res", res);
          if (res.ret === 1) {
            let data = res.data;
            if (data.length === null || data.length < 1) {
              self.footer_text = "暂无更多数据";
            } else {
              self.footer_text = "加载更多";
            }
            self.page = self.page + 1;

            CIData.recActionExpose_array(data);

            if (more) {
              self.items.push(...data);
            } else {
              self.items = [];
              self.items.push(...data);
            }
          } else {
            self.footer_text = "暂无更多数据";
          }
          self.$apply();
        },
        true
      );
    },
    onScroll(ev) {
      if (this.list) {
        this.offset = this.list.scrollTop;
      }
    },
    onItemClick(item) {
      this.$emit("onItemClick", item);
    },
    onloading() {
      this.fetch(true);
    }
  }
};
</script>

<style lang = "sass" scoped>
  @import 'index'
</style>
