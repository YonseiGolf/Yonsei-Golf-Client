<template>
  <div class="application-tables">
    <ApplicationTable :applications="documentReceived.content" title="지원 접수" :total-count="documentReceived.totalElements"/>
    <ApplicationTable :applications="documentPassed.content" title="1차 합격" :total-count="documentPassed.totalElements"/>
    <ApplicationTable :applications="finalPassed.content" title="최종 합격" :total-count="finalPassed.totalElements"/>
    <ApplicationTable :applications="documentFailed.content" title="서류 탈락" :total-count="documentFailed.totalElements"/>
    <ApplicationTable :applications="finalFailed.content" title="최종 탈락" :total-count="finalFailed.totalElements"/>
  </div>
</template>

<script>
import axios from "axios";
import ApplicationTable from "@/components/application/admin/ApplicationTable.vue";

export default {
  components: {
    ApplicationTable
  },

  data() {
    return {
      documentReceived: [],
      documentPassed: [],
      finalPassed: [],
      documentFailed: [],
      finalFailed: []
    }
  },

  async mounted() {
    try {
      const documentReceivedResponse = await axios.get(`${process.env.VUE_APP_API_URL}/admin/forms`);
      this.documentReceived = documentReceivedResponse.data.data;

      const documentPassedResponse = await axios.get(`${process.env.VUE_APP_API_URL}/admin/forms?documentPass=true`);
      this.documentPassed = documentPassedResponse.data.data;

      const finalPassedResponse = await axios.get(`${process.env.VUE_APP_API_URL}/admin/forms?finalPass=true`);
      this.finalPassed = finalPassedResponse.data.data;

      const documentFailedResponse = await axios.get(`${process.env.VUE_APP_API_URL}/admin/forms?documentPass=false`);
      this.documentFailed = documentFailedResponse.data.data;

      const finalFailedResponse = await axios.get(`${process.env.VUE_APP_API_URL}/admin/forms?finalPass=false`);
      this.finalFailed = finalFailedResponse.data.data;

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
}
</script>


<style lang="scss" scoped>
.application-tables {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin-bottom: 1vh;

  & > * {
    margin-left: auto;
    margin-right: auto;
    max-width: 80%;
  }

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
}
</style>