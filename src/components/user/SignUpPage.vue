<template>
  <div class="register-container">

    <h2>회원가입</h2>
    <form @submit.prevent="register">
      <div class="input-group">
        <label for="name">이름</label>
        <input type="text" id="name" placeholder="김연골" v-model="name" @input="validateName" required/>
        <p v-if="nameInvalid" class="error-message">이름은 10자 이내로 입력해주세요.</p>
      </div>

      <div class="input-group">
        <label for="phoneNumber">전화번호</label>
        <input type="text" id="phoneNumber" placeholder="010-0000-0000" v-model="phoneNumber" @input="validatePhoneNumber" required/>
        <p v-if="phoneNumberInvalid" class="error-message">숫자와 - 만 입력 가능합니다.</p>
      </div>

      <div class="input-group">
        <label for="studentId">학번</label>
        <input type="text" id="studentId" placeholder="16" v-model="studentId" @input="validateStudentId" required/>
        <p v-if="studentIdInvalid" class="error-message">학번은 다음과 같이 입력해주세요 ex) 16.</p>
      </div>

      <div class="input-group">
        <label for="major">학과</label>
        <input type="text" id="major" placeholder="OO과" v-model="major" @input="validateMajor" required/>
        <p v-if="majorInvalid" class="error-message">학과는 10자 이내로 입력해주세요.</p>
      </div>

      <div class="input-group">
        <label for="semester">연세골프 기수</label>
        <input type="text" id="semester" placeholder="10" v-model="semester" @input="validateSemester" required/>
        <p v-if="semesterInvalid" class="error-message">기수는 2글자 이내로 입력해주세요.</p>
      </div>
      <button type="submit" :disabled="isFormInvalid">회원가입</button>
    </form>
  </div>

</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      name: '',
      phoneNumber: '',
      studentId: '',
      major: '',
      semester: '',

      nameInvalid: false,
      phoneNumberInvalid: false,
      studentIdInvalid: false,
      majorInvalid: false,
      semesterInvalid: false,
    };
  },

  computed: {
    isFormInvalid() {
      return this.nameInvalid || this.phoneNumberInvalid || this.majorInvalid || this.semesterInvalid || this.studentIdInvalid;
    }
  },

  methods: {
    async register() {
      try {
        const response = await axios.post(`${process.env.VUE_APP_API_URL}/users/signUp`, {
          name: this.name,
          phoneNumber: this.phoneNumber,
          studentId: this.studentId,
          major: this.major,
          semester: this.semester
        });

        if (response.status === 200) {
          await Swal.fire({
            title: '회원가입에 성공했습니다.',
            text: '다시 로그인 해주세요',
            icon: 'success',
            confirmButtonText: '확인'
          });
          this.$router.push('/login');
        } else {
          await Swal.fire({
            title: '회원가입에 실패했습니다.',
            text: '다시 시도해주세요',
            icon: 'error',
            confirmButtonText: '확인'
          });
          this.$router.push('/');
        }

      } catch (error) {
        await Swal.fire({
          title: '회원가입에 실패했습니다.',
          text: '다시 시도해주세요',
          icon: 'error',
          confirmButtonText: '확인'
        });
        this.$router.push('/');
      }
    },

    validateName() {
      if (this.name.length > 10) {
        this.name = this.name.substring(0, 11); // 이름이 10자를 넘어갈 경우 마지막 부분을 잘라냄
      }
      this.nameInvalid = this.name.length > 10;
    },

    validatePhoneNumber() {
      // 숫자와 '-' 이외의 문자가 있는지 확인
      const invalidCharacters = /[^0-9-]/g;
      // 숫자나 '-' 이외의 문자를 제거
      this.phoneNumber = this.phoneNumber.replace(invalidCharacters, '');
      // 길이가 10자를 넘어갈 경우 마지막 부분을 잘라냄
      if (this.phoneNumber.length > 14) {
        this.phoneNumber = this.phoneNumber.substring(0, 14);
      }
      this.phoneNumberInvalid = invalidCharacters.test(this.phoneNumber) || this.phoneNumber.length > 13;
    },

    validateStudentId() {
      const nonNumericCharacters = /[^0-9]/g;
      // 숫자 이외의 문자를 제거
      this.studentId = this.studentId.replace(nonNumericCharacters, '');
      // 길이가 10자를 넘어갈 경우 마지막 부분을 잘라냄
      if (this.studentId.length > 3) {
        this.studentId = this.studentId.substring(0, 3);
      }

      this.studentIdInvalid = this.studentId.length > 2;
    },

    validateMajor() {
      if (this.major.length > 10) {
        this.major = this.major.substring(0, 11); // 이름이 10자를 넘어갈 경우 마지막 부분을 잘라냄
      }
      this.majorInvalid = this.major.length > 10;
    },

    validateSemester() {
      // 숫자 이외의 문자가 있는지 확인
      const nonNumericCharacters = /[^0-9]/g;
      // 숫자 이외의 문자를 제거
      this.semester = this.semester.replace(nonNumericCharacters, '');
      // 길이가 10자를 넘어갈 경우 마지막 부분을 잘라냄
      if (this.semester.length > 3) {
        this.semester = this.semester.substring(0, 3);
      }
      this.semesterInvalid = this.semester.length > 2;
    },

  }
}
</script>

<style scoped>
.register-container {
  width: 280px;
  margin: auto;
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

.error-message {
  color: red;
  font-size: 12px;
  margin-top: 5px;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
