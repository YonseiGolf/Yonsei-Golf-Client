<template>
  <!--    면접-->
  <div class="answer-container">
    <input type="checkbox" id="interview-answer01">
    <label for="interview-answer01">
      질문글 1
    </label>
    <div>
      <p>
        답변글 1
      </p>
    </div>
  </div>

  <div class="answer-container">
    <input type="checkbox" id="interview-answer02">
    <label for="interview-answer02">
      질문글 2
    </label>
    <div>
      <p>
        답변글 2
      </p>
    </div>
  </div>

  <div class="answer-container">
    <input type="checkbox" id="interview-answer03">
    <label for="interview-answer03">
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
  padding: 20px;
}

input[id*="answer"]:checked + label + div {
  max-height: 100px;
}

</style>