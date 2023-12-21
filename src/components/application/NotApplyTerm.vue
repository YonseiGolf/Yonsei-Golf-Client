<template>

  <div class="container">

    <h1>
      지금은 모집기간이 아닙니다.<br>
      모집 기간이 되면 메일로 알려드립니다.
    </h1>
    <div class="email-input">
      <input type="email" v-model="email" placeholder="메일을 입력해주세요" @input="validateEmail">
      <p v-if="emailInvalid" class="error-message">올바른 이메일 형식이 아닙니다.</p>
      <button @click="registerNotification" :disabled="emailInvalid">알림 등록</button>
    </div>

  </div>

</template>

<script>

import axios from 'axios';
import Swal from "sweetalert2";

export default {
  data() {
    return {
      email: '',

      emailInvalid: false,
    }
  },

  computed: {
    isFormInvalid() {
      return this.emailInvalid;
    }
  },

  methods: {
    async registerNotification() {
      try {

        if (!this.email.trim()) {
          await Swal.fire({
            title: "이메일을 입력해주세요.",
            confirmButtonColor: '#0a3d91',
          });
          return;
        }

        const response =
            await axios.post(`${process.env.VUE_APP_API_URL}/application/emailAlarm`, {
              email: this.email
            });

        // 응답 처리
        if (response.status === 200) {
          await Swal.fire({
            title: "알림이 성공적으로 등록되었습니다.",
            confirmButtonColor: '#0a3d91',
          });
          this.$router.push('/');
        } else {
          console.log(process.env.LOCAL_API_URL)
          console.error('알림 등록에 실패하였습니다.');
        }
      } catch (error) {
        await Swal.fire({
          title: "알림 등록에 실패하였습니다.",
          confirmButtonColor: '#0a3d91',
        });
      }
    },

    validateEmail() {
      // Check for the email format something@something
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValidFormat = emailPattern.test(this.email);

      // Check for the length and if it's not blank
      const isWithinLengthLimit = this.email.length <= 25;
      const isNotBlank = this.email.trim() !== '';

      // Combine the results
      this.emailInvalid = !isValidFormat || !isWithinLengthLimit || !isNotBlank;
    }
  },

}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 40vh;
  padding-top: 60px;
  padding-bottom: 150px;
  background-color: #f0f0f0;
  width: 100%
}

h1 {
  text-align: center;
  font-size: 30px;
  max-width: 80%;
  padding: 50px;
}

.email-input {
  width: 80%;
  height: 20%;
  max-width: 800px;
  padding: 10px 5px;
  background-color: #ffffff; // 흰색 배경 추가
  border-radius: 100px; // 모서리 둥글게
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;

  input {
    padding: 3%;
    width: 90%;
    font-size: 2vh;
    border: 1px solid white;
    border-radius: 100px;
  }

  button {
    padding: 3%;
    font-size: 18px;
    background-color: #143673;
    color: #fff;
    border: none;
    border-radius: 100px;
    cursor: pointer;
    transition: background-color 0.3s;

    min-width: 140px;

    &:hover {
      background-color: #1a5cc8;
    }
  }
}

input {
  outline: none;
}

h1{
  font-family: 'GmarketSansMedium', sans-serif;
  font-weight: bold;
}

</style>
