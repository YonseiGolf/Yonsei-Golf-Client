<template>
  <header class="header-container">
    <div class="logo">
      <router-link to="/">
        <img src="https://yg-img-storage.s3.ap-northeast-2.amazonaws.com/image/logo.5d322a8d.png" alt="Logo" width=727/>
      </router-link>
    </div>
    <nav>
      <ul class="header-nav">

        <li>
          <router-link to="/board">게시판</router-link>
        </li>

        <li>
          <router-link to="/apply/form">지원서</router-link>
        </li>
        <li v-if="adminStatus">
          <router-link to="/admin/form">
            지원서 관리
          </router-link>
        </li>

        <li v-if="adminStatus">
          <router-link to="/admin/users">
            회원 관리
          </router-link>
        </li>

        <li>
          <router-link to="/">Home</router-link>
        </li>
        <li>
          <router-link to="/recruit">모집안내</router-link>
        </li>
        <li>
          <router-link to="/apply">지원하기</router-link>
        </li>
        <li v-if="!username">
          <router-link to="/login">로그인</router-link>
        </li>
        <li v-else class="logout-button" @click="logout">로그아웃</li>
      </ul>
    </nav>
  </header>
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

    const logout = async () => {
      await store.dispatch('logout');
    };

    return {
      username, adminStatus, logout
    };
  },

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

.header-nav {
  font-size: 15px;
  color: white;
  font-weight: bold;
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

.logout-button {
  cursor: pointer; /* 커서를 포인터로 설정 */
  color: white; /* 기본 텍스트 색상 */
  transition: color 0.3s; /* 호버 효과 적용 */
}

.logout-button:hover {
  color: black; /* 호버 시 텍스트 색상 변경 */
}

</style>
