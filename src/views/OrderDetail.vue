<template>
  <div class="wrap">
    <div v-for="(info, i) in infos" :key="i">
      <div v-if="Array.isArray(info)">
        <div v-for="(item, index) in info" :key="index">
          <CustomerInfo v-if="item.type === 'customInfo'" :info="item" :infos="infos" :isDisabled="true" :data="data"></CustomerInfo>
          <div v-else>
            <div class="title bold">{{ item.title }}</div>
            <div class="tip">{{ item.tip }}</div>
            <div v-if="item.fields">
              <Field
                :style="{ height: field.height }"
                v-for="(field, idx) in item.fields"
                :key="idx"
                :info="field"
                :data="data"
                :isDisabled="true"
              ></Field>
            </div>
            <RepaymentPlan v-else-if="item.type === 'collapse'" :plan="item.plan" :accordion="item.accordion"></RepaymentPlan>
            <div v-else>
              <r-uploader
                class="uploader"
                v-model="item.value"
                :folder="item.folder"
                :attrs="makeIDUploadProps(item)"
                :type="item.format"
                @success="onUploadChange($event, index)"
              ></r-uploader>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="title bold" v-if="info.title">{{ info.title }}</div>
        <div class="tip">{{ info.tip }}</div>
        <div v-if="info.type === 'text'">
          <Field :info="item" v-for="(item, index) in info.fields" :data="data" :isDisabled="true" :key="index"></Field>
        </div>
        <div v-else>
          <div v-if="info.children">
            <van-radio-group v-model="info.value" direction="horizontal" disabled>
              <van-radio name="0">未婚</van-radio>
              <van-radio name="1">已婚</van-radio>
              <van-radio name="2">离婚</van-radio>
            </van-radio-group>
          </div>
          <r-uploader
            v-else
            class="uploader"
            v-model="info.value"
            :attrs="makeIDUploadProps(i)"
            :folder="info.folder"
            :type="info.format"
            @success="onUploadChange($event, i)"
          ></r-uploader>
        </div>
      </div>
    </div>
    <div v-if="infos" class="btns flex justify-between">
      <van-button plain :color="colors.theme" @click="downloadEmail">下载到邮箱</van-button>
      <van-button :color="colors.theme" @click="download">下载到本地</van-button>
    </div>
    <van-overlay :show="show">
      <van-loading type="spinner" size="24px">请稍后...</van-loading>
    </van-overlay>
  </div>
</template>

<script>
  import api from '@/api/api'
  import _ from 'lodash'
  import Field from '@/components/commonField/Field'
  import RepaymentPlan from '@/components/RepaymentPlan'
  import CustomerInfo from '@/components/CustomerInfo.vue'
  import { COLORS } from '@/utils/enum.js'
  import { download } from '@/utils/util.js'
  export default {
    data() {
      return {
        options: null,
        infos: null,
        data: null,
        colors: COLORS,
        show: false
      }
    },
    created() {
      this.getDetail()
    },

    components: {
      Field,
      RepaymentPlan,
      CustomerInfo
    },

    methods: {
      getDetail() {
        let params = {
          sn: this.$route.params.sn
        }
        this.$http.get(api.getOrderDetail, { params: params }).then((res) => {
          if (res.data.business_license) {
            let field = res.configs.fields.find((item) => item.type === 'radio'),
              index = res.configs.fields.findIndex((item) => item.type === 'radio')
            if (res.data.divorce_cert) {
              // 离婚
              field.value = '2'
            } else if (res.data.marriage_cert) {
              // 结婚
              field.value = '1'
            } else {
              // 未婚
              field.value = '0'
            }
            res.configs.fields.splice(index + 1, 0, ...field.children[field.value])
          }
          res.configs.fields &&
            res.configs.fields.forEach((item, index) => {
              if (Array.isArray(item)) {
                item.forEach((i) => {
                  i.tip = ''
                  if (i.fields) {
                    if (i.name === 'borrowers') {
                      i.fields.forEach((j) => {
                        j.placeholder = ''
                        j.readonly = true
                        j.value = res.data[i.name][0][j.name] // 获取客户信息那里的数据
                      })
                    } else {
                      i.fields.forEach((j) => {
                        j.placeholder = ''
                        j.readonly = true
                        j.value ? (j.value = res.data[j.name]) : false
                      })
                    }
                  } else {
                    i.placeholder = ''
                    i.readonly = true
                    if (i.plan) {
                      let rate = this.computeRate(res.data)
                      res.data[i.name].forEach((j) => {
                        j.monthInterest = j.repay_interest
                        j.principal = j.repay_amount
                        j.refundDay = j.repay_date
                        j.readonly = true
                      })
                    }
                    i.plan ? (i.plan = res.data[i.name]) : false
                    i.value ? (i.value = res.data[i.name]) : false
                  }
                })
              } else {
                item.tip = ''
                if (item.fields) {
                  item.fields.forEach((i) => {
                    i.readonly = true
                    // i.value = res.data[i.name]
                  })
                } else {
                  if (item.type !== 'radio') item.value = res.data[item.name]
                }
              }
            })
          this.infos = res.configs.fields
          this.options = res.configs.options
          this.data = res.data
        })
      },

      /**
       * 计算月利率的函数
       * @param {Object} productInfo 产品详情
       * @return {Number} rate 月利率
       */
      computeRate(productInfo) {
        return productInfo.rate_type === '日'
          ? productInfo.interest_rate * 30
          : productInfo.interest_rate_type === '月'
          ? productInfo.interest_rate
          : productInfo.interest_rate / 12
      },

      makeIDUploadProps(item) {
        return {
          isQiniu: true,
          disabled: true,
          oldDisabled: true,
          autoUpload: true,
          // max: 1,
          iconVisible: true,
          textVisible: false,
          compress: {
            maxWidth: 800,
            quality: 0.8,
            autoZoomin: false,
            autoCrop: true
          },
          itemStyle: {
            width: 100,
            height: 75
          }
        }
      },

      download: _.debounce(
        function() {
          download(this.$route.params.sn, this)
        },
        1000,
        { leading: true, trailing: false }
      ),

      downloadEmail: _.debounce(
        function() {
          let params = {
            sn: this.$route.params.sn
          }
          this.show = true
          this.$http
            .get(api.downloadEmail, { params: params })
            .then((res) => {
              console.log(res)
              this.show = false
            })
            .catch((e) => {
              this.show = false
            })
        },
        1000,
        { leading: true, trailing: false }
      )
    }
  }
</script>

<style lang="less" scoped>
  @import url('~@/assets/css/custom.less');
  .wrap {
    padding-top: 1px;
    background-color: @background;
    .uploader {
      padding-bottom: 0;
      background-color: transparent;
      /deep/ .van-uploader__upload {
        margin: 0 !important;
        border: 0;
        background-color: white;
      }
      /deep/ .van-icon-clear {
        position: absolute;
        top: 5px;
        right: 5px;
        background: transparent;
      }
      /deep/ .van-icon-plus {
        font-size: 25px;
      }
    }

    .title {
      margin-top: 30px;
      margin-left: 15px;
      font-size: @fz-15;
    }

    .tip {
      margin: 8px 0 0 15px;
      font-size: @fz-14;
      color: @tip-back;
    }

    .van-radio-group {
      margin: 8px 0 0 15px;
      font-size: @fz-14;
    }

    .btns {
      padding: 10px 16px;
      .van-button {
        width: 46%;
      }
    }

    .van-overlay {
      z-index: 9999 !important;
      .van-loading {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
</style>
