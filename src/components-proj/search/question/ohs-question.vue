<template>
  <div class="ohs-question-container">

    <div>
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
</template>

<script>
  // 其它用法与vue相同
  import OBlock from '../../../components/OBlock/index'
  export default {
    components: {
      OBlock: OBlock.weexComponent
    },
    props: {
      obj: {
        type: Object,
        required: true
      },
      extra: {
        type: Object
      }
    },
    data () {
    	return {}
    },
    mounted () {
      var words = this.extra.keyword.split('');

      var content = this.$refs.content;
      var contentHTML = content.$el.innerHTML;

      for (let i = 0; i < words.length; i++) {
        let regStr = "/(" + words[i] + ")/gm";
        let reg = eval(regStr);
        contentHTML = contentHTML.replace(reg, "<strong style='color: red; font-size: 1em'>" + words[i] + "</strong>");
      }
      content.$el.innerHTML = contentHTML;


      var title = this.$refs.title;
      var titleHTML = title.$el.innerHTML;

      for (let i = 0; i < words.length; i++) {
        let regStr = "/(" + words[i] + ")/gm";
        let reg = eval(regStr);
        titleHTML = titleHTML.replace(reg, "<strong style='color: red; font-size: 1em'>" + words[i] + "</strong>");
      }
      title.$el.innerHTML = titleHTML;
    },
    computed: {
    	question () {
    		let reg = new RegExp(this.obj.keyword, 'g')
    		return this.obj.question.replace(reg, function (s) {
          return `<span class="keyword-hightlight-span">${s}</span>`
        })
      },
      answer() {
        let reg = new RegExp(this.obj.keyword, 'g')
        return this.obj.answer.replace(reg, function (s) {
          return `<span class="keyword-hightlight-span">${s}</span>`
        })
      }
    },
    methods: {
    }
  }
</script>

<style lang="sass" scoped>
  @import "index.scss";
</style>
