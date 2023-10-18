<template>
  <div class="blue-container">
    <h2 id="title">연골 동아리는 이런 활동을 해요</h2>

    <div class="card-container">

      <div class="card grey-card">
        <img src="../../img/rounding.jpg" alt="정규 활동" class="introduction-image">
      </div>
      <div class="card">
        <span>정기 활동</span>
      </div>

      <div class="card grey-card">
        <img src="../../img/new-comer.jpg" alt="정규 활동" class="introduction-image">
      </div>
      <div class="card">
        <span>신입 환영 MT</span>
      </div>

      <div class="card grey-card">
        <img src="../../img/rounding.jpg" alt="단체 라운딩" class="introduction-image">
      </div>
      <div class="card">
        <span>단체 라운딩</span>
      </div>

      <div class="card grey-card">
        <img src="../../img/home-coming.jpg" alt="홈커밍데이" class="introduction-image">
      </div>
      <div class="card">
        <span>홈커밍 데이</span>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "BlueComponent"
};
</script>

<style scoped>

#title {
  text-align: center;
}

.blue-container {
  background-color: #0a3d91;
  color: white;
  padding: 40px;
}

h2 {
  font-size: 24px;
}

.card-container {

  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 50px;
  width: 60%;
}

.card {
  width: 410px;
  height: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #0a3d91;
  border: 1px solid #a5b1c2;
  font-size: 18px;
  border-radius: 10px;
}

.introduction-image {
  width: 410px;
  height: 250px;
  border-radius: 9px;
}

</style>
