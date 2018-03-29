<template>
  <OPopupWindow class="registerAlert-window" :hasCancel="false" @onDoneClick="onDoneClick" title="提示">
    <div class="registerAlert-content">
      <text class="registerAlert-text">请先完成注册！</text>
    </div>
  </OPopupWindow>
</template>

<script>
// 其它用法与vue相同
import OPopupWindow from '../../../components/OPopupWindow'
export default {
  components: {
    OPopupWindow: OPopupWindow.weexComponent
  },
  props: {},
  data () {
    return {}
  },
  methods: {
    onDoneClick() {
      this.$emit('onDoneClick')
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "registerAlert"
</style>
