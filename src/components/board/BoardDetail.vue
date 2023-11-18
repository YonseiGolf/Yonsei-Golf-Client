<template>

  <div class="board-container">

    <div v-if="!editing">
      <p class="detail-category"> {{ categoryName }} </p>
      <p v-if="boardData" class="detail-title"> {{ boardData.title }} </p>
    </div>
    <div v-else>
      <select v-model="selectedCategory" class="select-category">
        <option value="NOTICE">공지</option>
        <option value="FREE">자유게시판</option>
      </select>
      <br>
      <input @input="validTitle" type="text" v-model="editedTitle" class="edit-title">
    </div>

    <div v-if="boardData" class="board-user"> {{ boardData.writer }}</div>

    <div class="post-header">
      <span class="board-time">{{ boardData.createdAt }}</span>
      <div v-if="Number(boardData.writerId) === Number(sessionUserId)" class="post-actions">
        <button @click="editPost" class="edit-delete-post">수정</button>
        <button @click="confirmDelete" class="edit-delete-post">삭제</button>
      </div>
    </div>

    <hr>

    <div v-if="editing" class="edit-form">
      <textarea @input="validContent" v-model="editedContent" class="edit-content"></textarea>
      <button class="save-cancle-edit" @click="savePost" :disabled="!isFormValid">저장</button>
      <button class="save-cancle-edit" @click="cancelEdit">취소</button>
    </div>
    <div v-else>
      <p v-if="boardData" class="detail-content" v-html="formatContent(boardData.content)"></p>
    </div>
    <hr>

  </div>

  <div class="reply-container" v-if="boardData && boardData.replies">
    <h3 class="replies-title">댓글 {{ boardData.replies.replies.length }}개</h3>
    <ul class="replies-list">
      <li class="reply" v-for="reply in boardData.replies.replies" :key="reply.id">
        <span class="reply-writer">{{ reply.writer }}</span>
        <span class="reply-content" v-html="formatContent(reply.content)"></span>
        <div class="reply-header">
          <span class="reply-date">{{ reply.createdAt }}</span>
          <span v-if="Number(reply.writerId) === Number(sessionUserId)" class="reply-actions">
            <button @click="confirmDeleteReply(reply.id)" class="edit-delete-post">삭제</button>
          </span>
        </div>
      </li>
    </ul>
  </div>

  <div class="reply-form-container">
    <form @submit.prevent="submitReply">
      <textarea @input="handleReply" v-model="newReply.content" placeholder="댓글을 입력하세요..." required>
      </textarea>
      <button type="submit" class="post-reply">댓글 등록</button>
    </form>
  </div>


