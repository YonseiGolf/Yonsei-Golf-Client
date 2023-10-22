<template>
  <div>
    <NotApplyTerm></NotApplyTerm>
    <ApplyTerm></ApplyTerm>
    <QnA></QnA>
  </div>
</template>

<script>
import NotApplyTerm from "@/components/application/NotApplyTerm.vue";
import ApplyTerm from "@/components/application/ApplyTerm.vue";
import QnA from "@/components/qna/QnA.vue";
export default {

  components: {
    ApplyTerm,
    NotApplyTerm,
    QnA,
  },
}
</script>

<style lang="scss" scoped>

</style>