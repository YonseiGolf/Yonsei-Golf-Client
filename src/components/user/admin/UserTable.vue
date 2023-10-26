<template>

  <div class="user-container">
    <h3> {{ title }} &nbsp; {{ totalCount }}명</h3>
    <table>
      <thead>
      <tr>
        <th>이름</th>
        <th>전화번호</th>
        <th>학번</th>
        <th>학과</th>
        <th>기수</th>
        <th>회원 구분</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in applications" :key="item.id">
        <td>
          <div>{{ item.name }}</div>
        </td>
        <td>
          <div> {{ item.phoneNumber}}</div>
        </td>
        <td>
          <div> {{ item.studentId }} </div>
        </td>
        <td>
          <div> {{ item.major}} </div>
        </td>
        <td>
          <div> {{ item.semester }} </div>
        </td>
        <td>
          <select v-model="item.userClass" @change="updateUserClass(item)">
            <option value="YB">YB</option>
            <option value="OB">OB</option>
            <option value="NONE">NONE</option>
          </select>
        </td>

      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    applications: {
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
  },

  methods: {
    async updateUserClass(item) {
      console.log(item.id)
      console.log(item.userClass)

      try {
        const response = await axios.patch(`${process.env.VUE_APP_API_URL}/admin/users/${item.id}`, {
          userClass: item.userClass
        });
        if (response.status === 200) {
          location.reload();
        } else {
          console.error("Error updating userClass");
        }
      } catch (error) {
        console.error("There was an error sending the request:", error);
      }
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

select {
  width: 90%;
  padding: 5px;
  border: 1px solid #d4d4d4;
  background-color: #f9f9f9;
}

</style>
