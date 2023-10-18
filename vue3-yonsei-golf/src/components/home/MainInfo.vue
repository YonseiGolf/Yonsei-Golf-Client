<template>
  <div class="background-image">
    <div id="yonsei-golf">
    YONSEI GOLF<br>
    </div>
    <div id="info">
    연세 골프는 골프를 시작한지 얼마 되지 않은 초심자부터 프로까지<br>
    다양한 실력을 보유하고 있는 사람들과 함께 합니다.
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.background-image {
  //width: 100%;
  padding-top: (1284 / 946) * 10%;
  position: relative;

  background-image: url('../../img/main_info_image.jpg');

  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  opacity: 0.8;
}

#yonsei-golf {
  font-size: 100px;

  color: white;
}

#info {
  font-size: 25px;
  color: white;
}

</style>