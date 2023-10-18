<template>
  <div class="info-container">

    <h2>연골 동아리 소개</h2>

    <div class="description">
          연세대학교 골프동아리 연세골프는<br>
          KPGA, KLPGA 투어프로<br>
          이효린, 염은호, 신의경, 김재희, 서어진 프로와 함께합니다.
    </div>

    <div class="statistic-cards">
      <div class="card">
        <span>창립 년도 <br><br><br></span>
        <span class="data">2019년<br><br></span>
      </div>
      <div class="card">
        <span>누적 회원 <br><br><br></span>
        <span class="data">130+ 명<br><br></span>
      </div>
      <div class="card">
        <span>활동 회원 <br><br><br></span>
        <span class="data">70+ 명<br><br></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "InfoComponent"
};
</script>

<style scoped>
.info-container {
  padding: 20px;
}

h2 {
  color: blue;
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
}

.description {
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 20px;
  text-align: center;
}

.statistic-cards {
  display: flex;
  justify-content: space-between;
  margin: auto;
}

.card {
  width: 25%;
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  text-align: center;
  background-color: #f2f2f2;
}

.data {
  font-weight: bold;
  font-size: 18px;
}
</style>
