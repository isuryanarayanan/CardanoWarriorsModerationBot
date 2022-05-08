<template>
  <div class="channellist">
    <div class="category">
      <div>Active tickets</div>
      <div class="category-icon">
        <AddCategoryIcon :size="21" />
      </div>
    </div>
    <div class="tickets">
      <div v-for="ticket in tickets" :key="ticket.ticket_tag">
        <ChannelButton
          :channelName="'ticket-' + ticket.ticket_tag"
          @click="showTicket(ticket)"
          :selected="isCurrentTicket(ticket.ticket_tag)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import AddCategoryIcon from "vue-material-design-icons/plus.vue";
import ChannelButton from "./ChannelButton.vue";
import { mapGetters } from "vuex";
export default {
  components: {
    AddCategoryIcon,
    ChannelButton,
  },
  computed: {
    ...mapGetters({
      tickets: "getTickets",
      current_ticket: "getCurrentTicket",
    }),
  },
  methods: {
    isCurrentTicket: function (tag) {
      return tag == this.current_ticket[1];
    },
    showTicket: function (ticket) {
      this.$store.dispatch("SET_CURRENT_TICKET",ticket);
    },
  },
};
</script>

<style scoped lang="scss">
.channellist {
  grid-area: CL;

  display: flex;
  flex-direction: column;

  padding: 24px 10px 0 16px;
  background-color: var(--secondary);
}

.category {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
  color: var(--grey);
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  .category-icon {
    color: var(--symbol);
    cursor: pointer;
  }
}
</style>
