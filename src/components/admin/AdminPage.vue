<template>
  <h1>어드민 페이지</h1>
  <div class="tab-container">
    <li>
      <router-link to="/admin/users">회원 관리</router-link>
    </li>
    <li>
      <router-link to="/admin/form">지원서 관리</router-link>
    </li>
    <li>
      <router-link to="/admin/apply-alarm">지원 대기 명단</router-link>
    </li>
    <li>
      <router-link to="/admin/apply/form">지원서 양식</router-link>
    </li>
  </div>


  <div class="router-container">
    <router-view></router-view>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>

.tab-container {
  display: flex;
  flex-direction: row; // 가로 방향으로 정렬
  align-items: center; // 중앙 정렬
  justify-content: center; // 시작 부분부터 정렬
  padding:1vh;
}


li {
  list-style: none;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 0.5vh;
  margin-right: 1vh;
  margin-bottom: 5vh;
}

.router-link {
  display: block;
  padding: 10px 20px;
  color: #333;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s, color 0.3s;
}

.router-link:hover {
  background-color: #f0f0f0;
  color: #000;
}

.router-link-active {
  background-color: gray;
  color: #fff;
  border-radius: 4px;
}


</style>