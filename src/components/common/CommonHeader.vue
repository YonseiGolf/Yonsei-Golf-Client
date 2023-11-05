<!--<template>-->
<!--  <header class="header-container">-->
<!--    <div class="logo">-->
<!--      <img src="https://yg-img-storage.s3.ap-northeast-2.amazonaws.com/image/logo.5d322a8d.png" alt="Logo" width=727/>-->
<!--    </div>-->
<!--    <nav>-->
<!--      <ul class="header-nav">-->
<!--        <li>-->
<!--          <router-link to="/apply/form">지원서</router-link>-->
<!--        </li>-->
<!--        <li v-if="adminStatus">-->
<!--          <router-link to="/admin/form">-->
<!--            지원서 관리-->
<!--          </router-link>-->
<!--        </li>-->

<!--        <li v-if="adminStatus">-->
<!--          <router-link to="/admin/users">-->
<!--            회원 관리-->
<!--          </router-link>-->
<!--        </li>-->

<!--        <li>-->
<!--          <router-link to="/board">게시판</router-link>-->
<!--        </li>-->

<!--        <li>-->
<!--          <router-link to="/">Home</router-link>-->
<!--        </li>-->
<!--        <li>-->
<!--          <router-link to="/recruit">모집안내</router-link>-->
<!--        </li>-->
<!--        <li>-->
<!--          <router-link to="/apply">지원하기</router-link>-->
<!--        </li>-->
<!--        <li v-if="!username">-->
<!--          <router-link to="/login">로그인</router-link>-->
<!--        </li>-->
<!--        <li v-else>{{ username }}님</li>-->
<!--      </ul>-->
<!--    </nav>-->
<!--  </header>-->
<!--</template>-->




<!--<style>-->
<!--.header-container {-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  justify-content: space-between;-->
<!--  padding: 10px 20px;-->
<!--  background-color: #143790;-->
<!--}-->

<!--.logo img {-->
<!--  width: 60px;-->
<!--  height: 60px;-->
<!--}-->

<!--.header-nav {-->
<!--  font-size: 15px;-->
<!--  color: white;-->
<!--  font-weight: bold;-->
<!--}-->

<!--nav ul {-->
<!--  display: flex;-->
<!--  gap: 15px;-->
<!--}-->

<!--nav li {-->
<!--  list-style: none;-->
<!--}-->

<!--nav a {-->
<!--  text-decoration: none;-->
<!--  color: white;-->
<!--  transition: color 0.3s;-->
<!--}-->

<!--nav a:hover {-->
<!--  color: black;-->
<!--}-->

<!--</style>-->

<template>
  <v-app-bar app>
    <v-toolbar-title class="pl-4">
      <img
          src="https://yg-img-storage.s3.ap-northeast-2.amazonaws.com/image/logo.5d322a8d.png"
          alt="Logo"
          height="50"
      />
    </v-toolbar-title>

    <v-spacer></v-spacer> <!-- This creates a flexible space that pushes the following components to the right -->

    <v-btn text to="/admin">관리자</v-btn>
    <v-btn text to="/apply/form">지원서</v-btn>
    <v-btn text to="/board">게시판</v-btn>
    <v-btn text to="/">Home</v-btn>
    <v-btn text to="/recruit">모집 안내</v-btn>
    <v-btn text to="/apply">지원하기</v-btn>
    <v-btn text v-if="!username" to="/login">로그인</v-btn>
    <v- v-else>
<!--      <span>{{ username }}</span>-->
      <v-menu open-on-hover>
        <template v-slot:activator="{ props }">
          <v-btn
            color="primary"
            v-bind="props">
            {{ username }}님
          </v-btn>
        </template>

        <v-list>
          <v-list-item to="/mypage">마이페이지</v-list-item>
          <v-list-item to="/logout">로그아웃</v-list-item>
        </v-list>

      </v-menu>
    </v->

  </v-app-bar>
</template>

<script>
import {useStore} from 'vuex';
import {computed, onMounted} from 'vue';

export default {
  name: 'CommonHeader',

  setup() {
    const store = useStore();

    // 로그인 정보 복원
    onMounted(() => {
      store.dispatch('restoreSession');
    });

    const username = computed(() => store.state.username);
    const adminStatus = computed(() => store.state.adminStatus);

    return {
      username, adminStatus
    };
  }
}

</script>

<style>
/* Custom styles here */
</style>
