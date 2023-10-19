<template>
  <div>
    <ApplyQualification></ApplyQualification>
    <br>
    <ApplyPeriod></ApplyPeriod>
  </div>
</template>

<script>
import ApplyQualification from "@/components/applyinfo/ApplyQualification.vue";
import ApplyPeriod from "@/components/applyinfo/ApplyPeriod.vue";

export default {

  components: {
    ApplyPeriod,
    ApplyQualification
  }

}
</script>

<style lang="scss" scoped>

</style>