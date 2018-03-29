<template>
  <div class="ohs-question-header-container">
    <text class="ohs-question-title">{{title}}</text>
    <div class="ohs-question-keyword-container">
      <text class="ohs-question-keyword-label">关键字：</text>
      <image class="ohs-question-keyword-tag" :src="require('/assets/tag.png')"/>
      <text class="ohs-question-keyword-text">{{keyword}}</text>
    </div>
    <div class="ohs-question-hot-container">
      <div style="flex-direction: row;align-items: center">
        <image class="ohs-question-eye" :src="require('/assets/eye.png')"/>
        <text class="ohs-question-hot">{{num+''}}</text>
      </div>
      <text class="ohs-question-source">惠妈300问</text>
    </div>
  </div>
</template>

<script>
  module.exports = {
    props: {
      keyword: {
        type:String,
        required:false,
        default:''
      },
      num: {
        type: Number,
        required: true
      },
      title: {
        type: String,
        required: true
      }
    },
    data () {
      return {}
    },
    methods: {}
  }
</script>


<style lang = "sass" scoped>
  @import "ohs-question-header"
</style>
