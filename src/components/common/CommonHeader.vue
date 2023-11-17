<template>
  <header class="header-container">
    <div class="logo">
      <router-link to="/">
        <img src="https://yg-img-storage.s3.ap-northeast-2.amazonaws.com/image/logo.5d322a8d.png" alt="Logo" width=727/>
      </router-link>
    </div>
    <nav>
      <ul class="header-nav">
        <li v-if="adminStatus">
          <router-link to="/admin">어드민</router-link>
        </li>
        <li>
          <router-link to="/board">게시판</router-link>
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

    <div class="mobile_btn">
      <input type="checkbox" id="hamburger" v-model="isHamburgerOpen"/>
      <label for="hamburger">
        <span></span>
        <span></span>
        <span></span>
      </label>




      <div class="sidebar">
        <img src="https://yg-img-storage.s3.ap-northeast-2.amazonaws.com/image/logo.5d322a8d.png" alt="Logo" width=100/>
        <hr style="position: relative; top:100px; border: solid 1px black;">
        <ul class="nav_mobile">
          <li>
            <router-link to="/" @click="closeHamburger">Home</router-link>
          </li>
          <li v-if="adminStatus" @click="closeHamburger">
            <router-link to="/admin">어드민</router-link>
          </li>
          <li>
            <router-link to="/board" @click="closeHamburger">게시판</router-link>
          </li>
          <li>
            <router-link to="/recruit" @click="closeHamburger">모집안내</router-link>
          </li>
          <li>
            <router-link to="/apply" @click="closeHamburger">지원하기</router-link>
          </li>
          <li v-if="!username" @click="closeHamburger">
            <router-link to="/login">로그인</router-link>
          </li>
          <li v-else class="logout-button" @click="logout">로그아웃</li>
        </ul>
      </div>
    </div>

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

  data() {
    return {
      isHamburgerOpen: false, // 햄버거 메뉴의 상태를 저장
    }
  },

  methods: {
    // 햄버거 메뉴를 토글하는 메소드
    toggleHamburger() {
      this.isHamburgerOpen = !this.isHamburgerOpen;
    },
    // 햄버거 메뉴를 닫는 메소드
    closeHamburger() {
      this.isHamburgerOpen = false;
    },
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












a {text-decoration: none;
  color: black;}

html,body {width: 100%; overflow-x: hidden; overflow-y: auto;}

* {margin: 0; padding: 0;}

.mobile_btn {
  display: none; /* 기본적으로 숨깁니다 */
  position: absolute;
  //top: 70px;
  right: 15px; /* 왼쪽 대신 오른쪽 정렬 */
  z-index: 100; /* 다른 요소 위에 표시되도록 z-index 설정 */
}

input[id="hamburger"] {
  display: none;
}
input[id="hamburger"] + label {
  display: block;
  width: 60px;
  height: 40px;
  position: relative;
  cursor: pointer;
}
input[id="hamburger"] + label span {
  display: block;
  position: absolute;
  width: 100%;
  height: 5px;
  border-radius: 30px;
  background: #000;
  transition: all 0.35s;
}
input[id="hamburger"] + label span:nth-child(1) {
  top: 0;
}
input[id="hamburger"] + label span:nth-child(2) {
  top: 50%;
  transform: translateY(-50%);
}
input[id="hamburger"] + label span:nth-child(3) {
  bottom: 0;
}
input[id="hamburger"]:checked + label {
  z-index: 99;
}
input[id="hamburger"]:checked + label span {
  background: black;
}
input[id="hamburger"]:checked + label span:nth-child(1) {
  top: 50%;
  transform: translateY(-50%) rotate(45deg);
}
input[id="hamburger"]:checked + label span:nth-child(2) {
  opacity: 0;
}
input[id="hamburger"]:checked + label span:nth-child(3) {
  bottom: 50%;
  transform: translateY(50%) rotate(-45deg);
}
div[class="sidebar"] {
  width: 100%;
  height: 100%;
  background: white;
  position: fixed;
  top: 0;
  left: -100%;
  z-index: 98;
  transition: all 0.35s;
}

input[id="hamburger"]:checked + label + div {
  left: 0;
}

.nav_mobile {
  position: absolute;
  top:119px;
  width: 100%;
}

.sidebar .nav_mobile li {
  color:black;
  position:relative;
  float:left;
  width:100%;
  list-style-type:none;
  font-size:20px;
  border-bottom:1px solid #ccc;
  font-family: 'Noto Sans KR';
  font-weight:bold;
  padding-top: 20px;
  padding-bottom: 20px;
  text-align: center;
}

.sidebar a {
  padding: 0;
  text-decoration: none;
  display: block;
}

.sidebar li a{
  display:block;
  font-weight:bold;
  line-height:40px;
  margin:0px;
  padding:0;
  text-align:center;
  text-decoration:none;
  transition: all 0.4s;
}

.sidebar li a:hover, .sidebar ul li:hover a {

  text-decoration: none;
  color: #eee;
  padding: 0;
  margin: 0;
  border: 0px;
}

//미디어 쿼리
@media (min-width: 1024px) {
  .mobile_btn, .sidebar {
    display: none;
  }

  .header-nav {
    display: flex;
  }
}


@media (max-width: 1024px) {
  .header-nav {
    display: none;
  }

  .mobile_btn, .sidebar {
    display: block;
  }

  .mobile_btn {
    position: relative; /* 위치 조정이 필요하면 수정하세요. */
  }
}

/* 햄버거 메뉴 버튼 크기 조정 */
input[id="hamburger"] + label {
  width: 50px; /* 너비를 줄입니다 */
  height: 30px; /* 높이를 줄입니다 */
}

/* 햄버거 메뉴 선의 크기 조정 */
input[id="hamburger"] + label span {
  height: 3px; /* 선의 두께를 줄입니다 */
  background: white;
  /* 각 선의 위치 조정이 필요하다면 여기에서 조정합니다. */
}

/* 햄버거 메뉴 변형 시 선의 크기 조정 */
input[id="hamburger"]:checked + label span:nth-child(1),
input[id="hamburger"]:checked + label span:nth-child(3) {
  /* 선의 두께가 변형되는 경우 여기에서 조정합니다. */
}

</style>
