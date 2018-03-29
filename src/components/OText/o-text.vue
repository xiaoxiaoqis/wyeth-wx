<template>
  <div class="o-text">
    <text :style="mStyle">{{text}}abc</text>
  </div>

</template>

<script>
	module.exports = {
    props: {
      text: {
        type: String,
        required: true
      },
      size: {
        type: Number,
        required: true
      }
    },
    data () {
      return {}
    },
    computed: {
      mStyle () {
        return {
          fontSize: this.size+'px'
        }
      },
      content () {
        return this.text + 'hhhh'
      }
    },
    methods: {}
	}
</script>

<style lang = "sass" scoped>
  @import "index.scss"
</style>
