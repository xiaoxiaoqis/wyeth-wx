<template>
  <div class="courseSeries-waterfall">
    <div class="courseSeries-waterfall-cloumn">
      <div class="courseSeries-waterfall-cell" v-for="(obj,i) in listLeft" :key="i" @click="onItemClick(obj)">
        <div class="courseCardCell">
          <div class="courseCardCell-poster">
            <image class="courseCardCell-img" :src="obj.img"/>
            <div class="courseCardCell-mask" style="background-image:linear-gradient(to top,RGBA(38,38,38,0.5),RGBA(255,255,255,0));">
              <image class="courseCardCell-num-icon" :src="require('/assets/love.png')"/>
              <text class="courseCardCell-num" :lines="1">{{obj.hot}}</text>
            </div>
          </div>
          <div class="courseCardCell-content">
            <text class="courseCardCell-content-title" :lines="2">{{obj.title}}</text>
            <div class="courseCardCell-content-userInfo">
              <image class="userInfo-avatar" :src="obj.teacher_avatar"/>
              <div class="userInfo-text">
                <text class="userInfo-name" :lines="1">{{obj.teacher_name}}</text>
                <text class="userInfo-hospital" :lines="1">{{obj.teacher_hospital}}</text>
                <text class="userInfo-position" :lines="1">{{obj.teacher_position}}</text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="courseSeries-waterfall-cloumn">
      <div class="courseSeries-waterfall-cell" v-for="(obj,i) in listRight" :key="i" @click="onItemClick(obj)">
        <div class="courseCardCell">
          <div class="courseCardCell-poster">
            <image class="courseCardCell-img" :src="obj.img"/>
            <div class="courseCardCell-mask" style="background-image:linear-gradient(to top,RGBA(38,38,38,0.5),RGBA(255,255,255,0));">
              <image class="courseCardCell-num-icon" :src="require('/assets/love.png')"/>
              <text class="courseCardCell-num" :lines="1">{{obj.hot}}</text>
            </div>
          </div>
          <div class="courseCardCell-content">
            <text class="courseCardCell-content-title" :lines="2">{{obj.title}}</text>
            <div class="courseCardCell-content-userInfo">
              <image class="userInfo-avatar" :src="obj.teacher_avatar"/>
              <div class="userInfo-text">
                <text class="userInfo-name" :lines="1">{{obj.teacher_name}}</text>
                <text class="userInfo-hospital" :lines="1">{{obj.teacher_hospital}}</text>
                <text class="userInfo-position" :lines="1">{{obj.teacher_position}}</text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script>

import CIData from "../../modules/CIData/index";

module.exports = {
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      padding: this.rpx(24),
      columnCount: 2,
      columnGap: this.rpx(20),
      columnWidth: "auto",
      contentOffset: "0"
    };
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
        let obj = this.items[i];

        obj.hot = num2str(obj.hot);
        if (!obj.start_day) {
          break;
        }
        var t = obj.start_day + " " + obj.start_time;

        let reg = new RegExp("[-: /]", "g");
        let arr = t.split(reg);
        arr[1] = arr[1] - 1;
        let time = new Date(arr[0], arr[1], arr[2], arr[3], arr[4]);
        var now = Date.parse(new Date());
        if (now < time) {
          obj.isOutdate = false;
        } else {
          obj.isOutdate = true;
        }
      }
      return this.items;
    },
    listLeft() {
      let l = [];
      for (let i = 0; i < this.courses.length; i++) {
        if (i % 2 === 0) {
          l.push(this.courses[i]);
        }
      }
      return l;
    },
    listRight() {
      let l = [];
      for (let i = 0; i < this.courses.length; i++) {
        if (i % 2 === 1) {
          l.push(this.courses[i]);
        }
      }
      return l;
    }
  },
  methods: {
    onItemClick(obj) {
      this.$emit("onItemClick", obj);
    }
  }
};
</script>

<style lang="sass" scoped>
  @import "./courseWaterFall.scss"
</style>
