<template>
  <div :style="style">
    <slot></slot>
  </div>
</template>

<script>
  // 其它用法与vue相同
  import Base from '../../../mixins/base'
  export default {
    mixins: [Base],
    props: {},
    data () { return {} },
    computed: {
      style: function () {
        return {
          position: 'absolute',
          top: this.rpx(0, true),
          left: this.rpx(0, true),
          right: this.rpx(0, true),
          bottom: this.rpx(0, true)
        }
      }
    },
    methods: {}
  }
</script>

<style lang="sass" scoped>

</style>
