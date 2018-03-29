<template>
  <OPopupWindow class="commonAlert-window" :hasCancel="false" @onDoneClick="onDoneClick" :title="title">
    <div class="commonAlert-content">
      <text class="commonAlert-text">{{content}}</text>
    </div>
  </OPopupWindow>
</template>

<script>
// 其它用法与vue相同
import OPopupWindow from '../../components/OPopupWindow'
export default {
  components: {
    OPopupWindow: OPopupWindow.weexComponent
  },
  props: {
    title: {
      type: String,
      required: false,
      default: '提示'
    },
    content: {
      type: String,
      required: false,
      default: ''
    }
  },
  methods: {
    onDoneClick() {
      this.$emit('onDoneClick')
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "commonAlert"
</style>
