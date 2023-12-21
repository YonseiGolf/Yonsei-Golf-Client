<template>
  게시글 템플릿 본문
  <div class="board-container">

    <div v-if="!editing">
      <p v-if="templateData" class="detail-title"> {{ templateData.title }} </p>
    </div>
    <div v-else>
      <textarea @input="validTitle" type="text" v-model="editedTitle" class="edit-title"></textarea>
    </div>


    <div class="post-header">
      <div class="post-actions">
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
      <p v-if="templateData" class="detail-content" v-html="formatContent(templateData.contents)"></p>
    </div>
    <hr>

    <div class="button-container" id="listButton">
      <button @click="goToList">
        <span class="listButton">목록</span>
      </button>
    </div>

  </div>

</template>

<script>
import Swal from "sweetalert2";
import axios from "axios";

export default {

  created() {
    this.fetchTemplate();
  },


  data() {
    return {
      templateData: '',
      editing: false, // 편집 모드 상태
      editedTitle: '', // 수정된 제목
      editedContent: '', // 수정된 내용
    }
  },

  methods:{

    fetchTemplate() {
      const templateId = this.$route.params.templateId;
      axios.get(`${process.env.VUE_APP_API_URL}/admin/boards/templates/${templateId}`)
          .then(response => {
            if (response.data.status === "success") {
              this.templateData = response.data.data;
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

    async savePost() {
      const payload = {
        title: this.editedTitle,
        contents: this.editedContent
      };

      try {
        await axios.patch(`${process.env.VUE_APP_API_URL}/admin/boards/templates/${this.templateData.id}`, payload,
            {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
              }
            });
        this.templateData.title = this.editedTitle;
        this.templateData.contents = this.editedContent;
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
        title: "템플릿을 삭제하시겠습니까?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: '#0a3d91',
        cancelButtonColor: "#d33",
        confirmButtonText: "삭제"
      }).then((result) => {
        if (result.isConfirmed) {
          this.deletePost();
          Swal.fire({
            title: "템플릿이 삭제되었습니다.",
            icon: "success",
            confirmButtonColor: '#0a3d91',
          });
        }
      });
    },

    deletePost() {
      axios.delete(`${process.env.VUE_APP_API_URL}/admin/boards/templates/${this.templateData.id}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }})
          .then(() => {
            this.$router.push('/admin/board/template');
          })
          .catch(() => {

            Swal.fire({
              icon: "error",
              title: "템플릿을 삭제하는데 실패했습니다.",
              confirmButtonColor: '#0a3d91',
            });

          });
    },
    editPost() {
      this.editing = true;
      this.editedTitle = this.templateData.title;
      this.editedContent = this.templateData.contents;
    },

    cancelEdit() {
      this.editing = false;
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
    },
    formatContent(content) {
      if (!content) {
        return ''; // content가 null이거나 undefined인 경우, 빈 문자열을 반환
      }
      return content.replace(/\n/g, '<br>'); // 줄바꿈 문자를 <br> 태그로 변환
    },

    isFormValid() {
      return this.editedTitle.trim().length > 0 && this.editedContent.trim().length > 0;
    },

    goToList() {
      this.$router.push('/admin/board/template');
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


hr {
  color: gray;
}

span {
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 10px;
}


textarea {
  width: 100%;
  height: 500px;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  min-height: 50px; // 댓글 입력 공간을 충분히 확보
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

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.post-actions {
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
.button-container{
  display: flex;
  justify-content: right;
  margin-top: 20px;
}

.listButton {
  padding: 10px 20px; /* 버튼의 내부 여백을 조정합니다 */
  font-size: 16px; /* 글자 크기를 조정합니다 */

  background-color: #08366f; /* 버튼의 배경색을 조정합니다 */
  color: white; /* 버튼의 글자 색상을 조정합니다 */
  border-radius: 5px; /* 버튼의 모서리를 둥글게 합니다 */
}

button{
  border: none;
}

.edit-title{
  height: 20px;
}

</style>