<template>
  <div>
    <van-popup :position="position" v-model="showPopup" @closed="closePopup">
      <van-picker
        :title="field.title"
        v-if="!field.picker"
        :columns="field.column"
        show-toolbar
        @confirm="pickerConfirm"
        @cancel="cancelHandler"
      ></van-picker>
      <van-datetime-picker
        v-else
        :type="field.picker"
        :title="field.label"
        :min-date="new Date(field.minDate)"
        :max-date="new Date(field.maxDate)"
        @confirm="dateConfirm"
        @cancel="cancelHandler"
      ></van-datetime-picker>
    </van-popup>
  </div>
</template>

<script>
  import { timeParser } from '@/utils/util.js'
  export default {
    props: {
      position: {
        type: String,
        default: 'bottom'
      },
      show: {
        type: Boolean,
        default: false
      },
      field: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        showPopup: this.show
      }
    },

    methods: {
      closePopup() {
        this.$emit('close')
      },

      pickerConfirm(value) {
        this.field.value = value
        this.showPopup = false
      },

      dateConfirm(value) {
        this.field.value = timeParser(value)
        this.showPopup = false
      },

      cancelHandler() {
        this.showPopup = false
      }
    }
  }
</script>

<style lang="less" scoped></style>
