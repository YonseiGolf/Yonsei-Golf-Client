<template>
  <table class="profile-info">
    <tbody>
    <tr>
      <td rowspan="2">
        사진
      </td>
      <td rowspan="2">
        <img :src="applications.photo" alt="Applicant's Photo"/>
      </td>
      <td>
        이름
      </td>
      <td>
        {{ applications.name }}
      </td>
    </tr>

    <tr>
      <td>나이</td>
      <td>
        {{ applications.age }}
      </td>
    </tr>

    <tr>
      <td>
        학번
      </td>
      <td>
        {{ applications.studentId }}
      </td>
      <td>
        전공
      </td>
      <td>
        {{ applications.major }}
      </td>
    </tr>

    <tr>
      <td>
        전화번호
      </td>
      <td>
        {{ applications.phoneNumber }}
      </td>

      <td>
        이메일
      </td>
      <td>
        {{ applications.email }}
      </td>
    </tr>

    <tr>
      <td>
        구력
      </td>
      <td>
        <div>{{ applications.golfDuration }} 년</div>
      </td>

      <td>
        라운딩 횟수
      </td>
      <td>
        <div> {{ applications.roundCount }} 회</div>
      </td>
    </tr>

    <tr>
      <td>
        레슨 여부
      </td>
      <td>
        <div>{{ applications.lessonStatus ? '레슨중' : '레슨x' }}</div>
      </td>
      <td>
        본인 클럽 소유 여부
      </td>
      <td>
        <div>{{ applications.clubStatus ? '보유' : '미보유' }}</div>
      </td>
    </tr>
    </tbody>
  </table>

  <table class="application-body">
    <thead>
    <tr>
      <th>
        1. 간략하게 자기소개 부탁드립니다. (군대 계획이나 교환학생 계획이 있다면 적어주세요)
      </th>
    </tr>
    </thead>
    <tbody>
    <tr>
      <td v-html="formatContent(applications.selfIntroduction)">
      </td>
    </tr>
    </tbody>

    <thead>
    <tr>
      <th>
        2. 연세 골프에 지원하게 된 동기를 작성해주세요
      </th>
    </tr>
    </thead>
    <tbody>
    <tr>
      <td v-html="formatContent(applications.applyReason)">
      </td>
    </tr>
    </tbody>

    <thead>
    <tr>
      <th>
        3. 현재 본인의 골프 실력을 객관적으로 평가해주세요.
      </th>
    </tr>
    </thead>
    <tbody>
    <tr>
      <td v-html="formatContent(applications.skillEvaluation)">
      </td>
    </tr>
    </tbody>

    <thead>
    <tr>
      <th>
        4. 골프와 관련된 추억이 있으시다면 말씀해주세요
      </th>
    </tr>
    </thead>
    <tbody>
    <tr>
      <td v-html="formatContent(applications.golfMemory)">
      </td>
    </tr>
    </tbody>

    <thead>
    <tr>
      <th>
        5. 현재 활동하는 다른 동아리나 학회가 있다면 적어주세요
      </th>
    </tr>
    </thead>
    <tbody>
    <tr>
      <td v-html="formatContent(applications.otherClub)">
      </td>
    </tr>
    </tbody>

    <thead>
    <tr>
      <th>
        6. 본인의 스윙 영상이 담긴 url을 적어주세요 (유튜브, 인스타 등)
      </th>
    </tr>
    </thead>
    <tbody>
    <tr>
      <td>
        <a :href="applications.swingVideo" target="_blank">스윙 영상 보기</a>
      </td>
    </tr>
    </tbody>
  </table>

  <table class="application-footer">
    <tbody>
    <tr>
      <td>
        지원 시간
      </td>
      <td>
        {{ applications.submitTime }}
      </td>

      <td>
        면접 시간
      </td>
      <td>
        {{ applications.interviewTime }} &nbsp;
        <button @click="showInterviewModal = true">면접 시간 변경</button>

        <InterviewModal v-if="showInterviewModal" @close="showInterviewModal = false" @save="updateInterviewTime"/>
      </td>
    </tr>

    <tr>
      <td>
        합격 여부
      </td>
      <td>
        <select v-model="applications.selection" @change="updateApplicationStatus">
          <option value="documentPass">서류 합격</option>
          <option value="finalPass">최종 합격</option>
          <option value="documentFail">서류 탈락</option>
          <option value="finalFail">최종 탈락</option>
          <option value="pending">보류</option>
        </select>
      </td>
    </tr>
    </tbody>
  </table>

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
      // 선택에 따라 documentPass와 finalPass 값을 설정
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

      // API 요청 보내기
      try {
        await axios.patch(`${process.env.VUE_APP_API_URL}/admin/forms/${this.applications.id}/pass`, payload);
        // 추가적인 로직 (예: 응답 처리, 라우팅, 상태 업데이트 등)
        await Swal.fire({
          title: "합격 여부 변경 완료",
          confirmButtonColor: '#08366f',
        });
      } catch (error) {
        console.error('API 요청 실패:', error);
      }
    },

    formatContent(content) {
      // 줄바꿈 문자를 <br> 태그로 변환
      if (!content) {
        return '';
      }
      return content.replace(/\n/g, '<br>');
    }

  },

};

</script>

<style lang="scss" scoped>
img {
  max-width: 100px;
}

.profile-info {
  margin-top: 30px;
}

.profile-info, .application-body, .application-footer {
  width: 50%;
  border-collapse: collapse;
}

table {
  margin: 0 auto;
  font-size: 12px;
  max-width: 70%;
}

table th, table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
}

table th {
  background-color: gray;
  color: #fff;
}

.application-footer {
  margin-bottom: 30px;
}

@media (max-width: 1300px) {
  .profile-info, .application-body, .application-footer {
    max-width: 90%;
    width: 90%;
  }
}
</style>