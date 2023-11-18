<template>
  <div class="application-tables">
    <ApplicationTable :applications="documentReceived.content" title="지원 접수"
                      :total-count="documentReceived.totalElements"/>
    <ApplicationTable :applications="documentPassed.content" title="1차 합격" :total-count="documentPassed.totalElements"
                      passFail="합격" :sendEmail="sendDocumentPassEmail"/>
    <ApplicationTable :applications="finalPassed.content" title="최종 합격" :total-count="finalPassed.totalElements"
                      passFail="합격" :sendEmail="sendFinalPassEmail"/>
    <ApplicationTable :applications="documentFailed.content" title="서류 탈락" :total-count="documentFailed.totalElements"
                      passFail="불합격" :sendEmail="sendDocumentFailEmail"/>
    <ApplicationTable :applications="finalFailed.content" title="최종 탈락" :total-count="finalFailed.totalElements"
                      passFail="합격" :sendEmail="sendFinalFailEmail"/>
  </div>

  <div v-if="isLoading" class="loading-container">
    <img src="https://yg-img-storage.s3.ap-northeast-2.amazonaws.com/image/loading.a11988e6.gif" alt="Loading">
  </div>

</template>

<script>
import axios from "axios";
import ApplicationTable from "@/components/application/admin/ApplicationTable.vue";
import Swal from "sweetalert2";

export default {
  components: {
    ApplicationTable
  },

  data() {
    return {
      documentReceived: {content: [], totalElements: 0},
      documentPassed: {content: [], totalElements: 0, passFail: "true"},
      finalPassed: {content: [], totalElements: 0, passFail: "true"},
      documentFailed: {content: [], totalElements: 0, passFail: "false"},
      finalFailed: {content: [], totalElements: 0, passFail: "false"},
      isLoading: false
    }
  },

  async mounted() {
    try {
      const documentReceivedResponse = await axios.get(`${process.env.VUE_APP_API_URL}/admin/forms`);
      this.documentReceived = documentReceivedResponse.data.data;

      const documentPassedResponse = await axios.get(`${process.env.VUE_APP_API_URL}/admin/forms?documentPass=true`);
      this.documentPassed = documentPassedResponse.data.data;

      const finalPassedResponse = await axios.get(`${process.env.VUE_APP_API_URL}/admin/forms?documentPass=true&finalPass=true`);
      this.finalPassed = finalPassedResponse.data.data;

      const documentFailedResponse = await axios.get(`${process.env.VUE_APP_API_URL}/admin/forms?documentPass=false`);
      this.documentFailed = documentFailedResponse.data.data;

      const finalFailedResponse = await axios.get(`${process.env.VUE_APP_API_URL}/admin/forms?finalPass=false&documentPass=true`);
      this.finalFailed = finalFailedResponse.data.data;

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },

  methods: {
    async sendEmail(data) {
      this.isLoading = true;
      try {
        const response = await axios.post(`${process.env.VUE_APP_API_URL}/admin/forms/results`, data);
        await Swal.fire({
          title: response.data.message,
          confirmButtonColor: '#0a3d91',
        });
      } catch (error) {
        await Swal.fire({
          title: error.response.data.message,
          confirmButtonColor: '#0a3d91',
        });
      } finally {
        this.isLoading = false;
      }
    },

    sendDocumentPassEmail() {
      this.sendEmail({
        documentPass: true,
        finalPass: null
      });
    },

    sendFinalPassEmail() {
      this.sendEmail({
        documentPass: true,
        finalPass: true
      });
    },

    sendDocumentFailEmail() {
      this.sendEmail({
        documentPass: false,
        finalPass: null
      });
    },

    sendFinalFailEmail() {
      this.sendEmail({
        documentPass: true,
        finalPass: false
      });
    },
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


.loading-container {
  position: fixed; /* 화면에 고정 */
  top: 0;
  left: 0;
  width: 100%; /* 화면 전체 너비 */
  height: 100%; /* 화면 전체 높이 */
  background-color: rgba(0, 0, 0, 0.5); /* 반투명 회색 배경 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* 다른 요소들 위에 표시 */
}

.loading-image {
  width: 100px; /* 로딩 이미지 크기 조절 */
  height: 100px;
}


</style>