<template>
  <div class="application-container">
    <h3>
      <span>지원 대기 목록</span>
      <br>
      <span>{{ emails.length }}개 &nbsp;</span>
      <button @click="sendEmail"> 메일 보내기</button>
    </h3>

    <!-- Semester 선택 드롭다운 추가 -->
    <div class="semester-selector">
      <label for="semester">학기 선택:</label>
      <select id="semester" v-model="selectedSemester" @change="onSemesterChange">
        <option value="0">0기</option>
        <option value="10">10기</option>
      </select>
    </div>

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
      loading: false,
      selectedSemester: '0', // 기본값을 0기로 설정
    }
  },

  methods: {
    async fetchEmails() {
      try {
        // query string에 semester 파라미터 추가
        const params = {};
        if (this.selectedSemester) {
          params.semester = this.selectedSemester;
        }
        
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/admin/email/apply-start-email`, {
          params: params
        });
        this.emails = response.data.data.emailAlarms;
        console.log(this.emails);
      } catch (err) {
        console.error(err);
      }
    },

    async sendEmail() {
      this.loading = true;
      
      // 메일 전송 시에도 semester 파라미터 포함
      const params = {};
      if (this.selectedSemester) {
        params.semester = this.selectedSemester;
      }
      
      axios.post(`${process.env.VUE_APP_API_URL}/admin/email/apply-start-email`, null, {
        params: params
      })
      .then(async (res) => {
        console.log(res);
        await Swal.fire({
          title: "메일 전송 완료",
          confirmButtonColor: '#08366f',
        });
        // 메일 전송 후 목록 새로고침
        this.fetchEmails();
      })
      .catch((err) => {
        console.error(err);
        Swal.fire({
          title: "메일 전송 실패",
          text: "메일 전송 중 오류가 발생했습니다.",
          icon: "error",
          confirmButtonColor: '#08366f',
        });
      })
      .finally(() => {
        this.loading = false;
      });
    },

    onSemesterChange() {
      // URL query string 업데이트
      this.updateQueryString();
      // 선택된 학기에 따라 이메일 목록 새로고침
      this.fetchEmails();
    },

    updateQueryString() {
      const query = {};
      if (this.selectedSemester) {
        query.semester = this.selectedSemester;
      }
      
      this.$router.push({
        query: query
      }).catch(() => {});
    },

    // URL에서 semester 파라미터 읽어오기
    loadSemesterFromQuery() {
      const semester = this.$route.query.semester;
      if (semester) {
        this.selectedSemester = semester;
      } else {
        // URL에 semester 파라미터가 없으면 기본값 0으로 설정
        this.selectedSemester = '0';
      }
    }
  },

  created() {
    // URL에서 semester 파라미터 로드
    this.loadSemesterFromQuery();
    this.fetchEmails();
  },

  // 라우트 변경 감지
  watch: {
    '$route'(to, from) {
      if (to.query.semester !== from.query.semester) {
        this.loadSemesterFromQuery();
        this.fetchEmails();
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.application-container {
  margin: 0 auto;
}

h3{
  margin-bottom: 20px;
}

.semester-selector {
  margin-bottom: 20px;
  text-align: center;
}

.semester-selector label {
  margin-right: 10px;
  font-weight: bold;
}

.semester-selector select {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
}

table{
  margin: 0 auto;
  border-collapse: collapse;
  width: 100%;
  max-width: 600px;
}

th{
  padding: 10px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
}

td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
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