<template>
  <img class="loading-img" src="../../img/loading.gif" alt="loading img">
</template>

<script>
import axios from "axios";
import globalState from "@/globalState";
import store from "@/store";

export default {
  name: 'KakaoCallback',
  async mounted() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      await this.sendCodeToBackend(code);
    }
  },
  methods: {
    async sendCodeToBackend(code) {
      try {
        const response = await axios.post('http://localhost:8080/oauth/kakao', { kakaoCode: code });
        console.log('response:', response);
        if (response.status === 200) {

          try {
            const loginResponse = await axios.post('http://localhost:8080/users/signIn');

            if (loginResponse.status === 200) {
              // 로그인이 성공하면 store 에 로그인 정보를 저장해둔다.
              const userDetails = {
                username: loginResponse.data.data.name,
                adminStatus: loginResponse.data.data.adminStatus // <-- 수정된 부분
              };
              store.commit('SET_USER_DETAILS', userDetails);

              this.$router.push('/');
            }
          } catch (error) {
            if (error.response && error.response.status === 401) {
              globalState.loginFailed = true;
              this.$router.push('/signup');
            } else {
              this.$router.push('/');
            }
          }

        } else {
          this.$router.push('/login');
        }

      } catch (error) {
        console.error('Error sending code to backend:', error);
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.loading-img{
  width: 300px;
  height: 300px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

</style>