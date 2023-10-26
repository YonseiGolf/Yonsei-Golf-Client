<template>
  <div>
    <h2>{{ applications.name }}</h2>

    <div v-if="applications.photo">
      <img :src="applications.photo" alt="Applicant's Photo"/>
    </div>

    <div>나이 {{ applications.age }}</div>
    <div>학번 {{ applications.studentId }}</div>
    <div>전공 {{ applications.major }}</div>
    <div>전화번호 {{ applications.phoneNumber }}</div>
    <div>골프 구력 {{ applications.golfDuration }}</div>
    <div>라운딩 횟수 {{ applications.roundCount }}</div>
    <div>레슨 여부 {{ applications.lessonStatus }}</div>
    <div>클럽 보유 여부 {{ applications.clubStatus }}</div>
    <div>자기 소개 {{ applications.selfIntroduction }}</div>
    <div>지원 동기 {{ applications.applyReason }}</div>
    <div>자기 실력 객관적 평가 {{ applications.skillEvaluation }}</div>
    <div>골프 추억 {{ applications.golfMemory }}</div>
    <div>다른 동아리 활동 {{ applications.otherClub }}</div>
    <div v-if="applications.swingVideo">
      <a :href="applications.swingVideo" target="_blank">스윙 영상 보기</a>
    </div>

    <div>
      지원 시간 {{ applications.submitTime }}
    </div>
    <div>
      서류 합격 {{ applications.documentPass }}
      <select v-model="applications.documentPass" @change="updateDocumentPass">
        <option value="true">합격</option>
        <option value="false">불합격</option>
        <option value="null">보류</option>
      </select>
    </div>
    <div>
      최종 합격 {{ applications.finalPass }}
      <select v-model="applications.finalPass" @change="updateFinalPass">
        <option value="true">합격</option>
        <option value="false">불합격</option>
        <option value="null">보류</option>
      </select>
    </div>
    <div>면접 시간 {{ applications.interviewTime }}</div>
    <div>기타 사항 {{ applications.etc }}</div>

  </div>
</template>

<script>
import axios from "axios";

export default {

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

      console.log(this.applications.documentPass)
      if (this.applications.documentPass === null) {
        this.applications.documentPass = null;
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

</style>