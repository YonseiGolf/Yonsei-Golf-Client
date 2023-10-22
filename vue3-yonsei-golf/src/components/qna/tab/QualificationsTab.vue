<template>
    <!--    지원 자격-->
    <input type="radio" name="accordion" id="qualifications-answer01">
    <label for="qualifications-answer01">
      질문글 1 <em></em>
    </label>
    <div>
      <p>
        답변글 1
      </p>
    </div>

    <input type="radio" name="accordion" id="qualifications-answer02">
    <label for="qualifications-answer02">
      질문글 2 <em></em>
    </label>
    <div>
      <p>
        답변글 2
      </p>
    </div>

<!--  type="checkbox"로 (name 없이)하면 탭이 열린채로 둘 수 있고, type=radio, name=accordion 으로 하면, 탭은 하나만 열리도록 할 수 있음-->
    <input type="radio" name="accordion" id="qualifications-answer03">
    <label for="qualifications-answer03">
      질문글 3 <em></em>
    </label>
    <div>
      <p>
        답변글 3
      </p>
    </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>

input[id*="answer"] {
  display: none;
}

input[id*="answer"] + label {
  display: block;
  padding: 20px;
  border: 1px solid #143790;
  border-bottom: 0;
  color: black;
  font-weight: 900;
  cursor: pointer;
  position: relative;
}

input[id*="answer"] + label em {
  position: absolute; // 오른쪽에 자율 배치
  top: 50%;
  right: 10px;
  width: 30px;
  height: 30px;
  margin-top: -15px;
  display: inline-block;
  background: url('../../../img/instalogo.png') 0 0 no-repeat
}

input[id*="answer"] + label + div {
  max-height: 0;
  transition: all .35s;
  overflow: hidden; // 안의 내용이 삐져나오지 않음
  background: #ebf8ff;
  font-size: 11px;
}

input[id*="answer"] + label + p {
  display: inline-block;
  padding: 20px;
}

input[id*="answer"]:checked + label + div {
  max-height: 100px;
}

input[id*="answer"]:checked + label em {
  background-position: 0 -30px;
}
</style>