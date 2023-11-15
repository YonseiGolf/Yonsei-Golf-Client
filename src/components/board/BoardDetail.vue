<template>

  <div class="board-container">
    <p v-if="boardData" class="detail-category"> {{ categoryName }} </p>
    <p v-if="boardData" class="detail-title"> {{ boardData.title }} </p>
    <div v-if="boardData" class="board-user"> {{ boardData.writer }}</div>
    <div v-if="boardData" class="board-time">{{ boardData.createdAt }}</div>
    <p v-if="boardData" class="detail-content"> {{ boardData.content }}</p>
  </div>
  <div> 댓글 창 - 구현 예정</div>

</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      boardData: null
    }
  },
  created() {
    this.fetchBoardData();
  },
  methods: {
    fetchBoardData() {
      const boardId = this.$route.params.boardId;
      axios.get(`${process.env.VUE_APP_API_URL}/boards/${boardId}`)
          .then(response => {
            if (response.data.status === "success") {
              this.boardData = response.data.data;
            } else {
              alert("게시글을 불러오는데 실패했습니다.");
            }
          })
          .catch(error => {
            console.error(error);
            alert("게시글을 불러오는데 실패했습니다.");
          });
    }
  },
  computed: {
    categoryName() {
      if (this.boardData && this.boardData.category) {
        switch (this.boardData.category) {
          case 'NOTICE':
            return '공지';
          case 'FREE':
            return '자유게시판';
          default:
            return '기타'; // 기본값 혹은 예상치 못한 값에 대한 처리
        }
      }
      return null; // boardData가 아직 설정되지 않았을 때
    }
  }
}
</script>

<style lang="scss" scoped>
.board-container {
  padding-top: 50px;
  width: 50%;
  border: 1px solid black;
  margin: 0 auto;
  text-align: left;
}
.detail-category {
  font-size: 20px;
  font-weight: bold;
  border: 1px solid black;
}
</style>