<template>
  <div>
    <MainInfo></MainInfo>
    <ClubIntroduction></ClubIntroduction>
    <ClubActivityIntroduction></ClubActivityIntroduction>
  </div>
</template>

<script>
import MainInfo from './MainInfo.vue'
import ClubIntroduction from './ClubIntroduction.vue'
import ClubActivityIntroduction from './ClubActivityIntroduction.vue'

export default {

  components: {
    MainInfo,
    ClubIntroduction,
    ClubActivityIntroduction,
  }

}

</script>

<style lang="scss" scoped>

</style>