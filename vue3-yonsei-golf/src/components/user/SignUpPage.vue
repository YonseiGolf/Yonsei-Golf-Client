<template>
  <div class="register-container">

    <h2>회원가입</h2>
    <form @submit.prevent="register">
      <div class="input-group">
        <label for="username">이름</label>
        <input type="text" id="username" placeholder="김연골" v-model="username" required />
      </div>

      <div class="input-group">
        <label for="phoneNumber">전화번호</label>
        <input type="text" id="phoneNumber" placeholder="010-0000-0000" v-model="phoneNumber" required />
      </div>

      <div class="input-group">
        <label for="studentId">학번</label>
        <input type="text" id="studentId" placeholder="16" v-model="studentId" required />
      </div>

      <div class="input-group">
        <label for="major">학과</label>
        <input type="text" id="major" placeholder="OO과" v-model="major" required />
      </div>

      <div class="input-group">
        <label for="semester">연세골프 기수</label>
        <input type="text" id="semester" placeholder="10기" v-model="semester" required />
      </div>

      <button type="submit">회원가입</button>
    </form>
  </div>

</template>

<script>
export default {
  data() {
    return {
      username: '',
      phoneNumber: '',
      password: '',
      studentId: '',
      major: '',
      semester: ''
    };
  },
  methods: {
    register() {
      // TODO: 회원가입 로직 구현 (예: API 호출)
      console.log('회원가입 정보:', {
        username: this.username,
        email: this.email,
        password: this.password
      });
      alert('회원가입 성공!');
    }
  }
}
</script>

<style scoped>
.register-container {
  width: 280px;
  margin: 0 auto;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
}

.input-group {
  margin-bottom: 15px;
  width: 250px;
  font-weight: bold;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #007BFF;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 20px;
}

button:hover {
  background-color: #0056b3;
}
</style>
