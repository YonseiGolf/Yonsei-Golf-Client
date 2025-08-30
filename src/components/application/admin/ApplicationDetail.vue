<template>
  <div class="section-spacer"></div>
  <div class="form-header">
    <h1>연세 골프 지원서</h1>
  </div>

  <div class="default_info">
    <div class="section-title">지원자 정보</div>

    <div class="photo-upload-section">
      <div class="photo-container">
        <div class="photo-display">
          <img class="apply-photo" :src="applications.photo" alt="지원자 사진"/>
        </div>
      </div>
    </div>

    <div class="info-field">
      <label>이름</label>
      <div class="field-value">{{ applications.name }}</div>
    </div>

    <div class="info-field">
      <label>이메일</label>
      <div class="field-value">{{ applications.email }}</div>
    </div>

    <div class="info-field">
      <label>전화번호</label>
      <div class="field-value">{{ applications.phoneNumber }}</div>
    </div>

    <div class="info-field">
      <label>학번</label>
      <div class="field-value">{{ applications.studentId }}</div>
    </div>

    <div class="info-field">
      <label>전공</label>
      <div class="field-value">{{ applications.major }}</div>
    </div>

    <div class="info-field">
      <label>생년월일</label>
      <div class="field-value">{{ applications.birthDate }}</div>
    </div>

<!--    <div class="info-field">-->
<!--      <label>구력</label>-->
<!--      <div class="field-value">{{ applications.golfDuration }} 년</div>-->
<!--    </div>-->

<!--    <div class="info-field">-->
<!--      <label>라운딩 횟수</label>-->
<!--      <div class="field-value">{{ applications.roundCount }} 회</div>-->
<!--    </div>-->

<!--    <div class="info-field">-->
<!--      <label>레슨 여부</label>-->
<!--      <div class="field-value">{{ applications.lessonStatus ? '레슨중' : '레슨x' }}</div>-->
<!--    </div>-->

