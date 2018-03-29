<template>
  <div id = "collectButton" @click = "clickCollect">
    <div class = "collectButton-icon" :style = "{backgroundImage:(isSave?likeStyle[1].buttonImage:likeStyle[0].buttonImage)}"></div>
    <text class = "collectButton-num" :lines = "1">{{saveNum || 0}}</text>
  </div>
</template>

<script>

import network from '../../modules/network/network'
import event from '../../modules/event'

export default {
  name: 'collectButton',
  props: {
    classInfo: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      likeStyle: [
        {
          buttonImage: 'url(' + require('http://wyeth-course.nibaguai.com/wyeth/image/collect_normal.png') + ')'
        },
        {
          buttonImage: 'url(' + require('http://wyeth-course.nibaguai.com/wyeth/image/collect_selected.png') + ')'
        }
      ]
    }
  },
  computed: {
    isSave: function () {
      console.log('设置 collectButton: ', this.classInfo)
      return this.classInfo.isSave || false
    },
    saveNum: function () {
      let n = parseInt(this.classInfo.saveNum)
      if (n >= 10000) {
        return (n / 10000).toFixed(2) + '万'
      } else {
        return n
      }
    }
  },
  methods: {
    clickCollect: function () {
      console.log('点赞')
      var self = this

      network.courseCollect({ cid: this.classInfo.id, is_cancel: this.classInfo.isSave, type: this.classInfo.type || 1
      }, res => {
        if (res.ret === 1) {
          event.sendEvent('toast', { type: 'success', text: (self.classInfo.isSave === 1) ? '取消收藏成功' : '收藏成功' })

          self.$emit('clickCollect', {
            class_id: self.classInfo.id,
            isSave: (self.classInfo.isSave === 1) ? 0 : 1
          })
        }
      })
    }
  }
}
</script>

<style lang = "sass" scoped>
    @import './collectButton.scss'
</style>
