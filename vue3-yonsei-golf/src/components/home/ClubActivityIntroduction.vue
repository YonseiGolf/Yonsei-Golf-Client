<template>
  <div class="blue-container">
    <h2 id="title">연골 동아리는 이런 활동을 해요</h2>

    <div class="card-container">

      <div class="card grey-card">
        <img src="https://yg-img-storage.s3.ap-northeast-2.amazonaws.com/image/rounding.476519da.jpg" alt="정규 활동" class="introduction-image">
      </div>
      <div class="card">
        <span>정기 활동 </span>
      </div>

      <div class="card grey-card">
        <img src="https://yg-img-storage.s3.ap-northeast-2.amazonaws.com/image/new-comer.efdadda2.jpg" alt="정규 활동" class="introduction-image">
      </div>
      <div class="card">
        <span>신입 환영 MT</span>
      </div>

      <div class="card grey-card">
        <img src="https://yg-img-storage.s3.ap-northeast-2.amazonaws.com/image/rounding.476519da.jpg" alt="단체 라운딩" class="introduction-image">
      </div>
      <div class="card">
        <span>단체 라운딩</span>
      </div>

      <div class="card grey-card">
        <img src="https://yg-img-storage.s3.ap-northeast-2.amazonaws.com/image/home-coming.9bb01e6a.jpg" alt="홈커밍데이" class="introduction-image">
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
  margin-bottom: 20px; /* 제목과 카드 컨테이너 사이의 간격 설정 */
  color: white; /* 제목 색상 설정 */
}


#title {
  text-align: center;
}

.blue-container {
  background-color: #0a3d91;
  padding: 40px;

  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}


h2 {
  font-size: 24px;
}

.card-container {
  width: 60%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 50px;
}

.card {
  width: 100%; /* 카드의 너비 설정 */
  height: 100%; /* 카드의 높이 설정 */
  margin-bottom: 5%; /* 카드 간의 위아래 간격 설정 */
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 20px; /* 글자 크기 설정 */

  border: 1px solid #a5b1c2;
  border-radius: 10px;
}

@media (max-width: 768px) {
  .card-container {
    width: 90%; /* 모바일 환경에서는 너비를 늘립니다 */
    grid-template-columns: 1fr; /* 모바일 환경에서는 카드를 한 행에 하나만 표시합니다 */
  }
}


.introduction-image {
  width: 100%;
  height: 100%;
  border-radius: 9px;
}

</style>
