<template>

  <div class="application-container">
    <h3>
      <span>지원 대기 목록</span>
      <br>
      <span>{{ emails.length }}개 &nbsp;</span>
      <button @click="sendEmail"> 메일 보내기</button>
    </h3>

    <table>
      <thead>
      <tr>
        <th>이메일 명단</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in emails" :key="item.id">
        <td>{{ item.email }}</td>
      </tr>
      </tbody>
    </table>

    <div v-if="loading" class="loading-container">
      <img src="https://yg-img-storage.s3.ap-northeast-2.amazonaws.com/image/loading.a11988e6.gif" alt="Loading">
    </div>

  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {

  data() {
    return {
      emails: [],
      loading: false, // 이메일 전송 중 상태 표시
    }
  },

  methods: {
    async fetchEmails() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/admin/email/apply-start-email`);
        this.emails = response.data.data.emailAlarms;
        console.log(this.emails)
      } catch (err) {
        console.error(err);
      }
    },
    async sendEmail() {
      this.loading = true;
      axios.post(`${process.env.VUE_APP_API_URL}/admin/email/apply-start-email`)
          .then(async (res) => {
            console.log(res);
            await Swal.fire({
              title: "메일 전송 완료",
              confirmButtonColor: '#0a3d91',
            });
          })
          .catch((err) => {
            console.error(err);
          })
          .finally(() => {
            this.loading = false; // 로딩 종료
          });
    }
  },

  created() {
    this.fetchEmails();
  },
}

</script>

<style lang="scss" scoped>
.application-container {
  margin: 0 auto;
}

h3{
  margin-bottom: 20px;
}

table{
  margin: 0 auto;
  border-collapse: collapse;
}

th{
  padding: 10px;
}

td {
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  padding: 10px;
  text-align: center;
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