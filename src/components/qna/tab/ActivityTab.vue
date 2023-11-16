<template>
  <!--    활동-->
  <div class="answer-container">
    <input type="checkbox" id="activity-answer01">
    <label for="activity-answer01">
      Q. 연세 골프 활동은 어떻게 진행되나요?
    </label>
    <div>
      <p>
        A. 매주 목요일 오후 6시 신촌역 부근에서 진행합니다.
      </p>
    </div>
  </div>

  <div class="answer-container">
    <input type="checkbox" id="activity-answer02">
    <label for="activity-answer02">
      Q. 동아리 회비가 있나요?
    </label>
    <div>
      <p>
        A. 회비는 활동 학기당 2만원으로, 동아리 차원에서 제작하는 볼마커, 숙소비 지원 등으로 사용하고 있습니다.
      </p>
    </div>
  </div>

  <div class="answer-container">
    <input type="checkbox" id="activity-answer03">
    <label for="activity-answer03">
      Q. 본인 소유의 클럽이 있어야 하나요?
    </label>
    <div>
      <p>
        A. 매주 동아리 활동은 대여채를 사용하실 수 있습니다. 하지만 단체 라운딩의 경우 본인 클럽이 필요합니다.
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