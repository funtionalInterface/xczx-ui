<template>
  <div class="Switcher" >
    <el-button style="left: 10px" size="small" type="primary" class="switchBtn" @click="toggleLive">
      返回
    </el-button>
  </div>
</template>

<script>
  export default {
    computed: {
      isLive() {
        return this.$route.name === 'live'
      }
    },
    methods: {
      toggleLive () {
        if(this.isLive) {
          this.$router.push('/playback')
        } else {
          this.$router.push('/media_list')
        }
      }
    }
  }
</script>

<style scoped>
  .switchBtn {
    text-align: center;
    position: absolute;
    right: 0px;
    top: 10px;
  }
</style>
