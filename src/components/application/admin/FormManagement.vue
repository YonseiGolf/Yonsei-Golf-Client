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
      documentReceived: [], // 서류 접수 데이터
      documentPassed: [],   // 서류 합격 데이터
      finalPassed: [],      // 최종 합격 데이터
      documentFailed: [],    // 서류 탈락 데이터
      finalFailed: []        // 최종 탈락 데이터
    }
  },

  async mounted() {
    try {
      const documentReceivedResponse = await axios.get('http://localhost:8080/admin/forms');
      this.documentReceived = documentReceivedResponse.data.data;

      const documentPassedResponse = await axios.get('http://localhost:8080/admin/forms?documentPass=true');
      this.documentPassed = documentPassedResponse.data.data;

      const finalPassedResponse = await axios.get('http://localhost:8080/admin/forms?finalPass=true');
      this.finalPassed = finalPassedResponse.data.data;

      const documentFailedResponse = await axios.get('http://localhost:8080/admin/forms?documentPass=false');
      this.documentFailed = documentFailedResponse.data.data;

      const finalFailedResponse = await axios.get('http://localhost:8080/admin/forms?finalPass=false');
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
  grid-template-columns: repeat(3, 1fr); // 오타 수정
  //gap: 2vh;
  margin-bottom: 1vh;

  & > * {
    margin-left: auto;
    margin-right: auto;
    max-width: 80%;  // 이 값을 조절하여 원하는 너비로 설정하실 수 있습니다.
  }

  @media (max-width: 1024px) {
    grid-template-columns: 1fr; // 모바일 화면에서는 한 컬럼으로 보여줌
  }
}
</style>