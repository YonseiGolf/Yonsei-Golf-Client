<template>
  <!--    활동-->
  <input type="radio" name="accordion" id="activity-answer01">
  <label for="activity-answer01">
    질문글 1 <em></em>
  </label>
  <div>
    <p>
      답변글 1
    </p>
  </div>

  <input type="radio" name="accordion" id="activity-answer02">
  <label for="activity-answer02">
    질문글 2 <em></em>
  </label>
  <div>
    <p>
      답변글 2
    </p>
  </div>

  <input type="radio" name="accordion" id="activity-answer03">
  <label for="activity-answer03">
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

input[id*="activity-answer"] {
  display: none;
}

input[id*="activity-answer"] + label {
  display: block;
  padding: 20px;
  border: 1px solid #143790;
  border-bottom: 0;
  color: black;
  font-weight: 900;
  cursor: pointer;
  position: relative;
}

input[id*="activity-answer"] + label em {
  position: absolute; // 오른쪽에 자율 배치
  top: 50%;
  right: 10px;
  width: 30px;
  height: 30px;
  margin-top: -15px;
  display: inline-block;
  background: url('../../../img/instalogo.png') 0 0 no-repeat
}

input[id*="activity-answer"] + label + div {
  max-height: 0;
  transition: all .35s;
  overflow: hidden; // 안의 내용이 삐져나오지 않음
  background: #ebf8ff;
  font-size: 11px;
}

input[id*="activity-answer"] + label + p {
  display: inline-block;
  padding: 20px;
}

input[id*="activity-answer"]:checked + label + div {
  max-height: 100px;
}

input[id*="activity-answer"]:checked + label em {
  background-position: 0 -30px;
}
</style>