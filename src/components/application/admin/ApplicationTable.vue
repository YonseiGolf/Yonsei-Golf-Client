<template>

  <div class="application-container">
  <h3> {{ title }} &np {{ totalCount}}개</h3>
  <table>
    <thead>
    <tr>
      <th>사진</th>
      <th>이름</th>
      <th>Interview Time</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="item in applications" :key="item.id">
      <td>
        <img :src="item.photo" alt="Applicant Photo" style="max-width: 100px;"> <!-- 사진 출력 -->
      </td>
      <td>
        <div>{{ item.name }}</div> <!-- 이름 출력 -->
      </td>
      <td>{{ item.interviewTime }}</td> <!-- 면접 시간 출력 -->
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

th{
  min-width: 50px;
}


</style>
