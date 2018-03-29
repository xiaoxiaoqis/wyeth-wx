<template>
  <OHSFullPage class="recharge">
    <scroller class="recharge-scroller">
      <image class="poster" :src="require('/assets/recharge_poster.png')"/>

      <text class="text title-1">请选择充值金额</text>

      <OHSChargeList :options="options" :selected="selected" @clickChargeCell="clickChargeCell"></OHSChargeList>

      <text class="text title-2">充值说明：</text>
      <text class="subtitle">1.MQ充值成功后无法退款，不可提现</text>
      <text class="subtitle">2.收款账户为魔栗妈咪学院授权微信支付商户，可放心付款。</text>
    </scroller>

    <div class="button-bg">
      <text class="button" @click="clickBuy">立即支付</text>
    </div>

  </OHSFullPage>
</template>

<script>
import event from "../../modules/event";
import network from "../../modules/network/network";
import store from "../../modules/store";

import OBlock from "../../components/OBlock";
import OSlider from "../../components/OSlider";
//import ChargeCell from '../../components/chargecell'
//import { OGridView } from '../../components/OGridView'

import OHSChargeList from "../../components-proj/pay/ChargeList/ohs-chargelist.vue";
import OHSFullPage from "../../components-proj/comm/page/ohs-fullpage.vue";

import base from "../../mixins/base";

import API from "../../lib/api";

export default {
  config: {
    navigationBarTitleText: "充值"
  },
  mixins: [base],
  components: {
    OHSFullPage: OHSFullPage.weexComponent,
    OBlock: OBlock.weexComponent,
    OHSChargeList: OHSChargeList
    //    ChargeCell: ChargeCell.weexComponent,
    //    OGridView: OGridView.weexComponent
  },
  data() {
    return {
      out_trade_no: String,
      order_no: "",
      queryCount: 0,
      options: [
        {
          id: 0,
          price: 1,
          mq: 50
        },
        {
          id: 1,
          price: 6,
          mq: 300
        },
        {
          id: 2,
          price: 10,
          mq: 500
        },
        {
          id: 3,
          price: 20,
          mq: 1000
        },
        {
          id: 4,
          price: 50,
          mq: 2500
        },
        {
          id: 5,
          price: 100,
          mq: 5000
        },
        {
          id: 6,
          price: 200,
          mq: 10000
        },
        {
          id: 7,
          price: 500,
          mq: 25000
        }
      ],
      selected: 0
    };
  },
  created() {
    this.selected = this.$route.params.id ? parseInt(this.$route.params.id) : 0;
    //    if (window.requestParams.status) {
    //      if (window.requestParams.status === 'ok' && window.requestParams.out_trade_no) {
    //        // 支付成功，开始轮询
    //        this.out_trade_no = window.requestParams.out_trade_no
    //        this.queryCount = 0
    //        this.queryOrder()
    //      } else {
    //        let msg = '支付失败'
    //        if (window.requestParams.status === 'cancel') {
    //          msg = '取消支付'
    //        }
    //        event.sendEvent('toast', { type: 'fail', text: msg })
    //      }
    //      window.requestParams.status = null
    //      window.requestParams.out_trade_no = null
    //
    //      this.getStash()
    //    }
  },
  destroyed() {
    store.removeItem("recharge", function() {});
  },
  methods: {
    clickChargeCell(id) {
      console.log("clickChargeCell");
      this.selected = id;
    },
    clickBuy() {
      console.log("clickBuy");

      let price = this.options[this.selected].price;

      let self = this;
      network.createMiniOrder(price, function(res) {
        if (res.ret === 1 && res.data) {
          let data = res.data;
          let params = JSON.parse(data.pay_param);

          API.requestPayment(
            Object.assign(params, {
              success: function(res) {
                console.log("##requestPayment success", res);
                self.queryOrder();
              },
              fail: function(errMsg) {
                console.log("##requestPayment fail", errMsg);
              },
              complete: function(errMsg) {
                console.log("##requestPayment complete", errMsg);
              }
            })
          );
          self.order_no = data.order_no;
        }
        self.$apply();
      });
    },
    queryOrder: function() {
      console.log("queryOrder ...");
      var self = this;

      if (self.queryCount > 5) {
        event.sendEvent("toast", { type: "fail", text: "支付失败" });
      }

      self.queryCount += 1;

      network.queryOrder(self.order_no, function(res) {
        if (res.ret === 1 && res.data && res.data.status === "success") {
          console.log("queryOrder success");
          event.sendEvent("toast", { type: "success", text: res.data.subject });
          // 跳转stash页面
          setTimeout(function() {
            self.$router.go(-1);
          }, 1000);
        } else {
          self.queryOrder();
        }
        self.$apply();
      });
    },
    saveStash: function(path) {
      console.log(path);
      store.setItem("recharge", JSON.stringify(path), function() {});
    },
    getStash: function() {
      store.getItem("recharge", function(res) {
        console.log(res);
        if (res.result === "success") {
          window.stashPath = JSON.parse(res.data);
          console.log(" window.stashPath =", window.stashPath);
        }

        store.removeItem("recharge", function() {});
      });
    },
    clickChargeCell(id) {
      this.selected = id;
    }
  }
};
</script>

<style scoped>
.recharge {
  background-color: #f2f4f5;
}

.recharge .poster {
  width: 750px;
  height: 160px;
}

.text {
  color: #333333;
  font-size: 28px;
  width: 750px;
  line-height: 30px;
  padding-left: 32px;
  margin: 23px 0 27px 0;
}

.title-1 {
  margin: 40px 0 27px 0;
}

.title-2 {
  margin: 20px 0 10px 0;
}

.recharge .subtitle {
  color: #999999;
  font-size: 26px;
  padding-left: 32px;
}

.recharge .options {
  width: 750px;
  background-color: #f2f4f5;
  padding: 0 15px;
}

.recharge-scroller {
  position: absolute;
  left: 0px;
  top: 0px;
  right: 0px;
  bottom: 126px;
}
.button-bg {
  position: fixed;
  bottom: 0px;
  left: 0px;
  right: 0px;
  height: 126px;
  background-color: #ffffff;
  justify-content: space-around;
}

.button-bg .button {
  width: 710px;
  height: 84px;
  line-height: 84px;
  background-image: linear-gradient(
    to right,
    #e7c25f,
    #e4be5b,
    #cea03f,
    #c69735
  );
  color: white;
  font-size: 32px;
  border-radius: 10px;
  align-self: center;
  text-align: center;
  vertical-align: middle;
}
</style>
