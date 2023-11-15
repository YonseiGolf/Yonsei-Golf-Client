<template>

  <div class="board-container">
    <p v-if="boardData" class="detail-category"> {{ categoryName }} </p>
    <p v-if="boardData" class="detail-title"> {{ boardData.title }} </p>
    <div v-if="boardData" class="board-user"> {{ boardData.writer }}</div>
    <div v-if="boardData" class="board-time">{{ boardData.createdAt }}</div>
    <hr>
    <p v-if="boardData" class="detail-content" v-html="formatContent(boardData.content)"></p>

    <hr>
  </div>

  <div class="reply-container" v-if="boardData && boardData.replies">
    <h3 class="replies-title">댓글</h3>
    <ul class="replies-list">
      <li class="reply" v-for="reply in boardData.replies.replies" :key="reply.id">
        <span class="reply-writer">{{ reply.writer }}</span>
        <span class="reply-content" v-html="formatContent(reply.content)"></span>
        <span class="reply-date">{{ reply.createdAt }}</span>
      </li>
    </ul>
  </div>

  <div class="reply-form-container">
    <form @submit.prevent="submitReply">
      <textarea v-model="newReply.content" placeholder="댓글을 입력하세요..." required></textarea>
      <button type="submit">댓글 등록</button>
    </form>
  </div>


</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      boardData: '',
      newReply: {
        content: '' // 사용자가 입력한 새 댓글 내용
      }
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
    },

    submitReply() {
      // API에 댓글 등록 요청을 보내는 코드를 여기에 추가합니다.
      const boardId = this.$route.params.boardId;
      axios.post(`${process.env.VUE_APP_API_URL}/boards/${boardId}/replies`, this.newReply)
          .then(() => {
            // 댓글 등록 후 처리
            // alert('댓글이 등록되었습니다.');
            this.newReply.content = ''; // 입력 폼 초기화
            this.fetchBoardData(); // 댓글 목록 새로고침
          })
          .catch(error => {
            console.error(error);
            alert('댓글을 등록하는 데 실패했습니다.');
          });
    },

    formatContent(content) {
      // 줄바꿈 문자를 <br> 태그로 변환
      return content.replace(/\n/g, '<br>');
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
  //border: 1px solid black;
  margin: 0 auto;
  text-align: left;
}
.detail-category {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}

.reply-container{
  margin: 0 auto;
  width: 50%;
  text-align: left;
}

.board-time{
  font-size: 12px;
  color: gray;
}

.detail-category{
  color: gray;
}

.detail-title{
  font-size: 30px;
  font-weight: bold;
  margin-top: 10px;
  margin-bottom: 10px;
}

.detail-content{
  margin-top: 40px;
  font-size: 15px;
  margin-bottom: 40px;
}

.reply-container {
  width: 50%;
}

.replies-title {
  font-size: 15px;
  margin-bottom: 20px;
}

.replies-list {
  list-style-type: none; // 불릿 제거
  padding: 0;
}

.reply {
  padding: 10px;
  border-bottom: 1px solid #eee; // 구분선 추가
  &:last-child {
    border-bottom: none; // 마지막 항목의 구분선 제거
  }
}

.reply-writer {
  font-weight: bold;
  margin-right: 10px;
}

.reply-content {
  font-weight: normal;
}

.reply-date {
  display: block; // 별도의 줄로 분리
  font-size: 0.8em;
  color: #777;
  margin-top: 5px;
}

hr{
  color: gray;
}

span{
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 10px;
}

.reply-form-container {
  margin: 20px auto;
  width: 50%;
}

textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  min-height: 50px; // 댓글 입력 공간을 충분히 확보
}

button {
  padding: 10px 15px;
  background-color: #1a5cc8;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}


</style>