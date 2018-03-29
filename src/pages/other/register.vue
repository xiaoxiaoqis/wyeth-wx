<template>
  <OHSFullPage class="register">
    <div class="header">
      <image class="icon" :src="require('/assets/moli_icon.png')"/>
      <div class="content">
        <text class="title">惠氏（上海）贸易有限公司</text>
        <text class="subtitle">惠氏妈妈俱乐部</text>
      </div>
    </div>

    <div class="info">
      <div class="memberInfo">
        <text class="text">姓名：{{memberInfo.name}}</text>
        <text class="text">手机：{{memberInfo.mobile}}</text>
      </div>

      <text class="tip-top">准确提供以下信息，即可获得私人订制款会员福利</text>

      <div class="section date">
        <text class="dot">*</text>
        <text class="title">预产期/宝宝生日</text>
        <picker mode="date" :value="pregdate" :end="pregdateRangeEnd" @change="pregdateChange()">
          <div class="picker">
            <div class="pregdate">{{pregdate}}</div>
            <image class="icon" :src="require('/assets/register_more.png')" />
          </div>
        </picker>
      </div>

      <div class="section index">
        <text class="dot">*</text>
        <text class="title">请选择</text>
        <radio-group class="radio-group" @change="radioChange()">
          <label class="radio">
            <radio value="1" :checked="child === 1"/>一胎
          </label>

          <label class="radio">
            <radio value="2" :checked="child === 2"/>二胎
          </label>
        </radio-group>
      </div>

      <div class="section code">
        <text class="title">邀请码</text>
        <input class="input" type="text" placeholder="请输入邀请码(选填)" @change="codeChange()" />
      </div>

      <div class="section remark">
        <text class="title">备注</text>
        <input class="input" type="text"  @change="remarkChange()"/>
      </div>

      <text class="tip-bottom">*为必填项</text>

      <div class="confirm" @click="confirm()">完成注册</div>
    </div>

    <text class="attention">个人资料将由并仅限惠氏（上海）贸易有限公司使用</text>

  </OHSFullPage>
</template>

<script>
import API from "../../lib/api";
import Base from "../../mixins/base";
import event from "../../modules/event";
import network from "../../modules/network/network";

import OHSFullPage from "../../components-proj/comm/page/ohs-fullpage.vue";

module.exports = {
  config: {
    navigationBarTitleText: "注册"
  },
  mixins: [Base],
  components: {
    OHSFullPage: OHSFullPage.weexComponent
  },
  data() {
    return {
      memberInfo: {
        name: "",
        mobile: ""
      },
      child: 1,
      pregdate: "请选择",
      pregdateRangeEnd: "",
      code: "",
      remark: ""
    };
  },
  created() {
    this.memberInfo = getApp().globalData.memberInfo;
    if (!this.memberInfo) {
      this.init();
    }
  },
  methods: {
    init() {
      let self = this;
      network.getWxCardMemberInfo(function(res) {
        if (res.ret === 1) {
          console.log("获取会员数据：", res.data);

          self.memberInfo = res.data;
        } else {
          API.showToast({
            title: "请重试",
            type: "fail"
          });
        }
      });
    },
    pregdateChange(e) {
      console.log("pregate:", e.detail.value);
      this.pregdate = e.detail.value;
    },
    radioChange(e) {
      console.log("checkboxChange:", e);
      this.child = parseInt(e.detail.value);
    },
    codeChange(e) {
      console.log("codeChange:", e);
      this.code = e.detail.value;
    },
    remarkChange(e) {
      console.log("remarkChange:", e);
      this.remark = e.detail.value;
    },
    confirm() {
      if (!this.pregdate || this.pregdate === "请选择") {
        API.showToast({
          title: "请选择日期",
          type: "fail"
        });

        return;
      }

      network.registerCrm(
        {
          baby_birthday: this.pregdate,
          child_number: this.child,
          recommend_code: this.code,
          comment: this.remark
        },
        function(res) {
          if (res.ret === 1) {
            getApp().globalData.userInfo.crm_status = 1
            
            API.pop();
          } else {
            API.showToast({
              title: res.msg,
              type: "fail"
            });
          }
        }
      );
    }
  }
};
</script>


<style lang="sass" scoped>
  @import '../scss/register.scss'
</style>

