<template>
  <div>
    <!-- 헤더 부분에 기수 필터 추가 -->
    <div class="header-section">
      <h2>지원서 관리</h2>
      <div class="filter-section">
        <label for="semester-select">지원 기수:</label>
        <select id="semester-select" v-model="selectedSemester" @change="fetchApplicationsByFilter">
<!--          <option value="">전체</option>-->
          <option v-for="semester in availableSemesters" :key="semester" :value="semester">
            {{ semester }}기
          </option>
        </select>
      </div>
    </div>

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
      isLoading: false,
      selectedSemester: 1, // 선택된 기수
      availableSemesters: [] // 사용 가능한 기수 목록
    }
  },

  async mounted() {
    await this.fetchAvailableSemesters();
    await this.fetchApplicationsByFilter();
  },

  methods: {
    // 사용 가능한 기수 목록을 가져오는 메서드
    async fetchAvailableSemesters() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/admin/recruits`, {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
          }
        });
        if (response.status === 200 && response.data.data) {
          // semester 값들을 추출하여 정렬 (최신 기수가 먼저)
          this.availableSemesters = response.data.data
            .map(recruit => recruit.semester)
            .sort((a, b) => b - a);

          // 첫 번째 기수를 기본 선택값으로 설정
          if (this.availableSemesters.length > 0) {
            this.selectedSemester = this.availableSemesters[0];
          }
        }
      } catch (error) {
        console.error('기수 목록 조회 실패:', error);
        this.availableSemesters = [];
      }
    },

    // 필터에 따라 지원서 목록을 가져오는 메서드
    async fetchApplicationsByFilter() {
      try {
        const semesterParam = this.selectedSemester ? `&semester=${this.selectedSemester}` : '';

        const documentReceivedResponse = await axios.get(`${process.env.VUE_APP_API_URL}/admin/forms?${semesterParam}`, {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
          }
        });
        this.documentReceived = documentReceivedResponse.data.data;

        const documentPassedResponse = await axios.get(`${process.env.VUE_APP_API_URL}/admin/forms?documentPass=true${semesterParam}`, {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
          }
        });
        this.documentPassed = documentPassedResponse.data.data;

        const finalPassedResponse = await axios.get(`${process.env.VUE_APP_API_URL}/admin/forms?documentPass=true&finalPass=true${semesterParam}`, {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
          }
        });
        this.finalPassed = finalPassedResponse.data.data;

        const documentFailedResponse = await axios.get(`${process.env.VUE_APP_API_URL}/admin/forms?documentPass=false${semesterParam}`, {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
          }
        });
        this.documentFailed = documentFailedResponse.data.data;

        const finalFailedResponse = await axios.get(`${process.env.VUE_APP_API_URL}/admin/forms?finalPass=false&documentPass=true${semesterParam}`, {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
          }
        });
        this.finalFailed = finalFailedResponse.data.data;

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },

    async sendEmail(data) {
      // 확인 팝업
      const result = await Swal.fire({
        title: '메일을 발송하시겠습니까?',
        text: '선택된 지원자들에게 결과 메일이 발송됩니다.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#08366f',
        cancelButtonColor: '#d33',
        confirmButtonText: '발송',
        cancelButtonText: '취소'
      });

      if (!result.isConfirmed) {
        return;
      }

      this.isLoading = true;
      try {
        // 선택된 기수 정보도 함께 전송
        const emailData = {
          ...data,
          semester: this.selectedSemester || null
        };

        const response = await axios.post(`${process.env.VUE_APP_API_URL}/admin/forms/results`, emailData, {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
          }
        });
        await Swal.fire({
          title: response.data.message,
          confirmButtonColor: '#08366f',
        });
      } catch (error) {
        await Swal.fire({
          title: error.response.data.message,
          confirmButtonColor: '#08366f',
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
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 20px;

  h2 {
    margin: 0;
    color: #333;
  }

  .filter-section {
    display: flex;
    align-items: center;
    gap: 10px;

    label {
      font-weight: bold;
      color: #555;
    }

    select {
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background-color: white;
      font-size: 14px;
      cursor: pointer;

      &:focus {
        outline: none;
        border-color: #08366f;
        box-shadow: 0 0 0 2px rgba(8, 54, 111, 0.1);
      }
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
}

.application-tables {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
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
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-image {
  width: 100px;
  height: 100px;
}
</style>