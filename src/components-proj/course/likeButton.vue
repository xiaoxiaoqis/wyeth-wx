<template>
  <div id="likeButton" @click="clickLike">
    <div class="likeButton-icon" :style="{backgroundImage:(isLike?likeStyle[1].buttonImage:likeStyle[0].buttonImage)}"></div>
    <text class="likeButton-num" :lines="1">{{likeNum || 0}}</text>
  </div>
</template>

<script>

import network from '../../modules/network/network'
import event from '../../modules/event'

export default {
  name: 'likeButton',
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
          buttonImage: 'url(' + require('http://wyeth-course.nibaguai.com/wyeth/image/like_normal.png') + ')'
        },
        {
          buttonImage: 'url(' + require('http://wyeth-course.nibaguai.com/wyeth/image/like_selected.png') + ')'
        }
      ]
    }
  },
  computed: {
    isLike: function () {
      console.log('设置 likeButton: ', this.classInfo)
      return this.classInfo.isLike || false
    },
    likeNum: function () {
      let n = parseInt(this.classInfo.likeNum)
      console.log(n)
      if (n >= 10000) {
        return (n / 10000).toFixed(2) + '万'
      } else {
        return n
      }
    }
  },
  methods: {
    clickLike: function () {
      console.log('点赞', this.classInfo.isLike)
      var self = this
      network.courseLike({ cid: this.classInfo.id, is_cancel: this.classInfo.isLike, type: this.classInfo.type || 1 }, res => {
        if (res.ret === 1) {
          event.sendEvent('toast', { type: 'success', text: (self.classInfo.isLike === 1) ? '取消点赞成功' : '点赞成功' })

          self.$emit('clickLike', {
            class_id: self.classInfo.id,
            isLike: (self.classInfo.isLike === 1) ? 0 : 1
          })
        }
      })
    }
  }
}
</script>

<style lang = "sass" scoped>
    @import './likeButton.scss'
</style>
