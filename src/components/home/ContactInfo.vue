<template>
  <div class="white-container"></div>
  <div class="contact-card">
    <h1>지금 바로 함께 해요</h1>
    <div class="contact-detail">상세 문의사항</div>
    <div v-if="leader" class="contact-info">
      &nbsp;&nbsp;<leaders>회장</leaders>&nbsp;&nbsp;:&nbsp;{{ leader.name }}  {{ leader.phoneNumber }}
    </div>
    <div v-for="assistant in assistantLeaders" :key="assistant.name" class="contact-info">
      <leaders>부회장</leaders>&nbsp;&nbsp;:&nbsp;{{ assistant.name }} {{ assistant.phoneNumber }}
    </div>

    <div class="contact-detail"><br>자세히 둘러보기</div>
    <p>
      INSTAGRAM :
      <a href="https://www.instagram.com/yonsei__golf" target="_blank">@yonsei__golf</a>
    </p>
    <div class="buttons">
      <router-link to="/recruit">
        <button>
          &nbsp;&nbsp;&nbsp;모집안내&nbsp;&nbsp;&nbsp;
        </button>
      </router-link>
      &nbsp;&nbsp;
      <router-link to="/apply">
        <button>
          &nbsp;&nbsp;&nbsp;지원하기&nbsp;&nbsp;&nbsp;
        </button>
      </router-link>
    </div>
  </div>
  <div class="white-container"></div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      leader: null,
      assistantLeaders: []
    };
  },
  created() {
    axios.get(`${process.env.VUE_APP_API_URL}/users/leaders`)
        .then(response => {
          if (response.data.status === "success") {
            this.leader = response.data.data.leader;
            this.assistantLeaders = response.data.data.assistantLeaders;
          }
        })
        .catch(error => {
          console.error("There was an error fetching the data:", error);
        });
  }
}
</script>

<style lang="scss" scoped>

.white-container{
  height: 150px;
  color: white;
}

.contact-card {
  //width: 80%;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;

  font-family: 'Pretendard-Regular', sans-serif;
}

h1 {
  font-size: 32px;
  margin-bottom: 30px;
  color: #143673;
  font-weight: bold;

  font-family: 'GmarketSansMedium', sans-serif;
}

.contact-detail {
  font-size: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
  font-weight: bold;
  color: #4d4d4d;
}

p {
  font-size: 16px;
  color: #4d4d4d;
  font-weight: 500;
}

.contact-info {
  font-size: 16px;
  font-weight: normal;
  color: #4d4d4d;
  margin-bottom: 10px;
}

.buttons {
  margin-top: 20px;
}

button {
  padding: 10px 20px;

  background-color: white;
  color: #143673;

  border: 2px solid #094a7a;
  border-radius: 30px;
  cursor: pointer;

  transition: background-color 0.3s ease;
  margin-top: 20px;
  margin-bottom: 40px;
}

button:hover {
  background-color: #094a7a;
  color: white;
}

.buttons button {
  margin-right: 20px;
  font-size: 24px;
}

.buttons button:last-child {
  margin-right: 0;
}

a{
  color: #094a7a; // 원하는 색상 코드로 변경
  text-decoration: none; // 밑줄 제거
  &:hover {
    text-decoration: underline; // 마우스를 올렸을 때 밑줄 표시
  }
}

.contact-main{
  font-size: 30px;
  font-weight: bold;
}

leaders{
  font-size: 16px;
  font-weight: bold;
}
</style>