<!--    <div class="info-field">-->
<!--      <label>본인 클럽 소유 여부</label>-->
<!--      <div class="field-value">{{ applications.clubStatus ? '보유' : '미보유' }}</div>-->
<!--    </div>-->

    <div class="section-spacer"></div>

    <div class="info-field">
      <label>간략하게 자기소개 부탁드립니다. (군대 계획이나 교환학생 계획이 있다면 적어주세요)</label>
      <div class="field-value textarea-value" v-html="formatContent(applications.selfIntroduction)"></div>
    </div>

    <div class="info-field">
      <label>연세 골프에 지원하게 된 동기를 작성해주세요</label>
      <div class="field-value textarea-value" v-html="formatContent(applications.applyReason)"></div>
    </div>

    <div class="info-field">
      <label>현재 본인의 골프 실력을 객관적으로 평가해주세요.</label>
      <div class="field-value textarea-value" v-html="formatContent(applications.skillEvaluation)"></div>
    </div>

    <div class="info-field">
      <label>골프와 관련된 추억이 있으시다면 말씀해주세요</label>
      <div class="field-value textarea-value" v-html="formatContent(applications.golfMemory)"></div>
    </div>

    <div class="info-field">
      <label>현재 활동하는 다른 동아리나 학회가 있다면 적어주세요</label>
      <div class="activities-container">
        <div v-if="applications.activities && applications.activities.length > 0" class="activities-table">
          <table>
            <thead>
              <tr>
                <th>동아리/학회명</th>
                <th>시작일</th>
                <th>종료일</th>
                <th>역할</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(activity, index) in applications.activities" :key="index">
                <td>{{ activity.clubName }}</td>
                <td>{{ formatDate(activity.startDate) }}</td>
                <td>{{ formatDate(activity.endDate) }}</td>
                <td>{{ activity.role }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="no-activities">
          <p>등록된 활동이 없습니다.</p>
        </div>
      </div>
    </div>

    <div class="info-field">
      <label>본인의 스윙 영상이 담긴 url을 적어주세요 (유튜브, 인스타 등)</label>
      <div class="field-value">
        <a :href="applications.swingVideo" target="_blank" class="video-link">스윙 영상 보기</a>
      </div>
    </div>

    <div class="section-spacer"></div>

    <!-- 관리자 기능 -->
    <div class="admin-section">
      <div class="section-title">관리자 기능</div>

      <div class="info-field">
        <label>지원 시간</label>
        <div class="field-value">{{ applications.submitTime }}</div>
      </div>

      <div class="info-field">
        <label>면접 시간</label>
        <div class="admin-field-container">
          <div class="field-value">{{ applications.interviewTime }}</div>
          <button class="admin-button" @click="showInterviewModal = true">면접 시간 변경</button>
        </div>
      </div>

      <div class="info-field">
        <label>합격 여부</label>
        <div class="admin-field-container">
          <select class="status-select" v-model="applications.selection" @change="updateApplicationStatus">
            <option value="documentPass">서류 합격</option>
            <option value="finalPass">최종 합격</option>
            <option value="documentFail">서류 탈락</option>
            <option value="finalFail">최종 탈락</option>
            <option value="pending">보류</option>
          </select>
        </div>
      </div>
    </div>
  </div>

  <!-- 모달 -->
  <InterviewModal v-if="showInterviewModal" @close="showInterviewModal = false" @save="updateInterviewTime"/>
</template>

<script>
import axios from "axios";
import InterviewModal from "@/components/application/admin/IntervieModal.vue";
import {ref} from "vue";
import {useRoute} from "vue-router";
import Swal from "sweetalert2";

export default {
  components: {
    InterviewModal,
  },

  setup() {
    const interviewTime = ref('2023-10-28 10:00');
    const showInterviewModal = ref(false);
    const route = useRoute();
    const currentPageId = route.params.id;

    const openModal = () => {
      showInterviewModal.value = true;
    };

    const closeModal = () => {
      showInterviewModal.value = false;
    };

    const updateInterviewTime = async (newTime) => {
      interviewTime.value = newTime;

      try {
        const response = await axios.patch(`${process.env.VUE_APP_API_URL}/admin/forms/${currentPageId}/interviewTime`, {
          time: interviewTime.value
        });
        if (response.status === 200) {
          await Swal.fire({
            title: "면접 시간 변경 성공",
            confirmButtonColor: '#08366f',
          });

          closeModal();
          location.reload();
        } else {
          await Swal.fire({
            title:"면접 시간 변경 실패",
            confirmButtonColor: '#08366f',
          });
        }

      } catch (error) {
        await Swal.fire({
          title: "면접 시간 변경 실패",
          confirmButtonColor: '#08366f',
        });
      }
    }

    return {
      interviewTime,
      showInterviewModal,
      openModal,
      closeModal,
      updateInterviewTime
    };
  },

  data() {
    return {
      applications: {}
    }
  },

  beforeRouteEnter(to, from, next) {
    axios.get(`${process.env.VUE_APP_API_URL}/admin/forms/${to.params.id}`)
    .then(response => {
      const data = response.data.data;
      let selection = null;

      if (data.documentPass === true && data.finalPass === true) {
        selection = 'finalPass';
      } else if (data.documentPass === true && data.finalPass === false) {
        selection = 'finalFail';
      } else if (data.documentPass === false) {
        selection = 'documentFail';
      } else if (data.documentPass === true && data.finalPass === null) {
        selection = 'documentPass';
      } else if (data.documentPass === null && data.finalPass === null) {
        selection = 'pending';
      }

      next(vm => {
        vm.applications = data;
        vm.applications.selection = selection;
      });
    })
    .catch(error => {
      console.error("Error fetching data:", error);
      next(false);
    });
  },

  methods: {
    async updateApplicationStatus() {
      let payload = {};
      switch (this.applications.selection) {
        case "documentPass":
          payload = {documentPass: true, finalPass: null};
          break;
        case "finalPass":
          payload = {documentPass: true, finalPass: true};
          break;
        case "documentFail":
          payload = {documentPass: false, finalPass: null};
          break;
        case "finalFail":
          payload = {documentPass: true, finalPass: false};
          break;
        case "pending":
          payload = {documentPass: null, finalPass: null};
          break;
      }

      try {
        await axios.patch(`${process.env.VUE_APP_API_URL}/admin/forms/${this.applications.id}/pass`, payload);
        await Swal.fire({
          title: "합격 여부 변경 완료",
          confirmButtonColor: '#08366f',
        });
      } catch (error) {
        console.error('API 요청 실패:', error);
      }
    },

    formatContent(content) {
      if (!content) {
        return '';
      }
      return content.replace(/\n/g, '<br>');
    },

    formatDate(dateString) {
      if (!dateString) return '-';
      const date = new Date(dateString);
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    }
  },
};
</script>

<style lang="scss" scoped>
/* 폼 헤더 스타일 */
.form-header {
  width: 100%;
  max-width: 800px;
  margin: 0 auto 30px auto;
  text-align: left;
  padding: 0 20px;
  box-sizing: border-box;
}

.form-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
}

