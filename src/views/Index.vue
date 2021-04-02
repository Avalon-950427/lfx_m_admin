<template>
  <div class="wrap">
    <div class="top-card-wrap" v-if="userInfo">
      <div class="user-info-wrap flex">
        <r-uploader class="id-img" :attrs="makeAvatarUploadProps()" prefix="/mapi" @change="onUploadChange($event, 1)"></r-uploader>
        <div class="user-info grow-1 flex-column justify-evenly">
          <div class="user-name">{{ userInfo.nickname }}</div>
          <div class="tel">
            <span>TEL</span>
            {{ userInfo.mobile }}
          </div>
        </div>
        <div style="padding: 0 10px 10px" @click="toSetting">
          <van-image class="shrink-0 setting-img" :src="require('@/assets/imgs/setting.png')"></van-image>
        </div>
      </div>
      <div class="company-info-wrap flex">
        <div class="company-info justify-between flex grow-1">
          <div v-for="(item, index) in company" :key="index">
            <div>{{ item.name }}</div>
            <div class="value">{{ item.value }}</div>
          </div>
        </div>
        <van-image class="shrink-0" fit="contain" :src="userInfo.company_logo || require('@/assets/imgs/company.png')"></van-image>
      </div>
    </div>
    <StatisticsCard :info="orderStatistics" @topHandler="topHandler(0)" @bottomHandler="bottomHandler(0)"></StatisticsCard>
    <StatisticsCard :info="productStatistics" @topHandler="topHandler(1)" @bottomHandler="bottomHandler(1)"></StatisticsCard>
  </div>
</template>

<script>
  import StatisticsCard from '@/components/StatisticsCard.vue'
  import api from '@/api/api'
  import { getApiPrefix, getApiPath } from '@/utils/util.js'
  export default {
    data() {
      return {
        userInfo: null,
        productStatistics: null,
        orderStatistics: null,
        company: []
      }
    },

    components: {
      StatisticsCard
    },

    created() {
      this.getIndex()
    },

    methods: {
      makeAvatarUploadProps(type) {
        return {
          isQiniu: true,
          autoUpload: true,
          max: 1,
          iconVisible: false,
          textVisible: false,
          compress: {
            maxWidth: 800,
            // maxHeight: 800,
            quality: 0.8,
            autoZoomin: false,
            autoCrop: true
          },
          itemStyle: {
            width: 70,
            height: 70
          },
          uploadStyle: {
            bgImage: this.userInfo.avatar || require('@/assets/imgs/avatar.png')
          }
        }
      },

      getIndex() {
        this.$http.get(api.getIndex).then((res) => {
          this.userInfo = res.userInfo
          res.productStatistics = this.setProductStatistics(res.productStatistics)
          this.productStatistics = res.productStatistics
          res.orderStatistics = this.setOrderStatistics(res.orderStatistics)
          this.orderStatistics = res.orderStatistics
          this.company.push(
            { name: '企业', value: res.userInfo.company ? res.userInfo.company : '暂无企业' },
            { name: '职位', value: res.userInfo.job ? res.userInfo.job : '暂无职位' },
            { name: '区域', value: res.userInfo.work_area ? res.userInfo.work_area : '暂无区域' }
          )
        })
      },

      setProductStatistics(productStatistics) {
        productStatistics.topType = '产品数量'
        productStatistics.logo = productStatistics.icon
        productStatistics.title = productStatistics.productTotalCount
        productStatistics.showUnit = true
        productStatistics.unit = '个'
        productStatistics.statistic = [
          { label: '今日访问', value: productStatistics.clicksDaily, unit: '次' },
          { label: '本月访问', value: productStatistics.clicksMonthly, unit: '次' },
          { label: '总计访问', value: productStatistics.clicksTotal, unit: '次' }
        ]
        return productStatistics
      },

      setOrderStatistics(orderStatistics) {
        orderStatistics.topType = '待处理进件'
        orderStatistics.logo = orderStatistics.icon
        orderStatistics.title = orderStatistics.pendingOrderCount
        orderStatistics.showUnit = true
        orderStatistics.unit = '笔'
        orderStatistics.statistic = [
          { label: '今日处理', value: orderStatistics.daily, unit: '笔' },
          { label: '本月处理', value: orderStatistics.monthly, unit: '笔' },
          { label: '总计处理', value: orderStatistics.total, unit: '笔' }
        ]
        return orderStatistics
      },

      /**
       * 选择图片后的回调事件
       */
      onUploadChange({ fileList, uploader }, e) {
        if (!fileList || !fileList.length || !fileList[0].url) {
          return
        } else {
          const params = {
            url: fileList[0].url
          }
          let prefix = getApiPrefix(api.modifyAvatar),
            path = getApiPath(api.modifyAvatar)
          this.$axios(prefix)
            .post(path, params)
            .then((res) => {
              this.userInfo.avatar = res.avatar
              document.getElementsByClassName('van-uploader__preview-delete')[0].click()
            })
        }
      },

      toSetting() {
        this.$router.push('/user/setting')
      },

      topHandler(type) {
        if (type) {
          this.$router.push('/user/statistic/list')
        } else {
          // this.$router.push('/order/list')
          // let token = this.$http.cookies.get('token'),
          //   uuid = this.$http.cookies.get('uuid')
          // console.log('uid', uuid)
          // window.location.search = token
          // console.log(window.location.search)
          this.$router.push({ name: 'orderlist' })
        }
      },

      bottomHandler(type) {
        this.$router.push({ name: 'statisticDetail', params: { type: type } })
      }
    }
  }
</script>

<style lang="less" scoped>
  @import url('~@/assets/css/custom.less');
  .wrap {
    min-height: 100%;
    background: linear-gradient(to bottom, white 150px, @background 180px);
    .top-card-wrap {
      padding-top: 1px;
      background-color: white;
      .user-info-wrap {
        margin: 10px 19px 20px 14px;
        .van-image {
          width: 25px;
          height: 25px;
        }
        .id-img {
          padding: 0;
          width: 70px;
          height: 70px;
          /deep/ .van-cell__value {
            width: 100%;
            height: 100%;
            .van-uploader {
              width: 100%;
            }
          }
          /deep/ .van-uploader__upload {
            width: 100%;
            height: 70px !important;
            margin: 0 !important;
            border: 0;
            background-size: cover !important;
            background-position: center;
            background-repeat: no-repeat;
            border-radius: 50%;
          }
          /deep/ .van-icon {
            position: absolute;
            top: 10px;
            right: 10px;
            background: transparent;
          }
        }
        /deep/ .van-cell::after {
          border-bottom: none;
        }
        .setting-img {
          margin-top: 5px;
        }
        .user-info {
          margin-left: 15px;
          font-size: @fz-18;
          .tel {
            vertical-align: middle;
            font-size: @fz-14;
            color: @text-grey;
            span {
              display: inline-block;
              width: 32px;
              height: 14px;
              margin-right: 6px;
              line-height: 14px;
              text-align: center;
              font-size: @fz-12;
              color: white;
              background-color: @dark-grey;
              border-radius: 2.5px;
            }
          }
        }
      }
      .company-info-wrap {
        margin: 0 18px;
        .company-info {
          margin-right: 15px;
          font-size: @fz-15;
          color: @dark-grey;
          .value {
            margin-top: 6px;
            font-size: @fz-12;
            color: @text-grey;
          }
        }
        .van-image {
          width: 100px;
          height: 40px;
        }
      }
    }
  }
</style>
