<template>
  <v-card sm="6" md="4">
    <v-tabs
        v-model="tab"
        bg-color="primary"
    >
      <v-tab @click="tab = 'one'">지원서 관리</v-tab>
      <v-tab @click="tab = 'two'">회원 관리</v-tab>
      <v-tab @click="tab = 'three'">지원 기간 관리</v-tab>
    </v-tabs>

    <v-card-text>
      <v-window v-model="tab">
        <v-window-item value="one">
          <FormManagement></FormManagement>
        </v-window-item>

        <v-window-item value="two">
          <UserManagement></UserManagement>
        </v-window-item>

        <v-window-item value="three">
          지원기간 관리
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>

<script>
import FormManagement from "@/components/admin/FormManagement.vue";
import UserManagement from "@/components/user/admin/UserManagement.vue";

export default {
  components: {
    UserManagement,
    FormManagement,
  },

  data() {
    return {
      tab: 'one',
    }
  },

}
</script>

<style lang="scss" scoped>

</style>