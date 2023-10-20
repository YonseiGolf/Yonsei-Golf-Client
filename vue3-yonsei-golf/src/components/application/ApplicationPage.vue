<template>
  <div>
    <NotApplyTerm></NotApplyTerm>
    <ApplyTerm></ApplyTerm>
  </div>
</template>

<script>
import NotApplyTerm from "@/components/application/NotApplyTerm.vue";
import ApplyTerm from "@/components/application/ApplyTerm.vue";
export default {

  components: {
    ApplyTerm,
    NotApplyTerm
  },
}
</script>

<style lang="scss" scoped>

</style>