.notice-text {
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
  line-height: 1.4;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.section-spacer {
  height: 30px;
  margin: 20px 0;
}

/* 기본 정보 섹션 스타일 */
.default_info {
  width: 100%;
  max-width: 800px;
  margin: 20px auto;
  text-align: left;
  padding: 0 20px;
  box-sizing: border-box;
}

.info-field {
  margin-bottom: 25px;
}

.info-field label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.field-value {
  padding: 12px 0;
  font-size: 14px;
  color: #555;
  border-bottom: 1px solid #eee;
  line-height: 1.5;
}

.textarea-value {
  padding: 12px;
  background-color: #f9f9f9;
  border-radius: 4px;
  border: none;
  min-height: 80px;
  line-height: 1.6;
}

/* 사진 업로드 섹션 스타일 */
.photo-upload-section {
  margin-bottom: 25px;
  text-align: center;
}

.photo-container {
  display: inline-block;
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  background-color: #f9f9f9;
}

.photo-display {
  display: inline-block;
}

.apply-photo {
  max-width: 150px;
  max-height: 150px;
  border-radius: 8px;
  object-fit: cover;
}

/* 관리자 섹션 스타일 */
.admin-section {
  border-top: 2px solid #08366f;
  padding-top: 30px;
  margin-top: 40px;
}

.admin-field-container {
  display: flex;
  align-items: center;
  gap: 15px;
}

.admin-button {
  padding: 8px 16px;
  background-color: #08366f;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.admin-button:hover {
  background-color: #1a5cc8;
}

.status-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  font-size: 14px;
  cursor: pointer;
}

.status-select:focus {
  outline: none;
  border-color: #08366f;
  box-shadow: 0 0 0 2px rgba(8, 54, 111, 0.1);
}

/* 비디오 링크 스타일 */
.video-link {
  color: #08366f;
  text-decoration: underline;
  font-weight: 500;
}

.video-link:hover {
  color: #1a5cc8;
}

/* 모바일 반응형 */
@media (max-width: 768px) {
  .form-header,
  .default_info {
    max-width: 100%;
    padding: 0 15px;
  }

  .form-header h1 {
    font-size: 20px;
  }

  .section-title {
    font-size: 16px;
  }

  .notice-text {
    font-size: 12px;
  }

  .info-field {
    margin-bottom: 20px;
  }

  .info-field label {
    font-size: 13px;
  }

  .field-value {
    font-size: 13px;
  }

  .photo-container {
    padding: 15px;
  }

  .apply-photo {
    max-width: 120px;
    max-height: 120px;
  }

  .admin-field-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .admin-button {
    align-self: flex-start;
  }
}

/* 활동 테이블 스타일 */
.activities-container {
  margin-top: 10px;
}

.activities-table {
  width: 100%;
  overflow-x: auto;
}

.activities-table table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.activities-table th {
  background-color: #08366f;
  color: white;
  padding: 12px 8px;
  text-align: center;
  font-size: 13px;
  font-weight: 600;
}

.activities-table td {
  padding: 12px 8px;
  text-align: center;
  border-bottom: 1px solid #eee;
  font-size: 13px;
}

.activities-table tr:last-child td {
  border-bottom: none;
}

.activities-table tr:hover {
  background-color: #f8f9fa;
}

.no-activities {
  text-align: center;
  padding: 20px;
  color: #666;
  font-size: 14px;
  background: #f5f5f5;
  border-radius: 8px;
}

/* 모바일 반응형 */
@media (max-width: 768px) {
  .activities-table {
    font-size: 12px;
  }
  
  .activities-table th,
  .activities-table td {
    padding: 8px 4px;
    font-size: 12px;
  }
  
  .activities-table th {
    font-size: 11px;
  }
}
</style>