<template>
  <div class="ohs-chargelist-container">
    <div class="ohs-chargelist-list">
      <div v-for="(item,i) in listLeft" class = "chargecell" @click = "clickChargeCell(item)" :class =
        "selected === item.id?'chargecell-selected':'chargecell-normal'">
        <text class = "price">{{item.price + '元'}}</text>
        <text class = "mq">{{item.mq + 'MQ'}}</text>
      </div>
    </div>
    <div class="ohs-chargelist-list">
      <div v-for="(item,i) in listRight" class = "chargecell" @click = "clickChargeCell(item)" :class =
        "selected === item.id?'chargecell-selected':'chargecell-normal'">
        <text class = "price">{{item.price + '元'}}</text>
        <text class = "mq">{{item.mq + 'MQ'}}</text>
      </div>
    </div>
  </div>
</template>

<script>
	module.exports = {
		props: {
      options: {
      	type: Array,
        required: true
      },
      selected: {
      	type: Number,
        default: function () {
          return 0
        }
      }
    },
    computed: {
			listLeft() {
				let l = []
				for (let i=0;i<this.options.length;i++) {
					if (i%2 === 0) {
						l.push(this.options[i])
          }
        }
        return l
      },
      listRight() {
        let l = []
        for (let i=0;i<this.options.length;i++) {
          if (i%2 === 1) {
            l.push(this.options[i])
          }
        }
        return l
      }
    },
		data () {
			return {}
		},
		methods: {
      clickChargeCell (item) {
        this.$emit('clickChargeCell', item.id)
      }
    }
	}
</script>

<style lang="sass" scoped>
  @import "index"
</style>
