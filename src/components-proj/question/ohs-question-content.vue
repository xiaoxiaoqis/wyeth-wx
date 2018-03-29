<template>
  <div style="background-color: white;flex-direction: column;">
    <image class="ohs-question-content-label" :src="require('/assets/question_title.png')"/>

    <OBlock1 :height="1" bgColor="#EFEFF4"></OBlock1>
    <div class="ohs-question-content-container" :style="showAll?{}:contentStyle">
      <text id="answer1" ref="answer" class="ohs-question-content-text">{{content}}</text>
    </div>
    <OBlock2 :height="1" bgColor="#EFEFF4"></OBlock2>
    <div class="ohs-question-content-bottom" v-show="!showAll">
      <text class="ohs-question-more" @click="onMoreClick">查看全部</text>
    </div>
  </div>
</template>

<script>
  import OBlock from '../../components/OBlock'
  import Base from '../../mixins/base'
  module.exports = {
    mixins: [Base],
    props: {
      content: {
        type: String,
        retuired: true
      }
    },
    components: {
      OBlock1: OBlock.weexComponent,
      OBlock2: OBlock.weexComponent
    },
    data () {
      return {
        showAll: true
      }
    },
    computed: {
      contentStyle () {
        return {
          maxHeight: this.rpx(500, true)
        }
      }
    },
    created () {
      let self = this
      this.$nextTick(function () {
//        let vn = self.$refs.answer
//        let height = vn.$el.clientHeight
//        if (height < this.rpx(500, false)) {
//          self.showAll = true
//        }
      })
    },
    methods: {
      onMoreClick () {
        this.showAll = true
      }
    }
  }
</script>

<style lang = "sass" scoped>
  @import "ohs-question-content"
</style>
