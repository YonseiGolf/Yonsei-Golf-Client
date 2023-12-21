<template>

  <div class="white-container"></div>
  <div class="info-container">
    <h2>연골 동아리 소개</h2>
    <div class="description">
      연세대학교 골프동아리 연세골프는<br><br>
      KPGA, KLPGA 투어프로<br><br>
      이효린, 염은호, 신의경, 김재희, 서어진 프로와 함께합니다.
    </div>

    <div class="statistic-cards">
      <div class="card">
        <div class="info-title"><br>창립 년도<br><br><br></div>
        <div class="data">2019년<br><br></div>
      </div>
      <div class="card">
        <span><br>누적 회원 <br><br><br></span>
        <span class="data">130+ 명<br><br></span>
      </div>
      <div class="card">
        <span><br>활동 회원 <br><br><br></span>
        <span class="data">70+ 명<br><br></span>
      </div>
    </div>
  </div>
  <div class="white-container"></div>
</template>

<script>
export default {
  name: "InfoComponent"
};
</script>

<style scoped>

.white-container {
  background-color: white;
  height: 150px;
}

.info-container {
  padding: 20px;
  font-family: 'Pretendard-Regular', sans-serif;

}

h2 {
  color: #143673;
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;

  font-family: 'GmarketSansMedium', sans-serif;
}

.description {
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 20px;
  text-align: center;
  font-size: 18px;
}

.statistic-cards {
  display: flex;
  justify-content: center;
  margin: auto;
}

.card {
  width: 30%;
  max-width: 250px;
  //height: 50%;
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  background-color: #f2f2f2;
  margin: 10px;
  //align-content: center;
}

.data {
  font-weight: bold;
  font-size: 30px;
}
</style>
