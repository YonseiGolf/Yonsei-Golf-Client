<template>
  <div class="template-header-container">
    <h2>템플릿 생성</h2>
    <hr>
  </div>

  <div class="template-body-container">
    <div class="title-input">
      <input v-model="title" type="text" placeholder="제목을 입력해 주세요." class="input-title" @input="handleTitleInput">
    </div>

  </div>
  <textarea v-model="content" class="board-body-input" placeholder="내용을 입력하세요."></textarea>

  <div class="button-container">
    <button @click="postTemplate" class="posting-button" :disabled="!isFormValid">
      <span class="postButton">템플릿 등록</span>
    </button>
  </div>
</template>

<script>
import axios from "axios";
import router from "@/router";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      title: '',
      content: '',
    };
  },
  methods: {
    postTemplate() {
      // 여기에 API 요청을 보내는 코드를 작성합니다
      axios.post(`${process.env.VUE_APP_API_URL}/admin/boards/templates`, {
            title: this.title,
            contents: this.content
          },
          {
            headers:{
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
          })
          .then(() => {
            router.push('/admin/board/template')
            Swal.fire('템플릿이 등록되었습니다.')
          })
          .catch(error => {
            console.error(error);
            Swal.fire('템플릿 등록에 실패했습니다.')
            router.push('/admin/board/template')
          });
    },

    handleTitleInput() {
      if (this.title.length > 30) {
        this.title = this.title.slice(0, 30)
      }
    },

    handleContentInput(){
      if (this.contents.length > 1000) {
        this.contents = this.contents.slice(0, 1000)
      }
    }
  },


  computed:{
    isFormValid() {
      return this.title.trim().length > 0 && this.content.trim().length > 0;
    }
  }
}
</script>

<style lang="scss" scoped>

h2 {
  text-align: left;
  margin-bottom: 5px;
}

.template-header-container {
  padding-top: 20px;
  margin: 0 auto;
  width: 50%;
}

.template-body-container {
  margin: 0 auto;
  width: 50%;
}

.title-input{
  display: flex;
  height: 30px;
  padding-bottom: 20px;
  padding-top: 10px;
  justify-content: space-between;
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
  .board-body-input {
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
  justify-content: flex-end;
}

select,
input,
textarea {
  outline: none;
}
textarea{
  resize: none;
}

.button-container{
  display: flex;
  justify-content: right;
  margin-top: 20px;
}

.postButton {
  padding: 10px 20px; /* 버튼의 내부 여백을 조정합니다 */
  font-size: 16px; /* 글자 크기를 조정합니다 */

  background-color: #0a3d91; /* 버튼의 배경색을 조정합니다 */
  color: white; /* 버튼의 글자 색상을 조정합니다 */
  border-radius: 5px; /* 버튼의 모서리를 둥글게 합니다 */
}

button{
  border: none;
}
</style>