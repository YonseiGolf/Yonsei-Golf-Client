<template>
  <div>
    <MainInfo></MainInfo>
    <ClubIntroduction></ClubIntroduction>
  </div>
</template>

<script>
import MainInfo from './MainInfo.vue'
import ClubIntroduction from "@/components/home/ClubIntroduction.vue";

export default {

  components: {
    MainInfo,
    ClubIntroduction,
  }

}

</script>

<style lang="scss" scoped>

</style>