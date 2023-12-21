<template>

  <div class="board-header-container">
    <h2>글쓰기</h2>
    <hr>
  </div>

  <div class="board-body-container">
    <div class="select-category-title">
      <select v-model="selectedCategory" class="select-category">
        <option v-if="isAdmin" value="NOTICE">공지</option>
        <option value="FREE">자유게시판</option>
      </select>


      <input v-model="title" type="text" placeholder="제목을 입력해 주세요." class="input-title" @input="handleTitleInput">
    </div>

    <div class="select-template" v-if="isAdmin">
      <select v-model="selectedTemplate" class="select-template-option">
        <option value="">
          템플릿 없음
        </option>
        <option v-for="template in templates" :key="template.id" :value="template.id">
          {{ template.title }}
        </option>
      </select>
    </div>

  </div>
  <textarea v-model="content" class="board-body-input" placeholder="내용을 입력하세요."></textarea>

  <div class="button-container">
    <button @click="postArticle" class="posting-button" :disabled="!isFormValid">
      <span class="postBoard">게시글 등록</span>
    </button>
  </div>

</template>

<script>
import axios from "axios";
import router from "@/router";
import Swal from "sweetalert2";

export default {

  created() {

    if (this.isAdmin) {
      this.fetchTemplates();
    }
  },

  watch: {
    selectedTemplate(newVal) {
      if (newVal) {
        this.fetchTemplateData(newVal);
      } else {
        this.title = '';
        this.content = '';
      }
    },
  },

  data() {
    return {
      selectedCategory: 'FREE',
      title: '',
      content: '',
      templates: [],
      selectedTemplate: ''
    };
  },
  methods: {
    postArticle() {
      // 여기에 API 요청을 보내는 코드를 작성합니다
      axios.post(`${process.env.VUE_APP_API_URL}/boards`, {
            category: this.selectedCategory,
            title: this.title,
            content: this.content
          },
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
          })
          .then(() => {
            router.push('/board')
            Swal.fire('게시글이 등록되었습니다.')
          })
          .catch(error => {
            console.error(error);
            Swal.fire('게시글 등록에 실패했습니다.')
            router.push('/board')
          });
    },

    handleTitleInput() {
      if (this.title.length > 30) {
        this.title = this.title.slice(0, 30)
      }
    },

    handleContentInput() {
      if (this.content.length > 1000) {
        this.content = this.content.slice(0, 1000)
      }
    },

    fetchTemplates() {
      axios.get(`${process.env.VUE_APP_API_URL}/admin/boards/templates`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
          .then(response => {
            this.templates = response.data.data.templates;
          })
          .catch(error => {
            console.error(error);
          });
    },

    fetchTemplateData(templateId) {
      axios.get(`${process.env.VUE_APP_API_URL}/admin/boards/templates/${templateId}`)
          .then(response => {
            this.title = response.data.data.title;
            this.content = response.data.data.contents;
          })
          .catch(error => {
            console.error('Error fetching template data:', error);
          });
    },
  },

  computed: {
    isFormValid() {
      return this.title.trim().length > 0 && this.content.trim().length > 0;
    },

    isAdmin() {
      return this.$store.state.adminStatus;
    },
  }
}
</script>

<style lang="scss" scoped>

h2 {
  text-align: left;
  margin-bottom: 5px;
}

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
  padding-top: 10px;
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

textarea {
  resize: none;
}

.button-container {
  display: flex;
  justify-content: right;
  margin-top: 20px;
}

.postBoard {
  padding: 10px 20px; /* 버튼의 내부 여백을 조정합니다 */
  font-size: 16px; /* 글자 크기를 조정합니다 */

  background-color: #08366f; /* 버튼의 배경색을 조정합니다 */
  color: white; /* 버튼의 글자 색상을 조정합니다 */
  border-radius: 5px; /* 버튼의 모서리를 둥글게 합니다 */
}

button {
  border: none;
}

.select-template {
  display: flex;
  width: 100%;
  height: 30px;
  padding-bottom: 20px;
  padding-top: 10px;
  justify-content: space-between;
}

.select-template-option{
  width: 70%;
  border: 1px solid gray;
  border-radius: 10px;
  height: 100%;
}

</style>