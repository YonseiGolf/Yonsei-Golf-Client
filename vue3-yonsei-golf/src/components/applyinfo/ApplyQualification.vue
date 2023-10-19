<template>
  <h1>
    연세 골프에서는<br>
    이러한 사람들을 모집합니다.
  </h1>
  <div class="container">
    <div class="text-box">
      ⛳️ 혼자 즐기던 골프를 다른 사람들과 함께하고 싶은 분 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <br><br>
      ⛳️ 비슷한 또래와 라운딩하며 실력 향상을 원하는 분 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <br><br>
      ⛳️ 골프를 치면서 타과 학생들과 함께 친목을 다지고 싶은 분
      <br><br>
      ⛳️ 골프에 대해 남다른 열정을 가지고 있는 분
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    </div>
  </div>

</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
h1{
  color: #143673;
}
.container{
  display: flex;
  justify-content: center; /* 가로 중앙 정렬 */
  //height: 100vh;           /* 뷰포트 높이로 설정 */
}

.text-box {
  border: 1px solid #e3e3e3; /* 테두리 색상 */
  padding: 20px; /* 내부 패딩 */
  width: 600px; /* 박스의 너비 */
  height: 200px; /* 박스의 높이 */
  display: flex; /* 텍스트를 중앙에 위치시키기 위한 flex 사용 */
  justify-content: center; /* 가로 중앙 정렬 */
  align-items: center; /* 세로 중앙 정렬 */
  text-align: center; /* 텍스트 중앙 정렬 */
  border-radius: 20px;
}

</style>