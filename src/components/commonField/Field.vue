<template>
  <div class="field-wrap">
    <van-field
      v-if="isDisabled"
      ref="field"
      class="text-field"
      :style="{ 'font-size': info['font-size'], height: info['height'] }"
      label-width="2.5rem"
      center
      autosize
      :maxlength="info.maxlength"
      :input-align="info.align || 'right'"
      :readonly="info.readonly"
      :type="info.type"
      :placeholder="info.placeholder"
      :label="info.label"
      v-model="data[info.name]"
      @blur="blurHandler"
      @input="inputHandler"
    >
      <template #button>
        <van-button v-if="info.button" size="small" @click="emitButtonHandler">
          {{ info.button }}
        </van-button>
      </template>
    </van-field>
    <van-field
      v-else
      ref="field"
      class="text-field"
      :style="{ 'font-size': info['font-size'], height: info['height'] }"
      label-width="2.5rem"
      center
      autosize
      :maxlength="info.maxlength"
      :input-align="info.align || 'right'"
      :readonly="info.readonly"
      :type="info.type"
      :placeholder="info.placeholder"
      :label="info.label"
      v-model="info.value"
      @blur="blurHandler"
      @input="inputHandler"
    >
      <template #button>
        <van-button v-if="info.button" size="small" @click="emitButtonHandler">
          {{ info.button }}
        </van-button>
      </template>
    </van-field>
  </div>
</template>

<script>
  import { phoneValidator, timeParser } from '@/utils/util.js'
  export default {
    props: {
      info: {
        type: Object,
        require: true,
        default() {
          return {}
        }
      },
      isDisabled: {
        type: Boolean,
        default: false
      },
      data: {
        type: Object
      }
    },

    data() {
      return {
        canSend: false,
        value: ''
      }
    },

    created() {
      // if (this.info.value instanceof Date) {
      //   this.value = timeParser(this.info.timer)
      // } else {
      //   this.value = this.info.value
      // }
    },

    methods: {
      phoneValidator,

      blurHandler() {
        this.$emit('blur')
      },

      emitButtonHandler() {
        this.$emit('buttonHandler')
      },

      inputHandler() {
        this.$emit('input')
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '~@/assets/css/custom.less';
  .text-field {
    width: 347px;
    height: 49px;
    margin: 10px auto 0;
    font-size: @fz-14;
    border-radius: 10px;
    /deep/ .van-cell__value {
      height: 100%;
    }
  }
</style>
