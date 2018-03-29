<template>
  <scroller scroll-direction = "horizontal"  class = "o-tagSelect-container">
    <div v-for = "item,key in tags" @click = "onClick(key)" :style = "{justifyContent: 'center'}">
      <OButton :text = "item"
               :radius = "31" :height='62'
               :ref = "'btn'+key"
               :borderWidth = "1"
               :highLight = "key === index"

      ></OButton>

    </div>
  </scroller>
</template>

<script>
  // 其它用法与vue相同
  import OButton from '../OButton'
  import base from '../../mixins/base'
  import dom from '../../modules/dom'

  export default {
    components: {
      OButton: OButton.weexComponent
    },
    mixins: [base],
    props: {
      enable: {
        type: Boolean,
        default: function () {
          return true
        }
      },
      tags: {
        type: Array,
        required: true
      },
      selectid: {
        type: Number,
        default: function () {
          return 0
        }
      }
    },
    computed: {
      _6px() {
        return this.rpx(6, true)
      },
      _62px() {
        return this.rpx(62, true)
      }
    },
    data () {
      return {
        index: this.selectid
      }
    },
    created () {
      this.rpx(11, true)
    },
    watch: {
      index: function (newid, oldid) {
        var btn = this.$refs['btn' + newid]

        console.log('xxx newid=', newid, 'oldid=', oldid)
        dom.scrollToElement(btn, {offset: -300})
        // this.$emit('onSelect',newid)
      }
    },
    methods: {
      setIndex (x) {
        this.index = x
      },
      onClick: function (key) {
        if (this.enable) {
          this.index = key
          this.$emit('onSelect', key)
        }
      }
    }
  }
</script>

<style lang="sass" scoped>
  @import "./index.scss"
</style>
