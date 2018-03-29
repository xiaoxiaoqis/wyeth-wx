<template>
  <div v-if = "actived" style = "flex: 1;">
    <slot></slot>
  </div>
</template>
<script>

  import Base from '../../mixins/base'

  import event from '../../modules/event/index'
  export default {
    mixins: [Base],
    name: 'OTab',
    props: {
      label: {
        type: String,
        required: true
      },
      value: {
        type: [String, Number, Boolean, Object, Array],
        required: true
      },
      icon: {
        type: [String, Number, Boolean, Object, Array],
        default: ''
      }
    },
    data () {
      return {
        $parent: null,
        actived: false
      }
    },
    created () {
      event.sendEvent('OTab-addTab',{label: this.label, value: this.value, icon:this.icon},false)
      let self = this
      event.addEventListener('OTab-change',function (v) {
        console.log('### OTab-change,,,',v)
        self.actived = self.value === v
        self.$apply()
      })
    },
    beforeDestroy () {
      this.$parent && this.$parent.removeTab(this)
    }
  }
</script>
