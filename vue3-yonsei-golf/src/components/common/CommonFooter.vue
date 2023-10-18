<template>
  <footer class="common-footer">
    <div id="contact">Contact
      <a :href="instaUrl" target="_blank" id="insta">
        <img src="../../img/instalogo.png" alt="Instagram">
      </a>
    </div>
    <div id="copyright">Copyright @YONSEI_GOLF. ALL RIGHTS RESERVED.</div>
  </footer>
</template>

<script>
export default {
  name: 'CommonFooter',

  data() {
    return {
      instaUrl: "https://www.instagram.com/yonsei__golf/"
    }
  },
}
</script>

<style scoped>
.common-footer {
  background-color: #4d4d4d;
  color: white;
  padding: 10px 0;
  text-align: center;
  font-size: 12px;
}

.common-footer img {
  width: 20px;
  height: 20px;
}

#contact {
  text-align: left;
}

#copyright {
  align-content: center;
  top: 10px;
}

</style>
