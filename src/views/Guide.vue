<template>
  <div>
    <Guide v-if="showGuide"></Guide>
  </div>
</template>

<script>
  import Guide from '@/components/Guide.vue'
  import { isWeixin, get_android_version, isIos } from '@/utils/util.js'
  export default {
    components: {
      Guide
    },

    data() {
      return {
        showGuide: false
      }
    },

    created() {
      if (isWeixin()) {
        if (!isIos()) {
          this.showGuide = true
        }
      } else {
        this.createA(this.$route.query.src)
      }
    },

    methods: {
      createA(src) {
        let oA = document.createElement('a')
        oA.href = src
        oA.click()
      }
    }
  }
</script>

<style lang="less" scoped></style>
