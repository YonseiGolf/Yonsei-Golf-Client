<template>
  <v-app>
    <!-- Header -->
    <CommonHeader></CommonHeader>

    <!-- Main content -->
    <v-main>
      <router-view/>
    </v-main>

    <!-- Footer -->
    <CommonFooter></CommonFooter>
  </v-app>
</template>

<script>
import CommonFooter from "@/components/common/CommonFooter.vue";
import CommonHeader from "@/components/common/CommonHeader.vue";

export default {
  name: 'App',

  components: {
    CommonFooter,
    CommonHeader
  },

  data: () => ({
    //...
  }),
}
</script>
