<template>
  <div>
    <Guide v-if="showGuide"></Guide>
  </div>
</template>

<script>
  import Guide from '@/components/Guide.vue'
  import { isWeixin, get_android_version } from '@/utils/util.js'
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
      console.log('src--brower', this.$route.query.src)
      if (isWeixin()) {
        if (get_android_version() >= 11) {
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
