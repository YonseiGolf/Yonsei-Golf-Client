<template>
  <h1>
    모집 일정
  </h1>
  <div class="container">
    <div class="text-box">
      서류 접수
      &nbsp;&nbsp;&nbsp;&nbsp;
      00월 00일 ~ 00월 00시
      <br><br>

      서류 합격 발표
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      00월 00일
      <br><br>

      면접
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      00월 00일 ~ 00월 00시
      <br><br>

      최종 결과 발표
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      00월 00일
      <br><br>

      오리엔테이션
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      00월 00일
      <br><br>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>

h1 {
  color: #143673;
}

.container {
  display: flex;
  justify-content: center; /* 가로 중앙 정렬 */
  //height: 100vh; /* 뷰포트 높이로 설정 */
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