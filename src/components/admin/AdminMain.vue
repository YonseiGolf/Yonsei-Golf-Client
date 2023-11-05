<template>
  <v-card sm="6" md="4">
    <v-tabs
        v-model="tab"
        bg-color="primary"
    >
      <v-tab value="one" to="/admin/form">지원서 관리</v-tab>
      <v-tab value="two" to="/admin/users">회원 관리</v-tab>
      <v-tab value="three">지원 기간 관리</v-tab>
    </v-tabs>

    <v-card-text>
      <v-window v-model="tab">
        <v-window-item value="one">
          One
        </v-window-item>

        <v-window-item value="two">
          Two
        </v-window-item>

        <v-window-item value="three">
          Three
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>

</style>