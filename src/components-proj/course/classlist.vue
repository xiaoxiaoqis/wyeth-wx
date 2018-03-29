<template>
  <div id="classlist">
    <panel v-if="classlist.chapter && classlist.chapter.length > 0" title="课程大纲" :paddingLeft="12" :paddingRight="34" :titlePaddingLeft="10" :extraPaddingRight="27" :titleSize="29" :extraSize="25" :imgBg="'http://wyeth-course.nibaguai.com/wyeth/image/header_bg.png'" :imgLeftWitdh="8" titleColor="#af730c" extraColor="#666666" :imgLeftHeight="38" :imgRightWitdh="28" :imgRightHeight="28" :imgLeft="require('/assets/line.png')" :noextra="true"></panel>
    <Chapter v-for="(data, i) in classlist.chapter"
             :chapterIndex="i" :key="i"
             :datasource="data"
             @clickSectionCell="clickSectionCell"
             :songSelected="songSelected">
    </Chapter>
  </div>
</template>

<script>

  import Chapter from '../../components-service/course/chapter'
  import panel from '../../components/panel'

  export default {
    name: 'classlist',
    components: {
      'Chapter': Chapter,
      panel: panel.weexComponent
    },
    props: {
      classlist: {
        type: Object,
        required: false,
        default: {}
      },
      songSelected: {
        type: Object,
        required: false,
        default: {}
      }
    },
    methods: {
      clickSectionCell: function(e) {
        this.$emit('clickSectionCell', e)
      }
    }
  }
</script>


<style lang = "sass" scoped>
  @import './classlist.scss'
</style>
