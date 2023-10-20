<template>
  <header class="header-container">
    <div class="logo">
      <img src="../../img/logo.png" alt="Logo" width=727 />
    </div>
    <nav>
      <ul class="header-nav">
        <li><router-link to="/">Home</router-link ></li>
        <li><router-link to="/recruit">모집안내</router-link></li>
        <li><router-link to="/apply">지원하기</router-link></li>
<!--        <li><router-link to="/apply/administration">지원서관리</router-link></li>-->
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
  height: 60px;
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
  color: black;
}

</style>
