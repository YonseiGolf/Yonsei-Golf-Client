<template>
  <div class="contact-card">
    <h1>지금 바로 함께 해요</h1>
    <div class="contact-detail">상세 문의사항</div>
    <div class="contact-info">회장 임동현 : 010 0000 0000</div>
    <div class="contact-info">부회장 임동현 : 010 0000 0000</div>
    <div class="contact-detail">자세히 둘러보기</div>
    <p>
<!--      <a href="https://www.instagram.com/yonsei__golf/" target="__blank">-->
        INSTAGRAM : @yonsei__golf
<!--      </a>-->
    </p>
    <div class="buttons">
      <button>&nbsp;&nbsp;&nbsp;모집안내&nbsp;&nbsp;&nbsp;</button>
      <button>&nbsp;&nbsp;&nbsp;지원하기&nbsp;&nbsp;&nbsp;</button>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.contact-card {
  //width: 80%;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Noto Sans KR', sans-serif;
  text-align: center;
}

h1 {
  font-size: 32px;
  margin-bottom: 30px;
  color: #143673;
  font-weight: 500;
}

.contact-detail{
  font-size: 20px;
  margin-top: 15px;
  margin-bottom: 10px;
  font-weight: 400;
  color: #4d4d4d;
}

p {
  font-size: 16px;
  color: #4d4d4d;
  font-weight: 500;
}

.contact-info{
  font-size: 16px;
  font-weight: normal;
  color: #4d4d4d;
}

.buttons {
  margin-top: 20px;
}

button {
  padding: 10px 20px;

  background-color: white;
  color: #143673;

  border: 2px solid #094a7a;
  border-radius: 30px;
  cursor: pointer;

  transition: background-color 0.3s ease;
  margin-top: 20px;
  margin-bottom: 40px;
}

button:hover {
  background-color: #094a7a;
  color: white;
}

.buttons button {
  margin-right: 20px;
  font-size: 24px;
}

.buttons button:last-child {
  margin-right: 0;
}

</style>