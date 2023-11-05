<template>
  <v-container class="boardList-header">
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 py-4">게시판</h1>
      </v-col>
    </v-row>
  </v-container>

  <v-container clsas="boarder-category">
    <v-row justify="start">
      <v-col cols="12" md="8">
        <v-tabs v-model="activeCategory" background-color="transparent">
          <v-tab v-for="category in categories" :key="category.name" :value="category.name">
            {{ category.displayName }}
          </v-tab>
        </v-tabs>
      </v-col>
    </v-row>
  </v-container>

  <v-container>
    <v-row justify="space-between">
      <v-col cols="12" md="8">
        <v-simple-table style="width: 100%;">
          <template v-slot:default>
            <thead>
            <tr>
              <th class="text-center">카테고리</th>
              <th>제목</th>
              <th class="text-center">작성자</th>
              <th class="text-center">작성일</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="post in filteredPosts" :key="post.id" @click="goToDetail(post.id)">
              <td class="text-center">{{ getCategoryName(post.category) }}</td>
              <td>{{ post.title }}</td>
              <td class="text-center">{{ post.writer }}</td>
              <td class="text-center">{{ post.createdAt }}</td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>
  </v-container>

  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-pagination v-model="page" :length="totalPages" @input="fetchPosts"></v-pagination>
      </v-col>
    </v-row>
  </v-container>

  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8" class="text-right">
        <v-btn @click="goToPost">글쓰기</v-btn>
      </v-col>
    </v-row>
  </v-container>

</template>


<script>
import axios from "axios";

export default {
  data() {
    return {
      categories: [
        {name: 'ALL', displayName: '전체'},
        {name: 'NOTICE', displayName: '공지'},
        {name: 'FREE', displayName: '자유게시판'},
        // 여기에 추가 카테고리
      ],
      activeCategory: 'ALL',
      posts: [], // 이 배열은 서버에서 가져온 게시글 데이터,
      page: 0, // 현재 페이지 번호
      totalPages: 0, // 전체 페이지 수
    };
  },

  computed: {
    filteredPosts() {
      // activeCategory에 따라 게시글 필터링
      if (this.activeCategory === 'ALL') {
        return this.posts;
      }
      return this.posts.filter(post => post.category === this.activeCategory);
    }
  },

  // Vue 라이프 사이클과 함꼐하는 메서드
  async created() {
    await this.fetchPosts(this.page);
  },


  methods: {
    // 게시글 세부 정보 페이지로 이동하는 함수
    goToDetail(boardId) {
      this.$router.push(`/board/${boardId}`);
    },


    async fetchPosts(page) {
      // 카테고리가 ALL이 아니라면 category 파라미터를 추가
      const categoryParam = this.activeCategory !== 'ALL' ? `&category=${this.activeCategory}` : '';

      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/boards?page=${page}&size=10${categoryParam}`);
        this.posts = response.data.data.content;
        this.totalPages = response.data.data.totalPages;
        this.page = Math.max(0, Math.min(page, this.totalPages - 1)); // 페이지 값 조정
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    },

    async selectCategory(category) {
      this.activeCategory = category.name;
      await this.fetchPosts(0); // 카테고리 변경 시 첫 페이지부터 보여주기
    },

    getCategoryName(categoryCode) {
      const categoryNames = {
        'NOTICE': '공지',
        'FREE': '자유게시판',
        // 기타 카테고리 코드에 대한 이름도 이곳에 추가할 수 있습니다.
      };
      // categoryCode에 해당하는 이름을 반환하거나, 없다면 코드 그대로 반환
      return categoryNames[categoryCode] || categoryCode;
    },

    goToPost() {
      this.$router.push('/board/post');
    }

  },

};
</script>


<style lang="scss" scoped>
.boardList-header {
  margin: 0 auto;
  width: 80%;
  display: flex;
  text-align: center;
}

table {
  border-collapse: collapse; /* 경계선을 겹치게 */
  margin-top: 20px; /* 테이블 상단에 여백을 추가 */
  //border-left: 1px solid #ccc; // 테이블의 왼쪽 경계선
  //border-right: 1px solid #ccc; // 테이블의 오른쪽 경계선
}

th, td {
  border-top: 1px solid #ccc; // 가로선만 표시
  border-bottom: 1px solid #ccc; // 가로선만 표시
}
th:nth-child(2), td:nth-child(2) {
  width: 50%; /* 3/6의 비율 */
}

th:nth-child(1), td:nth-child(1),
th:nth-child(3), td:nth-child(3),
th:nth-child(4), td:nth-child(4) {
  width: 16.66%; /* 1/6의 비율 */
  text-align: center;
}
th {
  padding: 8px; /* 셀 내부에 패딩을 추가하여 내용이 선에 닿지 않도록 */
  text-align: center;
}

td {
  padding: 8px; /* 셀 내부에 패딩을 추가하여 내용이 선에 닿지 않도록 */
  text-align: left; /* 텍스트를 왼쪽 정렬 */
}

thead {
  background-color: #f9f9f9; /* 테이블 헤더의 배경색 */
}

.boardList:hover {
  background-color: #f1f1f1; /* 마우스를 올렸을 때 행의 배경색을 변경 */
}

.pagination {
  list-style-type: none;
  display: flex;
  justify-content: center;
  padding: 0;
}

.page-item {
  margin: 0 5px;
}

.page-link {
  cursor: pointer;
  padding: 5px 10px;
  border: 1px solid #ddd;
  color: #337ab7;
}

.page-link:hover {
  background-color: #eee;
}

/* 탭 컨테이너 스타일 */
.nav-tabs {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0 auto;
  border-bottom: 1px solid #ccc;
  width: 80%;
}

/* 각 탭 아이템 스타일 */
.nav-tabs li {
  margin-bottom: -1px; /* 탭 아래 경계선과 겹치게 하여 선택된 탭 효과 */
}

/* 탭 링크 기본 스타일 */
.nav-tabs a {
  display: block;
  padding: 0.5rem 1rem;
  text-decoration: none;
  background: #f7f7f7;
  border: 1px solid transparent;
  border-bottom: none;
  color: #555;
  transition: background-color 0.2s ease-in-out;
}

/* 활성 탭 및 호버 스타일 */
.nav-tabs a:hover,
.nav-tabs .active a {
  background: #fff;
  border-color: #ccc;
  color: #333;
}

/* 탭 컨텐츠 영역 스타일 */
.tab-content {
  border: 1px solid #ccc;
  border-top: none;
  padding: 1rem;
}

.board-button {
  margin: 0 auto;
  width: 80%;
  display: flex;
  justify-content: flex-end;
}
</style>
