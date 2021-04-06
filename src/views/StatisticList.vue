<template>
  <div class="statistic-wrap" v-if="info">
    <div class="statistic-top align-c flex justify-around align-items-center">
      <div v-for="(item, index) in info.top" :key="index">
        <div class="value">{{ item.value }}</div>
        <div>{{ item.title }}</div>
      </div>
    </div>
    <div v-for="(item, index) in info.products" :key="index">
      <StatisticsCard :info="item" @click.native="toStatistic(item.id)"></StatisticsCard>
    </div>
  </div>
</template>

<script>
  import StatisticsCard from '@/components/StatisticsCard.vue'
  import api from '@/api/api'
  export default {
    data() {
      return {
        info: null
      }
    },

    components: {
      StatisticsCard
    },

    created() {
      this.getStatisticList()
    },

    methods: {
      getStatisticList() {
        this.$http.get(api.getStatisticList).then((res) => {
          res.top = [
            { value: res.dailyClicks, title: '今日访问' },
            { value: res.monthlyClicks, title: '本月访问' },
            { value: res.totalClicks, title: '总计访问' }
          ]
          res.products.forEach((item) => {
            item.topType = '产品名称'
            item.showUnit = false
            item.daily.label = '今日访问'
            item.daily.value = item.daily.clicks_num
            item.daily.unit = '次'
            item.monthly.label = '本月访问'
            item.monthly.value = item.monthly.clicks_num
            item.monthly.unit = '次'
            item.total.label = '总计访问'
            item.total.value = item.total.clicks_num
            item.total.unit = '次'
            item.statistic = [item.daily, item.monthly, item.total]
          })
          this.info = res
        })
      },

      toStatistic(id) {
        // type为1则需要在统计页请求分类列表
        this.$router.push({ name: 'statisticDetail', params: { type: 1, id: id } })
      }
    }
  }
</script>

<style lang="less" scoped>
  @import url('~@/assets/css/custom.less');
  .statistic-wrap {
    min-height: 100%;
    overflow: scroll;
    background-color: @background;
    .statistic-top {
      height: 140px;
      font-size: @fz-11;
      color: white;
      background: url('~@/assets/imgs/back.png') center/cover;
      .value {
        margin-bottom: 8px;
        font-size: @fz-18;
        font-weight: bold;
      }
    }
    .card-wrap {
      margin-top: -20px;
      margin-bottom: 40px;
    }
  }
</style>
