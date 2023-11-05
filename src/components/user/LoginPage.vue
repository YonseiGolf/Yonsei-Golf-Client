<!--<template>-->
<!--  <div class="yonsei-golf">-->
<!--    <img src="https://yg-img-storage.s3.ap-northeast-2.amazonaws.com/image/yonsei-golf.5d322a8d.jpg" alt="yonsei-golf Logo"/>-->
<!--    <h1>Yonsei-Golf</h1>-->
<!--    <button @click="kakaoLogin" id="login-text">-->
<!--      <img src="https://yg-img-storage.s3.ap-northeast-2.amazonaws.com/image/kakao.0d1ed005.jpg" alt="kako logo" id="kako">-->
<!--      카카오로 3초 만에 시작하기-->
<!--    </button>-->
<!--  </div>-->

<!--</template>-->

<!--<script>-->

<!--export default {-->
<!--  name: 'Yonsei-golf',-->
<!--  data() {-->
<!--    return {-->
<!--      message: '카카오로 3초 만에 시작하기',-->
<!--      kakaoUrl: `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.VUE_APP_KAKAO_REST_API_KEY}&redirect_uri=${process.env.VUE_APP_KAKAO_REDIRECT_URI}&response_type=code`,-->
<!--    };-->
<!--  },-->
<!--  methods: {-->
<!--    kakaoLogin() {-->
<!--      window.location.href = this.kakaoUrl;-->
<!--    },-->
<!--  }-->
<!--}-->
<!--</script>-->

<!--<style scoped>-->
<!--.yonsei-golf {-->
<!--  text-align: center;-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  justify-content: center;-->
<!--  align-items: center;-->
<!--  height: 50vh;-->
<!--  margin-top: 50px;-->
<!--}-->

<!--.yonsei-golf img {-->
<!--  width: 100px;-->
<!--  margin-top: 20px;-->
<!--}-->

<!--.yonsei-golf h1 {-->
<!--  font-size: 24px;-->
<!--  margin-bottom: 40px;-->
<!--}-->

<!--.yonsei-golf button {-->
<!--  padding-bottom: 20px;-->
<!--  padding-left: 40px;-->
<!--  padding-right: 40px;-->
<!--  background-color: #FFEB3B;-->
<!--  border: none;-->
<!--  border-radius: 20px;-->
<!--  cursor: pointer;-->
<!--  transition: background-color 0.3s;-->
<!--}-->

<!--.yonsei-golf button:hover {-->
<!--  background-color: #FFC107;-->
<!--}-->

<!--#kako {-->
<!--  width: 10px;-->
<!--  height: 10px;-->
<!--}-->

<!--#login-text {-->
<!--  font-weight: bold;-->
<!--}-->

<!--</style>-->

<template>
  <v-container fill-height>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6" class="text-center">
        <v-img
            src="https://yg-img-storage.s3.ap-northeast-2.amazonaws.com/image/yonsei-golf.5d322a8d.jpg"
            alt="yonsei-golf Logo"
            contain
            max-width="100"
            class="mx-auto mt-10"
        />

        <h1 class="my-4">Yonsei-Golf</h1>

        <v-btn color="yellow" dark @click="kakaoLogin" rounded class="px-5 py-3">
          <v-img
              src="https://yg-img-storage.s3.ap-northeast-2.amazonaws.com/image/kakao.0d1ed005.jpg"
              alt="kakao logo"
              class="mr-2"
          />
          카카오로 3초 만에 시작하기
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>



<script>
export default {
  name: 'YonseiGolf',
  data() {
    return {
      kakaoUrl: `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.VUE_APP_KAKAO_REST_API_KEY}&redirect_uri=${process.env.VUE_APP_KAKAO_REDIRECT_URI}&response_type=code`,
    };
  },
  methods: {
    kakaoLogin() {
      window.location.href = this.kakaoUrl;
    },
  },
};
</script>

<style scoped>

</style>
