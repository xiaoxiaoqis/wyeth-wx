<template>
  <div class="o-searchview">
    <div  class="o-searchbar-wrap">
      <!--搜索条-->
      <transition name="slide-fade">
        <div ref="input1" class="o-searchbar-inner" :style="inputStyle">
          <image class="o-search-icon" :src="searchIcon"/>
          <input class="o-search-input"
                 :placeholder="hint"
                 return-key-type="search"
                 ref="input"
                 type="search"
                 :value="inputValue"
                 @change="onChange"
                 @return="onreturn"
                 @input="onInput"
                 @focus="onFocus"
                 @blur="onBlur"/>
        </div>
      </transition>

      <transition name="slide-fade">
        <text v-if="isOpen" @click="onBtnClick" class="o-searchbar-cancel" lines="1">{{btnText}}</text>
      </transition>
    </div>
    <transition name="alpha-fade">
      <div v-show="isOpen&&!searchover" class="o-history" @click="onBgClick">
        <slot name="search_preview"></slot>
      </div>
    </transition>
    <transition name="alpha-fade">
      <div v-if="isOpen&&searchover" ref="result_page" class="o-history" >
        <slot name="search_result"></slot>
      </div>
    </transition>

  </div>
</template>

<script>
  // 其它用法与vue相同
  import Base from '../../mixins/base'
//  const animation=weex.requireModule('animation')
//  var modal=weex.requireModule('modal')
  export default {
    mixins: [Base],
    props: {
      hint: {
        type: String,
        default: '搜索一下'
      },
      autofocus: {
        type: Boolean,
        default: function () {
          return false
        }
      },
      btnText: {
        type: String,
        default: function () {
          return '取消'
        }
      }
    },
    data () {
      return {
        searchIcon: require('/assets/search.png'),
        clearImg: require('/assets/delete.png'),
        isOpen: true,
        searchover: false,
        hintText: this.hint,
        value: '',
        inputValue: ''
      }
    },
    watch: {
      searchover: function (newobj, oldobj) {
        this.$emit('showResult', newobj)
      }
    },
    computed: {
      inputStyle: function () {
        return {
          width: this.rpx(718, true),
          backgroundColor: '#ffffff',
          justifyContent: this.isOpen ? 'flex-start' : 'center'
        }
      }
    },
    methods: {
      onBgClick: function () {
//        this.$router.go(-1)
      },
      onFocus: function () {
        this.isOpen=true
        this.$emit('onFocus')

        console.log('----- onFocus')
      },
      onBlur: function () {
        this.$emit('onBlur')
        console.log('----- onBlur')
      },

      cancel: function () {
        this.isOpen=false
        this.searchover=false
        this.$emit('onClose')
        this.clear()
      },
      onBtnClick: function () {
        if (this.btnText === '取消') {
          this.cancel()
        } else {
          this.$emit('onBtnClick')
        }
      },
      getValue () {
//        return this.$refs.input.$el.value
        return this.inputValue
      },
      onChange (ev) {
//      modal.toast({
//        message: 'input onChange',
//        duration: 0.8
//      })
      },
      onInput (event) {
        switch (this.getPlatform()) {
          case 'WX_APP':
            this.inputValue=event.detail.value
            this.value=event.detail.value
            break
          case 'BROWSER':
            this.inputValue=event.value
            this.value=event.value
            break
        }
        this.searchover=false
      },
      onreturn: function (event) {
        switch (this.getPlatform()) {
          case 'WX_APP':
            this.search(event.detail.value)
            break
          case 'BROWSER':
            this.search(event.value)
            break
        }
//      this.$refs.input.blur()
      },
      search (value) {
        if (value.trim() === '') {
//          modal.toast({
//            message: '搜索词不得为空',
//            duration: 0.3
//          })
        } else {
          this.inputValue=value
          this.$emit('search', value)
          this.jump()
        }
      },
      clear: function () {
//        this.$refs.input.$el.value=''
        this.inputValue=''
        this.searchover=false
      },
      jump () {
        this.searchover=true
        this.$nextTick(function () {
//          if (this.$refs.result_page.$children.length > 0) {
//            // 不跳转
//            this.searchover=true
//          } else {
//            this.searchover=false
//          }
        })
      },
      back () {
        this.searchover=false
      }

    },
    created () {
      if (this.$refs.input) {
        this.clear()
        if (this.autofocus) {
          this.$refs.input.focus()
        }
      }
    },
    mounted () {
    },
    activated () {
      if (this.autofocus) {
        this.isOpen=true
      }
    }
  }
</script>

<style lang="sass" scoped>
  @import "index"
</style>
