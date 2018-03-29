<template>
  <div class = "o-popupwindow-bg">
    <div class = "o-popupwindow-container">
      <text class = "o-popupwindow-title" :style = "titleStyle">{{title}}</text>
      <slot></slot>
      <OBlock :height = "2" :width = "562" bgColor = "#d2d3d5"></OBlock>
      <div class = "o-popupwindow-button">
        <text v-show = "hasCancel"
              @click = "onCancelClick"
              :style = "btnStyle"
              class = "o-popupwindow-cancel">{{cancelText}}</text>
        <text class = "o-popupwindow-done"
              :style = "btnStyle"
              @click = "onDoneClick">{{doneText}}</text>
      </div>
    </div>
  </div>

</template>

<script>
// 其它用法与vue相同
import OBlock from '../OBlock'
export default {
  components: {
    OBlock: OBlock.weexComponent
  },
  props: {
    title: {
      type: String,
      required: true
    },
    doneText: {
      type: String,
      default: function () {
        return '确定'
      }
    },
    cancelText: {
      type: String,
      default: function () {
        return '取消'
      }
    },
    hasCancel: {
      type: Boolean,
      default: function () {
        return true
      }
    },
    titleBgColor: {
      type: String,
      default: function () {
        return '#dddddd'
      }
    },
    titleBgImage: {
      type: String,
      default: function () {
        return 'linear-gradient(to right,#e7c25f,#e4be5b,#cea03f,#c69735)'
      }
    },
    btnColor: {
      type: String,
      default: function () {
        return '#ad7a00'
      }
    }
  },
  data () {
    return {
    }
  },
  computed: {
    btnStyle () {
      return {
        color: this.btnColor
      }
    },
    titleStyle () {
      return {
        backgroundImage: this.titleBgImage,
        backgroundColor: this.titleBgColor
      }
    }
  },
  methods: {
    onCancelClick () {
      this.$emit('onCancelClick')
    },
    onDoneClick () {
      this.$emit('onDoneClick')
    }
  }
}
</script>

<style lang = "sass" scoped>
  @import "index"
</style>
