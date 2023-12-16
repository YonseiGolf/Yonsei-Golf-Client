<template>
  <h1>게시판 양식</h1>
  <div class="table-container">

    <table>
      <thead>
      <tr>
        <th>제목</th>
      </tr>
      </thead>

      <tbody>
      <tr v-for="template in templates" :key="template.id" @click="goToDetail(template.id)">
        <td>
          {{ template.title }}
        </td>
      </tr>
      </tbody>

    </table>

  </div>
  <div class="button-out-container">

    <div class="button-container" id="postTemplateButton">
      <button @click="goToPost">
        <span class="postButton">템플릿 추가</span>
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      templates: [],
    }
  },

  methods: {
    fetchTemplates() {
      axios.get(`${process.env.VUE_APP_API_URL}/admin/boards/templates`)
          .then(response => {
            this.templates = response.data.data.templates;
          })
          .catch(error => {
            console.log(error);
          })
    },

    goToDetail(templateId) {
      this.$router.push({name: 'boardTemplateDetail', params: {templateId: templateId}})
    },

    goToPost() {
      this.$router.push({name: 'postBoardTemplate'})
    }
  },

  mounted() {
    this.fetchTemplates();
  }

}
</script>

<style lang="scss" scoped>
.table-container {
  display: flex;
  justify-content: center; /* 가로 중앙 정렬 */
}

table {
  border-collapse: collapse; /* 경계선을 겹치게 */
  margin-top: 20px; /* 테이블 상단에 여백을 추가 */
  width: 80%;
  border-left: 1px solid #ccc; // 테이블의 왼쪽 경계선
  border-right: 1px solid #ccc; // 테이블의 오른쪽 경계선
}

th, td {
  border-top: 1px solid #ccc; // 가로선만 표시
  border-bottom: 1px solid #ccc; // 가로선만 표시
}

th {
  padding: 8px; /* 셀 내부에 패딩을 추가하여 내용이 선에 닿지 않도록 */
  text-align: center;
}

td {
  padding: 8px; /* 셀 내부에 패딩을 추가하여 내용이 선에 닿지 않도록 */
  text-align: center;
}

thead {
  background-color: #f9f9f9; /* 테이블 헤더의 배경색 */
}

.boardList:hover {
  background-color: #f1f1f1; /* 마우스를 올렸을 때 행의 배경색을 변경 */
}


.button-out-container{
  display: flex;
  justify-content: right;
  margin-top: 20px;
  width: 90%;
}


.button-container {
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

button {
  border: none;
}
</style>