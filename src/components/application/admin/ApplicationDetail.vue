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
      <td>
        {{ applications.selfIntroduction }}
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
      <td>
        {{ applications.applyReason }}
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
      <td>
        {{ applications.skillEvaluation }}
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
      <td>
        {{ applications.golfMemory }}
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
      <td>
        {{ applications.otherClub }}
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
        {{ applications.interviewTime }}
        <button @click="showInterviewModal = true">면접 시간 변경</button>

        <InterviewModal v-if="showInterviewModal" @close="showInterviewModal = false" @save="updateInterviewTime" />
      </td>
    </tr>

    <tr>
      <td>
        서류 합격 여부
      </td>
      <td>
        <select v-model="applications.documentPass" @change="updateDocumentPass">
          <option value="true">합격</option>
          <option value="false">불합격</option>
          <option value="null">보류</option>
        </select>
      </td>

      <td>
        최종 합격 여부
      </td>
      <td>
        <select v-model="applications.finalPass" @change="updateFinalPass">
          <option value="true">합격</option>
          <option value="false">불합격</option>
          <option value="null">보류</option>
        </select>
      </td>
    </tr>
    </tbody>
  </table>

</template>

<script>
import axios from "axios";
import InterviewModal from "@/components/application/admin/IntervieModal.vue";

export default {
  components: {InterviewModal},

  data() {
    return {
      applications: {}
    }
  },

  beforeRouteEnter(to, from, next) {
    axios.get(`${process.env.VUE_APP_API_URL}/admin/forms/${to.params.id}`)
        .then(response => {
          next(vm => {
            vm.applications = response.data.data;
          });
        })
        .catch(error => {
          console.error("Error fetching data:", error);
          next(false);
        });
  },

  methods: {
    async updateDocumentPass() {

      if (this.applications.finalPass === "true") {
        this.applications.finalPass = true;
      } else if (this.applications.finalPass === "false") {
        this.applications.finalPass = false;
      } else {
        this.applications.finalPass = null;
      }

      axios.patch(`${process.env.VUE_APP_API_URL}/admin/forms/${this.applications.id}/documentPass`, this.applications.documentPass,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
      )
          .then(response => {
            if (response.status === 200) {
              location.reload();
            } else {
              console.error("Error updating documentPass");
            }
          })
          .catch(error => {
            console.error("Error updating documentPass:", error);
          });
    },

    async updateFinalPass() {

      if (this.applications.finalPass === "true") {
        this.applications.finalPass = true;
      } else if (this.applications.finalPass === "false") {
        this.applications.finalPass = false;
      } else {
        this.applications.finalPass = null;
      }
      axios.patch(`${process.env.VUE_APP_API_URL}/admin/forms/${this.applications.id}/finalPass`, this.applications.finalPass,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
      )
          .then(response => {
            if (response.status === 200) {
              location.reload();
            } else {
              console.error("Error updating finalPass");
            }
          })
          .catch(error => {
            console.error("Error updating finalPass:", error);
          });
    }
  }
};

</script>

<style lang="scss" scoped>
img {
  max-width: 100px;
}

.profile-info{
  margin-top: 30px;
}

.profile-info, .application-body, .application-footer {
  width: 50%;
  border-collapse: collapse;
}

table {
  margin: 0 auto;
  font-size: 10px;
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

.application-footer{
  margin-bottom: 30px;
}

@media (max-width: 1300px) {
  .profile-info, .application-body {
    max-width: 90%;
    width: 90%;
  }
}
</style>