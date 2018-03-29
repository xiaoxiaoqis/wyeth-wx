<template>
  <div id = "courseAd" @click = "clickAd">
    <image class = "courseAd-image" :src = "ad.src"/>
  </div>
</template>

<script>
export default {
  props: {
    ad: {
      type: Object,
      required: true
    }
  },
  methods: {
    clickAd: function () {
      window.location.href = this.ad.url
    }
  }
}
</script>

<style lang = "sass" scoped>
    @import './courseAd.scss'
</style>
