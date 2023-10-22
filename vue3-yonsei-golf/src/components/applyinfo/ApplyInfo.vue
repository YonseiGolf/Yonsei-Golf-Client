<template>
  <div>
    <ApplyQualification></ApplyQualification>
    <br>
    <ApplyPeriod></ApplyPeriod>
    <br>
    <QnA></QnA>
  </div>
</template>

<script>
import ApplyQualification from "@/components/applyinfo/ApplyQualification.vue";
import ApplyPeriod from "@/components/applyinfo/ApplyPeriod.vue";
import QnA from "@/components/qna/QnA.vue";

export default {

  components: {
    QnA,
    ApplyPeriod,
    ApplyQualification
  }

}
</script>

<style lang="scss" scoped>

</style>