<template>
  <OSearchbar :hint="hint" @onBtnClick="onBtnClick" @onClose="onClose" @showResult="onTransition"
              @search="search" :autofocus="autofocus" :btnText="btnText" ref="input1">
    <!--历史搜索页面-->
    <div slot="search_preview" class="ohs-history">
      <div v-if="historyItems.length>0" class="ohs-tag-header">
        <text class="ohs-history-title">历史搜索</text>
        <div class="ohs-tag-clear-wrap" @click="clearHistory">
          <image class="ohs-tag-clear" :src="clearImg"/>
        </div>
      </div>
      <div class="ohs-tag-group">
        <text class="ohs-tag-span" v-for="(item,i) in historyItems" :key="i" @click="onTagClick(item)">{{item}}</text>
      </div>
      <text v-if="hotTags.length>0" class="ohs-hot-title">热门搜索</text>
      <div class="ohs-tag-group">
        <text class="ohs-tag-span" v-for="(item,i) in hotTags" :key="i" @click="onTagClick(item)">{{item}}</text>
      </div>
    </div>

    <!--搜索结果页面-->
    <div slot="search_result" style="flex: 1;position: static;">

      <Tabs :value="tab1" @onTabChange="onTabChange" class="tabs-container">

        <Tab1 label="课程" value="one" style="position: static;">
          <OHSCourseList :keyword="keyword" @onItemClick="onCourseClick"></OHSCourseList>
        </Tab1>
        <Tab2 label="问答" value="two"  style="position: static;">
          <OHSQuestionList :keyword="keyword" @onItemClick="onQuestionClick"></OHSQuestionList>
        </Tab2>
      </Tabs>
    </div>

  </OSearchbar>
</template>

<script>
// 其它用法与vue相同
import CIData from "../../../modules/CIData/index";

import searchbar from "../../../components/searchbar/index";
import store from "../../../modules/store/index";
import config from "../../../config.json";
import OPanel from "../../../components/panel/index";
import OTabs from "../../../components/OTab";
import OTab from "../../../components/OTab/o-tab";
import network from "../../../modules/network/network";
import { courseRoute } from "../../../modules/tools";
import OHSCourseList from "../courseList/ohs-courseList.vue";
import OHSQuestionList from "../questionList/ohs-questionList.vue";

import Base from "../../../mixins/base";

export default {
  mixins: [Base],
  components: {
    OSearchbar: searchbar.weexComponent,
    OPanel: OPanel.weexComponent,
    Tabs: OTabs.weexComponent,
    Tab1: OTab.weexComponent,
    Tab2: OTab.weexComponent,
    OHSCourseList: OHSCourseList,
    OHSQuestionList: OHSQuestionList
  },
  props: {
    hint: {
      type: String,
      default: "搜索一下"
    },
    hotTags: {
      type: Array,
      default: function() {
        return ["宝宝", "孕期"];
      }
    },
    btnText: {
      type: String,
      default: function() {
        return "取消";
      }
    },
    autofocus: {
      type: Boolean,
      default: function() {
        return false;
      }
    }
  },
  data() {
    return {
      clearImg: require("/assets/delete.png"),
      historyItems: [],
      hintText: this.hint,
      classItems: [],
      teachers: [],
      articles: [],
      questions: [],
      course_page: 1,
      keyword: "",
      loadmore_flag: false,
      isLoading: false,
      tab1: "one",
      courseSearch: {
        url: "getCourseSearch",
        params: {
          keyword: ""
        }
      },
      questionSearch: {
        url: "getQuestionSearch",
        params: {
          keyword: ""
        }
      },
      extra: {
        keyword: ""
      }
    };
  },
  computed: {
    searchWord() {
      console.log(this.$refs.input1);
      if (this.$refs.input1) {
        return {
          word: this.$refs.input1.getValue()
        };
      } else {
        return {};
      }
    }
  },
  created() {
    var self=this;
    store.getItem("search_history", function(data) {
      if (data.result === "failed") {
        self.historyItems=[];
      } else {
        self.historyItems=JSON.parse(data.data);
      }
    });
  },
  watch: {
    historyItems: function(newobj, oldobj) {
      var str=JSON.stringify(newobj);
      store.setItem("search_history", str, function(data) {
        console.log("保存搜索历史,", data);
      });
    }
  },
  methods: {
    onTabChange: function(v) {
      this.tab1=v;
      console.log("##onTabChange tab1", v);
    },
    search: function(item) {
      console.log("----------search", this);
      var first=this.historyItems[0];
      if (item !== first) {
        var a=[];
        a.push(item);
        a.push(...this.historyItems);
        this.historyItems=a;
        if (this.historyItems.length > 5) {
          this.historyItems=this.historyItems.slice(0, 5);
        }
        console.log("this.historyItems=", this.historyItems);
      }
      this.keyword=item;
      this.courseSearch.params.keyword=item;

      this.questionSearch.params.keyword=item;
      this.extra.keyword=item;
      this.fetch(item, 0);
    },
    fetch: function(keyword) {
      let self=this;
      let params={};
      params.keyword=keyword;

      this.isLoading=true;

      network.getSearchResult(params, function(res) {
        self.isLoading=false;
        if (res.ret === 1) {
          let data=res.data;

          self.classItems=data.course;

          self.questions=data.question;
          if (data.teacher) {
            self.teachers=[data.teacher];
          } else {
            self.teachers=[];
          }
        } else {
        }
      });
    },
    onTagClick: function(item) {
      this.$refs.input1.search(item);
    },
    clearHistory: function() {
      this.historyItems=[];
    },
    onBtnClick: function() {
      this.$refs.input1.search(this.$refs.input1.getValue());
    },
    onClose: function() {},
    onQuestionClick: function(item) {
      this.$router.push({ name: "questionDetail", params: { id: item.id } });
    },
    onArticleClick: function() {},
    onCourseClick(item) {
      courseRoute(item);
    },
    onQuestionMore() {
      this.$router.push({
        name: "questionList",
        params: {
          keyword: this.keyword,
          nokeep: true
        }
      });
      this.questions();
    },
    onCourseMore() {
      this.$router.push({
        name: "courseList",
        params: {
          url: "getCourseSearch",
          params: {
            keyword: this.keyword
          },
          nokeep: true
        }
      });
    },
    onTeacherClick: function(item) {
      this.$router.push({
        name: "courseList",
        params: {
          url: "getTeacherCourse",
          params: {
            tid: item.tid
          },
          nokeep: true
        }
      });
    },
    refresh: function() {
      this.fetch(this.keyword);
    },
    onTransition: function(showResult) {
      if (!showResult) {
        this.classItems=[];
        this.teachers=[];
        this.articles=[];
        this.questions=[];
      }
    }
  }
};
</script>

<style lang="sass" scoped>
  @import "index"
</style>
