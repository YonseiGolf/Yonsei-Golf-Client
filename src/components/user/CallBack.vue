<template>
  <img class="loading-img" src="https://yg-img-storage.s3.ap-northeast-2.amazonaws.com/image/loading.a11988e6.gif"
       alt="loading img">
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

        const response = await axios.post(`${process.env.VUE_APP_API_URL}/oauth/kakao`, {kakaoCode: code});

        if (response.status === 200) {
          const token = response.data.data.accessToken;
          localStorage.setItem('accessToken', token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          try {
            const loginResponse = await axios.post(`${process.env.VUE_APP_API_URL}/users/signIn`);
            // localStorage에 저장된 access Token을 삭제한다.
            localStorage.removeItem('accessToken')

            if (loginResponse.status === 200) {
              const token = loginResponse.data.data.accessToken;
              localStorage.setItem('accessToken', token);

              // 로그인 성공 후 다시 access Token 설정
              axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

              const parts = token.split('.');
              const payload = parts[1]
              const decoded = atob(payload);
              const decodedURIComponent = decodeURIComponent(escape(decoded));
              const json = JSON.parse(decodedURIComponent);

              // 로그인이 성공하면 store 에 로그인 정보를 저장해둔다.
              const userDetails = {
                userId: json.userProfile.id,
                username: json.userProfile.name,
                adminStatus: json.userProfile.adminStatus,
                memberStatus: json.userProfile.memberStatus,
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

.loading-img {
  width: 300px;
  height: 300px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

</style>