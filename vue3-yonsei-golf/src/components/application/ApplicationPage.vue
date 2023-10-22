<template>
  <div>
    <ApplyTerm v-if="applicationAvailable"></ApplyTerm>
    <NotApplyTerm v-else></NotApplyTerm>
    <QnA></QnA>
  </div>
</template>

<script>
import NotApplyTerm from "@/components/application/NotApplyTerm.vue";
import ApplyTerm from "@/components/application/ApplyTerm.vue";
import QnA from "@/components/qna/QnA.vue";
import axios from "axios";
export default {

  data() {
    return {
      applicationAvailable: false,
    }
  },

  components: {
    ApplyTerm,
    NotApplyTerm,
    QnA,
  },

  async mounted() {
    try {
      const response = await axios.get(`${process.env.VUE_APP_LOCAL_API_URL}/application/availability`);

      if (response.status === 200) {
        this.applicationAvailable = response.data.data;
      }
    }catch (error){
      console.error('API 호출 중 오류 발생:', error);
    }
  }
}
</script>

<style lang="scss" scoped>

</style>