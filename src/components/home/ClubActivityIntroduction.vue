<template>
  <div class="blue-container">
    <h2 id="title">연골 동아리는 이런 활동을 해요</h2>

    <div class="card-container">

      <div class="card grey-card">
        <img src="https://yg-img-storage.s3.ap-northeast-2.amazonaws.com/image/rounding.476519da.jpg" alt="정규 활동"
             class="introduction-image">
      </div>
      <div class="card">
        <span>
          <main-title>
            정규 활동<br><br>
          </main-title>
          <main-body>
            매주 목요일 신촌역 부근에서<br>
          정기활동을 진행해요
          </main-body>
        </span>
      </div>

      <div class="card grey-card">
        <img src="https://yg-img-storage.s3.ap-northeast-2.amazonaws.com/image/new-comer.efdadda2.jpg" alt="신입 환영 MT"
             class="introduction-image">
      </div>
      <div class="card">
        <span>
          <main-title>
            신입 환영 MT<br><br>
          </main-title>

          <main-body>
            신입 부원들과 기존 부원들과의 조화를 위해<br>
            신입 환영 MT를 진행해요</main-body>
        </span>
      </div>

      <div class="card grey-card">
        <img
            src="https://yg-img-storage.s3.ap-northeast-2.amazonaws.com/image/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA+2023-11-16+%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE+9.58.19.png"
            alt="단체 라운딩" class="introduction-image">
      </div>
      <div class="card">
        <span>
          <main-title>
            단체 라운딩<br><br>
          </main-title>

          <main-body>
            매 학기 경기권에서 라운딩을 진행해요
          </main-body>
        </span>
      </div>

      <div class="card grey-card">
        <img
            src="https://yg-img-storage.s3.ap-northeast-2.amazonaws.com/image/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA+2023-11-16+%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE+9.57.21.png"
            alt="OB 엠티" class="introduction-image">
      </div>
      <div class="card">
        <span>

          <main-title>
            OB 라운딩<br><br>
          </main-title>

          <main-body>
            YB 활동이 끝나더라도<br>
            OB 부원과 라운딩을 함께해요
          </main-body>
        </span>
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

.blue-container {

  background-color: #08366f;
  padding: 4%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 3%;
}


h2 {
  font-size: 30px;

  font-family: 'GmarketSansMedium', sans-serif;
}

.card-container {
  width: 60%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 50px;
}

.card {
  margin-bottom: 5%; /* 카드 간의 위아래 간격 설정 */
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 20px; /* 글자 크기 설정 */

  border: 1px solid #a5b1c2;
  border-radius: 10px;

  overflow: hidden;
}

@media (max-width: 1024px) {
  .card-container {
    width: 90%; /* 모바일 환경에서는 너비를 늘립니다 */
    grid-template-columns: 1fr; /* 모바일 환경에서는 카드를 한 행에 하나만 표시합니다 */
  }
}

.introduction-image {
  max-width: 100%;
  height: auto;
  border-radius: 9px;
}

main-title {
  font-size: 30px;
  font-weight: bold;
  font-family: 'GmarketSansMedium', sans-serif;
}

main-body {
  font-size: 18px;
  font-family: 'Pretendard-Regular', sans-serif;
}
</style>
