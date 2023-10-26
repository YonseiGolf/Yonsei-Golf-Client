<template>
  <div class="users-tables">
    <user-table :applications="YBUsers.content" title="YB" :totalCount="YBUsers.totalElements"></user-table>
    <user-table :applications="OBUsers.content" title="OB" :totalCount="OBUsers.totalElements"></user-table>
    <user-table :applications="NoneUsers.content" title="회원 대기" :totalCount="NoneUsers.totalElements"></user-table>
  </div>
</template>

<script>
import UserTable from "@/components/user/admin/UserTable.vue";
import axios from "axios";

export default {
  components: {
    UserTable
  },

  data() {
    return {
      YBUsers: { content: [], totalElements: 0 },
      OBUsers: { content: [], totalElements: 0 },
      NoneUsers: { content: [], totalElements: 0 },
    };
  },

  async mounted() {
    try {
      const YBUsersResponse = await axios.get(`${process.env.VUE_APP_API_URL}/admin/users?userClass=YB`);
      this.YBUsers = YBUsersResponse.data.data;

      const OBUsersResponse = await axios.get(`${process.env.VUE_APP_API_URL}/admin/users?userClass=OB`);
      this.OBUsers = OBUsersResponse.data.data;

      const NoneUsersResponse = await axios.get(`${process.env.VUE_APP_API_URL}/admin/users?userClass=NONE`);
      this.NoneUsers = NoneUsersResponse.data.data;

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },
}
</script>

<style lang="scss" scoped>
.users-tables {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin-bottom: 1vh;

  & > * {
    margin-left: auto;
    margin-right: auto;
    max-width: 80%;
  }

  @media (max-width: 1300px) {
    grid-template-columns: 1fr;
  }
}
</style>