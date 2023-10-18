<template>
  <header class="header-container">
    <div class="logo">
      <img src="../../img/logo.png" alt="Logo" width=727 />
    </div>
    <nav>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/link1">모집안내</a></li>
        <li><a href="/link2">지원하기</a></li>
<!--        <li><a href="/link3">지원서관리</a></li>-->
      </ul>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'CommonHeader'
}
</script>

<style>
.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  background-color: #143790;
}

.logo img {
  width: 60px;
  height: 60px; /* 이 값을 조정하여 원하는 로고 크기를 설정하세요. */
}

nav ul {
  display: flex;
  gap: 15px;
}

nav li {
  list-style: none;
}

nav a {
  text-decoration: none;
  color: white;
  transition: color 0.3s;
}

nav a:hover {
  color: blue;
}
</style>