</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      boardData: '',
      newReply: {
        content: '' // 사용자가 입력한 새 댓글 내용
      },
      editing: false, // 편집 모드 상태
      editedTitle: '', // 수정된 제목
      editedContent: '', // 수정된 내용
      selectedCategory: ''
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
              Swal.fire({
                icon: "error",
                title: "게시글을 불러오는데 실패했습니다.",
                confirmButtonColor: '#0a3d91',
              });
            }
          })
          .catch(error => {
            console.error(error);
            Swal.fire({
              icon: "error",
              title: "게시글을 불러오는데 실패했습니다.",
              confirmButtonColor: '#0a3d91',
            });
          });
    },

    submitReply() {
      // API에 댓글 등록 요청을 보내는 코드를 여기에 추가합니다.
      const boardId = this.$route.params.boardId;
      axios.post(`${process.env.VUE_APP_API_URL}/boards/${boardId}/replies`, this.newReply)
          .then(() => {
            this.newReply.content = ''; // 입력 폼 초기화
            this.fetchBoardData(); // 댓글 목록 새로고침
          })
          .catch(error => {
            console.error(error);
            Swal.fire({
              icon: "error",
              title: "로그인 정보가 유효하지 않습니다. \n다시 로그인해주세요",
              confirmButtonColor: '#0a3d91',
            });
          });
    },

    formatContent(content) {
      // 줄바꿈 문자를 <br> 태그로 변환
      return content.replace(/\n/g, '<br>');
    },

    editPost() {
      this.editing = true;
      this.editedTitle = this.boardData.title;
      this.editedContent = this.boardData.content;
      this.selectedCategory = this.boardData.category;
    },

    cancelEdit() {
      this.editing = false;
    },

    async savePost() {
      const payload = {
        category: this.selectedCategory,
        title: this.editedTitle,
        content: this.editedContent
      };

      try {
        await axios.patch(`${process.env.VUE_APP_API_URL}/boards/${this.boardData.id}`, payload);
        this.boardData.title = this.editedTitle;
        this.boardData.content = this.editedContent;
        this.editing = false;

        await Swal.fire({
          title: "게시글 수정 성공",
          confirmButtonColor: '#0a3d91',
        });

        location.reload();
      } catch (error) {
        console.error('Post update failed:', error);
        // 에러 처리 로직
      }
    },

    confirmDelete() {
      Swal.fire({
        title: "게시글을 삭제하시겠습니까?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: '#0a3d91',
        cancelButtonColor: "#d33",
        confirmButtonText: "삭제"
      }).then((result) => {
        if (result.isConfirmed) {
          this.deletePost();
          Swal.fire({
            title: "게시글이 삭제되었습니다.",
            icon: "success",
            confirmButtonColor: '#0a3d91',
          });
        }
      });
    },

    deletePost() {
      axios.delete(`${process.env.VUE_APP_API_URL}/boards/${this.boardData.id}`)
          .then(() => {
            this.$router.push('/board');
          })
          .catch(() => {

            Swal.fire({
              icon: "error",
              title: "게시글을 삭제하는데 실패했습니다.",
              confirmButtonColor: '#0a3d91',
            });

          });
    },

    confirmDeleteReply(replyId) {

      Swal.fire({
        title: "댓글을 삭제하시겠습니까?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: '#0a3d91',
        cancelButtonColor: "#d33",
        confirmButtonText: "삭제"
      }).then((result) => {
        if (result.isConfirmed) {
          this.deleteReply(replyId)
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
            confirmButtonColor: '#0a3d91',
          });
        }
      });

    },

    deleteReply(replyId) {
      axios.delete(`${process.env.VUE_APP_API_URL}/replies/${replyId}`)
          .then(() => {
            this.$router.push(`/board/${this.boardData.id}`);
            this.fetchBoardData();
          })
          .catch(() => {
            Swal.fire({
              icon: "error",
              title: "댓글을 삭제하는데 실패했습니다.",
              confirmButtonColor: '#0a3d91',
            });
          });
    },

    handleReply() {
      if (this.newReply.content.length > 200) {
        Swal.fire({
          icon: "error",
          title: "댓글은 200자 이내로 작성해주세요",
          confirmButtonColor: '#0a3d91',
        });
        this.newReply.content = this.newReply.content.slice(0, 200);
      }
    },

    validTitle() {
      if (this.editedTitle.length > 30) {
        Swal.fire({
          icon: "error",
          title: "제목은 30자 이내로 작성해주세요",
          confirmButtonColor: '#0a3d91',
        });
        this.editedTitle = this.editedTitle.slice(0, 30);
      }
    },

    validContent() {
      if (this.editedContent.length > 1000) {
        Swal.fire({
          icon: "error",
          title: "본문은 1000자 이내로 작성해주세요",
          confirmButtonColor: '#0a3d91',
        });
        this.editedContent = this.editedContent.slice(0, 1000);
      }
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
    },

    sessionUserId() {
      return this.$store.state.userId;
    },

    isFormValid() {
      return this.editedTitle.trim().length > 0 && this.editedContent.trim().length > 0;
    },

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

.reply-container {
  margin: 0 auto;
  width: 50%;
  text-align: left;
}

.board-time {
  font-size: 12px;
  color: gray;
}

.detail-category {
  color: gray;
}

.detail-title {
  font-size: 30px;
  font-weight: bold;
  margin-top: 10px;
  margin-bottom: 10px;
}

.detail-content {
  margin-top: 40px;
  font-size: 15px;
  margin-bottom: 40px;
}

.reply-container {
  width: 50%;
}

.replies-title {
  font-size: 15px;
  margin-top: 20px;
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
  display: block; /* 댓글 내용을 새로운 줄에 표시 */
  margin-top: 0.5em; /* 위쪽 여백 추가 */
}

.reply-date {
  display: block; // 별도의 줄로 분리
  font-size: 0.8em;
  color: #777;
  margin-top: 5px;
}

hr {
  color: gray;
}

span {
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

.post-reply {
  padding: 10px 15px;
  background-color: #1a5cc8;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

textarea {
  outline: none;
  resize: none;
}

.edit-delete-post {
  font-size: 15px;
  font-color: gray;
  border: none;
  margin-right: 10px;
  background-color: white;
}

.post-header, .reply-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.post-actions, .reply-actions {
  margin-left: 10px;
}

.edit-delete-post {
  font-size: 10px;
  color: gray;
  border: none;
  background-color: white;
  cursor: pointer;
  padding: 0.3vh;
  margin-bottom: 20px;

  &:hover {
    color: black;
  }
}

.save-cancle-edit {
  font-size: 15px;
  font-color: gray;
  border: none;
  margin-right: 10px;
  background-color: white;
  cursor: pointer;
  padding: 0.3vh;
  margin-bottom: 20px;

  &:hover {
    color: black;
  }
}

</style>