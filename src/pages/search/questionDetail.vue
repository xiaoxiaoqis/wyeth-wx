<template>

  <div style="flex-direction: column">

    <OHSQuestionHeader :title="title" :num="num" :keyword="keyword"></OHSQuestionHeader>
    <OBlock1  :height="16" bgColor="#eeeeee"></OBlock1>

    <OHSQuestionContent :content="answer"></OHSQuestionContent>
    <OBlock2  :height="16" bgColor="#eeeeee"></OBlock2>
    <CourseRecommend :recommendList="recomClass"></CourseRecommend>

    <OSlider v-show="broadcast.length > 0" :items="broadcast" :width="750" :interval="3000" :autoPlay="true" :height="200" :showIndicator="false"></OSlider>

  </div>

</template>

<script>
import API from "../../lib/api";
import OHSFullPage from "../../components-proj/comm/page/ohs-fullpage.vue";
import OBlock from "../../components/OBlock";
import OHSQuestionHeader from "../../components-proj/question/ohs-question-header.vue";
import OHSQuestionContent from "../../components-proj/question/ohs-question-content.vue";
import CourseRecommend from "../../components-proj/course/courseRecommend.vue";
import OSlider from "../../components/OSlider";
import network from "../../modules/network/network";
module.exports = {
  components: {
    OHSFullPage: OHSFullPage.weexComponent,
    OHSQuestionHeader: OHSQuestionHeader.weexComponent,
    OBlock: OBlock.weexComponent,
    OBlock1: OBlock.weexComponent,
    OBlock2: OBlock.weexComponent,
    OHSQuestionContent: OHSQuestionContent.weexComponent,
    CourseRecommend: CourseRecommend.weexComponent,
    OSlider: OSlider.weexComponent
  },
  created() {
    API.setNavigationBarTitle({ title: "探索" });
    this.fetch();
  },
  onShareAppMessage(options) {
    let params = { id: this.id };
    return {
      title: this.title,
      path: `/pages/search/questionDetail?params=${JSON.stringify(params)}`
    };
  },
  data() {
    return {
      title: "",
      num: 0,
      keyword: "",
      answer: "",
      recomClass: [],
      broadcast: [],
      id: 0
    };
  },
  methods: {
    fetch: function() {
      let self = this;
      let params = {};

      params.tid = this.$route.params.id;

      network.getTagQuestion(params, function(res) {
        if (res.ret == 1) {
          let data = res.data;
          self.title = data.tag_question.question;
          self.num = data.tag_question.scan_num;
          self.keyword = data.tag_question.keyword;
          self.answer = data.tag_question.answer;
          self.recomClass = data.recomClass;
        }
        self.$apply();
      });
      console.log(params);
    }
  }
};
</script>

<style>

</style>
