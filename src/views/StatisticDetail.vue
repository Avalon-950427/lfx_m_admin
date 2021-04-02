<template>
  <div class="statistic-wrap">
    <div class="visual-filter">
      <div class="filter-wrap flex justify-between">
        <van-dropdown-menu active-color="#1989fa">
          <van-dropdown-item v-model="value" :options="option" @change="chooseDropdown" />
        </van-dropdown-menu>
        <div class="time" :class="{ 'active-time': show, 'day-time': startDay, 'no-filter': !filter }" @click="show = !show">
          {{
            filter
              ? startDay
                ? getFilterText(startDay, '', '开始日期') + '至' + getFilterText(endDay, '', '结束日期')
                : getFilterText(startMonth, '', '开始月份') + '至' + getFilterText(endMonth, '', '结束月份')
              : '筛选'
          }}
        </div>
      </div>
      <canvas style="overflow-x: scroll;display: block;margin: auto;" id="container" v-if="data.length"></canvas>
    </div>
    <div class="statistic-list">
      <div class="title flex justify-between">
        <span>访问日期</span>
        <span>{{ type ? '访问次数' : value ? '未完成数量' : '处理次数' }}</span>
      </div>
      <van-list
        v-model="loading"
        loading-text="加载中..."
        :finished="finished"
        :finished-text="statisticData.length ? '没有更多了' : ''"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        :immediate-check="false"
        offset="0"
        @load="getStageData"
      >
        <div v-if="statisticData.length">
          <div class="statistic flex justify-between" v-for="(i, idx) in statisticData" :key="idx">
            <span>{{ i.date }}</span>
            <span>{{ type ? i.clicks_num : value ? i.reject_order_add : i.review_order_add }}</span>
          </div>
        </div>
        <van-empty v-else :image="require('@/assets/imgs/empty.png')">暂无产品</van-empty>
      </van-list>
    </div>
    <van-popup position="bottom" v-model="show" :style="{ height: '100%' }">
      <div class="popup-time bz-bd flex justify-between">
        <span @click="close">关闭</span>
        选择时间
        <span class="confirm" @click="confirm">确定</span>
      </div>
      <div class="choosed-time bz-bd ">
        <div class="time-type flex align-items-center justify-between">
          <van-button round style="height: 30px;width: 110px;color: black;" color="#f6f6f6" @click="chooseDateFilterType">
            {{ buttonOptions.text }}
            <van-icon name="exchange"></van-icon>
          </van-button>
        </div>
        <div>
          <!-- <div class="month-picked align-c" v-if="!buttonOptions.type">{{ tempMonth }}</div> -->
          <div class="month-picked flex justify-around" v-if="!buttonOptions.type">
            <div :class="{ active: activeTime === 'startMonth' }" @click="chooseActiveTime('startMonth')">{{ tempStartMonth || '开始月份' }}</div>
            <span>至</span>
            <div :class="{ active: activeTime === 'endMonth' }" @click="chooseActiveTime('endMonth')">{{ tempEndMonth || '结束月份' }}</div>
          </div>
          <div class="day-picked flex justify-around" v-else>
            <div :class="{ active: activeTime === 'startDay' }" @click="chooseActiveTime('startDay')">{{ tempStartDay || '开始日期' }}</div>
            <span>至</span>
            <div :class="{ active: activeTime === 'endDay' }" @click="chooseActiveTime('endDay')">{{ tempEndDay || '结束日期' }}</div>
          </div>
        </div>
        <van-icon class="flex justify-end" style="margin-bottom: 10px" size="0.3rem" name="delete-o" @click="deleteStatus"></van-icon>
      </div>
      <van-datetime-picker
        @change="dateChange"
        v-model="currentDate"
        :type="buttonOptions.dateType"
        visible-item-count="3"
        :show-toolbar="false"
      ></van-datetime-picker>
    </van-popup>
  </div>
</template>

