<template>
  <div id="app">
    <div id="grid">
      <ServerList />
      <ServerName />
      <ChannelList />
      <ChannelInfo />
      <UserInfo />
      <ChannelData />
      <UserList />
    </div>
  </div>
</template>

<script>
import ServerList from "./components/ServerList/index.vue";
import ServerName from "./components/ServerName/index.vue";
import ChannelInfo from "./components/ChannelInfo/index.vue";
import ChannelList from "./components/ChannelList/index.vue";
import UserInfo from "./components/UserInfo/index.vue";
import ChannelData from "./components/ChannelData/index.vue";
import UserList from "./components/UserList/index.vue";
import { mapGetters } from "vuex";

export default {
  name: "App",
  components: {
    ServerList,
    ServerName,
    ChannelInfo,
    ChannelList,
    UserInfo,
    ChannelData,
    UserList,
  },
  computed: {
    ...mapGetters({ tickets: "getTickets" }),
  },
  data() {
    return {};
  },
  methods: {},
  mounted() {
    this.$store.dispatch("GET_TICKETS");
  },
};
</script>

<style lang="scss" scoped>
#grid {
  display: grid;
  grid-template-columns: 71px 240px auto 240px;
  grid-template-rows: 46px auto 52px;
  grid-template-areas:
    "SL SN CI CI"
    "SL CL CD UL"
    "SL UI CD UL";
  height: 100vh;
}
</style>
