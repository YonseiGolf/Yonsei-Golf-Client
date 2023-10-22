<template>
  <div class="container">
    <h1>Welcome</h1>

    <h2>
      연세 골프는 당신을 환영합니다!<br>
      지금 바로 지원하세요
    </h2>

    <router-link to="/apply/form">
      <button>
      지원하러 가기
      </button>
    </router-link>
  </div>
</template>

<script>
export default {}
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

button {
  padding: 30px 40px;
  font-size: 30px;
  background-color: #143673;
  color: #fff;
  border: none;
  border-radius: 100px;
  cursor: pointer;

  transition: background-color 0.3s;

  &:hover {
    background-color: #1a5cc8;
  }
}

</style>
