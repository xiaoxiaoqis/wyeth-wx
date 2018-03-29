<template>
  <div class="ohs-dynamic-container">
    <image class="ohs-dynamic-avatar" :src="obj.avatar"/>
    <div class="ohs-dynamic-info-container">
      <div class="ohs-dynamic-info-linear">
        <text class="ohs-dynamic-info-linear-name">{{ obj.name }}</text>
        <text v-if="obj.type === 0" class="ohs-dynamic-info-linear-type">发布了文章:</text>
      </div>
      <text class="ohs-dynamic-info-date">{{ obj.date }}</text>
      
      <text v-if="obj.type === 0" class="ohs-dynamic-info-content">{{ obj.desc }}</text>
      <div class="ohs-dynamic-info-course" @click="onClick">
        <image class="ohs-dynamic-info-course-img" :src="obj.img"/>
        <div style="flex: 1;align-items: stretch;justify-content: space-between">
          <text class="ohs-dynamic-info-course-title">{{ obj.title }}</text>
          <text class="ohs-dynamic-info-course-teacher">{{ obj.author }}</text>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import CIData from "../../../modules/CIData";

export default {
  props: {
    obj: {
      type: Object
    }
  },
  methods: {
    onClick() {
      if (this.obj.type) {
        // cms
        CIData.push([
          "trackEvent",
          "wyeth",
          "cms_click",
          this.obj.name,
          this.obj.id
        ]);
        this.$router.push({ name: "cmsPageInfo", params: this.obj });
      } else {
        // 动态
        this.$router.push('/course/' + this.obj.id);
      }
    }
  }
};
</script>

<style lang="sass" scoped>
  @import "./index.scss"
</style>
