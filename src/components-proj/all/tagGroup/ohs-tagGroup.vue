<template>
  <div class = "ohs-taggroup-container">
    <!--<OTagSelect1 :enable = "enable" :tags = "typeTags" ref = "s1" :selectid = "select[0]" @onSelect = "onTag1Select"></OTagSelect1>-->
    <!--<OTagSelect2 :enable = "enable" :tags = "stageTags" ref = "s2" :selectid = "select[1]" @onSelect = "onTag2Select"></OTagSelect2>-->
    <!--<OTagSelect3 :enable = "enable" :tags = "hotTags" ref = "s3" :selectid = "select[2]" @onSelect = "onTag3Select"></OTagSelect3>-->

    <OTagSelectList1
      style=""
      :radius = "31" :height='62'
      :borderWidth = "1"
      :enable = "enable" :tags = "typeTags" ref = "s1" :selectid = "select[0]"
      @onSelect = "onTag1Select"></OTagSelectList1>
    <OTagSelectList2
      :radius="31" :height='62'
      :borderWidth="1"
      :enable = "enable" :tags = "stageTags" ref = "s2" :selectid = "select[1]"
      @onSelect = "onTag2Select"></OTagSelectList2>
    <OTagSelectList3
      :radius = "31" :height='62'
      :borderWidth = "1"
      :enable = "enable" :tags = "hotTags" ref = "s3" :selectid = "select[2]"
      @onSelect = "onTag3Select"></OTagSelectList3>
  </div>
</template>

<script>

  import Base from '../../../mixins/base'
  import OTagSelect from '../../../components/tagSelect'
  import OTagSelectList from '../../../components/tagSelect2/o-tagselectlist.vue'
  // 其它用法与vue相同
  export default {
    mixins: [Base],
    components: {
      OTagSelect1: OTagSelect.weexComponent,
      OTagSelect2: OTagSelect.weexComponent,
      OTagSelect3: OTagSelect.weexComponent,
      OTagSelectList1: OTagSelectList,
      OTagSelectList2: OTagSelectList,
      OTagSelectList3: OTagSelectList
    },
    props: {
      enable: {
        type: Boolean,
        default: function () {
          return true
        }
      },
      initSelect: {
        type: Array,
        default: function () {
          return [0, 0, 0]
        }
      },
      typeTags: {
        type: Array,
        required: true
      },
      stageTags: {
        type: Array,
        required: true
      },
      hotTags: {
        type: Array,
        required: true
      }
    },
    data () {
      return {
        tags1: ['最新', '推荐', '热门'],
        tags2: ['不限', '孕期', '0-12月', '12-24月', '24+月'],
        tags3: ['热门标签', '奶爸', '宝宝护理', '孕期营养'],
        select: this.initSelect
      }
    },
    methods: {
      setSelect (s) {
        console.log('### setSelect,s=',s)
        this.select = s
        this.$refs.s1.setIndex(s[0])
        this.$refs.s2.setIndex(s[1])
        this.$refs.s3.setIndex(s[2])
      },
      onTag1Select: function (index) {
        this.select[0] = index
        this.$emit('onTagChange', this.select)
      },
      onTag2Select: function (index) {
        this.select[1] = index
        this.$emit('onTagChange', this.select)
      },
      onTag3Select: function (index) {
        this.select[2] = index
        this.$emit('onTagChange', this.select)
      }
    }
  }
</script>

<style lang="sass" scoped>
  @import "./index.scss"
</style>
