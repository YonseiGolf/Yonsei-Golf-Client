<template>
  <div class="background-image">
    <h1 id="yonsei-golf">
      YONSEI GOLF
    </h1>
    <h2 id="info">
      연세 골프는 골프를 시작한지 얼마 되지 않은 초심자부터 프로까지<br>
      다양한 실력을 보유하고 있는 사람들과 함께 합니다.
    </h2>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.background-image {
  width: 100%;
  height: 600px;
  padding-top: (1284 / 946) * 10%;
  position: relative;

  background-image: url('https://yg-img-storage.s3.ap-northeast-2.amazonaws.com/image/main_info_image.c68f1fb3.jpg');

  background-position: center;
  background-repeat: no-repeat;

  background-size: cover;
  opacity: 0.9;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5));
    pointer-events: none;
  }
}

#yonsei-golf {
  font-size: 100px;
  color: white;
  text-align: left;
  margin-left: 10%;
  position: relative;
}

#info {
  font-size: 25px;
  color: white;
  text-align: left;
  margin-left: 10%;
  position: relative;
}

@media (max-width: 768px) {

  #yonsei-golf {
    font-size: 50px;
    color: white;
    text-align: left;
    margin-left: 10%;
    position: relative;
  }

  #info {
    display: none;
  }

}

#yonsei-golf{
  font-family: 'GmarketSansMedium', sans-serif;
}

#info{
  font-family: 'GmarketSansMedium', sans-serif;
}

</style>