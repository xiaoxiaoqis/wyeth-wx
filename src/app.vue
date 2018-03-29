<style lang="less">
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
}
</style>

<script>
if (typeof Object.assign !== "function") {
  Object.assign = function(target) {
    if (target == null) {
      throw new TypeError("Cannot convert undefined or null to object");
    }

    target = Object(target);
    for (var index = 1; index < arguments.length; index++) {
      var source = arguments[index];
      if (source != null) {
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
    }
    return target;
  };
}

//import wepy from "wepy";
import wekit from "wekit";
import "wepy-async-function";

import API from "./lib/api";
import network from "./modules/network/network";

import wepyBase from "./mixins/wepyBase";

import animBase from "./animation/mixin";

import routerConfig from "./routes/config";

import store from "./modules/store/index";
import event from "./modules/event/index";

const CIData = require("./modules/CIData/index");

var app = {};

export default class extends wekit.app {
  config = {
    pages: [
      "mix/home/index",
      "mix/mine/index",
      "mix/webview/index",
      "pages/discover",
      "pregnotice/pages/check-up/list",
      "pregnotice/pages/check-up/detail",
      "pregnotice/pages/weight/list",
      "pregnotice/pages/symptom/index",
      "pregnotice/pages/symptom/detail",
      "pregnotice/pages/music/list",
      "pregnotice/pages/check-up-report/list",
      "pregnotice/pages/mom-weekly/index",
      "pregnotice/pages/can-i-eat/list",
      "pregnotice/pages/can-i-eat/food",
      "pregnotice/pages/can-i-eat/search",
      "pregnotice/pages/recipe/home",
      "pregnotice/pages/recipe/categroy",
      "pregnotice/pages/recipe/list",
      "pregnotice/pages/recipe/detail",
      "pregnotice/pages/can-i-eat/index",
      "pregnotice/pages/my/feedback",
      "pregnotice/pages/set-pregdate/index",
      "pregnotice/pages/pintuan/detail",
      "pregnotice/pages/hospital/list",
      "pregnotice/pages/hospital/detail",
      "pregnotice/pages/sale/list",
      "pregnotice/pages/sale/item",
      "pregnotice/pages/sale/confirm",
      "pregnotice/pages/sale/result",
      "pregnotice/pages/sale/appointment",
      "pregnotice/pages/sale/orderList",
      "pregnotice/pages/sale/orderDetail",
      "pregnotice/pages/filing/guide",
      "pregnotice/pages/article/article",
      "pregnotice/pages/name/index",
      "pregnotice/pages/name/detail",
      "pregnotice/pages/name/alternative",
      "pregnotice/pages/name/rater",
      "pregnotice/pages/name/single-rate",
      "pages/index",
      "pages/course/courseAudio",
      "pages/course/courseVideo",
      "pages/course/courseNew",
      "pages/course/courseSeries",
      "pages/search/search",
      "pages/search/questionDetail",
      "pages/mine/history",
      "pages/other/orderPay",
      "pages/other/recharge",
      "pages/other/register"
    ],
    window: {
      backgroundTextStyle: "light",
      navigationBarBackgroundColor: "#E6C166",
      navigationBarTitleText: "首页",
      navigationBarTextStyle: "white"
    },
    tabBar: {
      color: "#666666",
      selectedColor: "#CD9E29",
      borderStyle: "white",
      backgroundColor: "#fbf9fe",
      list: [
        {
          pagePath: "mix/home/index",
          iconPath: "/assets/tab_home_normal.png",
          selectedIconPath: "/assets/tab_home_selected.png",
          text: "首页"
        },
        {
          pagePath: "pages/index",
          iconPath: "/assets/tab_discover_normal.png",
          selectedIconPath: "/assets/tab_discover_selected.png",
          text: "探索"
        },
        {
          pagePath: "pages/discover",
          iconPath: "/assets/tab_mine_normal.png",
          selectedIconPath: "/assets/tab_mine_selected.png",
          text: "我的"
        }
      ]
    }
  };
  mixins = [wepyBase, animBase];
  router = routerConfig;

  globalData = {
    userInfo: {
      user_token: ""
    },
    pregdate: "",
    pregtoday: "",
    pregweek: "",
    pregday: "",
    needSyncData: true,
    wyeth_channel: "",
    preg: true
  };

  constructor() {
    super();
    this.use("requestfix");
  }

  onLaunch(options) {
    console.log("APP onLaunch:", options);

    if (options) {
      let channel = "0";
      if (options.query && options.query.channel) {
        channel = options.query.channel;
      }

      CIData.sendEvent("enter", {
        channel: channel,
        scene: options.scene,
        path: options.path
      });
    }

    var temp = store.getItemSync("userInfo");

    if (temp) {
      this.globalData.userInfo = temp;
      this.globalData.preg = new Date(Date.parse(temp.pregdate)) >= new Date();
    }

    app = this;

    event.addEventListener("toast", function(obj) {
      API.showToast(obj);
    });
  }

  onShow(data) {
    console.log("开卡数据：", data.referrerInfo);

    if (
      data &&
      data.referrerInfo &&
      data.referrerInfo.extraData &&
      data.referrerInfo.extraData.activate_ticket
    ) {
      let extraData = data.referrerInfo.extraData;

      let self = this;
      network.getWxCardMemberInfoByTicket(
        extraData.activate_ticket,
        extraData.code,
        function(res) {
          console.log("获取会员数据：", res);
          if (res.ret === 1) {
            self.globalData.userInfo.crm_status = 2;
            self.globalData.memberInfo = res.data;
            API.push({ url: "/pages/other/register" });
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
}

const util = require("./pregnotice/util/util");

Object.assign(getApp(), {
  globalData: app.globalData,
  askForWxLogin: function() {
    console.log("请求登录 askForWxLogin");
  },
  askForLogout: function() {
    console.log("请求退出 askForLogout");
  },
  setUserInfo: function(userInfo) {
    console.log("setUserInfo:", userInfo);

    store.setItemSync("userInfo", userInfo);

    this.globalData.userInfo = userInfo;

    CIData.setUserId(userInfo.id);
    CIData.setChannel(userInfo.channel);

    CIData.setUserProperties(userInfo.user_properties);

    this.setPregdate(userInfo.pregdate);
  },
  setPregdate: function(pregdate) {
    var _pregdate;
    if (
      pregdate &&
      pregdate.length > 0 &&
      pregdate.indexOf("0000-00-00") === -1
    ) {
      _pregdate = pregdate;
      wx.setStorageSync("pregdate", _pregdate);
    } else {
      _pregdate = wx.getStorageSync("pregdate");
    }
    this.updateGlobalPregdate(_pregdate);
  },
  updateGlobalPregdate: function(pregdate) {
    var globalData = this.globalData;
    if (globalData) {
      globalData.pregdate = pregdate;
      globalData.pregtoday = util.pregDateFormat.calPregweek(pregdate);
      globalData.pregday = util.pregDateFormat.calPregweek(pregdate, "day");
      globalData.pregweek = util.pregDateFormat.calPregweek(pregdate, "week");
      globalData.preg = new Date(Date.parse(pregdate)) >= new Date();
    }
  }
});
</script>
