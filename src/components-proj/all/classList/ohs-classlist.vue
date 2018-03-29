<template>
<div>
  <div v-for="(obj,index) in courses" @click="onItemClick(obj)">
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
</div>
</template>

<script>
import OBlock from "../../../components/OBlock";
import { courseRoute } from "../../../modules/tools";
export default {
  components: {
    OBlock: OBlock.weexComponent
  },
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  data() {
    return {};
  },
  computed: {
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
  created() {},
  methods: {
    onItemClick(obj) {
      this.$emit("onItemClick", obj);
      console.log("onItemClick", obj);
    }
  }
};
</script>

<style lang="sass" scoped>
  @import "./index.scss"
</style>
