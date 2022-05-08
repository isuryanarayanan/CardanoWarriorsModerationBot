<template>
  <div class="channeldata">
    <div class="messages">
      <ChannelMessage
        v-for="log in logs"
        :author="log.author.username"
        :id="log.author.id"
        :avatar="log.author.avatar"
        date="12/03/1982"
        :key="log.ticket_tag"
        >{{ getContentOrNothing(log.content) }}</ChannelMessage
      >
    </div>
    <div class="inputwrapper">
      <input
        type="text"
        maxlength="0"
        placeholder="Chat history on ticket#123"
      />
      <div class="icon">
        <At :size="24" />
      </div>
    </div>
  </div>
</template>

<script>
import ChannelMessage from "./ChannelMessage.vue";
import At from "vue-material-design-icons/at.vue";
import { mapGetters } from "vuex";

export default {
  components: {
    ChannelMessage,
    At,
  },
  computed: {
    ...mapGetters({
      logs: "getLogs",
    }),
  },
  methods: {
    getContentOrNothing(content) {
      if (content) {
        return content;
      } else {
        return "Nothing";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.channeldata {
  grid-area: CD;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: var(--primary);
  flex: 1;
}
.messages {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 46px - 68px);
  max-height: calc(100vh - 46px - 68px);
  overflow-y: scroll;

  .channelmessage:first-child {
    margin-top: 0;
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--tertiary);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background-color: var(--secondary);
  }
}

.inputwrapper {
  width: 100%;
  padding: 0 16px;
  height: 68px;

  input {
    width: 100%;
    height: 44px;
    padding: 0 10px 0 57px;
    border-radius: 5px;
    color: var(--white);
    background-color: var(--chat-input);
    position: relative;

    &::placeholder {
      color: var(--grey);
    }
  }

  .icon {
    color: var(--grey);
    position: relative;
    top: -50%;
    left: 14px;
    transition: ease-out all 0.2s;
    width: 24px;
  }
}
</style>
