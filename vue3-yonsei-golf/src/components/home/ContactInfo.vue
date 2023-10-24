<template>
  <div class="white-container"></div>
  <div class="contact-card">
    <h1>지금 바로 함께 해요</h1>
    <div class="contact-detail">상세 문의사항</div>
    <div v-if="leader" class="contact-info">
      &nbsp;&nbsp;회장&nbsp;&nbsp;:&nbsp;{{ leader.name }}  {{ leader.phoneNumber }}
    </div>
    <div v-for="assistant in assistantLeaders" :key="assistant.name" class="contact-info">
      부회장 :{{ assistant.name }} {{ assistant.phoneNumber }}
    </div>

    <div class="contact-detail">자세히 둘러보기</div>
    <p>
      INSTAGRAM : @yonsei__golf
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
    axios.get("http://localhost:8080/users/leaders")
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
  font-family: 'Noto Sans KR', sans-serif;
  text-align: center;
}

h1 {
  font-size: 32px;
  margin-bottom: 30px;
  color: #143673;
  font-weight: 500;
}

.contact-detail {
  font-size: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
  font-weight: 400;
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

</style>