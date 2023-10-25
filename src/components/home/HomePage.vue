<template>
  <div>
    <MainInfo></MainInfo>
    <ClubIntroduction></ClubIntroduction>
    <ClubActivityIntroduction></ClubActivityIntroduction>
    <ContactInfo></ContactInfo>
  </div>
</template>

<script>
import MainInfo from './MainInfo.vue'
import ClubIntroduction from './ClubIntroduction.vue'
import ClubActivityIntroduction from './ClubActivityIntroduction.vue'
import ContactInfo from "./ContactInfo.vue";

export default {

  components: {
    MainInfo,
    ClubIntroduction,
    ClubActivityIntroduction,
    ContactInfo,
  }

}

</script>

<style lang="scss" scoped>

</style>