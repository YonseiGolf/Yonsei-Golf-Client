<template>
  <div class="loading-modal">
    <img :src="loadingGif" alt="Loading..." />
  </div>
</template>

<script>
export default {
  data() {
    return {
      loadingGif: "https://yg-img-storage.s3.ap-northeast-2.amazonaws.com/image/loading.a11988e6.gif"
    };
  }
};
</script>

<style scoped>
.loading-modal {
  position: fixed;      /* 고정 위치 */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);  /* 반투명한 검은색 배경 */
  z-index: 9999;        /* 다른 요소 위에 표시 */
  display: flex;        /* 자식 요소 중앙 정렬을 위한 flex */
  align-items: center;
  justify-content: center;
}
</style>