<script>
  import F2 from '@antv/f2'
  import Pan from '@antv/f2/lib/interaction/pan'
  import api from '@/api/api'
  import { COLORS } from '@/utils/enum.js'
  import { timeParser, addZero } from '@/utils/util.js'
  const FILTER_TYPE = {
    month: {
      text: '按月选择',
      name: 'month',
      type: 0,
      dateType: 'year-month'
    },
    day: {
      text: '按天选择',
      name: 'day',
      type: 1,
      dateType: 'date'
    }
  }
  const ORDER_STATUS = [
    {
      text: '已完成进件',
      value: 0
    },
    {
      text: '未完成进件',
      value: 1
    }
  ]
  const PAGE_SIZE = 12
  const now = new Date()
  let month = now.getFullYear() + '-' + addZero(now.getMonth() + 1)
  export default {
    data() {
      return {
        colors: COLORS,
        type: '',
        page: 0,
        value: 0,
        option: [],
        show: false,
        buttonOptions: FILTER_TYPE.month,
        currentDate: new Date(), // timepicker的value值
        startDay: '',
        tempStartDay: '',
        endDay: '',
        tempEndDay: '',
        startMonth: '',
        tempStartMonth: '',
        endMonth: '',
        tempEndMonth: '',
        data: [], // 制作图标的数据
        statisticData: [], // 总统计数据
        loading: false,
        error: false,
        finished: false,
        activeTime: 'startMonth', // 当前激活的选择时间框,
        filter: false // 请求数据的时候是否启用筛选
      }
    },
    mounted() {
      this.type = this.$route.params.type
      this.id = this.$route.params.id
      // if (this.type) {
      //   new Promise((resolve, reject) => {
      //     this.getStatisticList(resolve, true)
      //   }).then((res) => {
      //     // this.option.unshift({ id: '', title: '全部', text: '全部', value: 0 })
      //     // console.log(this.option)
      //     this.getStageData()
      //   })
      // } else {
      //   this.option = ORDER_STATUS
      //   this.getStageData()
      // }
      this.type ? this.getStatisticList() : (this.option = ORDER_STATUS)
      this.getStageData()
    },

    filters: {},

    methods: {
      getFilterText(data, text1, text2) {
        return data === text1 || data === text2 ? '~' : data
      },

      getStatisticList(resolve) {
        this.$http.get(api.getStatisticList).then((res) => {
          res.products.forEach((item, index) => {
            item.text = item.title
            // if (isTrue) {
            //   item.value = index
            //   if (this.id === item.id) {
            //     this.value = index
            //   }
            // } else {
            item.value = index
            if (this.id === item.id) {
              this.value = index
            }
            // }
          })
          this.option = res.products
          resolve ? resolve() : false
        })
      },

      /**
       * 获取统计数据
       */
      getStageData() {
        let params = {
          type: this.buttonOptions.name,
          from: this.filter
            ? this.activeTime === 'startMonth' || this.activeTime === 'endMonth'
              ? this.startMonth === '开始月份'
                ? ''
                : this.startMonth
              : this.startDay
            : '',
          to: this.filter
            ? this.activeTime === 'startMonth' || this.activeTime === 'endMonth'
              ? this.endMonth === '结束月份'
                ? ''
                : this.endMonth
              : this.endDay
            : '',
          page: ++this.page,
          page_size: PAGE_SIZE
        }
        this.type ? (params.product_id = this.id) : false
        let path = this.type ? api.getStageData : api.getUserStageData
        this.$http
          .get(path, { params: params })
          .then((res) => {
            this.statisticData.push(...res.data)
            if (this.statisticData.length >= res.count) {
              this.finished = true
            }
            res.data.forEach((item, index) => {
              // 循环res.data，修改每一项的date和time
              if (this.activeTime === 'startMonth' || this.activeTime === 'endMonth') {
                // 如果是month，则取出年和月拼接
                item.date = item.date.substr(0, 4) + '-' + item.date.substr(4)
              } else {
                // 如果不是month则是日，那么就丢掉前4位的年，将月和日用-拼接
                item.date = item.date.substr(4)
                item.date = item.date.substr(0, 2) + '-' + item.date.substr(2)
              }
              // if (index % 2 !== 0) {
              //   // 如果index能被2整除，则初始化time，并且依次拼接空格字符串
              //   item.time = ''
              //   for (let i = 0; i < Math.floor(index / 2); i++) {
              //     item.time += ' '
              //   }
              // } else {
              //   item.time = item.date
              // }
            })
            // if (!this.data.length) {
            this.data.push(...res.data)
            this.$nextTick(() => {
              this.data.length ? this.draw() : false
            })
            // }
            this.loading = false
          })
          .catch((e) => {
            this.loading = false
            this.error = true
          })
      },

      draw() {
        let width = 350 * (document.documentElement.clientWidth / 375),
          height = 184 * (document.documentElement.clientHeight / 667)
        const ScrollBar = require('@antv/f2/lib/plugin/scroll-bar')
        // const chart = new F2.Chart({
        //   id: 'container',
        //   width: width,
        //   height: height,
        //   pixelRatio: window.devicePixelRatio
        // })
        // chart.source(this.data, {
        //   sales: {
        //     tickCount: 5
        //   }
        // })

        // chart.tooltip({
        //   showItemMarker: false,
        //   onShow: function onShow(ev) {
        //     const items = ev.items
        //     items[0].name = null
        //     // items[0].name = items[0].title
        //     items[0].name = items[0].date
        //     items[0].value = items[0].value
        //   }
        // })
        // var key
        // this.type ? (key = 'time*clicks_num') : this.value ? (key = 'time*reject_order_add') : (key = 'time*review_order_add')
        // chart.interval().position(key)
        // chart.render()
        const _this = this
        var y
        this.type ? (y = 'clicks_num') : this.value ? (y = 'reject_order_add') : (y = 'review_order_add')
        let key = `date*${y}`
        // console.log('data', this.data)
        F2.Chart.registerInteraction('pan', Pan)
        const originDates = []
        const originSteps = []
        const firstDayArr = []
        let data = []
        this.data.forEach(function(obj, index) {
          let item = {
            date: obj.date,
            steps: obj[y]
          }
          if (index % 12 === 0) {
            item.first = true
          }
          data.push(item)
          if (index < 12) {
            // 首屏的x轴数据和y轴数据
            originDates.push(obj.date)
            originSteps.push(obj[y])
          }
          // if (obj.date >= '2018-05-01') {

          // }

          if (item.first) {
            firstDayArr.push(item)
          }
        })

        const chart = new F2.Chart({
          id: 'container',
          pixelRatio: window.devicePixelRatio,
          width: width,
          height: height,
          plugins: ScrollBar
        })
        // console.log('7777', data, originDates, originSteps)
        chart.source(data, {
          date: {
            type: 'timeCat',
            tickCount: 6, // 一屏上横轴的坐标个数
            values: originDates,
            mask: 'YY-MM'
          },
          steps: {
            tickCount: 5 // y轴分几段
          }
        })

        chart.axis('date', {
          // 日期处指示线的样式
          tickLine: {
            length: 4,
            stroke: '#cacaca'
          },
          label: {
            fill: '#cacaca'
          },
          line: {
            top: true
          }
        })
        chart.axis('steps', {
          // y轴刻度线的样式
          position: 'right',
          label: function label(text) {
            return {
              text: _this.formatNumber(text * 1),
              fill: '#cacaca'
            }
          },

          grid: {
            stroke: '#d1d1d1'
          }
        })
        chart.tooltip({
          // 选中的柱状显示具体数值的样式
          showItemMarker: false,
          background: {
            radius: 2,
            padding: [3, 5]
          },
          onShow: function onShow(ev) {
            const items = ev.items
            items[0].name = ''
            items[0].value = items[0].value
          }
        })
        chart
          .interval()
          .position('date*steps')
          .style({
            radius: [2, 2, 0, 0]
          })

        firstDayArr.forEach(function(obj) {
          chart.guide().line({
            top: false,
            start: [obj.date, 'min'],
            end: [obj.date, 'max'],
            style: {
              lineWidth: 1,
              stroke: '#A4A4A4'
            }
          })
          chart.guide().text({
            position: [obj.date, 'max'],
            content: obj.date,
            style: {
              textAlign: 'start',
              fill: '#cacaca',
              textBaseline: 'top'
            },
            offsetX: 5,
            offsetY: 5
          })
        })
        // 定义进度条
        chart.scrollBar({
          mode: 'x',
          xStyle: {
            backgroundColor: '#e8e8e8',
            fillerColor: '#808080',
            offsetY: -2
          }
        })
        chart.interaction('pan')
        chart.render()
      },

      formatNumber(n) {
        return String(Math.floor(n * 100) / 100).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      },

      /**
       * 选择日期类型
       */
      chooseDateFilterType() {
        if (this.buttonOptions.type) {
          this.buttonOptions = FILTER_TYPE.month
          this.activeTime = 'month'
        } else {
          // 如果buttonOptions.type是0（即按月选择），则buttonOptions设置为按天选择，并且将activeTime设置为startDay
          this.buttonOptions = FILTER_TYPE.day
          this.activeTime = 'startDay'
        }
      },

      /**
       * 重新初始化数据
       */
      resetData() {
        this.data = []
        this.statisticData = []
        this.loading = false
        this.error = false
        this.finished = false
        this.page = 0
      },

      chooseDropdown(e) {
        this.id = this.option[e].id
        this.data = []
        this.statisticData = []
        this.loading = false
        this.error = false
        this.finished = false
        this.page = 0
        this.getStageData()
      },

      dateChange(e) {
        if (this.activeTime === 'startMonth' || this.activeTime === 'endMonth') {
          this[`temp${this.activeTime.slice(0, 1).toUpperCase() + this.activeTime.slice(1)}`] =
            this.currentDate.getFullYear() + '-' + addZero(this.currentDate.getMonth() + 1)
        } else {
          this[`temp${this.activeTime.slice(0, 1).toUpperCase() + this.activeTime.slice(1)}`] = timeParser(this.currentDate)
        }
      },

      chooseActiveTime(mark) {
        this.activeTime = mark
      },

      /**
       * 关闭弹窗，并将弹窗开关设为false，临时日期变量设为空，当前筛选类型选为month
       */
      close() {
        this.tempStartMonth = month
        this.tempEndMonth = month
        this.tempStartDay = ''
        this.tempEndDay = ''
        // this.activeTime = 'month'
        this.show = false
      },

      confirm() {
        this.resetData()
        this.filter = true // 选择日期并确定后启用请求筛选
        if (this.activeTime === 'startMonth' || this.activeTime === 'endMonth') {
          if ((this.tempStartMonth === '开始月份' && this.tempEndMonth === '结束月份') || (this.tempStartMonth === '' && this.tempEndMonth === '')) {
            // 如果tempMonth是选择月份，则说明是在activeTime为month状态下点过删除按钮的
            this.filter = false
          } else {
            this.startMonth = this.tempStartMonth
            this.endMonth = this.tempEndMonth
          }
          this.startDay = ''
          this.endDay = ''
          this.getStageData()
        } else if (this.activeTime === 'startDay' || this.activeTime === 'endDay') {
          if ((this.tempStartDay === '开始日期' && this.tempEndDay === '结束日期') || (this.tempStartDay === '' && this.tempEndDay === '')) {
            // 如果这tempStartDay为开始时间，tempEndDay为结束时间，则说明是在activeTime为day状态下点过删除按钮的
            this.filter = false
          } else {
            this.startDay = this.tempStartDay
            this.endDay = this.tempEndDay
          }
          // this.month = month
          this.getStageData()
        }

        /* 确认后不去重置temp数据
          this.tempMonth = month
          this.tempStartDay = ''
          this.tempEndDay = '' */
        this.show = false
      },

      deleteStatus() {
        this.filter = false
        if (this.activeTime === 'startMonth' || this.activeTime === 'endMonth') {
          // this.month = '选择月份'
          this.tempStartMonth = '开始月份'
          this.tempEndMonth = '结束月份'
          this.startMonth = ''
          this.endMonth = ''
        } else {
          this.tempStartDay = '开始日期'
          this.tempEndDay = '结束日期'
          this.startDay = ''
          this.endDay = ''
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import url('~@/assets/css/custom.less');
  .statistic-wrap {
    // min-height: 100%;
    // height: 100%;
    background: linear-gradient(white 150px, @background 180px);
    .visual-filter {
      background-color: white;
      .filter-wrap {
        padding: 0 14px;
        .time {
          position: relative;
          padding-right: 10px;
          font: bold 12px/44px caption;
        }
        .no-filter {
          font: normal 16px/44px caption;
        }
        .time::after {
          position: absolute;
          top: 50%;
          right: 0;
          content: '';
          width: 0;
          height: 0;
          border: 4px solid @lighter-grey;
          border-bottom-color: transparent;
          border-left-color: transparent;
          border-right-color: transparent;
          transform: translate(0, -50%);
        }
        .active-time::after {
          margin-top: -8px;
          transform: rotate(180deg);
        }
      }
      /deep/ .van-dropdown-menu__bar {
        border-bottom: none;
        .van-ellipsis {
          font: bold 17px caption;
        }
      }
    }
    .statistic-list {
      margin-top: 10px;
      padding: 14px 28px 0;
      font: normal 13px/39px caption;
      background-color: white;
      .title {
        line-height: 28px;
      }
      .statistic {
        border-bottom: 1px solid @line-color;
      }
    }
    .van-popup {
      .popup-time {
        width: 100%;
        padding: 0 10px;
        font: 18px/55px caption;
        background-color: white;
        span {
          font-size: @fz-14;
        }
        .confirm {
          color: @theme-color;
        }
      }
      .choosed-time {
        width: 100%;
        padding: 0 14px;
        font-size: @fz-14;
        background-color: white;
        .time-type {
          margin: 20px auto;
        }
        .van-icon {
          vertical-align: middle;
        }
        .van-button {
          border-color: @lighter-grey !important;
          box-sizing: border-box;
          /deep/ .van-button__content {
            width: 75px;
            span {
              color: black;
            }
          }
        }
        .van-button::before {
          padding: 0;
        }
        .day-picked,
        .month-picked {
          line-height: 45px;
          div {
            width: 150px;
            height: 35px;
            margin: 0 5px;
            text-align: center;
            border-bottom: 1px solid @line-color;
          }
          .active {
            color: @theme-color;
            border-bottom-color: @theme-color;
          }
        }
      }
    }
  }
</style>
