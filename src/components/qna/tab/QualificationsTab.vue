<template>
  <!--    지원 자격-->
  <div class="answer-container">
    <input type="checkbox" id="qualifications-answer01">
    <label for="qualifications-answer01">
      Q: 연세 골프의 지원 자격
    </label>
    <div>
      <p>
        A: 골프에 관심있는 모든 연세인
      </p>
    </div>
  </div>

  <div class="answer-container">
    <input type="checkbox" id="qualifications-answer02">
    <label for="qualifications-answer02">
      Q. 재학생만 지원 가능한가요?
    </label>
    <div>
      <p>
        A. 목요일 정기활동 일정 참여에 제한이 없다면 졸업생, 대학원생도 지원 가능합니다.
      </p>
    </div>
  </div>

  <!--  type="checkbox"로 (name 없이)하면 탭이 열린채로 둘 수 있고, type=radio, name=accordion 으로 하면, 탭은 하나만 열리도록 할 수 있음-->
  <div class="answer-container">
    <input type="checkbox" id="qualifications-answer03">
    <label for="qualifications-answer03">
      Q. 골프를 처음 하는 사람도 지원 가능한가요?
    </label>
    <div>
      <p>
        A. 골프에 대한 열정이 있고, 레슨 계획만 있으시다면 지원 가능합니다.
      </p>
    </div>
  </div>

  <div class="answer-container">
    <input type="checkbox" id="qualifications-answer04">
    <label for="qualifications-answer04">
      Q. 추가적인 질문은 어디로 하나요?
    </label>
    <div>
      <p>
        A. @yonsei__golf 인스타그램으로 DM 주시면 됩니다.
      </p>
    </div>
  </div>


</template>

<script>
export default {}
</script>

<style lang="scss" scoped>

.answer-container {
  margin: 0 auto;
  border: 1px solid #f2f2f2;
  border-radius: 20px;
  width: 95%;
  max-width: 800px;
  margin-bottom: 20px;
  text-align: left;
  background: #f2f2f2;

  font-family: 'Pretendard-Regular', sans-serif;
}

input[id*="answer"] {
  display: none;
}

input[id*="answer"] + label {
  display: block;
  padding: 20px;
  //border: 1px solid #143790;
  border-bottom: 0;
  color: black;
  font-weight: 900;
  cursor: pointer;
  position: relative;
}

input[id*="answer"] + label + div {
  max-height: 0;
  transition: all .35s;
  overflow: hidden; // 안의 내용이 삐져나오지 않음
  font-size: 14px;
  font-weight: bold;
  margin-left: 20px;
}

input[id*="answer"] + label + p {
  display: inline-block;
  overflow: hidden;
  padding: 20px;
}

input[id*="answer"]:checked + label + div {
  max-height: 100px;
}

p{
  padding-bottom: 20px;
}
</style>