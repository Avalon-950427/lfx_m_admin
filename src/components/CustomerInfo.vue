<template>
  <div class="wrap">
    <div>
      <div class="title bold">{{ info.title }}</div>
      <div class="tip">{{ info.tip }}</div>
      <div v-if="info.fields">
        <Field
          :style="{ height: field.height }"
          v-for="(field, idx) in info.fields"
          :key="idx"
          :info="field"
          @blur="blurHandler"
          @input="inputHandler"
          @click.native="addField(field, info.fields, 0)"
        ></Field>
      </div>
    </div>
    <div v-for="(info, index) in fields" :key="index">
      <div class="title bold">{{ info.title }}</div>
      <div class="tip">{{ info.tip }}</div>
      <div v-if="info.fields">
        <Field
          :style="{ height: field.height }"
          v-for="(field, idx) in info.fields"
          :key="idx"
          :info="field"
          @blur="blurHandler"
          @input="inputHandler"
          @click.native="addField(field, fields, index)"
        ></Field>
      </div>
    </div>
    <!-- <div v-for="(item, index) in info" :key="index">
      <div class="title bold">{{ item.title }}</div>
      <div class="tip">{{ item.tip }}</div>
      <div v-if="item.fields">
        <Field
          :style="{ height: field.height }"
          v-for="(field, idx) in item.fields"
          :key="idx"
          :info="field"
          @blur="blurHandler"
          @click.native="addField(field, item.fields, index)"
        ></Field>
      </div>
    </div> -->
  </div>
</template>

<script>
  import Field from '@/components/commonField/Field.vue'
  import _ from 'lodash'
  export default {
    name: 'CustomerInfo',
    props: {
      info: {
        type: Object
      },
      infos: {
        type: Array
      },
      isDisabled: {
        type: Boolean
      },
      data: {
        type: Object
      },
      borrower: {
        type: Array
      }
    },

    components: {
      Field
    },

    data() {
      return {
        fields: [
          {
            title: '共借信息',
            tip: '请录入真实有效的客户借款信息',
            fields: [
              {
                type: 'text',
                label: '',
                value: '+',
                align: 'center',
                readonly: true,
                'font-size': '25px'
              }
            ]
          }
        ]
      }
    },

    created() {
      if (this.isDisabled) {
        this.data.borrowers.shift()
        this.fields = []
        this.data.borrowers.forEach((item) => {
          this.fields.push({
            title: '共借信息',
            fields: [
              { type: 'text', label: '借款人姓名', readonly: true, placeholder: '请输入借款人姓名', value: item.name, require: true },
              { type: 'text', label: '借款人身份证', readonly: true, placeholder: '请输入借款人身份证', value: item.id_number, require: true },
              {
                type: 'text',
                label: '借款人手机号',
                readonly: true,
                placeholder: '请输入借款人手机号',
                value: item.mobile,
                require: true,
                maxlength: 11
              },
              { type: 'text', label: '借款人邮箱账号', readonly: true, placeholder: '请输入借款人邮箱账号', value: item.email },
              { type: 'text', label: '借款人地址', readonly: true, placeholder: '请输入借款人地址', value: item.address }
            ]
          })
        })
      }
      if (this.borrower) {
        this.fields = this.borrower
      }
    },

    methods: {
      blurHandler() {
        this.$emit('blurHandler')
      },

      inputHandler() {
        let copyFields = JSON.parse(JSON.stringify(this.fields))
        copyFields.pop()
        this.$emit('updateBorrower', copyFields)
        // this.$store.commit('guaranty/changeFields', copyFields)
      },

      // /**
      //  * 点击field文本域的事件
      //  * 如果该field的value是+号,则增加该文本域块,并添加新的value是+号的文本域
      //  * 如果该field的value是-号,则删除该文本域块
      //  * @param {Object} field 该文本域的配置对象
      //  * @param {Array} fields 该文本域的配置对象所在的配置对象数组
      //  * @param {Number} index fields对象在当前active数组中的索引,即在二维数组中的索引
      //  */
      // addField(field, fields, index) {
      //   this.$emit('addField', field, fields, index)
      // }

      /**
       * 点击field文本域的事件
       * 如果该field的value是+号,则增加该文本域块,并添加新的value是+号的文本域
       * 如果该field的value是-号,则删除该文本域块
       * @param {Object} field 该文本域的配置对象
       * @param {Array} fields 该文本域的配置对象所在的配置对象数组
       * @param {Number} index fields对象在当前active数组中的索引,即在二维数组中的索引
       */
      addField: _.debounce(
        function(field, fields, index) {
          if (!field.readonly) return
          if (field.type === 'picker') this.initPicker(field)
          if (field.value === '+') {
            const configs = [
              { type: 'text', label: '借款人姓名', placeholder: '请输入借款人姓名', value: '', require: true },
              { type: 'text', label: '借款人身份证', placeholder: '请输入借款人身份证', value: '', require: true },
              { type: 'text', label: '借款人手机号', placeholder: '请输入借款人手机号', value: '', require: true, maxlength: 11 },
              { type: 'text', label: '借款人邮箱账号', placeholder: '请输入借款人邮箱账号', value: '' },
              { type: 'text', label: '借款人地址', placeholder: '请输入借款人地址', value: '' }
            ]
            // 添加文本域
            field.value = '-'
            fields[index].fields.unshift(...configs)
            let config = {
              title: '共借信息',
              tip: '请录入真实有效的客户借款信息',
              fields: [
                {
                  type: 'text',
                  label: '',
                  value: '+',
                  align: 'center',
                  readonly: true,
                  'font-size': '25px'
                }
              ]
            }
            this.fields.splice(index + 1, 0, config)
          } else if (field.value === '-') {
            // 删除文本域
            field.value = '+'
            fields[index].fields.splice(0, 5)
            if (this.fields.length > 1) {
              this.fields.splice(index, 1)
            }
          }
          let copyFields = JSON.parse(JSON.stringify(this.fields))
          copyFields.pop()
          this.$emit('updateBorrower', copyFields)
          // this.$store.commit('guaranty/changeFields', copyFields)
        },
        500,
        { leading: true, trailing: false }
      )
    }
  }
</script>

<style lang="less" scoped>
  @import url('~@/assets/css/custom.less');
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
</style>
