<template>

  <list id = "listview" class = "list-container" loadmoreoffset = "10" @scroll = "onScroll" @loadmore = "onloading">
    <div v-for = "(obj,index) in items" @click = "onItemClick(obj)">
      <div class="ohs-question-container">

        <text class="ohs-question-keyword-text">来自关键词：{{obj.keyword}}</text>
        <OBlock :height="1" :width="718" bgColor="#eeeeee"></OBlock>

        <text class="ohs-question-title" ref="title">{{obj.question}}</text>
        <text class="ohs-question-answer" ref="content">{{obj.answer}}</text>

        <div class="ohs-question-readnum">
          <image class="ohs-question-readnum-eye" :src="require('/assets/eye.png')"/>
          <text class="ohs-question-readnum-text">{{obj.scan_num}}</text>
        </div>
      </div>
    </div>
    <text  :style = "loadingStyle" @click="onloading">{{footer_text}}</text>
  </list>

</template>

<script>
  // 其它用法与vue相同
  import OBlock from '../../../components/OBlock'
  import Base from '../../../mixins/base'
  import network from '../../../modules/network/network'
  import config from '../../../config.json'

  export default {
    mixins: [Base],
    components: {
      OBlock: OBlock.weexComponent
    },
    props: {
      keyword:{
        type: String,
        required: true
      }
    },
    data () {
      return {
        url: 'getQuestionSearch',
        page: 1,
        items: [],
        footer_text: '正在加载中...'
      }
    },
    watch: {
      keyword(val) {
        this.page = 1
        this.fetch(false)
      }
    },
    computed: {
      loadingStyle () {
        return {
          display: 'flex',
          alignSelf: 'stretch',
          height: this.rpx(80, true),
          fontSize: this.rpx(24, true),
          alignItems: 'center',
          justifyContent: 'center',
          color: '#888888'
        }
      },
      params () {
        return {
          keyword: this.keyword
        }
      }
    },

    created () {
      let self = this
      setTimeout(function () {
        self.fetch(false)
      }, 0)
    },
    mounted () {
    },
    updated () {
      this.list = document.querySelector('#listview')
    },
    activated () {
      if (this.list) {
        this.list.scrollTop = this.offset
      }
    },
    methods: {
      fetch (more) {
        let self = this
        let p = Object.assign(this.params, {
          page: this.page
        })
        self.footer_text = '正在加载中...'
        network.getRequest(config.api[this.url], p, function (res) {
          console.log('xxx res', res)
          if (res.ret === 1) {
            let data = res.data
            if (data.length === null || data.length < 1) {
              self.footer_text = '暂无更多数据'
            } else {
              self.footer_text = '加载更多'
            }
            self.page = self.page + 1
            if (more) {
              self.items.push(...data)
            } else {
              self.items = []
              self.items.push(...data)
            }
          } else {
            self.footer_text = '暂无更多数据'
          }
          self.$apply()
        }, true)
      },
      onScroll (ev) {
        if (this.list) {
          this.offset = this.list.scrollTop
        }
      },
      onItemClick (item) {
        this.$emit('onItemClick', item)
      },
      onloading () {
        this.fetch(true)
      }
    }
  }
</script>

<style lang = "sass" scoped>
  @import 'index'
</style>
