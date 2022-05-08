<template>
  <div class="container">
    <div class="icon">
      <Hashtag :size="24" />
    </div>
    <div  v-if="current_ticket[0] != null">
      <h1 class="title">Ticket-{{ current_ticket[1].ticket_tag}}</h1>
    </div>
    <div  v-else>
      <h1 class="title">Select a ticket to view</h1>
    </div>
    <div class="separator"></div>

    <div v-if="current_ticket[0] != null" class="description">Ticket opened by {{current_ticket[1].opener}}</div>
    <div v-else class="description"></div>
  </div>
</template>

<script>
import Hashtag from "vue-material-design-icons/pound.vue";
import { mapGetters } from "vuex";
export default {
  components: {
    Hashtag,
  },
  computed: {
    ...mapGetters({
      tickets: "getTickets",
      current_ticket: "getCurrentTicket",
    }),
  },
};
</script>

<style scoped>
.container {
  grid-area: CI;
  display: flex;
  align-items: center;
  padding: 0 17px;
  background-color: var(--primary);
  box-shadow: rgba(0, 0, 0, 0.9) 0 1px 0 0;
  z-index: 2;
}

.title {
  color: var(--white);
  font-size: 16px;
  margin-left: 9px;
  font-weight: bold;
}

.description {
  color: var(--grey);
  font-size: 15px;
}

.separator {
  background-color: var(--white);
  height: 24px;
  width: 1px;
  opacity: 0.2;
  margin: 0 13px;
}

.icon {
  color: var(--symbol);
}
</style>
