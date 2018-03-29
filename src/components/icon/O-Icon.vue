<template>
  <text :style = "style" @click = "click" @longpress = "longpress">{{getFontName}}</text>
</template>
<script>
var he = require('he')
export default {
  name: 'OIcon',
  props: {
    size: {
      type: String,
      default: '55px'
    },
    color: {
      type: String,
      default: ''
    },
    iconID: {
      default: '&#xe64d'
    }
  },
  computed: {
    style () {
      return {
        fontFamily: 'iconfont',
        color: this.color,
        fontSize: `${this.size}px`
      }
    },
    getFontName: function () {
      return he.decode(this.iconID)
    }
  },
  methods: {
    click (e) {
      this.$emit('click', e)
    },
    longpress (e) {
      this.$emit('longpress', e)
    }
  },
  created () {
    const domModule = weex.requireModule('dom')
    domModule.addRule('fontFace', {
      'fontFamily': 'iconfont',
      'src': "url('http://at.alicdn.com/t/font_rlhwh5t0rj5uerk9.ttf')"
    })
  }
}
</script>
