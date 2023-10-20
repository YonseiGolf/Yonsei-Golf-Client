<template>

  <div class="container">

    <h1>
      지금은 모집기간이 아닙니다.<br>
      모집 기간이 되면 메일로 알려드립니다.
    </h1>
    <div class="email-input">
      <input type="email" v-model="email" placeholder="메일을 입력해주세요">
      <button @click="registerNotification">알림 등록하기</button>
    </div>

  </div>

</template>

<script>
export default {

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
}

h1 {
  text-align: center;
  font-size: 30px;
  max-width: 80%;
  padding: 50px;
}

.email-input {
  padding: 10px 5px;
  background-color: #ffffff;  // 흰색 배경 추가
  border-radius: 100px;  // 모서리 둥글게
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;

  input {
    padding: 30px;
    font-size: 30px;
    border: 1px solid white;
    border-radius: 100px;
    width: 500px;
  }

  button {
    padding: 30px 40px;
    font-size: 30px;
    background-color: #143673;
    color: #fff;
    border: none;
    border-radius: 100px;
    cursor: pointer;
    &:hover {
      background-color: #1a5cc8;
    }
  }
}
</style>
