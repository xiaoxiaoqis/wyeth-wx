<template>
<div>
  <div class="ohs-dynamic-container" v-for="(obj,index) in items" :key="index" @click="onItemClick(obj)">
    <image class="ohs-dynamic-avatar" :src="obj.avatar"/>
    <div class="ohs-dynamic-info-container">
      <div class="ohs-dynamic-info-linear">
        <text class="ohs-dynamic-info-linear-name">{{ obj.name }}</text>
        <text v-if="!obj.type" class="ohs-dynamic-info-linear-type">发布了文章:</text>
      </div>
      <text class="ohs-dynamic-info-date">{{ obj.date }}</text>
      
      <text v-if="!obj.type" class="ohs-dynamic-info-content">{{ obj.desc }}</text>
      <div class="ohs-dynamic-info-course" @click="onItemClick(obj)">
        <image class="ohs-dynamic-info-course-img" :src="obj.img"/>
        <div style="flex: 1;align-items: stretch;justify-content: space-between">
          <text class="ohs-dynamic-info-course-title">{{ obj.title }}</text>
          <text class="ohs-dynamic-info-course-teacher">{{ obj.author }}</text>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  data() {
    return {};
  },
  created() {},
  computed: {},
  methods: {
    onItemClick(obj) {
      this.$emit("onItemClick", obj);
    }
  }
};
</script>

<style lang="sass" scoped>
  @import "./index.scss"
</style>
