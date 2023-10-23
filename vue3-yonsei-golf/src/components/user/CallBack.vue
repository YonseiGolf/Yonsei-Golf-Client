<template>
  <div>Loading...</div>
</template>

<script>
import axios from "axios";
import globalState from "@/globalState";

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
