<template>

  <div class="board-header-container">
    <h2>글쓰기</h2>
  </div>

  <div class="board-body-container">
    <div class="select-category-title">
      <select v-model="selectedCategory" class="select-category">
        <option value="NOTICE">공지</option>
        <option value="FREE">자유게시판</option>
      </select>

      <input v-model="title" type="text" placeholder="제목을 입력해 주세요." class="input-title">
    </div>

  </div>
  <textarea v-model="content" class="board-body-input" placeholder="내용을 입력하세요."></textarea>

  <div class="button-container">
    <button @click="postArticle" class="posting-button">게시글 등록</button>
  </div>

</template>

<script>
import axios from "axios";
import router from "@/router";
export default {
  data() {
    return {
      selectedCategory: 'FREE',
      title: '',
      content: '',
    };
  },
  methods: {
    postArticle() {
      // 여기에 API 요청을 보내는 코드를 작성합니다
      axios.post(`${process.env.VUE_APP_API_URL}/boards`, {
        category: this.selectedCategory,
        title: this.title,
        content: this.content
      })
          .then(() => {
            router.push('/board')
            alert('게시글이 등록되었습니다.')
          })
          .catch(error => {
            console.error(error);
            alert('게시글 등록에 실패했습니다.')
            router.push('/board')
          });
    },
  },
}
</script>

<style lang="scss" scoped>
.board-header-container {
  padding-top: 20px;
  margin: 0 auto;
  width: 50%;
}
.board-body-container {
  margin: 0 auto;
  width: 50%;
}
.select-category-title {
  display: flex;
  height: 30px;
  padding-bottom: 20px;
  justify-content: space-between;
}
.select-category {
  width: 17%;
  border: 1px solid gray;
  border-radius: 10px;
  height: 100%;
}
.input-title {
  width: 70%;
  border: 1px solid gray;
  border-radius: 10px;
  height: 100%;
  text-align: left;
  padding-left: 10px;
}
.board-body-input {
  display: flex;
  margin: 0 auto;
  border: 1px solid gray;
  border-radius: 10px;
  width: 50%;
  height: 400px;
  text-align: left;
  padding: 10px;
}
@media (max-width: 1024px) {
  .board-header-container,
  .board-body-container,
  .board-body-input,
  .button-container {
    width: 90%;
  }
}

.button-container {
  display: flex;
  justify-content: flex-end;
  margin: 0 auto;
  width: 50%;
  padding-top: 20px;
}
.posting-button {
  display: flex;
}
</style>