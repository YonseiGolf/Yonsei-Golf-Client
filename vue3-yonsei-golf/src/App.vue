<template>
  <div id="app">
    <header>
      <CommonHeader></CommonHeader>
    </header>

    <div>내용</div>

    <footer>
      <CommonFooter></CommonFooter>
    </footer>


  </div>
</template>

<script>
import CommonHeader from './components/common/CommonHeader.vue'
import CommonFooter from './components/common/CommonFooter.vue'
export default {
  name: 'App',

  components: {
    CommonHeader,
    CommonFooter,
  }
}
</script>

<style lang="scss">
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  > common-footer {
    position: sticky;
    top: 0;
    z-index: 1000;
  }

  > footer {
    margin-top: auto;
  }
}
body {
  margin: 0;
}
</style>
