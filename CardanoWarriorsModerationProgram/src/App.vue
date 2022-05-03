<script>
import { mapGetters } from "vuex";
export default {
  name: "App",
  components: {},
  computed: {
    ...mapGetters({tickets: "getTickets" }),
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

<template>
  <div id="app">
    {{ tickets }}
  </div>
</template>

<style></style>
