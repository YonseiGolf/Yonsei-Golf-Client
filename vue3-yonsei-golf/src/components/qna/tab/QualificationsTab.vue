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
      질문글 2
    </label>
    <div>
      <p>
        답변글 2
      </p>
    </div>
  </div>

  <!--  type="checkbox"로 (name 없이)하면 탭이 열린채로 둘 수 있고, type=radio, name=accordion 으로 하면, 탭은 하나만 열리도록 할 수 있음-->
  <div class="answer-container">
    <input type="checkbox" id="qualifications-answer03">
    <label for="qualifications-answer03">
      질문글 3
    </label>
    <div>
      <p>
        답변글 3
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
  width: 800px;
  margin-bottom: 20px;
  text-align: left;
  background: #f2f2f2;
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
</style>