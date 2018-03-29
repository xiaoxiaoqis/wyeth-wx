<template>
  <div id = "chapter">
    <text class = "title" :lines = "1">{{datasource.index +'.'+datasource.title}}</text>
    <Sectioncell v-for = "(section, i) in datasource.section"
                 :ref = "'sectioncell'+i"
                 :chapterIndex="datasource.index"
                 :key = "i"
                 :section = "section"
                 :songSelected = "songSelected"
                 @clickSectionCell = "clickSectionCell"></Sectioncell>
  </div>
</template>

<script>

  import Sectioncell from '../../components/sectioncell/sectioncell'

  export default {
    name: 'chapter',
    components: {
      'Sectioncell': Sectioncell
    },
    props: {
      datasource: {
        type: Object,
        required: true
      },
      songSelected: {
        type: Object,
        required: false,
        default: {}
      }
    },
    data () {
      return {
      }
    },
    methods: {
      clickSectionCell: function (e) {
        console.log('chapter ' + e)
        this.$emit('clickSectionCell', e)
      }
    }
  }
</script>

<style lang = "sass" scoped>
  @import './chapter.scss'
</style>
