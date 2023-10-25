<template>
  <div id="app">
    <header>
      <CommonHeader></CommonHeader>
    </header>

    <router-view></router-view>

    <footer>
      <CommonFooter></CommonFooter>
    </footer>
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  display: flex;
  flex-direction: column;
  min-height: 100vh;

  > header {
    position: sticky;
    top: 0;
    z-index: 1000;
  }

  > footer {
    margin-top: auto;
  }
}

nav {

  a {
    font-weight: bold;
    // navigation bar의 텍스트 색상
    color: white;

    &.router-link-exact-active {
      //라우터 링크 선택될때 나오는 색
      color: #42b983;
    }
  }
}

body {
  margin: 0;
}
</style>
<script setup>
import CommonFooter from "@/components/common/CommonFooter.vue";
import CommonHeader from "@/components/common/CommonHeader.vue";
</script>