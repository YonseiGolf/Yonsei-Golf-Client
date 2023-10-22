<template>
  <div class="yonsei-golf">
    <img src="../../img/yonsei-golf.jpg" alt="yonsei-golf Logo"/>
    <h1>Yonsei-Golf</h1>
    <button @click="showMessage" id="login-text">
      <img src="../../img/kakao.jpg" alt="kako logo" id="kako">
      카카오로 3초 만에 시작하기
    </button>
<!--    추후에 분리하기 -->
    <SignUpPage></SignUpPage>
  </div>

</template>

<script>

import SignUpPage from "./SignUpPage.vue";

export default {
  components:{
    SignUpPage
  },
  name: 'Yonsei-golf',
  data() {
    return {
      message: '카카오로 3초 만에 시작하기'
    };
  },
  methods: {
    showMessage() {
      alert(this.message);
    }
  }
}
</script>

<style scoped>
.yonsei-golf {
  text-align: center;
}

.yonsei-golf img {
  width: 100px;
  margin-top: 20px;
}

.yonsei-golf h1 {
  font-size: 24px;
  margin-bottom: 10px;
}

.yonsei-golf button {
  padding-bottom: 20px;
  padding-left: 40px;
  padding-right: 40px;
  background-color: #FFEB3B;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.yonsei-golf button:hover {
  background-color: #FFC107;
}

#kako {
  width: 10px;
  height: 10px;
}

#login-text {
  font-weight: bold;
}

</style>
