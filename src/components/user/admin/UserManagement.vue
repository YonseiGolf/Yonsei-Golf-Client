<template>
  <div class="users-tables">
    <user-table :applications="YBUsers.content" title="YB" :totalCount="YBUsers.totalElements"></user-table>
    <user-table :applications="OBUsers.content" title="OB" :totalCount="OBUsers.totalElements"></user-table>
    <user-table :applications="NoneUsers.content" title="회원 대기" :totalCount="NoneUsers.totalElements"></user-table>
    <user-table :applications="DormantUsers.content" title="휴면 회원" :totalCount="DormantUsers.totalElements"></user-table>
    <user-table :applications="BlackListUsers.content" title="블랙리스트" :totalCount="BlackListUsers.totalElements"></user-table>
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
      DormantUsers: { content: [], totalElements: 0 },
      BlackListUsers: { content: [], totalElements: 0 },
    };
  },

  async mounted() {
    try {
      const YBUsersResponse = await axios.get(`${process.env.VUE_APP_API_URL}/admin/users?userClass=YB`, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
        }
      });
      this.YBUsers = YBUsersResponse.data.data;

      const OBUsersResponse = await axios.get(`${process.env.VUE_APP_API_URL}/admin/users?userClass=OB`, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
        }
      });
      this.OBUsers = OBUsersResponse.data.data;

      const NoneUsersResponse = await axios.get(`${process.env.VUE_APP_API_URL}/admin/users?userClass=NONE`, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
        }
      });
      this.NoneUsers = NoneUsersResponse.data.data;

      const DormantUsersResponse = await axios.get(`${process.env.VUE_APP_API_URL}/admin/users?userClass=DORMANT`, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
        }
      });
      this.DormantUsers = DormantUsersResponse.data.data;

      const BlackListUsersResponse = await axios.get(`${process.env.VUE_APP_API_URL}/admin/users?userClass=BLACK_LIST`, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
        }
      });
      this.BlackListUsers = BlackListUsersResponse.data.data;

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },
}
</script>

<style lang="scss" scoped>
.users-tables {
  margin: 0 auto;
  display: grid;
  gap: 30px;
  grid-template-columns: repeat(2, 1fr);
  margin-bottom: 1vh;
  width: 80%;

  & > * {
    margin-left: auto;
    margin-right: auto;
    max-width: 80%;
  }

  @media (max-width: 1300px) {
    grid-template-columns: 1fr;
    justify-content: center;
    width: 100%;
  }
}
</style>