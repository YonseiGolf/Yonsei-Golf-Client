<template>

  <div class="application-container">
    <h3>
      {{ title }} {{ totalCount }}개

      <button v-if="passFail" @click="sendEmail">{{ passFail }} 메일 보내기</button>
    </h3>
    <table>
      <thead>
      <tr>
        <th>사진</th>
        <th>이름</th>
        <th>면접 시간</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in applications" :key="item.id" @click="viewDetail(item.id)">
        <td>
          <img :src="item.photo" alt="Applicant Photo" style="max-width: 100px;">
        </td>
        <td>
          <div>{{ item.name }}</div>
        </td>
        <td>{{ item.interviewTime }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    applications: { // 각 분류별 데이터를 전달받는 props
      type: Array,
      required: true
    },
    title: {
      type: String,
      default: "",
      required: true
    },
    totalCount: {
      type: Number,
      default: 0,
      required: true
    },
    passFail: {
      type: String,
      default: "",
      required: false
    }
  },

  methods: {
    viewDetail(id) {
      console.log(id)
      this.$router.push({name: 'ApplicationDetail', params: {id: id}});
    }
  }
}
</script>

<style lang="scss" scoped>
table {
  border-collapse: collapse;
  margin-top: 20px;
}

thead {
  background-color: #f2f2f2;
}

th, td {
  border: 1px solid #d4d4d4;
  padding: 8px 8px;
  text-align: center;
}

th {
  min-width: 50px;
}

tbody tr {
  cursor: pointer;

  &:hover {
    background-color: #f5f5f5; // 원하는 배경색으로 설정
  }
}

</style>
